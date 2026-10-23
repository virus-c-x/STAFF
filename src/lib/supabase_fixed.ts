import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ApplicationFormData,
  ApplicationStatus,
  PositionType,
  StoredApplicationRecord,
} from '../types/application';
import {
  AdminKPIs,
  AdminRole,
  AdminUser,
  AuditLogEntry,
  CandidateHistorySummary,
  FormQuestion,
  RecruitmentSettings,
  ReviewerNoteItem,
} from '../types/admin';

const STORAGE_KEY_URL = 'staff_recruitment_supabase_url';
const STORAGE_KEY_ANON = 'staff_recruitment_supabase_anon_key';
const LOCAL_APPLICATIONS_KEY = 'staff_recruitment_local_submissions';
const LOCAL_ADMIN_USERS_KEY = 'staff_recruitment_admin_users';
const LOCAL_SETTINGS_KEY = 'staff_recruitment_settings';
const LOCAL_NOTES_KEY = 'staff_recruitment_reviewer_notes';
const LOCAL_HISTORY_KEY = 'staff_recruitment_status_history';
const LOCAL_QUESTIONS_KEY = 'staff_recruitment_questions';
const LOCAL_ADMIN_SESSION_KEY = 'staff_recruitment_admin_session';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://gaxjpazgvwyqstmszymc.supabase.co')?.trim() || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '';

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: true,
      source: 'env',
    };
  }

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL)?.trim() || '';
  const storedKey = localStorage.getItem(STORAGE_KEY_ANON)?.trim() || '';

  if (storedUrl && storedKey) {
    return {
      url: storedUrl,
      anonKey: storedKey,
      isConfigured: true,
      source: 'custom',
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none',
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
}

export function clearCustomSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
}

let cachedClient: SupabaseClient | null = null;
let currentClientConfigHash = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const hash = `${config.url}::${config.anonKey}`;
  if (cachedClient && currentClientConfigHash === hash) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentClientConfigHash = hash;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Generate a cryptographically secure, non-sequential public reference code.
 * Example: REF-2026-K9P4X2
 */
export function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars[array[i] % chars.length];
  }
  return `REF-${year}-${randomPart}`;
}

export interface SubmissionResult {
  success: boolean;
  referenceCode: string;
  isLiveSupabase: boolean;
  message?: string;
  error?: string;
}

