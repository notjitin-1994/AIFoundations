# supabase-integration - Work Plan

## TL;DR (For humans)

**What you'll get:** Your AI Foundations course gets a real backend. Learners create an account with their first name, last name, email, and password — no magic links, no OAuth, just a clean traditional signup form with world-class UX (password strength meter, show/hide toggle, real-time validation, ARIA accessibility). They sign in with email/password instead of a mock guest session. Every single interaction in Modules 0 and 1 — every slide viewed, every video watched, every quiz answer, every interactive element clicked — gets recorded to a Supabase database as an xAPI statement, attributable to the real authenticated learner. Corporate/bundled customers can see their team's learning data. You (SmartSlate admin) can see everyone's data. All media assets (voiceovers, images, videos) move from your local `public/` folder to Supabase Storage. Row-Level Security enforces the 3-tier access model at the database level — no application code can bypass it.

**Why this approach:** Supabase replaces three separate systems (mock auth, external LRS, local file storage) with one integrated platform. PostgreSQL JSONB columns store full xAPI statements while denormalized hot columns enable fast queries. RLS policies enforce data access at the database level — the application never needs to filter queries manually. The CanvasViewer component becomes the centralized tracking hub for slide-view events, so we don't need to modify 37 individual slide components. Email/password auth is the most universally understood authentication pattern — every learner knows how to use it, reducing support burden and onboarding friction.

**What it will NOT do:** No OAuth/Google/GitHub login (add later), no magic link/passwordless login (add later), no email verification (add later when SMTP is configured), no real-time streaming, no SCORM/cmi5 packaging, no multi-org membership per user (one org per learner), no changes to slide content or visual design, no changes to unbuilt Modules 2-7.

**Effort:** XL
**Risk:** High — replaces core infrastructure (auth, data persistence, media delivery); touches every page in the app
**Decisions to sanity-check:** (1) Email/password only — no magic link, no OAuth, no email verification (all deferred to a later phase). (2) Signup collects first_name, last_name, email, password — stored in `profiles` table via Supabase trigger. (3) User's database key is a Supabase-generated UUID (`auth.users.id`); email is the unique human-facing identifier (`profiles.email` with UNIQUE constraint). This is the industry-standard Supabase pattern — `auth.users.id` must be a UUID and cannot be changed to email. (4) One org per user (not multi-org). (5) No guest mode — all learners must authenticate. (6) Public storage buckets for course media. (7) Custom `app_role` enum (learner / team_admin / admin) for access tiers. (8) Password policy: min 8 chars, require uppercase + lowercase + numbers + symbols (enforced both client-side via Zod and server-side via Supabase Auth settings). (9) Email confirmation disabled in Supabase dashboard for now — users can log in immediately after signup. Enable later when SMTP is configured.

Your next move: review the 7-phase plan below, flag any decisions you want changed, then approve to proceed with implementation.

---

> TL;DR (machine): XL effort, High risk — 7-phase Supabase integration: foundation → database+RLS → auth → LRS → storage → event tracking → testing. Replaces mock auth, external LRS, and local file storage.

## Scope
### Must have
1. Supabase client utilities (browser + server) + auth middleware
2. Database schema with 6 tables + RLS policies (3-tier access)
3. Auth UI (login, signup, callback) replacing mock useUser hook
4. Rewritten sendXAPIStatement inserting to Supabase instead of external LRS
5. xAPI tracking for all ~45 untracked interactions across modules 0 & 1
6. Supabase Storage with 3 buckets + media migration from public/
7. Basic admin dashboard for viewing all learner data

### Must NOT have (guardrails, anti-slop, scope boundaries)
- NO OAuth providers (Google, GitHub, etc.) in this phase
- NO magic link or passwordless login — email/password only (add in a later phase)
- NO email verification / email confirmation — disabled in Supabase dashboard (add later when SMTP is configured)
- NO real-time xAPI streaming or WebSocket subscriptions
- NO xAPI State API or Agent Profile API — Statement API only
- NO SCORM or cmi5 packaging
- NO multi-org membership per user — one org per user
- NO content authoring, CMS, or admin content management
- NO changes to slide visual design, content, or animations
- NO changes to Modules 2-7 (not yet built)
- NO migration of YouTube embeds — they stay as external embeds
- NO new Zustand stores (keep the existing 3)
- NO `as any` or `@ts-ignore` (AGENTS.md §10)
- NO commits directly to main for code changes
- NO passwords stored in localStorage — tokens in httpOnly cookies only (via @supabase/ssr)
- NO custom password hashing — Supabase Auth uses bcrypt automatically

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after (RLS policy tests + integration tests + manual QA)
- Evidence: .omo/evidence/task-<N>-supabase-integration.<ext>
- Key verification: RLS policies tested with `auth.uid()` simulation; auth flow tested end-to-end; xAPI statements verified in Supabase dashboard

## Execution strategy
### Parallel execution waves

**Phase 1 — Foundation (Wave 1, parallel):**
- Tasks 1-3: Install packages, create client utilities, create middleware

**Phase 2 — Database Schema (Wave 2, sequential after Phase 1):**
- Task 4: Create SQL migration with all tables
- Task 5: Create RLS policies
- Task 6: Create database triggers (auto-profile creation on signup)

**Phase 3 — Auth Integration (Wave 3, parallel after Phase 2):**
- Tasks 7-9: Login page, signup page, auth callback route
- Task 10: Replace useUser hook
- Task 11: Update layout for auth state

**Phase 4 — LRS Integration (Wave 4, sequential after Phase 3):**
- Task 12: Rewrite sendXAPIStatement server action
- Task 13: Create useLRS hook for client-side tracking
- Task 14: Add slide-view tracking to CanvasViewer

**Phase 5 — Storage Migration (Wave 5, parallel after Phase 4):**
- Task 15: Create storage buckets
- Task 16: Migrate audio files
- Task 17: Migrate image files
- Task 18: Migrate video files
- Task 19: Update all media references in code

**Phase 6 — Event Tracking (Wave 6, parallel after Phase 5):**
- Task 20: Add tracking for Module 0 untracked interactions
- Task 21: Add tracking for Module 1 untracked interactions
- Task 22: Add tracking for interactive elements (timeline, simulator, etc.)

