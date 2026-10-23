-- ==============================================================================
-- Staff Recruitment & Application Portal - Supabase PostgreSQL Schema
-- Production Schema with Row Level Security (RLS) & Admin Role Architecture
-- ==============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'pending',
        'under_review',
        'interview',
        'accepted',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE staff_position AS ENUM (
        'moderator',
        'administrator'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Admin Users Allowlist & RBAC Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID DEFAULT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'lead_reviewer', 'reviewer')) DEFAULT 'reviewer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_login_at TIMESTAMPTZ DEFAULT NULL,
    invited_by TEXT DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 3. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) NOT NULL UNIQUE,
    position staff_position NOT NULL,
    
    -- Applicant Personal Info
    applicant_display_name VARCHAR(100) NOT NULL,
    platform_username VARCHAR(100) NOT NULL,
    platform_user_id VARCHAR(64) DEFAULT NULL,
    age_range VARCHAR(32) NOT NULL,
    time_zone VARCHAR(64) NOT NULL,
    languages TEXT[] NOT NULL DEFAULT '{}',
    contact_method VARCHAR(120) NOT NULL,
    weekly_availability VARCHAR(64) NOT NULL,
    
    -- Written Submissions
    general_answers JSONB NOT NULL,
    role_answers JSONB NOT NULL,
    
    -- Status & Administrative Workflow
    status application_status NOT NULL DEFAULT 'pending',
    reviewer_notes TEXT DEFAULT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NULL,
    reviewed_by UUID DEFAULT NULL,
    
    -- Legal / Compliance
    privacy_consent_timestamp TIMESTAMPTZ NOT NULL,
    privacy_notice_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for Efficient Querying & Anti-Abuse
CREATE INDEX IF NOT EXISTS idx_applications_ref_code ON applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_position ON applications(position);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_platform_user ON applications(platform_username);

-- 4. Audit History Table for Status Changes
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status application_status,
    new_status application_status NOT NULL,
    changed_by TEXT DEFAULT NULL,
    change_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON application_status_history(application_id);

-- 5. Reviewer Notes & Competency Scoring Table
CREATE TABLE IF NOT EXISTS reviewer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(50) DEFAULT 'reviewer',
    note_content TEXT NOT NULL,
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5),
    score_de_escalation INT CHECK (score_de_escalation BETWEEN 1 AND 5),
    score_integrity INT CHECK (score_integrity BETWEEN 1 AND 5),
    score_composure INT CHECK (score_composure BETWEEN 1 AND 5),
    score_leadership INT CHECK (score_leadership BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reviewer_notes_app_id ON reviewer_notes(application_id);

-- 6. Recruitment Operational Settings (Singleton)
CREATE TABLE IF NOT EXISTS recruitment_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    staff_intake_open BOOLEAN NOT NULL DEFAULT true,
    judge_intake_open BOOLEAN NOT NULL DEFAULT false,
    banner_active BOOLEAN NOT NULL DEFAULT true,
    banner_text TEXT NOT NULL DEFAULT 'Official Spring 2026 Cohort Recruitment Cycle is now active. Review screening criteria before submission.',
    banner_type TEXT NOT NULL CHECK (banner_type IN ('info', 'announcement', 'warning')) DEFAULT 'announcement',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by TEXT DEFAULT NULL
);

-- 7. Dynamic Form Questions Table
CREATE TABLE IF NOT EXISTS form_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_target TEXT NOT NULL CHECK (role_target IN ('general', 'moderator', 'administrator')),
    category TEXT NOT NULL,
    question_key TEXT NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    field_type TEXT NOT NULL DEFAULT 'textarea',
    min_chars INT NOT NULL DEFAULT 50,
    max_chars INT NOT NULL DEFAULT 1000,
    is_required BOOLEAN NOT NULL DEFAULT true,
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_form_questions_target ON form_questions(role_target, order_index);