export async function submitApplication(
  formData: ApplicationFormData
): Promise<SubmissionResult> {
  const referenceCode = generateReferenceCode();
  const position = formData.position as PositionType;

  // Enforce intake gate before processing or submitting
  try {
    const settings = await fetchRecruitmentSettings();
    if ((position === 'moderator' || position === 'administrator') && !settings.staff_intake_open) {
      return {
        success: false,
        referenceCode,
        isLiveSupabase: false,
        error: 'Staff Recruitment intake is currently closed. New applications cannot be submitted at this time.',
      };
    }
  } catch (gateErr) {
    console.warn('Intake status pre-check warning:', gateErr);
  }

  // Trim and clean all inputs
  const countryValue = (formData.applicantInfo.country || formData.applicantInfo.timeZone || '').trim();
  const rawContactMethod = (formData.applicantInfo.contactMethod || 'Discord').trim();
  const contactEmailVal = (formData.applicantInfo.contactEmail || '').trim();
  const effectiveContactMethod =
    rawContactMethod.toLowerCase() === 'gmail' && contactEmailVal
      ? `Gmail: ${contactEmailVal}`
      : rawContactMethod;

  const cleanedApplicantInfo = {
    displayName: formData.applicantInfo.displayName.trim(),
    platformUsername: formData.applicantInfo.platformUsername.trim(),
    platformUserId: formData.applicantInfo.platformUserId?.trim() || null,
    ageRange: formData.applicantInfo.ageRange,
    timeZone: countryValue,
    country: countryValue,
    languages: formData.applicantInfo.languages,
    otherLanguage: formData.applicantInfo.otherLanguage?.trim() || undefined,
    contactMethod: effectiveContactMethod,
    weeklyAvailability: formData.applicantInfo.weeklyAvailability,
  };

  const cleanedGeneralAnswers = Object.fromEntries(
    Object.entries(formData.generalAnswers).map(([k, v]) => [k, v.trim()])
  );

  const roleAnswers =
    position === 'moderator'
      ? Object.fromEntries(
          Object.entries(formData.moderatorAnswers).map(([k, v]) => [k, v.trim()])
        )
      : Object.fromEntries(
          Object.entries(formData.administratorAnswers).map(([k, v]) => [k, v.trim()])
        );

  const nowIso = new Date().toISOString();

  const allLanguages = [...cleanedApplicantInfo.languages];
  if (
    cleanedApplicantInfo.otherLanguage &&
    !allLanguages.includes(cleanedApplicantInfo.otherLanguage)
  ) {
    allLanguages.push(cleanedApplicantInfo.otherLanguage);
  }

  const payload = {
    reference_code: referenceCode,
    position: position,
    applicant_display_name: cleanedApplicantInfo.displayName,
    platform_username: cleanedApplicantInfo.platformUsername,
    platform_user_id: cleanedApplicantInfo.platformUserId,
    age_range: cleanedApplicantInfo.ageRange,
    time_zone: cleanedApplicantInfo.timeZone,
    languages: allLanguages,
    contact_method: cleanedApplicantInfo.contactMethod,
    weekly_availability: cleanedApplicantInfo.weeklyAvailability,
    general_answers: cleanedGeneralAnswers,
    role_answers: roleAnswers,
    status: 'pending' as ApplicationStatus,
    privacy_consent_timestamp: formData.declarations.consentTimestamp || nowIso,
    privacy_notice_version: formData.declarations.consentVersion || 'v1.0',
  };

  const client = getSupabaseClient();

  if (client) {
    try {
      let edgeFunctionSucceeded = false;
      let edgeErrorMsg = '';

      try {
        const { data: edgeData, error: edgeError } = await client.functions.invoke(
          'submit-application',
          { body: payload }
        );

        if (!edgeError && edgeData && edgeData.success) {
          edgeFunctionSucceeded = true;
          return {
            success: true,
            referenceCode: edgeData.reference_code || referenceCode,
            isLiveSupabase: true,
            message: 'Application successfully submitted.',
          };
        } else if (edgeError) {
          edgeErrorMsg = edgeError.message;
        }
      } catch (invokeErr) {
        edgeErrorMsg = (invokeErr as Error).message;
      }

      const { error: tableError } = await client.from('applications').insert([payload]);

      if (tableError) {
        console.error('Submission direct insert error:', tableError);
        return {
          success: false,
          referenceCode,
          isLiveSupabase: true,
          error: `Submission failed: ${tableError.message}.`,
        };
      }

      return {
        success: true,
        referenceCode,
        isLiveSupabase: true,
        message: 'Application successfully submitted.',
      };
    } catch (err) {
      console.error('Submission exception:', err);
      return {
        success: false,
        referenceCode,
        isLiveSupabase: true,
        error: (err as Error).message || 'An unexpected error occurred during submission.',
      };
    }
  } else {
    // Local Sandbox Mode
    try {
      const localRecord: StoredApplicationRecord = {
        id: crypto.randomUUID(),
        reference_code: referenceCode,
        position: position,
        applicant_display_name: cleanedApplicantInfo.displayName,
        platform_username: cleanedApplicantInfo.platformUsername,
        platform_user_id: cleanedApplicantInfo.platformUserId,
        age_range: cleanedApplicantInfo.ageRange,
        time_zone: cleanedApplicantInfo.timeZone,
        languages: allLanguages,
        contact_method: cleanedApplicantInfo.contactMethod,
        weekly_availability: cleanedApplicantInfo.weeklyAvailability,
        general_answers: cleanedGeneralAnswers as any,
        role_answers: roleAnswers as any,
        status: 'pending',
        privacy_consent_timestamp: payload.privacy_consent_timestamp,
        privacy_notice_version: payload.privacy_notice_version,
        created_at: nowIso,
      };

      const existingRaw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
      const list: StoredApplicationRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift(localRecord);
      localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(list));

      await new Promise((resolve) => setTimeout(resolve, 600));

      return {
        success: true,
        referenceCode,
        isLiveSupabase: false,
        message: 'Application successfully submitted.',
      };
    } catch (localErr) {
      return {
        success: false,
        referenceCode,
        isLiveSupabase: false,
        error: 'Unable to save application. Please check browser storage permissions.',
      };
    }
  }
}

