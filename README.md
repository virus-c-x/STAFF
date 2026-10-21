# Professional Staff Recruitment & Application Portal

A modern, responsive, multi-step recruitment website built for server communities to manage public applications for **Community Moderator** and **Server Administrator** positions.

Architected specifically for static deployment to **GitHub Pages** with a **Supabase PostgreSQL** backend leveraging Row Level Security (RLS) and serverless Edge Functions for secure, zero-leak operations.

---

## Key Features

- **Custom Recruitment Interface**: Built specifically for server communities with bespoke multi-step flows, character count constraints, and structured grading rubrics—eliminating dependency on Google Forms.
- **Role-Adaptive Application Workflow**:
  - **Step 1**: Applicant Profile (Community Display Name, Platform Username, Discord User ID, Age Range, Time Zone, Multilingual Spoken Languages, Primary Contact Method, and Weekly Availability).
  - **Step 2**: Position Selection with full responsibilities, governance scope disclaimers, and prerequisites.
  - **Step 3**: 10 General Behavioral & Ethical Questions (motivation, conflict de-escalation, anti-favoritism, confidentiality, and mistake handling).
  - **Step 4 (Moderator)**: 8 Real-time Moderation Scenarios (repeated insults, incomplete evidence, mutual accusations, friend violations, senior staff discrepancy, misunderstanding vs harassment, tiered warnings, and rule uncertainty).
  - **Step 5 (Administrator)**: 10 Operational & Leadership Scenarios (moderator disputes, internal staff complaints, inconsistent enforcement calibration, multi-report triage, influential member crisis, performance evaluation, permission governance, and community improvement proposals).
  - **Step 6**: Comprehensive review accordion, editable sections, and mandatory candidate declarations with full legal consent.
- **Non-Sequential Reference Code**: Each submission generates a unique tracking token (e.g. `REF-2026-X8K9M2`) without exposing internal PostgreSQL UUID primary keys.
- **Applicant Status Lookup Tool**: Allows candidates to check their application status at any time via a `SECURITY DEFINER` RPC function that exposes only status metadata while keeping written answers confidential.
- **Draft Persistence**: Automatically saves drafts to local storage in real-time, preventing candidate data loss upon accidental refresh.
- **Zero-Trust Security**:
  - PostgreSQL Row Level Security (RLS) policies allow anonymous candidates to insert their new application with `status = 'pending'`, but completely forbid reading, updating, or deleting other applications.
  - Reviewer notes and administrative decision fields are non-writable by anonymous callers.
- **GitHub Pages Ready**: Compiles to static HTML/CSS/JS with relative base asset paths (`base: './'`).

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Build Tool**: Vite 8
- **Hosting**: GitHub Pages
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)
- **Optional Notifications**: Supabase Edge Functions with Resend / Google Workspace

---

## Directory Structure

```
├── docs/
│   ├── GITHUB_PAGES_DEPLOYMENT.md   # Step-by-step GitHub Pages CI/CD guide
│   ├── SUPABASE_SETUP.md            # Schema execution and RLS configuration
│   ├── GMAIL_NOTIFICATIONS.md       # Secure Edge Function email setup
│   └── FUTURE_ADMIN_DASHBOARD.md    # Architecture roadmap for Phase 2
├── supabase/
│   ├── schema.sql                   # Complete PostgreSQL DDL with RLS & audit triggers
│   └── functions/
│       └── notify-application/      # Edge function for email dispatch
├── src/
│   ├── assets/                      # High-fidelity visual assets and role emblems
│   ├── components/
│   │   ├── ApplicationForm/         # Multi-step form subcomponents (Steps 1–6)
│   │   ├── Modals/                  # Privacy, Staff Rules, Status Check, & Supabase Settings
│   │   ├── Navbar.tsx               # Top Bar Contract compliant navigation
│   │   ├── Hero.tsx                 # Landing hero with status indicators
│   │   ├── PositionCards.tsx        # Moderator & Administrator role cards
│   │   ├── RecruitmentProcess.tsx   # 4-stage recruitment pipeline
│   │   └── Footer.tsx               # Quiet compliant footer
│   ├── lib/
│   │   ├── questions.ts             # All question definitions and evaluation criteria
│   │   ├── storage.ts               # Local draft persistence and recovery
│   │   └── supabase.ts              # Supabase client with RLS and sandbox fallback
│   ├── types/
│   │   └── application.ts           # Core TypeScript data contracts
│   ├── App.tsx                      # Main application shell
│   └── index.css                    # Styling and typography base
├── .env.example                     # Environment variable blueprint
└── vite.config.ts                   # Relative base configuration for GitHub Pages
```

---

## Setup & Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for local testing; sandbox fallback is enabled by default):
   Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
   VITE_SUPABASE_ANON_KEY="<your-public-anon-key>"
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Paste and run the entire contents of `supabase/schema.sql`.
4. Grab your `Project URL` and `anon public key` from **Project Settings > API** and add them to your environment or the in-app **Database Settings** modal.

---

## GitHub Pages Deployment

1. Go to your GitHub repository **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Under **Settings > Secrets and variables > Actions**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Add the GitHub Actions workflow file `.github/workflows/deploy.yml` (see `docs/GITHUB_PAGES_DEPLOYMENT.md`).
5. Push to your `main` branch. GitHub Actions will build and deploy your application automatically!