**Phase 7 — Admin & Testing (Wave 7, sequential after Phase 6):**
- Task 23: Create admin dashboard page
- Task 24: RLS policy verification tests
- Task 25: End-to-end auth flow test
- Task 26: Full build + lint verification

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 (install packages) | — | 2, 3 | — |
| 2 (browser client) | 1 | 7-11 | 3 |
| 3 (server client + middleware) | 1 | 7-11 | 2 |
| 4 (schema) | 1 | 5, 6 | — |
| 5 (RLS policies) | 4 | 12 | 6 |
| 6 (triggers) | 4 | 7-11 | 5 |
| 7-9 (auth pages) | 2, 3, 6 | 10 | 10, 11 |
| 10 (replace useUser) | 2, 3, 6 | 12-14 | 7-9, 11 |
| 11 (update layout) | 10 | 12-14 | 7-9 |
| 12 (rewrite xAPI) | 5, 10 | 13, 14 | — |
| 13 (useLRS hook) | 12 | 20-22 | 14 |
| 14 (CanvasViewer tracking) | 12 | 20-22 | 13 |
| 15 (buckets) | 1 | 16-18 | — |
| 16-18 (migrate media) | 15 | 19 | each other |
| 19 (update references) | 16-18 | 20-22 | — |
| 20 (Module 0 tracking) | 13, 14, 19 | 23 | 21, 22 |
| 21 (Module 1 tracking) | 13, 14, 19 | 23 | 20, 22 |
| 22 (interactive tracking) | 13, 14 | 23 | 20, 21 |
| 23 (admin dashboard) | 20-22 | 24-26 | — |
| 24 (RLS tests) | 23 | 26 | 25 |
| 25 (auth flow test) | 23 | 26 | 24 |
| 26 (build + lint) | 24, 25 | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.

- [x] 1. Install Supabase packages, configure environment variables, and set Auth dashboard settings
  What to do: Run `npm install @supabase/supabase-js @supabase/ssr`. Add env vars to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://lymilwegnuzimngpawik.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tT7RlIlWh1MyDmjD0n9Ekw_kYjt1tWB
  ```
  Also check if `react-hook-form` and `zod` are already installed (shadcn forms use them). If not: `npm install react-hook-form zod @hookform/resolvers`.
  
  Then configure Supabase Auth settings in the Supabase dashboard (Authentication → Providers → Email):
  - **Disable email confirmation**: Turn OFF "Confirm email" (Users can log in immediately after signup. We will enable this later when SMTP is configured.)
  - **Set minimum password length**: 8 characters
  - **Set required character sets**: Require uppercase letters, lowercase letters, digits, and symbols
  - **Enable leaked password protection** (if on Pro plan): Reject passwords known to HaveIBeenPwned
  - **Set rate limiting**: Supabase has built-in rate limiting on auth endpoints (5 attempts per minute per IP by default — verify this is enabled)
  - **Disable magic link**: Ensure "Enable email signup" is ON but magic link / passwordless login is not the primary method. (Magic link is deferred to a later phase.)
  
  Must NOT do: Do NOT commit `.env.local` (already in .gitignore). Do NOT install OAuth packages. Do NOT enable email confirmation (no SMTP configured yet). Do NOT install `@supabase/supabase-client-nextjs` (deprecated — use `@supabase/ssr` instead).
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 2, 3
  References: User-provided Supabase credentials. Context7: @supabase/ssr setup guide. Supabase docs — "Password security" guide. Supabase dashboard — Authentication → Providers → Email.
  Acceptance criteria: `npm ls @supabase/supabase-js @supabase/ssr` shows both installed. `.env.local` contains both vars. `react-hook-form` and `zod` are installed (check with `npm ls`). Supabase dashboard Auth settings configured (email confirmation OFF, password policy set).
  QA scenarios: (happy) packages installed, env vars present, dashboard configured; (failure) missing package, env var, or dashboard setting. Evidence: .omo/evidence/task-1-supabase-integration.txt
  Commit: Y | chore: install supabase packages, configure env vars, and set auth dashboard policy

- [x] 2. Create Supabase browser client utility
  What to do: Create `src/lib/supabase/client.ts`:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'
  
  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
  }
  ```
  Must NOT do: Do NOT use service role key in browser client. Do NOT create a singleton — function returns a new client per call (SSR-safe).
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 7-11
  References: Context7: createBrowserClient pattern from @supabase/ssr docs.
  Acceptance criteria: `src/lib/supabase/client.ts` exists and exports `createClient`. `npx tsc --noEmit` passes.
  QA scenarios: (happy) file exists, types check; (failure) type error or missing file. Evidence: .omo/evidence/task-2-supabase-integration.txt
  Commit: Y | feat(supabase): create browser client utility