export interface PublicStatusResult {
  found: boolean;
  referenceCode: string;
  position?: PositionType;
  status?: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  isLiveSupabase: boolean;
  error?: string;
}

export async function checkApplicationStatus(
  refCode: string
): Promise<PublicStatusResult> {
  const code = refCode.trim().toUpperCase();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.rpc('get_application_public_status', {
        p_reference_code: code,
      });

      if (error) {
        console.error('RPC error:', error);
        return {
          found: false,
          referenceCode: code,
          isLiveSupabase: true,
          error: error.message,
        };
      }

      if (data && data.length > 0) {
        const item = data[0];
        return {
          found: true,
          referenceCode: item.reference_code,
          position: item.position,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          isLiveSupabase: true,
        };
      }

      return {
        found: false,
        referenceCode: code,
        isLiveSupabase: true,
      };
    } catch (err) {
      return {
        found: false,
        referenceCode: code,
        isLiveSupabase: true,
        error: (err as Error).message,
      };
    }
  } else {
    initLocalSandboxSeed();
    const existingRaw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    const list: StoredApplicationRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const item = list.find((a) => a.reference_code.toUpperCase() === code);

    if (item) {
      return {
        found: true,
        referenceCode: item.reference_code,
        position: item.position,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.created_at,
        isLiveSupabase: false,
      };
    }

    return {
      found: false,
      referenceCode: code,
      isLiveSupabase: false,
    };
  }
}

export function getLocalDemoSubmissions(): StoredApplicationRecord[] {
  initLocalSandboxSeed();
  const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function updateLocalDemoStatus(
  referenceCode: string,
  newStatus: ApplicationStatus
): boolean {
  initLocalSandboxSeed();
  const list = getLocalDemoSubmissions();
  const item = list.find((a) => a.reference_code.toUpperCase() === referenceCode.toUpperCase());
  if (item) {
    item.status = newStatus;
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(list));
    return true;
  }
  return false;
}

/* ==============================================================================
   ADMIN SEED & LOCAL SANDBOX STORAGE ENGINE
   ============================================================================== */

export const PRIMARY_OWNER_EMAILS = [
  'viirusshop@gmail.com',
  'githubsupporrt@gmail.com',
];
export const PRIMARY_OWNER_EMAIL = PRIMARY_OWNER_EMAILS[0];

export function isPrimaryOwner(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return PRIMARY_OWNER_EMAILS.some((owner) => owner.toLowerCase() === clean);
}

/**
 * Safely purge demonstration records (app-seed-* or known test references)
 * without deleting genuine applicant records.
 */
export function purgeDemonstrationRecords(): { removedCount: number } {
  if (typeof window === 'undefined') return { removedCount: 0 };
  const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  if (!raw) return { removedCount: 0 };

  try {
    const list: StoredApplicationRecord[] = JSON.parse(raw);
    const demoCodes = ['REF-2026-X8M2K1', 'REF-2026-N4B9T7', 'REF-2026-P3Q8L5', 'REF-2026-Z2W5J9'];
    const real = list.filter(
      (a) => !a.id.startsWith('app-seed-') && !demoCodes.includes(a.reference_code)
    );
    const removedCount = list.length - real.length;
    if (removedCount > 0) {
      localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(real));
    }

    // Clean up seed notes and history
    const rawNotes = localStorage.getItem(LOCAL_NOTES_KEY);
    if (rawNotes) {
      const notesList: ReviewerNoteItem[] = JSON.parse(rawNotes);
      const realNotes = notesList.filter((n) => !n.application_id.startsWith('app-seed-'));
      localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(realNotes));
    }

    const rawHist = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (rawHist) {
      const histList: AuditLogEntry[] = JSON.parse(rawHist);
      const realHist = histList.filter((h) => !h.application_id.startsWith('app-seed-'));
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(realHist));
    }

    return { removedCount };
  } catch {
    return { removedCount: 0 };
  }
}

