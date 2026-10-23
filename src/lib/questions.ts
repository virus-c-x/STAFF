import { AgeRangeOption, AvailabilityOption, PositionType } from '../types/application';
import moderatorEmblem from '../assets/images/moderator_role_emblem_1792624473648.jpg';
import adminEmblem from '../assets/images/admin_role_emblem_1792624473208.jpg';

export const AGE_RANGE_OPTIONS: AgeRangeOption[] = [
  'Under 16',
  '16–17',
  '18–20',
  '21–24',
  '25 or older',
];

export const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  '1–3 hours/week',
  '4–7 hours/week',
  '8–14 hours/week',
  '15–20 hours/week',
  'More than 20 hours/week',
];

export const COMMON_TIMEZONES = [
  { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
  { value: 'UTC-08:00', label: 'UTC-08:00 (Pacific Time - US & Canada)' },
  { value: 'UTC-07:00', label: 'UTC-07:00 (Mountain Time - US & Canada)' },
  { value: 'UTC-06:00', label: 'UTC-06:00 (Central Time - US & Canada)' },
  { value: 'UTC-05:00', label: 'UTC-05:00 (Eastern Time - US & Canada)' },
  { value: 'UTC-03:00', label: 'UTC-03:00 (Buenos Aires, São Paulo)' },
  { value: 'UTC+00:00', label: 'UTC+00:00 (London, Dublin, Lisbon)' },
  { value: 'UTC+01:00', label: 'UTC+01:00 (Berlin, Paris, Rome, Madrid)' },
  { value: 'UTC+02:00', label: 'UTC+02:00 (Cairo, Helsinki, Athens)' },
  { value: 'UTC+03:00', label: 'UTC+03:00 (Riyadh, Moscow, Istanbul, Doha)' },
  { value: 'UTC+04:00', label: 'UTC+04:00 (Dubai, Baku)' },
  { value: 'UTC+05:00', label: 'UTC+05:00 (Karachi, Tashkent)' },
  { value: 'UTC+05:30', label: 'UTC+05:30 (India Standard Time)' },
  { value: 'UTC+07:00', label: 'UTC+07:00 (Bangkok, Jakarta)' },
  { value: 'UTC+08:00', label: 'UTC+08:00 (Singapore, Beijing, Perth)' },
  { value: 'UTC+09:00', label: 'UTC+09:00 (Tokyo, Seoul)' },
  { value: 'UTC+10:00', label: 'UTC+10:00 (Sydney, Melbourne)' },
  { value: 'UTC+12:00', label: 'UTC+12:00 (Auckland, Fiji)' },
];

export const COMMON_LANGUAGES = [
  'English',
  'Arabic (العربية)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Turkish (Türkçe)',
  'Russian (Русский)',
  'Portuguese (Português)',
  'Japanese (日本語)',
  'Korean (한국어)',
];

export interface QuestionDefinition {
  id: string;
  field: string;
  title: string;
  description: string;
  minChars: number;
  maxChars: number;
  evaluationFocus: string;
}

export const GENERAL_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'g1',
    field: 'q1_why_join',
    title: '1. Why do you want to join our staff team?',
    description: 'Share your personal motivation, community connection, and goals for contributing.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Genuine commitment, alignment with community values, and proactive attitude.',
  },
  {
    id: 'g2',
    field: 'q2_why_position',
    title: '2. Why did you choose this particular position?',
    description: 'Explain why your current skills and interests match this specific role over others.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Role understanding and self-awareness.',
  },
  {
    id: 'g3',
    field: 'q3_qualities',
    title: '3. What qualities make you suitable for this role?',
    description: 'Highlight personal strengths such as patience, active listening, composure, or analytical judgment.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Interpersonal strengths, maturity, and emotional intelligence.',
  },
  {
    id: 'g4',
    field: 'q4_previous_experience',
    title: '4. What previous moderation, administration, leadership, or community-management experience do you have?',
    description: 'List relevant communities, team sizes, responsibilities held, or tools used.',
    minChars: 40,
    maxChars: 1800,
    evaluationFocus: 'Track record and familiarity with operational workflows.',
  },
  {
    id: 'g5',
    field: 'q5_ready_to_learn',
    title: '5. If you have no previous experience, how would you demonstrate that you are ready to learn?',
    description: 'If you already have experience, outline how you approach adopting new guidelines and protocols.',
    minChars: 50,
    maxChars: 1500,
    evaluationFocus: 'Coachability, receptiveness to training, and resourcefulness.',
  },
  {
    id: 'g6',
    field: 'q6_staff_disagreement',
    title: '6. How would you handle disagreements with another staff member?',
    description: 'Describe your steps to maintain professionalism and resolve conflicts without affecting community safety.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Conflict de-escalation, mutual respect, and chain of command awareness.',
  },
  {
    id: 'g7',
    field: 'q7_friend_rule_violation',
    title: '7. How would you respond if a friend violated the server rules?',
    description: 'Address fairness, personal boundaries, neutrality, and professional duty.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Impartiality, integrity, and anti-favoritism.',
  },
  {
    id: 'g8',
    field: 'q8_confidentiality',
    title: '8. How would you handle confidential information shared with staff?',
    description: 'Discuss private logs, sensitive reports, and staff-only deliberations.',
    minChars: 50,
    maxChars: 1500,
    evaluationFocus: 'Discretion, data security, and trust.',
  },
  {
    id: 'g9',
    field: 'q9_handling_criticism',
    title: '9. How would you respond to criticism of a moderation decision?',
    description: 'Explain your demeanor when interacting with frustrated or dissatisfied members.',
    minChars: 60,
    maxChars: 1500,
    evaluationFocus: 'Patience, composure under pressure, and reflective problem solving.',
  },
  {
    id: 'g10',
    field: 'q10_mistake_handling',
    title: '10. What would you do if you made a mistake while performing your duties?',
    description: 'Walk through admitting errors, correcting the action, and informing senior staff.',
    minChars: 50,
    maxChars: 1500,
    evaluationFocus: 'Accountability, honesty, and continuous improvement.',
  },
];