- [x] 3. Create Supabase server client utility + auth middleware
  What to do: Create two files:
  
  `src/lib/supabase/server.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  
  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet, _headers) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch { /* called from Server Component — ignored with middleware refreshing */ }
          }
        }
      }
    )
  }
  ```
  
  `src/middleware.ts`:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'
  
  export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet, headers) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
            Object.entries(headers).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value)
            )
          }
        }
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup') && !request.nextUrl.pathname.startsWith('/auth')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }
  
  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4)$).*)']
  }
  ```
  Must NOT do: Do NOT use service role key in middleware. Do NOT skip `supabase.auth.getUser()`. Do NOT remove the matcher pattern (it excludes static files).
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 7-11
  References: Context7: middleware proxy pattern. Next.js 16 middleware docs.
  Acceptance criteria: `src/lib/supabase/server.ts` and `src/middleware.ts` exist. `npx tsc --noEmit` passes. Middleware redirects unauthenticated users to /login.
  QA scenarios: (happy) both files exist, types check, middleware redirects; (failure) type error or no redirect. Evidence: .omo/evidence/task-3-supabase-integration.txt
  Commit: Y | feat(supabase): create server client and auth middleware

- [x] 4. Create database schema SQL migration
  What to do: Create `supabase/migrations/001_initial_schema.sql` with the following tables:
  
  **profiles** — extends auth.users (industry-standard Supabase pattern per official docs):
  ```sql
  CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    app_role TEXT NOT NULL DEFAULT 'learner' CHECK (app_role IN ('learner', 'team_admin', 'admin')),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
  The `id` column is a UUID generated by Supabase Auth (`auth.users.id`) — this is a hard constraint of Supabase and cannot be changed to email. The `email` column has a UNIQUE constraint, making it the human-facing unique identifier. All foreign keys in other tables reference `profiles.id` (the UUID), not email. This is the pattern documented in Supabase's official "User Management" guide.
  
  **organizations** — corporate/bundle customers:
  ```sql
  CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan TEXT NOT NULL DEFAULT 'individual' CHECK (plan IN ('individual', 'team', 'enterprise')),
    max_seats INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
  
  **xapi_statements** — the LRS:
  ```sql
  CREATE TABLE xapi_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    actor_id TEXT NOT NULL,
    verb_id TEXT NOT NULL,
    verb_display TEXT,
    object_id TEXT NOT NULL,
    object_name TEXT,
    object_description TEXT,
    result_score REAL,
    result_success BOOLEAN,
    result_completion BOOLEAN,
    context_module_id TEXT,
    context_slide_id TEXT,
    context_lesson_index INTEGER,
    stored TIMESTAMPTZ NOT NULL DEFAULT now(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    statement JSONB NOT NULL
  );
  ```
  Indexes:
  ```sql
  CREATE INDEX idx_xapi_user_time ON xapi_statements(user_id, timestamp DESC);
  CREATE INDEX idx_xapi_org_time ON xapi_statements(organization_id, timestamp DESC);
  CREATE INDEX idx_xapi_verb_time ON xapi_statements(verb_id, timestamp DESC);
  CREATE INDEX idx_xapi_object_time ON xapi_statements(object_id, timestamp DESC);
  CREATE INDEX idx_xapi_statement_gin ON xapi_statements USING GIN(statement);
  ```
  
  **module_progress** — per-learner progress:
  ```sql
  CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    module_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    project_spine TEXT,
    active_lesson_index INTEGER DEFAULT 0,
    active_slide_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, module_id)
  );
  ```
  
  **assessment_results** — detailed assessment scores:
  ```sql
  CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    assessment_kind TEXT NOT NULL CHECK (assessment_kind IN ('baseline', 'module', 'final')),
    module_id TEXT,
    overall_score INTEGER NOT NULL,
    by_module JSONB,
    questions_answered INTEGER NOT NULL,
    duration_ms BIGINT,
    taken_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ```
  
  Enable RLS on all tables:
  ```sql
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE xapi_statements ENABLE ROW LEVEL SECURITY;
  ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
  ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
  ```
  Must NOT do: Do NOT use `gen_random_uuid()` if pgcrypto extension not enabled — use `uuid_generate_v4()` or ensure extension is enabled. Do NOT create foreign keys to non-existent tables (create in dependency order: organizations → profiles → xapi_statements → module_progress → assessment_results).
  Parallelization: Wave 2 | Blocked by: 1 | Blocks: 5, 6
  References: T-Square LRS schema article. xAPI 1.0.3 spec. Supabase database docs.
  Acceptance criteria: SQL file exists with all 5 tables + indexes + RLS enabled. Can be run via `supabase db push` or Supabase SQL editor without errors.
  QA scenarios: (happy) SQL executes cleanly; (failure) syntax error or FK violation. Evidence: .omo/evidence/task-4-supabase-integration.txt
  Commit: Y | feat(db): create initial schema with xAPI statements, profiles, organizations

- [x] 5. Create RLS policies for 3-tier access
  What to do: Create `supabase/migrations/002_rls_policies.sql`:
  
  **Helper function — get current user's org:**
  ```sql
  CREATE OR REPLACE FUNCTION get_user_org_id()
  RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid();
  $$ LANGUAGE sql SECURITY DEFINER STABLE;
  ```
  
  **Helper function — is admin:**
  ```sql
  CREATE OR REPLACE FUNCTION is_admin()
  RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND app_role = 'admin');
  $$ LANGUAGE sql SECURITY DEFINER STABLE;
  ```
  
  **profiles RLS:**
  ```sql
  -- Learners see their own profile
  CREATE POLICY "Profiles: self select" ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "Profiles: self update" ON profiles FOR UPDATE USING (auth.uid() = id);
  -- Team members see org members' profiles
  CREATE POLICY "Profiles: org members select" ON profiles FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
  -- Admins see all profiles
  CREATE POLICY "Profiles: admin select all" ON profiles FOR SELECT USING (is_admin());
  ```
  
  **organizations RLS:**
  ```sql
  -- Members see their own org
  CREATE POLICY "Orgs: member select" ON organizations FOR SELECT USING (id = get_user_org_id());
  -- Admins see all orgs
  CREATE POLICY "Orgs: admin select all" ON organizations FOR SELECT USING (is_admin());
  ```
  
  **xapi_statements RLS:**
  ```sql
  -- Learners INSERT their own statements
  CREATE POLICY "xAPI: self insert" ON xapi_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
  -- Learners SELECT their own statements
  CREATE POLICY "xAPI: self select" ON xapi_statements FOR SELECT USING (auth.uid() = user_id);
  -- Team members SELECT org members' statements
  CREATE POLICY "xAPI: org select" ON xapi_statements FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
  -- Admins SELECT all statements
  CREATE POLICY "xAPI: admin select all" ON xapi_statements FOR SELECT USING (is_admin());
  ```
  
  **module_progress RLS:**
  ```sql
  CREATE POLICY "Progress: self insert" ON module_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Progress: self select" ON module_progress FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Progress: self update" ON module_progress FOR UPDATE USING (auth.uid() = user_id);
  CREATE POLICY "Progress: org select" ON module_progress FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
  CREATE POLICY "Progress: admin select all" ON module_progress FOR SELECT USING (is_admin());
  ```
  
  **assessment_results RLS:**
  ```sql
  CREATE POLICY "Assessments: self insert" ON assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY "Assessments: self select" ON assessment_results FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY "Assessments: org select" ON assessment_results FOR SELECT USING (organization_id = get_user_org_id() AND organization_id IS NOT NULL);
  CREATE POLICY "Assessments: admin select all" ON assessment_results FOR SELECT USING (is_admin());
  ```
  Must NOT do: Do NOT use `USING (true)` — that disables RLS effectively. Do NOT forget the INSERT policies (learners need to write their own data). Do NOT grant DELETE to anyone but admin (statements are immutable per xAPI spec).
  Parallelization: Wave 2 | Blocked by: 4 | Blocks: 12
  References: Context7: RLS policy patterns. Supabase RLS docs.
  Acceptance criteria: SQL file exists with all policies. All tables have SELECT policies for 3 tiers. INSERT/UPDATE policies exist for self-service.
  QA scenarios: (happy) SQL executes, policies created; (failure) policy conflict or syntax error. Evidence: .omo/evidence/task-5-supabase-integration.txt
  Commit: Y | feat(db): create RLS policies for 3-tier access (learner, team, admin)

- [x] 6. Create database triggers (auto-profile on signup)
  What to do: Create `supabase/migrations/003_triggers.sql`:
  ```sql
  -- Auto-create profile on user signup
  -- Reads first_name and last_name from raw_user_meta_data (set by auth.signUp options.data)
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO profiles (id, email, first_name, last_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
  
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  
  -- Auto-update updated_at on profiles
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  
  CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  ```
  This trigger fires automatically when `supabase.auth.signUp()` creates a new row in `auth.users`. The signup call passes `options: { data: { first_name, last_name } }` which Supabase stores in `raw_user_meta_data`. The trigger reads those values and creates the profile row. This is the exact pattern from Supabase's official "User Management" documentation.
  Must NOT do: Do NOT set app_role in the trigger (default 'learner' is correct for new signups). Do NOT assign organization_id in the trigger (assigned later by admin). Do NOT set `SECURITY DEFINER` without `SET search_path = ''` (security best practice per Supabase docs).
  Parallelization: Wave 2 | Blocked by: 4 | Blocks: 7-11
  References: Supabase official docs — "User Management" guide, handle_new_user trigger pattern. Context7: Supabase auth trigger patterns.
  Acceptance criteria: SQL file exists. Trigger creates profile on user insert with first_name and last_name populated from raw_user_meta_data.
  QA scenarios: (happy) trigger fires on new user, profile has first_name + last_name; (failure) profile not created or names empty. Evidence: .omo/evidence/task-6-supabase-integration.txt
  Commit: Y | feat(db): create triggers for auto-profile creation and updated_at

- [x] 7. Create login page
  What to do: Create `src/app/login/page.tsx` — a premium email/password login form using Supabase auth, React Hook Form, Zod, and shadcn/ui components. This must feel world-class — not a generic auth form.

  **Layout & visual design:**
  - Centered card, max-width 420px, on a subtle gradient or glassmorphism background (per STYLE.md — dark navy base, teal accents for design elements, indigo for CTAs)
  - Card header: "Welcome back" title, "Sign in to continue your learning journey" subtitle
  - Card body: email field, password field, submit button, "Don't have an account? Sign up" link
  - Autofocus on the email field when the page loads
  - All fields use shadcn Input, Label, and Button components

  **Form fields (in order):**
  1. **Email** — `type="email"`, `autocomplete="email"`, `inputmode="email"` (mobile keyboard), `required`, label "Email address", placeholder "you@example.com", validates on blur
  2. **Password** — `type="password"`, `autocomplete="current-password"`, `required`, label "Password", show/hide eye-icon toggle button, validates on blur
  3. **Submit button** — full-width, indigo CTA color, text "Sign in", loading state with spinner (disabled + spinner during submission)

  **Validation (React Hook Form + Zod):**
  - Email: Zod `z.string().email("Please enter a valid email address")` — validate on blur
  - Password: `z.string().min(1, "Password is required")` — validate on blur (no strength check on login — they already have an account)
  - Errors appear inline below the field with `role="alert"` and red text
  - Errors announced to screen readers via `aria-live="polite"` on the error container

  **Auth behavior:**
  - On submit: call `supabase.auth.signInWithPassword({ email, password })`
  - On success: redirect to `/` (home / Module 0)
  - On error: show specific error message from Supabase (e.g., "Invalid login credentials" — do NOT say whether email or password was wrong, to prevent user enumeration)
  - On error: preserve the email field value (do NOT clear it) so the user doesn't retype it; clear only the password field
  - Focus moves to the first invalid field after a failed submit

  **Accessibility (WCAG 2.1 AA):**
  - Every field has a `<Label>` associated via `htmlFor` (no placeholder-only labels)
  - Error messages use `aria-describedby` linking to the error span
  - Invalid fields set `aria-invalid="true"`
  - Password show/hide button has `aria-label="Show password"` / `aria-label="Hide password"`
  - Form title announced on load via `aria-labelledby`
  - Loading state announced via `aria-live` region ("Signing in…")
  - Keyboard: Tab moves through fields → button → signup link; Enter submits from any field

  **Microcopy:**
  - Button: "Sign in" (not "Submit" or "Log in" — "Sign in" is the industry standard)
  - Error: "Invalid email or password. Please try again." (generic, prevents enumeration)
  - Link: "Don't have an account? Create one" → links to `/signup`

  Must NOT do: Do NOT add OAuth buttons. Do NOT add magic link option. Do NOT store passwords in localStorage. Do NOT use client-side auth without server-side session. Do NOT use placeholder text as the only label. Do NOT clear the email field on failed login.
  Parallelization: Wave 3 | Blocked by: 2, 3, 6 | Blocks: 10
  References: Supabase auth.signInWithPassword(). Context7: auth patterns. UX Patterns for Developers — "Sign Up Flow Pattern". shadcn/ui form examples. STYLE.md — two-accent rule (teal = design, indigo = CTA).
  Acceptance criteria: `/login` page renders with premium design. Login with valid credentials redirects to `/`. Login with invalid credentials shows error, preserves email. Autofocus works. Show/hide password toggle works. Tab navigation works. Screen reader announces errors.
  QA scenarios: (happy) login succeeds, redirect works, autofocus on email; (failure) wrong password shows error, email preserved. Evidence: .omo/evidence/task-7-supabase-integration.txt
  Commit: Y | feat(auth): create premium login page with email/password and accessibility

- [x] 8. Create signup page
  What to do: Create `src/app/signup/page.tsx` — a world-class account creation form. This is the first impression every learner has of the product. It must feel premium, be frictionless, and follow every industry best practice.

  **Layout & visual design:**
  - Centered card, max-width 420px, on the same dark navy / glassmorphism background as login
  - Card header: "Create your account" title, "Start learning AI foundations today" subtitle
  - Card body: 4 fields (first name, last name, email, password), password strength meter, submit button, "Already have an account? Sign in" link
  - Autofocus on the first name field when the page loads
  - All fields use shadcn Input, Label, and Button components

  **Form fields (in order):**
  1. **First name** — `type="text"`, `autocomplete="given-name"`, `required`, label "First name", validates on blur (min 1 character)
  2. **Last name** — `type="text"`, `autocomplete="family-name"`, `required`, label "Last name", validates on blur (min 1 character)
  3. **Email** — `type="email"`, `autocomplete="email"`, `inputmode="email"`, `required`, label "Email address", placeholder "you@example.com", validates on blur
  4. **Password** — `type="password"`, `autocomplete="new-password"`, `required`, label "Password", show/hide eye-icon toggle button, real-time strength meter below the field
  5. **Submit button** — full-width, indigo CTA color, text "Create account", loading state with spinner (disabled + spinner during submission)

  **Password strength meter (real-time as user types):**
  - 4 horizontal bars that fill and change color as the password gets stronger:
    - 1 bar red = Weak (< 8 chars)
    - 2 bars amber = Fair (8+ chars, only letters or only numbers)
    - 3 bars yellow = Good (8+ chars, letters + numbers)
    - 4 bars green = Strong (8+ chars, uppercase + lowercase + numbers + symbols)
  - Text label next to bars: "Weak" / "Fair" / "Good" / "Strong"
  - `role="progressbar"` with `aria-label="Password strength"` and `aria-valuenow` (0-4)
  - Requirements hint shown below the meter (always visible while typing): "Use 8+ characters with uppercase, lowercase, numbers, and symbols"

  **Validation (React Hook Form + Zod):**
  - First name: `z.string().min(1, "First name is required")` — validate on blur
  - Last name: `z.string().min(1, "Last name is required")` — validate on blur
  - Email: `z.string().email("Please enter a valid email address")` — validate on blur
  - Password: `z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must include an uppercase letter").regex(/[a-z]/, "Must include a lowercase letter").regex(/[0-9]/, "Must include a number").regex(/[^A-Za-z0-9]/, "Must include a symbol")` — validate on blur for errors, strength meter updates in real-time
  - Errors appear inline below the field with `role="alert"` and red text
  - Errors announced to screen readers via `aria-live="polite"`
  - On submit: validate all fields, focus first invalid field if any

  **Auth behavior:**
  - On submit: call `supabase.auth.signUp({ email, password, options: { data: { first_name, last_name } } })`
  - The `options.data` object stores `first_name` and `last_name` in `raw_user_meta_data` on `auth.users`
  - The database trigger (task 6) fires automatically and creates a `profiles` row with `first_name`, `last_name`, `email`
  - On success (email confirmation is OFF): user is immediately authenticated, redirect to `/` (home / Module 0)
  - On error — duplicate email: show "An account with this email already exists. Would you like to sign in instead?" with a link to `/login`
  - On error — weak password (Supabase server-side): show the specific `WeakPasswordError` reason from Supabase
  - On error — other: show the Supabase error message
  - Preserve all field values on error (do NOT clear the form) so the user can fix and retry

  **Accessibility (WCAG 2.1 AA):**
  - Every field has a `<Label>` associated via `htmlFor`
  - Error messages use `aria-describedby` linking to the error span
  - Invalid fields set `aria-invalid="true"`
  - Password show/hide button has `aria-label="Show password"` / `aria-label="Hide password"`
  - Password strength meter: `role="progressbar"` with `aria-label="Password strength"`, `aria-valuenow` (0-4), `aria-valuemin="0"`, `aria-valuemax="4"`
  - Password requirements hint: `aria-describedby` linking requirements text to the password field
  - Form title announced on load via `aria-labelledby`
  - Loading state announced via `aria-live` region ("Creating your account…")
  - Keyboard: Tab moves through fields → button → signin link; Enter submits from any field

  **Microcopy:**
  - Button: "Create account" (not "Sign up" or "Submit" — "Create account" is clearer and more action-oriented)
  - Subtitle: "Start learning AI foundations today"
  - Link: "Already have an account? Sign in" → links to `/login`
  - Duplicate email: "An account with this email already exists. Would you like to sign in instead?"

  Must NOT do: Do NOT add OAuth buttons. Do NOT add magic link signup. Do NOT create profile manually (trigger handles it). Do NOT assign organization on signup. Do NOT use placeholder text as the only label. Do NOT add a "confirm password" field (industry research: show/hide toggle is better UX than confirm field). Do NOT clear the form on error.
  Parallelization: Wave 3 | Blocked by: 2, 3, 6 | Blocks: 10
  References: Supabase auth.signUp() with options.data. Supabase docs — "User Management" (profiles + trigger pattern). UX Patterns for Developers — "Sign Up Flow Pattern". Authgear — "Login & Signup UX: The 2025 Guide". shadcn/ui form examples. LearnUI.design — "15 Tips for Better Signup/Login UX". STYLE.md — two-accent rule.
  Acceptance criteria: `/signup` page renders with premium design. Signup with valid data creates auth user + profile (via trigger) and redirects to `/`. Duplicate email shows error with sign-in link. Weak password shows specific error. Password strength meter updates in real-time. Show/hide toggle works. Autofocus on first name. Tab navigation works. Screen reader announces errors and strength.
  QA scenarios: (happy) signup creates user + profile, redirect to /; (failure) duplicate email rejected with helpful message, weak password rejected with specific reason. Evidence: .omo/evidence/task-8-supabase-integration.txt
  Commit: Y | feat(auth): create premium signup page with first/last name, password strength meter, and accessibility

- [x] 9. Create auth callback route
  What to do: Create `src/app/auth/callback/route.ts` — a minimal route that exchanges auth codes for sessions. Even though magic link is disabled in this phase, this route is kept as a safety net for future auth redirect flows (email confirmation when enabled later, OAuth when added later). For now it simply exchanges a `code` parameter for a session and redirects:
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  import { NextResponse } from 'next/server'
  
  export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'
    if (code) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } } }
      )
      await supabase.auth.exchangeCodeForSession(code)
    }
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
  }
  ```
  Must NOT do: Do NOT handle OAuth provider callbacks (no OAuth in this phase). Do NOT handle magic link redirects (magic link disabled). This route is a minimal placeholder for future auth flows.
  Parallelization: Wave 3 | Blocked by: 2, 3 | Blocks: 10
  References: Supabase auth callback pattern.
  Acceptance criteria: `/auth/callback?code=xxx` exchanges code and redirects to `/`. Route exists and compiles without errors.
  QA scenarios: (happy) code exchanged, redirect works; (failure) invalid code shows error. Evidence: .omo/evidence/task-9-supabase-integration.txt
  Commit: Y | feat(auth): create auth callback route for future auth redirect flows

- [x] 10. Replace useUser hook with Supabase auth
  What to do: Rewrite `src/hooks/use-user.ts` to use Supabase auth instead of localStorage UUID:
  ```typescript
  "use client";
  import { useEffect, useState } from "react";
  import { createClient } from "@/lib/supabase/client";
  import type { User } from "@supabase/supabase-js";
  
  export type { User };
  
  export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
  
    useEffect(() => {
      const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsLoading(false);
      };
      getUser();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      });
      return () => subscription.unsubscribe();
    }, []);
  
    return { user, isLoading };
  }
  ```
  Also update the `User` type usage across the app — Supabase User has `id` (UUID), `email`, and `user_metadata.first_name` + `user_metadata.last_name` (set during signup via `options.data`). Create a helper to get the display name:
  ```typescript
  export function getDisplayName(user: User | null): string {
    if (!user) return 'Learner';
    const firstName = user.user_metadata?.first_name as string | undefined;
    const lastName = user.user_metadata?.last_name as string | undefined;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user.email ?? 'Learner';
  }
  ```
  The `user_metadata` is populated from the `options.data` passed to `supabase.auth.signUp()` — `first_name` and `last_name` are stored there by Supabase and available on the client without a DB query.
  Must NOT do: Do NOT delete the file — rewrite it in place. Do NOT change the return type signature (keep `{ user, isLoading }`). Do NOT break existing imports. Do NOT query the `profiles` table in this hook (user_metadata has the names client-side).
  Parallelization: Wave 3 | Blocked by: 2, 3, 6 | Blocks: 11, 12
  References: `src/hooks/use-user.ts` current implementation. Supabase onAuthStateChange. Supabase docs — user_metadata and raw_user_meta_data.
  Acceptance criteria: `useUser()` returns Supabase user when authenticated, null when not. Auth state changes trigger re-render. `getDisplayName()` returns "Jane Doe" from user_metadata.
  QA scenarios: (happy) authenticated user returned with first_name + last_name in metadata; (failure) null when logged out, getDisplayName returns 'Learner'. Evidence: .omo/evidence/task-10-supabase-integration.txt
  Commit: Y | feat(auth): replace mock useUser hook with Supabase auth and display name helper

- [x] 11. Update root layout for auth state
  What to do: Update `src/app/layout.tsx` to check auth state. If user is not authenticated and on a non-auth page, the middleware will redirect. The layout should use the Supabase user for any user-specific rendering. Update `src/components/layout/header.tsx` to show the authenticated user's first name (from `getDisplayName()`) and a logout button. The logout button should call `supabase.auth.signOut()` and redirect to `/login`.
  Must NOT do: Do NOT add auth checks to every page — middleware handles that. Do NOT change the layout structure. Do NOT show the full email in the header (use first name or first + last name for a personal feel).
  Parallelization: Wave 3 | Blocked by: 10 | Blocks: 12
  References: `src/app/layout.tsx`, `src/components/layout/header.tsx`. `getDisplayName()` from `src/hooks/use-user.ts`.
  Acceptance criteria: Header shows user's first name when logged in. Logout button calls `supabase.auth.signOut()` and redirects to `/login`.
  QA scenarios: (happy) first name shows, logout works; (failure) name missing or logout fails. Evidence: .omo/evidence/task-11-supabase-integration.txt
  Commit: Y | feat(auth): update layout and header for authenticated user display

- [x] 12. Rewrite sendXAPIStatement server action
  What to do: Rewrite `src/actions/xapi.ts` to insert into Supabase instead of POSTing to external LRS:
  ```typescript
  "use server";
  import { createClient } from "@/lib/supabase/server";
  
  export async function sendXAPIStatement(
    verbId: string,
    verbDisplay: string,
    objectId: string,
    objectName: string,
    objectDescription?: string,
    context?: { moduleId?: string; slideId?: string; lessonIndex?: number; result?: { score?: number; success?: boolean; completion?: boolean } }
  ) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, reason: "Not authenticated" };
    
    // Get user's profile (first_name, last_name, organization_id)
    const { data: profile } = await supabase.from('profiles').select('first_name, last_name, email, organization_id').eq('id', user.id).single();
    const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Learner';
    
    const statement = {
      actor: { mbox: `mailto:${user.email}`, name: fullName, objectType: "Agent" },
      verb: { id: verbId, display: { "en-US": verbDisplay } },
      object: { id: objectId, definition: { name: { "en-US": objectName }, description: { "en-US": objectDescription || objectName } }, objectType: "Activity" },
      ...(context?.result ? { result: context.result } : {}),
      timestamp: new Date().toISOString(),
    };
    
    const { error } = await supabase.from('xapi_statements').insert({
      user_id: user.id,
      organization_id: profile?.organization_id ?? null,
      actor_id: user.email!,
      verb_id: verbId,
      verb_display: verbDisplay,
      object_id: objectId,
      object_name: objectName,
      object_description: objectDescription,
      result_score: context?.result?.score ?? null,
      result_success: context?.result?.success ?? null,
      result_completion: context?.result?.completion ?? null,
      context_module_id: context?.moduleId ?? null,
      context_slide_id: context?.slideId ?? null,
      context_lesson_index: context?.lessonIndex ?? null,
      statement: statement,
    });
    
    if (error) { console.error("xAPI insert error:", error); return { success: false }; }
    return { success: true };
  }
  ```
  Also update the function signature to accept the optional `context` parameter. Update all 7 existing call sites to pass context where available. The `actor.name` in the xAPI statement is constructed from `first_name + " " + last_name` from the profiles table (not from user_metadata, since the server action can query the DB directly for the authoritative name).
  Must NOT do: Do NOT keep the external LRS POST logic. Do NOT use service role key. Do NOT log PII to console.
  Parallelization: Wave 4 | Blocked by: 5, 10 | Blocks: 13, 14
  References: `src/actions/xapi.ts` current implementation. xAPI statement shape from spec.
  Acceptance criteria: `sendXAPIStatement()` inserts into `xapi_statements` table with actor.name = "Jane Doe" from profiles. Row appears in Supabase dashboard. RLS allows self-insert.
  QA scenarios: (happy) statement appears in DB with full name; (failure) RLS blocks insert or auth fails. Evidence: .omo/evidence/task-12-supabase-integration.txt
  Commit: Y | feat(lrs): rewrite xAPI server action to insert into Supabase

- [x] 13. Create useLRS hook for client-side tracking
  What to do: Create `src/hooks/use-lrs.ts` — a client-side hook that wraps `sendXAPIStatement` for easy use in components:
  ```typescript
  "use client";
  import { useCallback } from "react";
  import { sendXAPIStatement } from "@/actions/xapi";
  
  export function useLRS() {
    const track = useCallback(async (
      verb: string, verbDisplay: string, objectId: string, objectName: string,
      objectDescription?: string,
      context?: { moduleId?: string; slideId?: string; lessonIndex?: number; result?: { score?: number; success?: boolean; completion?: boolean } }
    ) => {
      try { await sendXAPIStatement(verb, verbDisplay, objectId, objectName, objectDescription, context); }
      catch (e) { console.error("LRS tracking error:", e); }
    }, []);
    return { track };
  }
  ```
  Must NOT do: Do NOT make tracking block the UI — fire and forget. Do NOT throw errors to the caller.
  Parallelization: Wave 4 | Blocked by: 12 | Blocks: 20-22
  References: Server action pattern. React useCallback.
  Acceptance criteria: `useLRS()` returns `{ track }`. Calling `track()` results in a DB insert.
  QA scenarios: (happy) track fires insert; (failure) error caught and logged. Evidence: .omo/evidence/task-13-supabase-integration.txt
  Commit: Y | feat(lrs): create useLRS hook for client-side xAPI tracking

- [x] 14. Add slide-view tracking to CanvasViewer
  What to do: Update `src/components/lesson/canvas-viewer.tsx` to fire an `experienced` xAPI statement every time the slide changes. In the `currentIndex` state setter or the navigation handler, call `sendXAPIStatement` with:
  - verb: `http://adlnet.gov/expapi/verbs/experienced`
  - verbDisplay: `experienced`
  - objectId: `http://smartslate.com/activities/${moduleId}/slides/${slide.id}`
  - objectName: `Slide ${currentIndex + 1}: ${slide.id}`
  - context: `{ moduleId, slideId: slide.id, lessonIndex: slide.lessonIndex }`
  This centralizes slide-view tracking — no need to modify 37 individual slide components.
  Must NOT do: Do NOT fire `experienced` on re-renders — only on actual slide change. Do NOT block navigation on the xAPI call. Do NOT modify the visual behavior of CanvasViewer.
  Parallelization: Wave 4 | Blocked by: 12 | Blocks: 20-22
  References: `src/components/lesson/canvas-viewer.tsx` — currentIndex state, navigation handlers.
  Acceptance criteria: Navigating to a new slide creates an `experienced` statement in the DB. No duplicate statements on re-render.
  QA scenarios: (happy) one statement per slide change; (failure) duplicate or missing statements. Evidence: .omo/evidence/task-14-supabase-integration.txt
  Commit: Y | feat(lrs): add slide-view xAPI tracking to CanvasViewer