function initLocalSandboxSeed(): void {
  // 1. Seed Admin Users Allowlist with Primary Owner accounts
  if (!localStorage.getItem(LOCAL_ADMIN_USERS_KEY)) {
    const initialAdmins: AdminUser[] = [
      {
        id: 'admin-owner-viirusshop',
        email: 'viirusshop@gmail.com',
        display_name: 'Primary Owner',
        role: 'owner',
        is_active: true,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        last_login_at: new Date().toISOString(),
      },
      {
        id: 'admin-owner-githubsupporrt',
        email: 'githubsupporrt@gmail.com',
        display_name: 'Executive Owner',
        role: 'owner',
        is_active: true,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        last_login_at: new Date().toISOString(),
      },
      {
        id: 'admin-reviewer-lead',
        email: 'lead.reviewer@aspida.internal',
        display_name: 'Senior Intake Officer',
        role: 'lead_reviewer',
        is_active: true,
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        last_login_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        invited_by: 'viirusshop@gmail.com',
      },
    ];
    localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(initialAdmins));
  } else {
    // Ensure viirusshop@gmail.com is present in existing admin users list
    try {
      const raw = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
      const admins: AdminUser[] = raw ? JSON.parse(raw) : [];
      if (!admins.some((a) => a.email.toLowerCase() === 'viirusshop@gmail.com')) {
        admins.unshift({
          id: 'admin-owner-viirusshop',
          email: 'viirusshop@gmail.com',
          display_name: 'Primary Owner',
          role: 'owner',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        });
        localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(admins));
      }
    } catch {
      // Continue safely
    }
  }

  // 2. Seed Recruitment Settings
  if (!localStorage.getItem(LOCAL_SETTINGS_KEY)) {
    const initialSettings: RecruitmentSettings = {
      id: 1,
      staff_intake_open: true,
      judge_intake_open: false,
      banner_active: true,
      banner_text: 'Spring 2026 Cohort Recruitment Cycle is currently evaluating candidates for Community Staff & Operations.',
      banner_type: 'announcement',
      updated_at: new Date().toISOString(),
      updated_by: PRIMARY_OWNER_EMAIL,
    };
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(initialSettings));
  }

  // 3. Initialize applications store as empty (no fake records) and purge any leftover mock data
  if (!localStorage.getItem(LOCAL_APPLICATIONS_KEY)) {
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify([]));
  } else {
    purgeDemonstrationRecords();
  }
}

// Auto-initialize sandbox allowlist and clean demo records on module load
if (typeof window !== 'undefined') {
  initLocalSandboxSeed();
}

/* ==============================================================================
   ADMIN AUTHENTICATION API
   ============================================================================== */

export async function signInWithGoogleOAuth(): Promise<{ error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    return { error: 'Supabase is not configured. Google sign-in requires a live Supabase connection.' };
  }

  try {
    // Return to the GitHub Pages app root. Do not append a hash route to the
    // OAuth redirect URL; Supabase must process the callback first.
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    return error ? { error: error.message } : {};
  } catch (err) {
    return { error: (err as Error).message || 'Google sign-in could not be started.' };
  }
}