export const MODERATOR_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'm1',
    field: 'm1_repeated_insults',
    title: '1. A member repeatedly insults another member. How would you handle the situation?',
    description: 'Detail your intervention process: warnings, logs, timeouts, and channel stabilization.',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Even-handed enforcement and swift channel de-escalation.',
  },
  {
    id: 'm2',
    field: 'm2_incomplete_evidence',
    title: '2. A user reports harassment but provides incomplete evidence. What would you do?',
    description: 'How do you balance user safety with evidence verification and investigative diligence?',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Investigative thoroughness, empathy, and objective verification.',
  },
  {
    id: 'm3',
    field: 'm3_mutual_accusations',
    title: '3. Two members accuse each other of breaking the rules. How would you investigate fairly?',
    description: 'Describe checking context, timestamps, provoking behavior, and avoiding snap judgments.',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Neutral arbitration and balanced fact-finding.',
  },
  {
    id: 'm4',
    field: 'm4_friend_violation_action',
    title: '4. You discover that a friend has broken a server rule. What action would you take?',
    description: 'What immediate steps would you take, and would you recuse yourself or involve another moderator?',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Ethics, transparency, and self-recusal when appropriate.',
  },
  {
    id: 'm5',
    field: 'm5_senior_staff_discrepancy',
    title: '5. A senior staff member gives an instruction that appears to violate the server rules. How would you respond?',
    description: 'How would you seek clarification while respecting authority and protecting guidelines?',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Courage, diplomacy, and ethical standard enforcement.',
  },
  {
    id: 'm6',
    field: 'm6_misunderstanding_vs_harassment',
    title: '6. How would you distinguish between an honest misunderstanding and deliberate harassment?',
    description: 'Examine tone, repeat pattern, recipient reactions, and linguistic nuances.',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Nuanced discernment and proportional response.',
  },
  {
    id: 'm7',
    field: 'm7_warning_restriction_escalation',
    title: '7. When should a moderator issue a warning, apply a temporary restriction, or escalate a case?',
    description: 'Outline the severity ladder from gentle reminder to administrative escalation.',
    minChars: 60,
    maxChars: 1800,
    evaluationFocus: 'Understanding tiered enforcement thresholds.',
  },
  {
    id: 'm8',
    field: 'm8_unsure_rule_interpretation',
    title: '8. What would you do if you were unsure whether a rule had been violated?',
    description: 'Describe the consultation process with peers or leadership before taking irreversible action.',
    minChars: 50,
    maxChars: 1800,
    evaluationFocus: 'Prudence, communication, and avoiding hasty unilateral actions.',
  },
];

