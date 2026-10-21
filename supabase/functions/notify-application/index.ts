// Follows Deno/Supabase Edge Functions conventions
// Triggered via Supabase Database Webhook or invoked securely after application insert.
// Secrets are stored securely in Supabase Secrets vault, never exposed in client code.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface NotificationPayload {
  record?: {
    reference_code: string;
    position: string;
    applicant_display_name: string;
    created_at: string;
  };
  // Fallback for direct invoke
  reference_code?: string;
  position?: string;
  applicant_display_name?: string;
  created_at?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const data = payload.record || payload;

    const reference = data.reference_code || "UNKNOWN";
    const position = data.position || "Staff";
    const displayName = data.applicant_display_name || "Applicant";
    const submissionTime = data.created_at || new Date().toISOString();

    // Environment variables configured in Supabase Project Secrets:
    // NOTIFICATION_RECIPIENT_EMAIL (e.g. recruitment@servercommunity.com)
    // RESEND_API_KEY or GMAIL_SMTP_KEY or GOOGLE_WORKSPACE_SERVICE_ACCOUNT
    // ADMIN_PORTAL_BASE_URL (e.g. https://admin.servercommunity.com)
    const recipientEmail = Deno.env.get("NOTIFICATION_RECIPIENT_EMAIL");
    const adminPortalBaseUrl = Deno.env.get("ADMIN_PORTAL_BASE_URL") || "https://your-server.community/admin";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    console.log(`[Notification Engine] Processing application: ${reference} for ${displayName}`);

    if (!recipientEmail || !resendApiKey) {
      console.warn("Email service credentials not configured. Notification logged only.");
      return new Response(
        JSON.stringify({
          success: true,
          mode: "dry-run",
          message: "Notification event received and logged (Email provider credentials not configured).",
          summary: { reference, position, displayName, submissionTime }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean, privacy-first notification email (NO sensitive answers transmitted over email)
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #e2e8f0; padding: 32px; border-radius: 12px; border: 1px solid #1e293b;">
        <h2 style="color: #ffffff; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 16px;">
          New Staff Application Received
        </h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
          A new candidate has submitted an application for the recruitment team's review.
        </p>
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #94a3b8; padding: 8px 0; width: 140px;">Reference Code:</td>
              <td style="color: #38bdf8; font-weight: 600; font-family: monospace;">${reference}</td>
            </tr>
            <tr>
              <td style="color: #94a3b8; padding: 8px 0;">Position:</td>
              <td style="color: #ffffff; font-weight: 600; text-transform: capitalize;">${position}</td>
            </tr>
            <tr>
              <td style="color: #94a3b8; padding: 8px 0;">Display Name:</td>
              <td style="color: #ffffff;">${displayName}</td>
            </tr>
            <tr>
              <td style="color: #94a3b8; padding: 8px 0;">Submitted At:</td>
              <td style="color: #cbd5e1;">${new Date(submissionTime).toUTCString()}</td>
            </tr>
          </table>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
          * Candidate answers and contact methods are kept securely in the encrypted database to protect applicant privacy.
        </p>
        <div style="margin-top: 28px;">
          <a href="${adminPortalBaseUrl}/applications/${reference}" 
             style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px; display: inline-block;">
            Open in Private Staff Review Portal
          </a>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Recruitment Team <notifications@servercommunity.com>",
        to: [recipientEmail],
        subject: `[Application] ${position.toUpperCase()}: ${displayName} (${reference})`,
        html: emailHtml,
      }),
    });

    const resData = await res.json();

    return new Response(JSON.stringify({ success: true, result: resData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notification edge function:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