export async function signInWithEmailPassword(
  email: string,
  pass: string
): Promise<{ user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (!error && data.user) {
        // Verify user exists in admin_users allowlist
        const { data: adminRecord, error: adminErr } = await client
          .from('admin_users')
          .select('*')
          .eq('email', cleanEmail)
          .eq('is_active', true)
          .single();

        if (adminErr || !adminRecord) {
          await client.auth.signOut();
          return { error: 'Access Denied: This account is not authorized as an ASPIDA Administrator.' };
        }

        // Update last login
        await client
          .from('admin_users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', adminRecord.id);

        const currentAdmin: AdminUser = {
          id: adminRecord.id,
          auth_user_id: data.user.id,
          email: adminRecord.email,
          display_name: adminRecord.display_name,
          role: adminRecord.role,
          is_active: adminRecord.is_active,
          created_at: adminRecord.created_at,
          last_login_at: new Date().toISOString(),
        };

        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(currentAdmin));
        return { user: currentAdmin };
      }
    } catch (supabaseAuthErr) {
      console.warn('Supabase auth attempt returned:', supabaseAuthErr);
    }
  }

  // Sandbox & Offline Fallback: Check local admin users allowlist
  initLocalSandboxSeed();
  const rawAdmins = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const adminList: AdminUser[] = rawAdmins ? JSON.parse(rawAdmins) : [];
  const found = adminList.find((a) => a.email.toLowerCase() === cleanEmail && a.is_active);

  if (found) {
    // Password check: in sandbox mode, accept any non-empty password of >= 6 chars or 'AspidaAdmin2026!'
    if (pass.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    found.last_login_at = new Date().toISOString();
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(found));
    return { user: found };
  }

  return { error: 'Invalid administrator credentials or unauthorized email.' };
}

export async function getCurrentAdminSession(): Promise<AdminUser | null> {
  const client = getSupabaseClient();

  // Live mode must only trust a real Supabase Auth session and an active
  // allowlisted admin record. Never fall back to a locally cached admin here.
  if (client) {
    try {
      const { data: { session }, error: sessionError } = await client.auth.getSession();

      if (sessionError || !session?.user?.id || !session.user.email) {
        localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
        return null;
      }

      const cleanEmail = session.user.email.trim().toLowerCase();
      const { data: adminRecord, error: adminError } = await client
        .from('admin_users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError || !adminRecord) {
        localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
        await client.auth.signOut();
        return null;
      }

      const currentAdmin: AdminUser = {
        id: adminRecord.id,
        auth_user_id: session.user.id,
        email: adminRecord.email,
        display_name: adminRecord.display_name,
        role: adminRecord.role,
        is_active: adminRecord.is_active,
        created_at: adminRecord.created_at,
        last_login_at: adminRecord.last_login_at,
      };

      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(currentAdmin));
      return currentAdmin;
    } catch (err) {
      console.warn('Failed to validate Supabase admin session:', err);
      localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
      return null;
    }
  }

  // Local sandbox is only used when no Supabase client is configured.
  const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
  if (!stored) return null;

  try {
    const user = JSON.parse(stored) as AdminUser;
    return user?.is_active ? user : null;
  } catch {
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    return null;
  }
}

export async function signOutAdmin(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  }
  localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
}

/* ==============================================================================
   ADMIN DATA OPERATIONS
   ============================================================================== */

export async function fetchAdminKPIs(): Promise<AdminKPIs> {
  const client = getSupabaseClient();
  let apps: StoredApplicationRecord[] = [];
  let liveSucceeded = false;

  if (client) {
    try {
      const { data, error } = await client
        .from('applications')
        .select('id, position, status, created_at');

      if (!error && data) {
        apps = data as any;
        liveSucceeded = true;
      }
    } catch (err) {
      console.warn('Error fetching live KPIs, falling back to local registry:', err);
    }
  }

  if (!liveSucceeded) {
    initLocalSandboxSeed();
    const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    apps = raw ? JSON.parse(raw) : [];
  }

  const total = apps.length;
  const pending = apps.filter((a) => a.status === 'pending').length;
  const underReview = apps.filter((a) => a.status === 'under_review').length;
  const interview = apps.filter((a) => a.status === 'interview').length;
  const accepted = apps.filter((a) => a.status === 'accepted').length;
  const rejected = apps.filter((a) => a.status === 'rejected').length;
  const moderator = apps.filter((a) => a.position === 'moderator').length;
  const administrator = apps.filter((a) => a.position === 'administrator').length;

  const decided = accepted + rejected;
  const acceptanceRate = decided > 0 ? Math.round((accepted / decided) * 100) : 0;

  return {
    totalApplications: total,
    pendingCount: pending,
    underReviewCount: underReview,
    interviewCount: interview,
    acceptedCount: accepted,
    rejectedCount: rejected,
    moderatorCount: moderator,
    administratorCount: administrator,
    acceptanceRate,
  };
}