-- 8. Triggers for Automatic Timestamps and Status Auditing
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_applications_updated_at ON applications;
CREATE TRIGGER set_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO application_status_history (
            application_id,
            old_status,
            new_status,
            changed_by,
            change_reason
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            COALESCE(NEW.reviewed_by::text, 'System / Admin'),
            NEW.reviewer_notes
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_application_status_change ON applications;
CREATE TRIGGER trigger_application_status_change
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION log_application_status_change();

-- Enforce intake closure at database level
CREATE OR REPLACE FUNCTION enforce_intake_window()
RETURNS TRIGGER AS $$
DECLARE
    settings_rec RECORD;
BEGIN
    SELECT staff_intake_open, judge_intake_open INTO settings_rec FROM recruitment_settings WHERE id = 1;
    IF settings_rec IS NOT NULL THEN
        IF (NEW.position = 'moderator' OR NEW.position = 'administrator') AND NOT settings_rec.staff_intake_open THEN
            RAISE EXCEPTION 'Staff recruitment intake is currently closed for new submissions.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_intake_before_insert ON applications;
CREATE TRIGGER check_intake_before_insert
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION enforce_intake_window();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_questions ENABLE ROW LEVEL SECURITY;

-- Helper to verify admin identity via email in JWT
CREATE OR REPLACE FUNCTION is_authenticated_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE email = auth.jwt() ->> 'email'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can read recruitment settings
DROP POLICY IF EXISTS "public_read_recruitment_settings" ON recruitment_settings;
CREATE POLICY "public_read_recruitment_settings"
    ON recruitment_settings FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admins can update recruitment settings
DROP POLICY IF EXISTS "admin_update_recruitment_settings" ON recruitment_settings;
CREATE POLICY "admin_update_recruitment_settings"
    ON recruitment_settings FOR ALL
    TO authenticated
    USING (is_authenticated_admin());

-- Public can read active form questions
DROP POLICY IF EXISTS "public_read_active_questions" ON form_questions;
CREATE POLICY "public_read_active_questions"
    ON form_questions FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR is_authenticated_admin());

-- Admins can manage questions
DROP POLICY IF EXISTS "admin_manage_questions" ON form_questions;
CREATE POLICY "admin_manage_questions"
    ON form_questions FOR ALL
    TO authenticated
    USING (is_authenticated_admin());

-- Applications RLS
-- Anon applicants can ONLY INSERT pending applications
DROP POLICY IF EXISTS "anon_can_insert_new_applications" ON applications;
CREATE POLICY "anon_can_insert_new_applications"
    ON applications FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'pending' AND
        reviewer_notes IS NULL AND
        reviewed_at IS NULL AND
        reviewed_by IS NULL
    );

-- Admins can view and update applications
DROP POLICY IF EXISTS "admin_select_applications" ON applications;
CREATE POLICY "admin_select_applications"
    ON applications FOR SELECT
    TO authenticated
    USING (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role');

DROP POLICY IF EXISTS "admin_update_applications" ON applications;
CREATE POLICY "admin_update_applications"
    ON applications FOR UPDATE
    TO authenticated
    USING (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role')
    WITH CHECK (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role');

-- Reviewer notes and audit history
DROP POLICY IF EXISTS "admin_reviewer_notes" ON reviewer_notes;
CREATE POLICY "admin_reviewer_notes"
    ON reviewer_notes FOR ALL
    TO authenticated
    USING (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role');

DROP POLICY IF EXISTS "admin_status_history" ON application_status_history;
CREATE POLICY "admin_status_history"
    ON application_status_history FOR ALL
    TO authenticated
    USING (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role');

-- Admin users allowlist access
DROP POLICY IF EXISTS "admin_manage_admin_users" ON admin_users;
CREATE POLICY "admin_manage_admin_users"
    ON admin_users FOR ALL
    TO authenticated
    USING (is_authenticated_admin() OR (auth.jwt() ->> 'role') = 'service_role');

-- ==============================================================================
-- 10. SAFE RPC FUNCTION: Public Status Check via Reference Code
-- ==============================================================================
CREATE OR REPLACE FUNCTION get_application_public_status(p_reference_code TEXT)
RETURNS TABLE (
    reference_code VARCHAR(32),
    position staff_position,
    status application_status,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.reference_code,
        a.position,
        a.status,
        a.created_at,
        a.updated_at
    FROM applications a
    WHERE a.reference_code = TRIM(p_reference_code)
    LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION get_application_public_status(TEXT) TO anon, authenticated;

-- ==============================================================================
-- 11. INITIAL SEED DATA
-- ==============================================================================

-- Seed primary administrator accounts
INSERT INTO admin_users (email, display_name, role)
VALUES 
    ('viirusshop@gmail.com', 'Primary Owner', 'owner'),
    ('githubsupporrt@gmail.com', 'Executive Owner', 'owner')
ON CONFLICT (email) DO NOTHING;

-- Seed default recruitment operational settings
INSERT INTO recruitment_settings (id, staff_intake_open, judge_intake_open, banner_active, banner_text, banner_type)
VALUES (1, true, false, true, 'Official Spring 2026 Cohort Recruitment Cycle is now active. Review screening criteria before submission.', 'announcement')
ON CONFLICT (id) DO NOTHING;
