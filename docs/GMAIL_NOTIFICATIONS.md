# Optional Gmail & Email Notification Integration Guide

This guide describes how to configure secure email notifications when a new staff application is submitted, without exposing any secret keys or email credentials in the frontend or public repository.

---

## 1. Architectural Overview

```
Applicant Browser (GitHub Pages)
         │
         ▼  (Supabase client.insert())
PostgreSQL Database (`applications` table)
         │
         ▼  (Database Webhook or Client Function Invoke)
Supabase Edge Function (`notify-application`)
         │
         ▼  (HTTPS with encrypted API secrets)
Email Delivery Service (Gmail API / Google Workspace / Resend)
         │
         ▼
Recruitment Team Inbox (e.g., recruitment@servercommunity.com)
```

---

## 2. Privacy & Data Minimization Rule

To protect candidate confidentiality and prevent sensitive logs in mail servers, **notification emails deliberately include ONLY minimal metadata**:
- Application Reference Code (`REF-2026-XXXXXX`)
- Target Position (`Moderator` or `Administrator`)
- Applicant Community Display Name
- Submission Timestamp (UTC)
- Secure link to the Private Staff Review Portal

**Forbidden in email body**:
- Full written scenario answers.
- Personal contact accounts or discord user IDs.
- Answers to sensitive interpersonal conflict questions.

---

## 3. Deployment Instructions for Supabase Edge Functions

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. Link your local project:
   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   ```
3. Set your private secrets in Supabase (these remain encrypted in the cloud and never touch Git):
   ```bash
   supabase secrets set NOTIFICATION_RECIPIENT_EMAIL="recruitment@yourcommunity.com"
   supabase secrets set RESEND_API_KEY="re_123456789..."
   supabase secrets set ADMIN_PORTAL_BASE_URL="https://admin.yourcommunity.com"
   ```
4. Deploy the function:
   ```bash
   supabase functions deploy notify-application
   ```

---

## 4. Setting up a Database Webhook (Automatic Trigger)

Instead of relying on the client, you can trigger the function automatically whenever a row is inserted:

1. In Supabase Dashboard, go to **Database** > **Webhooks**.
2. Click **Create a new webhook**.
3. Name: `on_application_created`.
4. Table: `applications`.
5. Events: `INSERT`.
6. Type: **Supabase Edge Function** -> select `notify-application`.
7. Click **Create Webhook**.

Whenever any applicant submits an application, the Supabase PostgreSQL engine immediately runs the Edge Function in a secure isolate.