export interface AdminAppFilters {
  position?: PositionType | 'all';
  status?: ApplicationStatus | 'all';
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'status';
}

export async function fetchAdminApplications(
  filters: AdminAppFilters = {}
): Promise<StoredApplicationRecord[]> {
  const client = getSupabaseClient();
  let results: StoredApplicationRecord[] = [];
  let liveSucceeded = false;

  if (client) {
    try {
      let query = client.from('applications').select('*');

      if (filters.position && filters.position !== 'all') {
        query = query.eq('position', filters.position);
      }
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        results = data as StoredApplicationRecord[];
        liveSucceeded = true;
      }
    } catch (err) {
      console.warn('Error querying Supabase applications, falling back to local registry:', err);
    }
  }

  if (!liveSucceeded) {
    initLocalSandboxSeed();
    const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    results = raw ? JSON.parse(raw) : [];
  }

  // Filter in memory for search query and sorting
  let filtered = [...results];

  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter((a) => a.position === filters.position);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((a) => a.status === filters.status);
  }

  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.reference_code.toLowerCase().includes(q) ||
        a.applicant_display_name.toLowerCase().includes(q) ||
        a.platform_username.toLowerCase().includes(q) ||
        a.contact_method.toLowerCase().includes(q) ||
        (a.platform_user_id && a.platform_user_id.toLowerCase().includes(q))
    );
  }

  if (filters.sortBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (filters.sortBy === 'status') {
    filtered.sort((a, b) => a.status.localeCompare(b.status));
  } else {
    // Default: newest first
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return filtered;
}

export async function fetchApplicationDetail(applicationId: string): Promise<{
  application: StoredApplicationRecord | null;
  notes: ReviewerNoteItem[];
  history: AuditLogEntry[];
}> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data: appData } = await client
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (appData) {
        const { data: notesData } = await client
          .from('reviewer_notes')
          .select('*')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: false });

        const { data: historyData } = await client
          .from('application_status_history')
          .select('*')
          .eq('application_id', applicationId)
          .order('created_at', { ascending: false });

        return {
          application: appData as StoredApplicationRecord,
          notes: (notesData as ReviewerNoteItem[]) || [],
          history: (historyData as AuditLogEntry[]) || [],
        };
      }
    } catch (err) {
      console.warn('Error fetching application detail live, using sandbox:', err);
    }
  }

  // Fallback to local sandbox
  initLocalSandboxSeed();
  const rawApps = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  const appList: StoredApplicationRecord[] = rawApps ? JSON.parse(rawApps) : [];
  const app = appList.find((a) => a.id === applicationId) || null;

  const rawNotes = localStorage.getItem(LOCAL_NOTES_KEY);
  const allNotes: ReviewerNoteItem[] = rawNotes ? JSON.parse(rawNotes) : [];
  const appNotes = allNotes.filter((n) => n.application_id === applicationId);

  const rawHistory = localStorage.getItem(LOCAL_HISTORY_KEY);
  const allHistory: AuditLogEntry[] = rawHistory ? JSON.parse(rawHistory) : [];
  const appHistory = allHistory.filter((h) => h.application_id === applicationId);

  return {
    application: app,
    notes: appNotes,
    history: appHistory,
  };
}

export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  reason: string,
  adminName: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  const nowIso = new Date().toISOString();

  if (client) {
    try {
      const { error: updateErr } = await client
        .from('applications')
        .update({
          status: newStatus,
          reviewer_notes: reason,
          reviewed_at: nowIso,
          reviewed_by: adminId,
        })
        .eq('id', applicationId);

      if (!updateErr) {
        // Explicitly write audit log
        await client.from('application_status_history').insert([
          {
            application_id: applicationId,
            new_status: newStatus,
            changed_by: adminName,
            change_reason: reason,
          },
        ]);
        return { success: true };
      }
    } catch (err) {
      console.warn('Live status update failed, saving to sandbox:', err);
    }
  }

  // Local sandbox update
  initLocalSandboxSeed();
  const rawApps = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  const appList: StoredApplicationRecord[] = rawApps ? JSON.parse(rawApps) : [];
  const index = appList.findIndex((a) => a.id === applicationId);

  if (index >= 0) {
    const oldStatus = appList[index].status;
    appList[index].status = newStatus;
    appList[index].reviewer_notes = reason;
    appList[index].reviewed_at = nowIso;
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(appList));

    // Add to local audit history
    const rawHistory = localStorage.getItem(LOCAL_HISTORY_KEY);
    const historyList: AuditLogEntry[] = rawHistory ? JSON.parse(rawHistory) : [];
    historyList.unshift({
      id: crypto.randomUUID(),
      application_id: applicationId,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: adminName,
      change_reason: reason,
      created_at: nowIso,
    });
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(historyList));

    return { success: true };
  }

  return { success: false, error: 'Application record not found.' };
}