- [x] 15. Create Supabase Storage buckets
  What to do: Create 3 storage buckets via Supabase dashboard or SQL:
  - `course-audio` (public) — for MP3 voiceover files
  - `course-images` (public) — for module images (jpg, png, webp)
  - `course-videos` (public) — for video files (mp4)
  Set allowed MIME types per bucket. Set file size limit to 50MB for audio, 10MB for images, 500MB for videos.
  Must NOT do: Do NOT create private buckets for course media (content is not learner-specific). Do NOT enable transformations (not needed).
  Parallelization: Wave 5 | Blocked by: 1 | Blocks: 16-18
  References: Context7: Supabase Storage bucket creation.
  Acceptance criteria: 3 buckets exist in Supabase dashboard. All are public.
  QA scenarios: (happy) buckets created; (failure) bucket name conflict. Evidence: .omo/evidence/task-15-supabase-integration.txt
  Commit: N (infra setup — done via Supabase dashboard or SQL, not code)

- [x] 16. Migrate audio files to Supabase Storage
  What to do: Upload all MP3 files from `public/audio/` to the `course-audio` bucket, preserving the filename structure. Can use a script or manual upload. The public URL will be: `https://lymilwegnuzimngpawik.supabase.co/storage/v1/object/public/course-audio/{filename}`.
  Must NOT do: Do NOT delete local files yet — keep as fallback until all references are updated. Do NOT change filenames.
  Parallelization: Wave 5 | Blocked by: 15 | Blocks: 19
  References: `public/audio/` directory — ~42 MP3 files.
  Acceptance criteria: All MP3s accessible via Supabase Storage public URLs.
  QA scenarios: (happy) files accessible; (failure) upload error. Evidence: .omo/evidence/task-16-supabase-integration.txt
  Commit: N (data migration, not code)

