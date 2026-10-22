import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ApplicationFormData,
  ApplicationStatus,
  PositionType,
  StoredApplicationRecord,
} from '../types/application';

const STORAGE_KEY_URL = 'staff_recruitment_supabase_url';
const STORAGE_KEY_ANON = 'staff_recruitment_supabase_anon_key';
const LOCAL_APPLICATIONS_KEY = 'staff_recruitment_local_submissions';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://gaxjpazgvwyqstmszymc.supabase.co/rest/v1/')?.trim() || '';
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
        persistSession: false,
        autoRefreshToken: false,
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
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // no ambiguous 0/O, 1/I
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

  // Trim and clean all inputs
  const cleanedApplicantInfo = {
    displayName: formData.applicantInfo.displayName.trim(),
    platformUsername: formData.applicantInfo.platformUsername.trim(),
    platformUserId: formData.applicantInfo.platformUserId?.trim() || null,
    ageRange: formData.applicantInfo.ageRange,
    timeZone: formData.applicantInfo.timeZone.trim(),
    languages: formData.applicantInfo.languages,
    otherLanguage: formData.applicantInfo.otherLanguage?.trim() || undefined,
    contactMethod: formData.applicantInfo.contactMethod.trim(),
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

  // Combine languages with otherLanguage if present
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
      // Primary: Route submission through Supabase Edge Function for server-side re-validation
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
            message: 'Application validated and recorded via Supabase Edge Function.',
          };
        } else if (edgeError) {
          edgeErrorMsg = edgeError.message;
        }
      } catch (invokeErr) {
        // Edge function may not be deployed yet in this project
        edgeErrorMsg = (invokeErr as Error).message;
      }

      // Secondary Fallback: Direct PostgreSQL Table Insert protected by Row Level Security (RLS)
      const { error: tableError } = await client.from('applications').insert([payload]);

      if (tableError) {
        console.error('Supabase direct insert error:', tableError);
        return {
          success: false,
          referenceCode,
          isLiveSupabase: true,
          error: `Database submission failed: ${tableError.message}. ${
            edgeErrorMsg ? `(Edge Function: ${edgeErrorMsg})` : ''
          }`,
        };
      }

      // Non-blocking notification trigger
      try {
        await client.functions.invoke('notify-application', {
          body: {
            reference_code: referenceCode,
            position,
            applicant_display_name: cleanedApplicantInfo.displayName,
            created_at: nowIso,
          },
        });
      } catch (notifyErr) {
        console.warn('Optional notification trigger skipped:', notifyErr);
      }

      return {
        success: true,
        referenceCode,
        isLiveSupabase: true,
        message: 'Application successfully stored in Supabase PostgreSQL database.',
      };
    } catch (err) {
      console.error('Network or database exception:', err);
      return {
        success: false,
        referenceCode,
        isLiveSupabase: true,
        error: (err as Error).message || 'An unexpected error occurred during transmission.',
      };
    }
  } else {
    // Demo Sandbox Mode: store securely in local registry
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

      // Simulate a realistic network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        referenceCode,
        isLiveSupabase: false,
        message: 'Application verified and saved to local sandbox database. Connect Supabase in settings to sync live.',
      };
    } catch (localErr) {
      return {
        success: false,
        referenceCode,
        isLiveSupabase: false,
        error: 'Unable to save locally. Please check browser storage permissions.',
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
      // Use the SECURITY DEFINER RPC to prevent leaking private fields
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
    // Query local sandbox
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
  const existingRaw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
  return existingRaw ? JSON.parse(existingRaw) : [];
}

export function updateLocalDemoStatus(
  refCode: string,
  newStatus: ApplicationStatus,
  notes?: string
): void {
  const list = getLocalDemoSubmissions();
  const index = list.findIndex((a) => a.reference_code === refCode);
  if (index >= 0) {
    list[index].status = newStatus;
    if (notes !== undefined) {
      list[index].reviewer_notes = notes;
    }
    list[index].reviewed_at = new Date().toISOString();
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(list));
  }
}