export async function addReviewerNote(
  note: Omit<ReviewerNoteItem, 'id' | 'created_at'>
): Promise<{ success: boolean; note?: ReviewerNoteItem; error?: string }> {
  const client = getSupabaseClient();
  const nowIso = new Date().toISOString();

  const newNote: ReviewerNoteItem = {
    ...note,
    id: crypto.randomUUID(),
    created_at: nowIso,
  };

  if (client) {
    try {
      const { data, error } = await client.from('reviewer_notes').insert([newNote]).select().single();
      if (!error && data) {
        return { success: true, note: data as ReviewerNoteItem };
      }
    } catch (err) {
      console.warn('Reviewer note insert live failed, saving locally:', err);
    }
  }

  // Local sandbox save
  initLocalSandboxSeed();
  const rawNotes = localStorage.getItem(LOCAL_NOTES_KEY);
  const notesList: ReviewerNoteItem[] = rawNotes ? JSON.parse(rawNotes) : [];
  notesList.unshift(newNote);
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notesList));

  return { success: true, note: newNote };
}

/* ==============================================================================
   RECRUITMENT SETTINGS & INTAKE CONTROL
   ============================================================================== */

export async function fetchRecruitmentSettings(): Promise<RecruitmentSettings> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('recruitment_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        return data as RecruitmentSettings;
      }
    } catch (err) {
      console.warn('Failed to fetch live settings, using sandbox:', err);
    }
  }

  initLocalSandboxSeed();
  const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (raw) {
    return JSON.parse(raw) as RecruitmentSettings;
  }

  return {
    id: 1,
    staff_intake_open: true,
    judge_intake_open: false,
    banner_active: true,
    banner_text: 'Official Spring 2026 Cohort Recruitment Cycle is now active. Review screening criteria before submission.',
    banner_type: 'announcement',
    updated_at: new Date().toISOString(),
  };
}

export async function updateRecruitmentSettings(
  settings: Partial<RecruitmentSettings>,
  adminEmail: string
): Promise<{ success: boolean; updated?: RecruitmentSettings; error?: string }> {
  const client = getSupabaseClient();
  const nowIso = new Date().toISOString();

  const payload = {
    ...settings,
    id: 1,
    updated_at: nowIso,
    updated_by: adminEmail,
  };

  if (client) {
    try {
      const { data, error } = await client
        .from('recruitment_settings')
        .upsert(payload)
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(data));
        return { success: true, updated: data as RecruitmentSettings };
      }
    } catch (err) {
      console.warn('Live settings update failed, saving locally:', err);
    }
  }

  // Local sandbox save
  const current = await fetchRecruitmentSettings();
  const merged: RecruitmentSettings = {
    ...current,
    ...settings,
    updated_at: nowIso,
    updated_by: adminEmail,
  };
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(merged));
  return { success: true, updated: merged };
}