- [x] 17. Migrate image files to Supabase Storage
  What to do: Upload all image files from `public/images/` to the `course-images` bucket.
  Must NOT do: Do NOT delete local files yet. Do NOT change filenames.
  Parallelization: Wave 5 | Blocked by: 15 | Blocks: 19
  References: `public/images/` directory.
  Acceptance criteria: All images accessible via Supabase Storage public URLs.
  QA scenarios: (happy) images load; (failure) upload error. Evidence: .omo/evidence/task-17-supabase-integration.txt
  Commit: N (data migration)

- [x] 18. Migrate video files to Supabase Storage
  What to do: Upload all video files from `public/video/` to the `course-videos` bucket.
  Must NOT do: Do NOT migrate YouTube embeds — they stay as external embeds. Do NOT delete local files yet.
  Parallelization: Wave 5 | Blocked by: 15 | Blocks: 19
  References: `public/video/` directory — tech-pulse.mp4.
  Acceptance criteria: All videos accessible via Supabase Storage public URLs.
  QA scenarios: (happy) videos load; (failure) upload error. Evidence: .omo/evidence/task-18-supabase-integration.txt
  Commit: N (data migration)

- [x] 19. Update all media references in code
  What to do: Create a utility `src/lib/media.ts` that maps old paths to Supabase Storage URLs:
  ```typescript
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  export function audioUrl(filename: string) { return `${SUPABASE_URL}/storage/v1/object/public/course-audio/${filename}`; }
  export function imageUrl(filename: string) { return `${SUPABASE_URL}/storage/v1/object/public/course-images/${filename}`; }
  export function videoUrl(filename: string) { return `${SUPABASE_URL}/storage/v1/object/public/course-videos/${filename}`; }
  ```
  Then update all references:
  - `src/components/modules/m1/index.tsx` — all `/audio/*.mp3` → `audioUrl('*.mp3')`, all `/images/*.jpg` → `imageUrl('*.jpg')`
  - `src/app/page.tsx` — `/images/*.jpg` → `imageUrl('*.jpg')`, `/video/tech-pulse.mp4` → `videoUrl('tech-pulse.mp4')`
  - `src/components/lesson/canvas-viewer.tsx` — audio loading logic
  - Any other files referencing `/public/` assets
  Must NOT do: Do NOT change YouTube embed URLs. Do NOT change Unsplash URLs (external). Do NOT delete `public/` files yet.
  Parallelization: Wave 5 | Blocked by: 16, 17, 18 | Blocks: 20-22
  References: All files referencing `/audio/`, `/images/`, `/video/` paths.
  Acceptance criteria: `grep -rn '"/audio/' src/` returns 0 matches. `grep -rn '"/images/' src/` returns 0 matches. `grep -rn '"/video/' src/` returns 0 matches. All media loads from Supabase Storage.
  QA scenarios: (happy) media loads from Supabase; (failure) broken URLs. Evidence: .omo/evidence/task-19-supabase-integration.txt
  Commit: Y | feat(storage): update all media references to Supabase Storage URLs

