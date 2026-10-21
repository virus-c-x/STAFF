// Supabase Edge Function: submit-application
// Provides server-side validation and secure insertion into PostgreSQL

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_POSITIONS = ["moderator", "administrator"];
const ALLOWED_AGE_RANGES = ["Under 16", "16–17", "18–20", "21–24", "25 or older"];
const ALLOWED_AVAILABILITY = [
  "1–3 hours/week",
  "4–7 hours/week",
  "8–14 hours/week",
  "15–20 hours/week",
  "More than 20 hours/week",
];

function generateServerReferenceCode(): string {
  const year = new Date().getFullYear();
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars[array[i] % chars.length];
  }
  return `REF-${year}-${randomPart}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    // 1. Position validation
    const position = String(payload.position || "").trim().toLowerCase();
    if (!ALLOWED_POSITIONS.includes(position)) {
      return new Response(
        JSON.stringify({ error: "Invalid position specified. Must be 'moderator' or 'administrator'." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Personal info validation
    const displayName = String(payload.applicant_display_name || "").trim();
    if (displayName.length < 2 || displayName.length > 100) {
      return new Response(
        JSON.stringify({ error: "Display name must be between 2 and 100 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const platformUsername = String(payload.platform_username || "").trim();
    if (platformUsername.length < 2 || platformUsername.length > 100) {
      return new Response(
        JSON.stringify({ error: "Platform username must be between 2 and 100 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ageRange = String(payload.age_range || "").trim();
    if (!ALLOWED_AGE_RANGES.includes(ageRange)) {
      return new Response(
        JSON.stringify({ error: "Invalid age range bracket." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timeZone = String(payload.time_zone || "").trim();
    if (!timeZone) {
      return new Response(
        JSON.stringify({ error: "Time zone is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contactMethod = String(payload.contact_method || "").trim();
    if (!contactMethod || contactMethod.length > 120) {
      return new Response(
        JSON.stringify({ error: "Valid contact method is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const weeklyAvailability = String(payload.weekly_availability || "").trim();
    if (!ALLOWED_AVAILABILITY.includes(weeklyAvailability)) {
      return new Response(
        JSON.stringify({ error: "Invalid weekly availability selection." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const languages = Array.isArray(payload.languages) ? payload.languages : [];
    if (languages.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one language must be specified." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. General answers validation (10 answers)
    const generalAnswers = payload.general_answers || {};
    const requiredGeneralKeys = [
      "q1_why_join",
      "q2_why_position",
      "q3_qualities",
      "q4_previous_experience",
      "q5_ready_to_learn",
      "q6_staff_disagreement",
      "q7_friend_rule_violation",
      "q8_confidentiality",
      "q9_handling_criticism",
      "q10_mistake_handling",
    ];

    for (const key of requiredGeneralKeys) {
      const val = String(generalAnswers[key] || "").trim();
      if (!val || val.length < 30) {
        return new Response(
          JSON.stringify({ error: `General question '${key}' is incomplete or below minimum required length.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 4. Role answers validation
    const roleAnswers = payload.role_answers || {};
    if (position === "moderator") {
      const modKeys = [
        "m1_repeated_insults",
        "m2_incomplete_evidence",
        "m3_mutual_accusations",
        "m4_friend_violation_action",
        "m5_senior_staff_discrepancy",
        "m6_misunderstanding_vs_harassment",
        "m7_warning_restriction_escalation",
        "m8_unsure_rule_interpretation",
      ];
      for (const key of modKeys) {
        const val = String(roleAnswers[key] || "").trim();
        if (!val || val.length < 40) {
          return new Response(
            JSON.stringify({ error: `Moderator scenario question '${key}' is incomplete.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    } else {
      const adminKeys = [
        "a1_ready_for_admin",
        "a2_resolve_moderator_dispute",
        "a3_investigate_staff_complaint",
        "a4_inconsistent_enforcement",
        "a5_consistent_rule_application",
        "a6_prioritizing_urgent_reports",
        "a7_influential_member_incident",
        "a8_fair_performance_eval",
        "a9_prevent_permission_misuse",
        "a10_practical_improvement_plan",
      ];
      for (const key of adminKeys) {
        const val = String(roleAnswers[key] || "").trim();
        if (!val || val.length < 50) {
          return new Response(
            JSON.stringify({ error: `Administrator scenario question '${key}' is incomplete.` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // 5. Connect to Supabase using standard Edge Functions environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // Use service role key if available in Edge runtime, or anon key passed from caller
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 6. Generate non-sequential reference code
    const referenceCode = payload.reference_code || generateServerReferenceCode();
    const nowIso = new Date().toISOString();

    const insertData = {
      reference_code: referenceCode,
      position: position,
      applicant_display_name: displayName,
      platform_username: platformUsername,
      platform_user_id: payload.platform_user_id ? String(payload.platform_user_id).trim() : null,
      age_range: ageRange,
      time_zone: timeZone,
      languages: languages,
      contact_method: contactMethod,
      weekly_availability: weeklyAvailability,
      general_answers: generalAnswers,
      role_answers: roleAnswers,
      status: "pending", // strictly enforced
      reviewer_notes: null,
      reviewed_at: null,
      reviewed_by: null,
      privacy_consent_timestamp: payload.privacy_consent_timestamp || nowIso,
      privacy_notice_version: payload.privacy_notice_version || "v1.0",
      created_at: nowIso,
    };

    const { error: insertError } = await supabase.from("applications").insert([insertData]);

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: `Database error: ${insertError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        reference_code: referenceCode,
        message: "Application validated and stored successfully.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Submission edge function error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
