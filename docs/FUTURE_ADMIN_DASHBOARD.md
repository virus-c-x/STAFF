# Administrative Dashboard — Architecture Blueprint (Future Phase)

This document details the architectural foundation already incorporated into the database schema and application design to ensure seamless delivery of the future administrative dashboard without requiring schema refactoring or breaking existing submissions.

---

## 1. Zero-Trust Access Control & Authentication

- **Authentication Engine**: Supabase Auth (Email/Password with Multi-Factor Authentication or Google Workspace SSO restricted to team domains).
- **Role-Based Access Control (RBAC)**:
  - `Admin`: Full permissions (view, status change, assign interviewers, configure recruitment open/closed status, delete/archive).
  - `Moderation Lead`: View all applications, score Moderator applications, leave reviewer notes, schedule interviews.
  - `Reviewer / Staff`: Read-only access to assigned applicant submissions, leave internal candidate ratings.
- **RLS Guard**: Public anonymous applicants can NEVER access the administrative dashboard routes or data feeds. Any attempt by an unauthenticated browser to query `/rest/v1/applications` returns empty or `401 Unauthorized`.

---

## 2. Core Dashboard Features (Future Implementation)

1. **Application Pipeline (Kanban / Table)**:
   - Columns matching PostgreSQL status enums:
     - `Pending`: Newly submitted applications awaiting preliminary screening.
     - `Under Review`: Staff member assigned and currently scoring scenario answers.
     - `Interview`: Candidate invited to Discord/voice behavioral interview.
     - `Accepted`: Onboarded into training cohort.
     - `Rejected`: Archived with polite automated or personalized notification.

2. **Search, Filter & Sorting**:
   - Filter by position (`Moderator`, `Administrator`).
   - Filter by weekly availability (`15-20h`, `>20h`).
   - Filter by languages spoken.
   - Search by username or reference code (`REF-2026-XXXXXX`).
   - Sort by submission timestamp or review priority.

3. **Candidate Detail & Evaluation Modal**:
   - Side-by-side view of applicant responses against the official scoring rubric.
   - Internal 1-to-5 star rating system for each question category (De-escalation, Integrity, Maturity, Leadership).
   - Team comments feed linked via the `reviewer_notes` table with author attribution and timestamps.

4. **Audit Trail & Governance**:
   - Every status modification triggers the `application_status_history` table automatically at the PostgreSQL database level.
   - Tamper-evident logging of which administrator authorized each promotion or rejection.

5. **Recruitment Campaign Management**:
   - Ability to toggle recruitment status between `Open` and `Closed`.
   - Custom recruitment announcement banner editor.