- [x] 20. Add xAPI tracking for Module 0 untracked interactions
  What to do: Add xAPI tracking for the following Module 0 interactions that are currently untracked:
  - **Slide views**: Already handled by CanvasViewer (task 14) — no additional work needed for slide views
  - **Confidence level selection** (`ConfidenceCheck` in `src/app/page.tsx`): Replace `console.log` with `sendXAPIStatement("http://adlnet.gov/expapi/verbs/answered", "answered", "http://smartslate.com/activities/confidence-check", "Confidence Level Check", `Learner selected confidence level ${selected}`, { moduleId: "0", slideId: "confidence-pulse", result: { score: selected } })`
  - **Video watched** (`WhatIsGenAISlide`): Fire `launched` when video starts and `completed` when "Mark Watched" is clicked
  - **Module 0 completion**: Add `sendXAPIStatement("http://adlnet.gov/expapi/verbs/completed", "completed", "http://smartslate.com/activities/modules/0", "Module 0: Orientation")` in the ProjectSpineSelector's onNext handler (alongside the existing `selected_template` call)
  Must NOT do: Do NOT duplicate slide-view tracking (CanvasViewer handles it). Do NOT change the visual behavior.
  Parallelization: Wave 6 | Blocked by: 13, 14, 19 | Blocks: 23
  References: `src/app/page.tsx` — ConfidenceCheck, WhatIsGenAISlide, ProjectSpineSelector.
  Acceptance criteria: All Module 0 interactions produce xAPI statements in DB.
  QA scenarios: (happy) all events tracked; (failure) missing events. Evidence: .omo/evidence/task-20-supabase-integration.txt
  Commit: Y | feat(lrs): add xAPI tracking for Module 0 interactions