export const ADMINISTRATOR_QUESTIONS: QuestionDefinition[] = [
  {
    id: 'a1',
    field: 'a1_ready_for_admin',
    title: '1. Why are you ready for administrative responsibilities beyond ordinary moderation?',
    description: 'Discuss strategic perspective, operational oversight, and willingness to shoulder escalation burdens.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Leadership readiness and executive capability.',
  },
  {
    id: 'a2',
    field: 'a2_resolve_moderator_dispute',
    title: '2. How would you resolve a disagreement between two moderators?',
    description: 'Address peer mediation, enforcing consistent interpretations, and team cohesion.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Internal conflict resolution and team harmony.',
  },
  {
    id: 'a3',
    field: 'a3_investigate_staff_complaint',
    title: '3. How would you investigate a complaint against a staff member?',
    description: 'Outline objective inquiry, preserving logs, hearing both sides, and maintaining confidentiality.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Fair internal accountability and evidence-based inquiry.',
  },
  {
    id: 'a4',
    field: 'a4_inconsistent_enforcement',
    title: '4. What would you do if a moderator repeatedly made inconsistent enforcement decisions?',
    description: 'How would you coach, audit, and provide structured feedback before punitive measures?',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Mentorship, performance calibration, and constructive feedback.',
  },
  {
    id: 'a5',
    field: 'a5_consistent_rule_application',
    title: '5. How would you ensure that staff members apply the rules consistently?',
    description: 'Propose clear guidelines, incident debriefs, precedent documentation, or staff alignment meetings.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Systems thinking and operational standardization.',
  },
  {
    id: 'a6',
    field: 'a6_prioritizing_urgent_reports',
    title: '6. How would you prioritize several urgent reports arriving simultaneously?',
    description: 'Triage framework: safety threats, raid attempts, toxic behavior, minor infractions.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Crisis triage, delegation, and rapid prioritization.',
  },
  {
    id: 'a7',
    field: 'a7_influential_member_incident',
    title: '7. How would you handle a serious incident involving a popular or influential member?',
    description: 'Balancing equal accountability with public communication and community fallout prevention.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Steadfast integrity against community pressure.',
  },
  {
    id: 'a8',
    field: 'a8_fair_performance_eval',
    title: '8. How would you evaluate staff performance fairly?',
    description: 'Metrics vs qualitative balance: ticket quality, presence, tone, teamwork, and reliability.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Holistic performance evaluation without toxic quotas.',
  },
  {
    id: 'a9',
    field: 'a9_prevent_permission_misuse',
    title: '9. How would you prevent misuse of staff permissions?',
    description: 'Principle of least privilege, two-person rule for critical actions, audit logs, and clear sanctions.',
    minChars: 70,
    maxChars: 2000,
    evaluationFocus: 'Security hygiene and governance.',
  },
  {
    id: 'a10',
    field: 'a10_practical_improvement_plan',
    title: '10. Describe a practical plan for improving the community without disrupting its existing operations.',
    description: 'Provide an actionable, phased proposal (e.g., onboarding revamp, event cadence, feedback channels).',
    minChars: 80,
    maxChars: 2000,
    evaluationFocus: 'Strategic vision, realism, and operational change management.',
  },
];

export interface RoleDetail {
  type: PositionType;
  title: string;
  badgeSubtitle: string;
  summary: string;
  responsibilities: string[];
  eligibility: string[];
  evaluationCriteria: string[];
  imageSrc: string;
}

export const ROLE_DETAILS: Record<PositionType, RoleDetail> = {
  moderator: {
    type: 'moderator',
    title: 'Community Moderator',
    badgeSubtitle: 'Frontend Community Safety & Enforcement',
    summary:
      'Moderators help maintain community standards, handle real-time user reports, resolve interpersonal conflicts, and enforce server rules with fairness and consistency.',
    responsibilities: [
      'Active monitoring of public chat channels and voice discussions',
      'Timely response to user tickets and harassment reports',
      'Neutral dispute mediation between community members',
      'Applying proportional disciplinary measures (warnings, mutes, escalations)',
      'Documenting incidents in moderation logs for transparency',
    ],
    eligibility: [
      'Minimum age: 16+ (or community-approved age criteria)',
      'Active community membership in good standing for at least 30 days',
      'Zero severe disciplinary sanctions on record within the last 90 days',
      'Demonstrated composure, written fluency, and patience',
      'Available for minimum 8+ active contribution hours weekly',
    ],
    evaluationCriteria: [
      'Fairness, judgment, and consistency',
      'De-escalation and communication clarity',
      'Willingness to escalate uncertain cases rather than guess',
      'Impartiality towards friends and personal acquaintances',
    ],
    imageSrc: moderatorEmblem,
  },
  administrator: {
    type: 'administrator',
    title: 'Server Administrator',
    badgeSubtitle: 'Operations, Leadership & Escalation Governance',
    summary:
      'Administrators handle escalated enforcement incidents, coordinate moderation team shifts, review staff conduct, audit logs, and support overall server community management.',
    responsibilities: [
      'Handling high-severity escalations, raids, and critical emergencies',
      'Supervising, mentoring, and evaluating moderation staff',
      'Investigating appeals and complaints regarding staff conduct',
      'Ensuring uniform policy enforcement across all shifts and timezones',
      'Collaborating with community leads on rules, bot setups, and safety tools',
    ],
    eligibility: [
      'Minimum age: 18+ (proven maturity and decision-making track record)',
      'Demonstrated leadership or senior moderation experience',
      'Exemplary integrity and trusted discretion with confidential data',
      'Strong written communication, conflict mediation, and triage skills',
      'Available for 12+ hours weekly with flexible on-call availability',
    ],
    evaluationCriteria: [
      'Leadership and accountability',
      'Confidentiality and peer conflict resolution',
      'Operational judgment under crisis pressure',
      'Systemic consistency and staff development capability',
    ],
    imageSrc: adminEmblem,
  },
};

export const MODERATOR_SCENARIO_QUESTIONS = MODERATOR_QUESTIONS;
export const ADMINISTRATOR_SCENARIO_QUESTIONS = ADMINISTRATOR_QUESTIONS;

