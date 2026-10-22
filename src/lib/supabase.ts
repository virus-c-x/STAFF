
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ApplicationFormData,
  ApplicationStatus,
  PositionType,
  StoredApplicationRecord,
} from '../types/application';

const DEFAULT_SUPABASE_URL =
  'https://gaxjpazgvwyqstmszymc.supabase.co';

const STORAGE_KEY_URL = 'staff_recruitment_supabase_url';
const STORAGE_KEY_ANON = 'staff_recruitment_supabase_anon_key';
const LOCAL_APPLICATIONS_KEY = 'staff_recruitment_local_submissions';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

function isSecretKey(key: string): boolean {
  return key.trim().startsWith('sb_secret_');
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl =
    (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  // Environment variables take precedence over local browser settings.
  if (envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isConfigured: Boolean(envUrl) && !isSecretKey(envKey),
      source: 'env',
    };
  }

  const storedUrl =
    (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
  const storedKey =
    (localStorage.getItem(STORAGE_KEY_ANON) || '').trim();

  if (storedUrl && storedKey) {
    return {
      url: storedUrl,
      anonKey: storedKey,
      isConfigured: !isSecretKey(storedKey),
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

function getConfigurationError(): string | null {
  const config = getSupabaseConfig();

  if (isSecretKey(config.anonKey)) {
    return (
      'Invalid browser API key: sb_secret_ keys must never be used ' +
      'in frontend code. Configure VITE_SUPABASE_ANON_KEY with your ' +
      'Supabase publishable key (sb_publishable_...) or legacy anon key.'
    );
  }

  if (!config.url || !config.anonKey || !config.isConfigured) {
    return (
      'Supabase is not configured. Check VITE_SUPABASE_URL and ' +
      'VITE_SUPABASE_ANON_KEY in your deployment settings.'
    );
  }

  return null;
}

export function saveCustomSupabaseConfig(
  url: string,
  anonKey: string
): void {
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

  if (getConfigurationError() || !config.isConfigured) {
    return null;
  }

  const hash = `${config.url}::${config.anonKey}`;

  if (cachedClient && currentClientConfigHash === hash) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    currentClientConfigHash = hash;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    cachedClient = null;
    currentClientConfigHash = '';
    return null;
  }
}

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
  const configError = getConfigurationError();

  if (configError) {
    return {
      success: false,
      referenceCode,
      isLiveSupabase: false,
      error: configError,
    };
  }

  const position = formData.position as PositionType;

  const cleanedApplicantInfo = {
    displayName: formData.applicantInfo.displayName.trim(),
    platformUsername: formData.applicantInfo.platformUsername.trim(),
    platformUserId:
      formData.applicantInfo.platformUserId?.trim() || null,
    ageRange: formData.applicantInfo.ageRange,
    timeZone: formData.applicantInfo.timeZone.trim(),
    languages: formData.applicantInfo.languages,
    otherLanguage:
      formData.applicantInfo.otherLanguage?.trim() || undefined,
    contactMethod: formData.applicantInfo.contactMethod.trim(),
    weeklyAvailability: formData.applicantInfo.weeklyAvailability,
  };

  const cleanedGeneralAnswers = Object.fromEntries(
    Object.entries(formData.generalAnswers).map(([key, value]) => [
      key,
      value.trim(),
    ])
  );

  const roleAnswers =
    position === 'moderator'
      ? Object.fromEntries(
          Object.entries(formData.moderatorAnswers).map(([key, value]) => [
            key,
            value.trim(),
          ])
        )
      : Object.fromEntries(
          Object.entries(formData.administratorAnswers).map(([key, value]) => [
            key,
            value.trim(),
          ])
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
    position,
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
    privacy_consent_timestamp:
      formData.declarations.consentTimestamp || nowIso,
    privacy_notice_version:
      formData.declarations.consentVersion || 'v1.0',
  };

  const client = getSupabaseClient();

  if (!client) {
    return {
      success: false,
      referenceCode,
      isLiveSupabase: false,
      error:
        getConfigurationError() ||
        'Could not initialize the Supabase client. Check your configuration.',
    };
  }

  try {
    // Submit directly to PostgreSQL. No Edge Function is required.
    const { error } = await client
      .from('applications')
      .insert([payload]);

    if (error) {
      console.error('Supabase application insert failed:', error);

      return {
        success: false,
        referenceCode,
        isLiveSupabase: true,
        error: `Database submission failed: ${error.message}`,
      };
    }

    return {
      success: true,
      referenceCode,
      isLiveSupabase: true,
      message: 'Application successfully saved to Supabase.',
    };
  } catch (error) {
    console.error('Application submission exception:', error);

    return {
      success: false,
      referenceCode,
      isLiveSupabase: true,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while submitting the application.',
    };
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
  const configError = getConfigurationError();

  if (configError) {
    return {
      found: false,
      referenceCode: code,
      isLiveSupabase: false,
      error: configError,
    };
  }

  const client = getSupabaseClient();

  if (!client) {
    return {
      found: false,
      referenceCode: code,
      isLiveSupabase: false,
      error: 'Could not initialize the Supabase client.',
    };
  }

  try {
    const { data, error } = await client.rpc(
      'get_application_public_status',
      { p_reference_code: code }
    );

    if (error) {
      console.error('Application status RPC failed:', error);

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
  } catch (error) {
    return {
      found: false,
      referenceCode: code,
      isLiveSupabase: true,
      error:
        error instanceof Error
          ? error.message
          : 'Could not check application status.',
    };
  }
}

// Kept for compatibility with existing admin/demo UI code.
export function getLocalDemoSubmissions(): StoredApplicationRecord[] {
  const existingRaw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  return existingRaw ? JSON.parse(existingRaw) : [];
}

// Kept for compatibility. These functions only update local demo records.
export function updateLocalDemoStatus(
  refCode: string,
  newStatus: ApplicationStatus,
  notes?: string
): void {
  const list = getLocalDemoSubmissions();
  const index = list.findIndex(
    (application) => application.reference_code === refCode
  );

  if (index >= 0) {
    list[index].status = newStatus;

    if (notes !== undefined) {
      list[index].reviewer_notes = notes;
    }

    list[index].reviewed_at = new Date().toISOString();

    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(list));
  }
}