- [x] 21. Add xAPI tracking for Module 1 untracked interactions
  What to do: Add xAPI tracking for the following Module 1 interactions that are currently untracked:
  - **Slide views**: Already handled by CanvasViewer (task 14)
  - **Video watched** (m1-video-whatis): Fire `launched` + `completed` like Module 0
  - **Timeline milestones** (m1-timeline): Fire `interacted` when each milestone is clicked
  - **Next-token simulator** (m1-next-token): Fire `interacted` when Temperature or Top-P slider is changed (debounce to avoid flooding)
  - **LLM/SLM toggle** (m1-llm-vs-slm): Fire `interacted` when toggle is clicked
  - **Prompt anatomy clicks** (m1-anatomy): Fire `interacted` when each component (Role/Task/Context/Constraints) is clicked
  - **Bias demo** (m1-bias): Fire `interacted` when "Train AI Model" button is clicked
  - **Module 1 completion**: Already handled by module page handleComplete
  Must NOT do: Do NOT fire `interacted` on every slider tick — debounce. Do NOT block UI on xAPI calls. Do NOT change the visual behavior.
  Parallelization: Wave 6 | Blocked by: 13, 14, 19 | Blocks: 23
  References: `src/components/modules/m1/index.tsx` — TimelineOfAI, NextTokenSlide, LlmVsSlm, AnatomyOfPrompt, BiasInAI, VideoSlide.
  Acceptance criteria: All Module 1 interactions produce xAPI statements in DB.
  QA scenarios: (happy) all events tracked; (failure) missing events. Evidence: .omo/evidence/task-21-supabase-integration.txt
  Commit: Y | feat(lrs): add xAPI tracking for Module 1 interactions

