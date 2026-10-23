export type AdminRole = 'owner' | 'lead_reviewer' | 'reviewer';

export interface AdminUser {
  id: string;
  auth_user_id?: string | null;
  email: string;
  display_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  last_login_at?: string | null;
  invited_by?: string | null;
}

export interface RecruitmentSettings {
  id: number;
  staff_intake_open: boolean;
  judge_intake_open: boolean;
  banner_active: boolean;
  banner_text: string;
  banner_type: 'info' | 'announcement' | 'warning';
  updated_at: string;
  updated_by?: string | null;
}

export interface CompetencyScores {
  de_escalation?: number;
  integrity?: number;
  composure?: number;
  leadership?: number;
}

export interface ReviewerNoteItem {
  id: string;
  application_id: string;
  author_id: string;
  author_name: string;
  author_role?: string;
  note_content: string;
  rating_score?: number;
  score_de_escalation?: number;
  score_integrity?: number;
  score_composure?: number;
  score_leadership?: number;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  application_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  change_reason: string | null;
  created_at: string;
}

export interface FormQuestion {
  id: string;
  role_target: 'general' | 'moderator' | 'administrator';
  category: string;
  question_key: string;
  question_text: string;
  description?: string | null;
  field_type: 'text' | 'textarea' | 'select';
  min_chars: number;
  max_chars: number;
  is_required: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface AdminKPIs {
  totalApplications: number;
  pendingCount: number;
  underReviewCount: number;
  interviewCount: number;
  acceptedCount: number;
  rejectedCount: number;
  moderatorCount: number;
  administratorCount: number;
  acceptanceRate: number;
}

export interface CandidateHistorySummary {
  applicant_display_name: string;
  platform_username: string;
  contact_method: string;
  applications: {
    id: string;
    reference_code: string;
    position: string;
    status: string;
    created_at: string;
  }[];
}