/* ==============================================================================
   TEAM & ROLE MANAGEMENT
   ============================================================================== */

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data as AdminUser[];
      }
    } catch (err) {
      console.warn('Live admin users query failed, using sandbox:', err);
    }
  }

  initLocalSandboxSeed();
  const raw = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function inviteAdminUser(
  email: string,
  displayName: string,
  role: AdminRole,
  invitedBy: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const client = getSupabaseClient();
  const nowIso = new Date().toISOString();

  const newAdmin: AdminUser = {
    id: crypto.randomUUID(),
    email: cleanEmail,
    display_name: displayName.trim(),
    role,
    is_active: true,
    created_at: nowIso,
    invited_by: invitedBy,
  };

  if (client) {
    try {
      const { data, error } = await client.from('admin_users').insert([newAdmin]).select().single();
      if (!error && data) {
        return { success: true, user: data as AdminUser };
      } else if (error) {
        return { success: false, error: error.message };
      }
    } catch (err) {
      console.warn('Live invite failed, saving locally:', err);
    }
  }

  // Local sandbox
  initLocalSandboxSeed();
  const rawAdmins = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const list: AdminUser[] = rawAdmins ? JSON.parse(rawAdmins) : [];

  if (list.some((a) => a.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An administrator with this email already exists.' };
  }

  list.push(newAdmin);
  localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(list));
  return { success: true, user: newAdmin };
}

export async function updateAdminUserRole(
  id: string,
  newRole: AdminRole,
  currentAdminEmail: string
): Promise<{ success: boolean; error?: string }> {
  // Prevent primary owner self-demotion
  const list = await fetchAdminUsers();
  const target = list.find((a) => a.id === id);

  if (target && isPrimaryOwner(target.email) && newRole !== 'owner') {
    return { success: false, error: 'Primary executive owner accounts cannot be downgraded.' };
  }

  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client
        .from('admin_users')
        .update({ role: newRole })
        .eq('id', id);

      if (!error) return { success: true };
    } catch (err) {
      console.warn('Live role update failed:', err);
    }
  }

  // Local sandbox
  initLocalSandboxSeed();
  const rawAdmins = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const adminList: AdminUser[] = rawAdmins ? JSON.parse(rawAdmins) : [];
  const idx = adminList.findIndex((a) => a.id === id);

  if (idx >= 0) {
    adminList[idx].role = newRole;
    localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(adminList));
    return { success: true };
  }

  return { success: false, error: 'Admin record not found.' };
}

export async function removeAdminUser(
  id: string,
  currentAdminEmail: string
): Promise<{ success: boolean; error?: string }> {
  const list = await fetchAdminUsers();
  const target = list.find((a) => a.id === id);

  if (target && isPrimaryOwner(target.email)) {
    return { success: false, error: 'Primary executive owner accounts cannot be revoked or deleted.' };
  }

  if (target?.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
    return { success: false, error: 'You cannot revoke your own administrator account.' };
  }

  const client = getSupabaseClient();

  if (client) {
    try {
      const { error } = await client.from('admin_users').delete().eq('id', id);
      if (!error) return { success: true };
    } catch (err) {
      console.warn('Live admin deletion failed:', err);
    }
  }

  // Local sandbox
  initLocalSandboxSeed();
  const rawAdmins = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
  const adminList: AdminUser[] = rawAdmins ? JSON.parse(rawAdmins) : [];
  const updated = adminList.filter((a) => a.id !== id);
  localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(updated));

  return { success: true };
}

/* ==============================================================================
   CANDIDATE RE-APPLICANT & DUPLICATE SUBMISSION DETECTOR
   ============================================================================== */

export async function searchCandidateHistory(
  query: string
): Promise<CandidateHistorySummary[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return [];

  const allApps = await fetchAdminApplications({});

  // Group by applicant platform username or email or display name
  const matched = allApps.filter(
    (a) =>
      a.platform_username.toLowerCase().includes(cleanQ) ||
      a.applicant_display_name.toLowerCase().includes(cleanQ) ||
      a.contact_method.toLowerCase().includes(cleanQ) ||
      a.reference_code.toLowerCase().includes(cleanQ)
  );

  const map = new Map<string, CandidateHistorySummary>();

  for (const app of matched) {
    const key = app.platform_username.toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        applicant_display_name: app.applicant_display_name,
        platform_username: app.platform_username,
        contact_method: app.contact_method,
        applications: [],
      });
    }

    map.get(key)!.applications.push({
      id: app.id,
      reference_code: app.reference_code,
      position: app.position,
      status: app.status,
      created_at: app.created_at,
    });
  }

  return Array.from(map.values());
}
