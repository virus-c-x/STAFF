# Supabase Configuration & Database Schema Guide

This document explains how to set up the PostgreSQL database and Row Level Security (RLS) on Supabase for the Staff Recruitment Portal.

---

## 1. Create a Supabase Project

1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Set a name (e.g., `server-community-recruitment`) and database password.
3. Choose the region closest to your server community members.

---

## 2. Apply the PostgreSQL Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this repository.
4. Copy the entire contents, paste it into the SQL Editor, and click **Run**.

### What gets created:
- **`applications`**: Stores applicant details, general scenario responses, role-specific responses, status, and compliance timestamps.
- **`application_status_history`**: Audit trail that automatically records status transitions (e.g., `pending` -> `under_review` -> `interview`).
- **`reviewer_notes`**: Internal team grading table for scoring candidates without exposing notes to applicants.
- **`get_application_public_status`**: A `SECURITY DEFINER` function allowing applicants to check their own status via reference code without having read access to the applications table.

---

## 3. Row Level Security (RLS) Validation

The schema enforces strict, zero-trust security:

| Role | Action | Constraints / Permissions |
|---|---|---|
| **Anonymous (`anon`)** | `INSERT` | **Allowed ONLY** with `status = 'pending'`, and `reviewer_notes IS NULL`, `reviewed_at IS NULL`, `reviewed_by IS NULL`. |
| **Anonymous (`anon`)** | `SELECT` | **Blocked entirely**. Anonymous users cannot query or list applications table. |
| **Anonymous (`anon`)** | `UPDATE / DELETE` | **Blocked entirely**. |
| **Anonymous (`anon`)** | `EXECUTE RPC` | Allowed only for `get_application_public_status(ref_code)`. |
| **Authenticated Staff** | `SELECT / UPDATE` | Full access for team members with role `staff`, `admin`, or `reviewer`. |

---

## 4. Retrieving Credentials for Frontend

1. In Supabase, go to **Project Settings** > **API**.
2. Find:
   - **Project URL**: e.g., `https://xyzabcdefg.supabase.co`
   - **Project API Keys** > `anon` `public`: e.g., `eyJhbGciOi...`
3. Add these to your local `.env` or GitHub Secrets:
   ```env
   VITE_SUPABASE_URL="https://xyzabcdefg.supabase.co"
   VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."
   ```

You can also input and test them directly in the application's built-in **Supabase Settings** modal during local testing!
