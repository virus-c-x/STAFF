-- ==============================================================================
-- Staff Recruitment & Application Portal - Supabase PostgreSQL Schema
-- Production Schema with Row Level Security (RLS) & Audit Logging
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

-- 2. Applications Table
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

-- 3. Indexes for Efficient Querying & Anti-Abuse
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
    changed_by UUID DEFAULT NULL,
    change_reason TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_status_history_app_id ON application_status_history(application_id);

-- 5. Reviewer Notes & Scoring Table (for Future Admin Dashboard)
CREATE TABLE IF NOT EXISTS reviewer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    note_content TEXT NOT NULL,
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reviewer_notes_app_id ON reviewer_notes(application_id);

-- 6. Trigger to Update 'updated_at' Timestamp
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

-- 7. Trigger to Log Status Changes
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO application_status_history (
            application_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            NEW.reviewed_by
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

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewer_notes ENABLE ROW LEVEL SECURITY;

-- RULE 1: Anonymous public applicants can ONLY INSERT new applications with status = 'pending'.
-- Crucially, they CANNOT set reviewer_notes, reviewed_at, or reviewed_by.
DROP POLICY IF EXISTS "anon_can_insert_new_applications" ON applications;
CREATE POLICY "anon_can_insert_new_applications"
    ON applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'pending' AND
        reviewer_notes IS NULL AND
        reviewed_at IS NULL AND
        reviewed_by IS NULL
    );

-- RULE 2: Anonymous users have ZERO SELECT permissions on the applications table directly.
-- (Prevents competitors or scrapers from viewing existing applications or user data).
DROP POLICY IF EXISTS "anon_cannot_view_applications" ON applications;
-- No SELECT policy for 'anon' means anon SELECT is completely denied by default.

-- RULE 3: Anonymous users have ZERO UPDATE or DELETE permissions.
-- No UPDATE or DELETE policies for 'anon' means anon UPDATE/DELETE is denied.

-- RULE 4: Authenticated staff / admins can view all applications.
-- In Supabase, staff users have a custom claim `user_metadata->>'role' in ('staff', 'admin')`
-- or belong to an authorized staff role table.
DROP POLICY IF EXISTS "staff_can_view_applications" ON applications;
CREATE POLICY "staff_can_view_applications"
    ON applications
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'role') = 'service_role' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin', 'reviewer')
    );

DROP POLICY IF EXISTS "staff_can_update_applications" ON applications;
CREATE POLICY "staff_can_update_applications"
    ON applications
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() ->> 'role') = 'service_role' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin', 'reviewer')
    )
    WITH CHECK (
        (auth.jwt() ->> 'role') = 'service_role' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin', 'reviewer')
    );

-- Reviewer Notes RLS (authenticated staff only)
DROP POLICY IF EXISTS "staff_access_reviewer_notes" ON reviewer_notes;
CREATE POLICY "staff_access_reviewer_notes"
    ON reviewer_notes
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() ->> 'role') = 'service_role' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin', 'reviewer')
    );

-- Status History RLS (authenticated staff only)
DROP POLICY IF EXISTS "staff_access_status_history" ON application_status_history;
CREATE POLICY "staff_access_status_history"
    ON application_status_history
    FOR ALL
    TO authenticated
    USING (
        (auth.jwt() ->> 'role') = 'service_role' OR
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin', 'reviewer')
    );

-- ==============================================================================
-- 9. SAFE RPC FUNCTION: Public Status Check via Reference Code
-- Allows applicants to check their own status WITHOUT reading any other fields
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

-- Grant execution to public anon role
GRANT EXECUTE ON FUNCTION get_application_public_status(TEXT) TO anon, authenticated;
