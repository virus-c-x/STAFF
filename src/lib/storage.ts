import { ApplicationFormData } from '../types/application';

const DRAFT_STORAGE_KEY = 'staff_application_form_draft_v1';

export const INITIAL_FORM_DATA: ApplicationFormData = {
  position: '',
  applicantInfo: {
    displayName: '',
    platformUsername: '',
    platformUserId: '',
    ageRange: '',
    timeZone: '',
    country: '',
    contactMethod: 'Discord',
    contactEmail: '',
    languages: ['English'],
    otherLanguage: '',
    weeklyAvailability: '',
  },
  generalAnswers: {
    q1_why_join: '',
    q2_why_position: '',
    q3_qualities: '',
    q4_previous_experience: '',
    q5_ready_to_learn: '',
    q6_staff_disagreement: '',
    q7_friend_rule_violation: '',
    q8_confidentiality: '',
    q9_handling_criticism: '',
    q10_mistake_handling: '',
  },
  moderatorAnswers: {
    m1_repeated_insults: '',
    m2_incomplete_evidence: '',
    m3_mutual_accusations: '',
    m4_friend_violation_action: '',
    m5_senior_staff_discrepancy: '',
    m6_misunderstanding_vs_harassment: '',
    m7_warning_restriction_escalation: '',
    m8_unsure_rule_interpretation: '',
  },
  administratorAnswers: {
    a1_ready_for_admin: '',
    a2_resolve_moderator_dispute: '',
    a3_investigate_staff_complaint: '',
    a4_inconsistent_enforcement: '',
    a5_consistent_rule_application: '',
    a6_prioritizing_urgent_reports: '',
    a7_influential_member_incident: '',
    a8_fair_performance_eval: '',
    a9_prevent_permission_misuse: '',
    a10_practical_improvement_plan: '',
  },
  declarations: {
    accurateInfo: false,
    agreeRulesPolicies: false,
    understandNoGuarantee: false,
    consentDataProcessing: false,
    consentVersion: 'v1.0',
    consentTimestamp: '',
  },
};

export function saveFormDraft(data: ApplicationFormData): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save application draft to local storage', e);
  }
}

export function loadFormDraft(): ApplicationFormData {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return INITIAL_FORM_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_FORM_DATA,
      ...parsed,
      applicantInfo: {
        ...INITIAL_FORM_DATA.applicantInfo,
        ...(parsed.applicantInfo || {}),
      },
      generalAnswers: {
        ...INITIAL_FORM_DATA.generalAnswers,
        ...(parsed.generalAnswers || {}),
      },
      moderatorAnswers: {
        ...INITIAL_FORM_DATA.moderatorAnswers,
        ...(parsed.moderatorAnswers || {}),
      },
      administratorAnswers: {
        ...INITIAL_FORM_DATA.administratorAnswers,
        ...(parsed.administratorAnswers || {}),
      },
      declarations: {
        ...INITIAL_FORM_DATA.declarations,
        ...(parsed.declarations || {}),
      },
    };
  } catch (e) {
    return INITIAL_FORM_DATA;
  }
}

export function clearFormDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear application draft', e);
  }
}
