export type PositionType = 'moderator' | 'administrator';

export type AgeRangeOption =
  | 'Under 16'
  | '16–17'
  | '18–20'
  | '21–24'
  | '25 or older';

export type AvailabilityOption =
  | '1–3 hours/week'
  | '4–7 hours/week'
  | '8–14 hours/week'
  | '15–20 hours/week'
  | 'More than 20 hours/week';

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface ApplicantInfo {
  displayName: string;
  platformUsername: string;
  platformUserId: string;
  ageRange: AgeRangeOption | '';
  timeZone: string;
  languages: string[];
  otherLanguage?: string;
  contactMethod: string;
  weeklyAvailability: AvailabilityOption | '';
}

export interface GeneralAnswers {
  q1_why_join: string;
  q2_why_position: string;
  q3_qualities: string;
  q4_previous_experience: string;
  q5_ready_to_learn: string;
  q6_staff_disagreement: string;
  q7_friend_rule_violation: string;
  q8_confidentiality: string;
  q9_handling_criticism: string;
  q10_mistake_handling: string;
}

export interface ModeratorAnswers {
  m1_repeated_insults: string;
  m2_incomplete_evidence: string;
  m3_mutual_accusations: string;
  m4_friend_violation_action: string;
  m5_senior_staff_discrepancy: string;
  m6_misunderstanding_vs_harassment: string;
  m7_warning_restriction_escalation: string;
  m8_unsure_rule_interpretation: string;
}

export interface AdministratorAnswers {
  a1_ready_for_admin: string;
  a2_resolve_moderator_dispute: string;
  a3_investigate_staff_complaint: string;
  a4_inconsistent_enforcement: string;
  a5_consistent_rule_application: string;
  a6_prioritizing_urgent_reports: string;
  a7_influential_member_incident: string;
  a8_fair_performance_eval: string;
  a9_prevent_permission_misuse: string;
  a10_practical_improvement_plan: string;
}

export interface DeclarationsConsent {
  accurateInfo: boolean;
  agreeRulesPolicies: boolean;
  understandNoGuarantee: boolean;
  consentDataProcessing: boolean;
  consentVersion: string;
  consentTimestamp: string;
}

export interface ApplicationFormData {
  position: PositionType | '';
  applicantInfo: ApplicantInfo;
  generalAnswers: GeneralAnswers;
  moderatorAnswers: ModeratorAnswers;
  administratorAnswers: AdministratorAnswers;
  declarations: DeclarationsConsent;
}

export interface StoredApplicationRecord {
  id: string;
  reference_code: string;
  position: PositionType;
  applicant_display_name: string;
  platform_username: string;
  platform_user_id: string | null;
  age_range: string;
  time_zone: string;
  languages: string[];
  contact_method: string;
  weekly_availability: string;
  general_answers: GeneralAnswers;
  role_answers: ModeratorAnswers | AdministratorAnswers;
  status: ApplicationStatus;
  privacy_consent_timestamp: string;
  privacy_notice_version: string;
  created_at: string;
  reviewer_notes?: string | null;
  reviewed_at?: string | null;
}