- [x] 22. Update assessment tracking to include context
  What to do: Update all existing `sendXAPIStatement` calls in `AssessmentRunner` and Module 1's inline quizzes to pass the new `context` parameter with `moduleId`, `slideId`, and `result` (score, success, completion). This enriches the xAPI statements with module/slide context for better analytics.
  Must NOT do: Do NOT change the assessment logic or visual behavior. Do NOT remove existing xAPI calls — just add context.
  Parallelization: Wave 6 | Blocked by: 13 | Blocks: 23
  References: `src/components/lesson/assessment-runner.tsx:126,143,205`. `src/components/modules/m1/index.tsx` — Assessment1, MlDnnLlmAssessment, Module1Quiz.
  Acceptance criteria: Assessment statements in DB include `context_module_id`, `context_slide_id`, and `result_score`.
  QA scenarios: (happy) context fields populated; (failure) context null. Evidence: .omo/evidence/task-22-supabase-integration.txt
  Commit: Y | feat(lrs): enrich assessment xAPI statements with module and slide context

- [x] 23. Create admin dashboard page
  What to do: Create `src/app/admin/page.tsx` — a read-only dashboard for SmartSlate admin. Shows:
  - Total learners count
  - Total organizations count
  - Recent xAPI statements (all users, paginated)
  - Filter by organization, verb, date range
  - Assessment results overview (average scores per module)
  Uses server-side Supabase client with admin RLS policy to read all data.
  Must NOT do: Do NOT add CRUD operations — admin is read-only. Do NOT show PII unnecessarily. Do NOT make this page accessible to non-admin users (check `app_role = 'admin'` via server-side profile query; redirect if not admin).
  Parallelization: Wave 7 | Blocked by: 20, 21, 22 | Blocks: 24, 25
  References: `src/lib/supabase/server.ts` for server client. RLS policies allow admin SELECT all.
  Acceptance criteria: `/admin` page renders for admin users. Non-admin users are redirected. Dashboard shows real data from DB.
  QA scenarios: (happy) admin sees data; (failure) non-admin redirected. Evidence: .omo/evidence/task-23-supabase-integration.txt
  Commit: Y | feat(admin): create admin dashboard for viewing all learner data

- [x] 24. RLS policy verification tests
  What to do: Create `src/lib/supabase/__tests__/rls.test.ts` (or SQL-based tests) that verify:
  - Learner can only SELECT their own xapi_statements (not other learners')
  - Learner can INSERT their own xapi_statements but not others'
  - Team member can SELECT all org members' xapi_statements
  - Admin can SELECT all xapi_statements
  - Learner cannot DELETE any statements
  - Unauthenticated requests are rejected
  Use Supabase's test framework or manual SQL tests with `set_config('request.jwt.claims', ...)` to simulate different users.
  Must NOT do: Do NOT test with service role key (bypasses RLS). Do NOT skip any tier.
  Parallelization: Wave 7 | Blocked by: 23 | Blocks: 26
  References: Supabase RLS testing patterns.
  Acceptance criteria: All RLS test cases pass. No policy allows unauthorized access.
  QA scenarios: (happy) all policies enforced; (failure) any policy breach. Evidence: .omo/evidence/task-24-supabase-integration.txt
  Commit: Y | test(rls): verify 3-tier RLS policies for all tables

- [x] 25. End-to-end auth flow test
  What to do: Test the complete auth flow:
  1. Unauthenticated user visits `/` → redirected to `/login`
  2. User signs up at `/signup` → profile created in DB (via trigger)
  3. User logs in at `/login` → session established, redirected to `/`
  4. User navigates modules → xAPI statements fire with real user ID
  5. User logs out → redirected to `/login`
  6. Team admin views org dashboard → sees team data
  7. SmartSlate admin views `/admin` → sees all data
  Must NOT do: Do NOT test OAuth (not implemented). Do NOT use service role key for auth tests.
  Parallelization: Wave 7 | Blocked by: 23 | Blocks: 26
  References: All auth-related files.
  Acceptance criteria: All 7 steps pass without errors.
  QA scenarios: (happy) full flow works; (failure) any step fails. Evidence: .omo/evidence/task-25-supabase-integration.txt
  Commit: Y | test(auth): verify end-to-end auth flow with xAPI tracking

- [x] 26. Full build + lint verification
  What to do: Run `npm run lint` and `npm run build`. Verify:
  - 0 new lint errors introduced (pre-existing errors are acceptable)
  - Build succeeds (may need to handle the pre-existing `reveal.tsx` issue)
  - No `as any` or `@ts-ignore` introduced
  - All TypeScript types check
  Must NOT do: Do NOT skip this step. Do NOT claim success without running both commands.
  Parallelization: Wave 7 | Blocked by: 24, 25 | Blocks: nothing
  References: All modified files.
  Acceptance criteria: `npm run lint` has 0 new errors. `npm run build` succeeds.
  QA scenarios: (happy) both pass; (failure) fix errors before declaring done. Evidence: .omo/evidence/task-26-supabase-integration.txt
  Commit: N (verification only)

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE.
- [x] F1. Plan compliance audit — all 26 tasks executed, acceptance criteria met
- [x] F2. Code quality review — lint clean, build clean, no anti-patterns
- [x] F3. Real manual QA — full learner journey: signup → login → Module 0 → Module 1 → logout. Verify all xAPI statements appear in Supabase dashboard.
- [x] F4. Scope fidelity — no OAuth added, no multi-org, no guest mode, no Module 2-7 changes, no visual design changes

## Commit strategy
- Feature branch: `feat/supabase-integration`
- Atomic commits per task (or grouped by phase)
- Commit messages: imperative, present tense, ≤72-char head
- Merge to main only after all tasks + final verification pass
- Do NOT force push (no history rewrite needed for this plan)

## Success criteria
- All 26 tasks completed with acceptance criteria met
- `npm run lint` and `npm run build` pass with 0 new errors
- Auth flow works end-to-end (signup → login → track → logout)
- RLS policies enforce 3-tier access (verified by tests)
- Every interaction in Modules 0 & 1 produces an xAPI statement in Supabase
- Media assets load from Supabase Storage
- Admin dashboard shows data from all users/orgs
- Non-admin users cannot access admin dashboard
- No guest mode — all learners must authenticate
