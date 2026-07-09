---
slug: supabase-integration
status: awaiting-approval
intent: clear
review_required: true
pending-action: present plan for user review and approval
approach: 7-phase integration — Supabase foundation → database schema with RLS → auth replacement → LRS server action rewrite → storage migration → comprehensive event tracking across modules 0 & 1 → testing
---

# Draft: supabase-integration

## Components (topology ledger)
| id | outcome (one line) | status | evidence path |
|---|---|---|---|
| C1 | Supabase clients (browser + server) + middleware for session management | active | Context7: /supabase/ssr docs |
| C2 | Database schema: profiles, organizations, organization_members, xapi_statements, module_progress, assessment_results | active | xAPI LRS schema research + Supabase RLS docs |
| C3 | RLS policies: 3-tier access (learner→own, team→org, admin→all) | active | Context7: RLS patterns + auth.uid()/auth.jwt() |
| C4 | Auth UI: login/signup pages, replace useUser hook, auth callback route | active | Context7: Next.js auth setup |
| C5 | LRS: rewrite sendXAPIStatement to insert into Supabase instead of external POST | active | src/actions/xapi.ts current implementation |
| C6 | Storage: 3 buckets (audio, images, videos) + migrate existing media | active | Context7: Supabase Storage quickstart |
| C7 | Event tracking: add xAPI statements for every interaction in modules 0 & 1 | active | Full codebase analysis of all 37 slides |
| C8 | Testing & verification: RLS policy tests, auth flow tests, event tracking verification | active | — |

## Open assumptions (announced defaults)
| assumption | adopted default | rationale | reversible? |
|---|---|---|---|
| Auth method | Email/password + magic link (no OAuth initially) | Simplest Supabase auth; can add Google/GitHub OAuth later. User mentioned "auth" without specifying providers. | Yes — add OAuth providers later |
| Admin identification | Custom `app_role` column in profiles table + JWT claim via database function | Supabase doesn't have built-in admin roles; custom claim is the standard pattern. Admin = SmartSlate staff (the user). | Yes |
| Organization model | One org per user (simplified); user has `organization_id` nullable FK | Most LMS deployments assign a learner to one org. Multi-org membership can be added later via a join table. | Yes — upgrade to join table later |
| Team visibility | Team members see all org members' xAPI statements, not just their own | User said "corporate or bundled users, they must see their team's data" | No — user explicitly specified this |
| xAPI statement shape | Full xAPI 1.0.3 JSONB + denormalized hot columns | Industry best practice from LRS schema research (T-Square article). JSONB for raw statement + indexed columns for fast queries. | No — standard xAPI spec |
| Storage bucket privacy | `audio` and `images` = public (course content is not secret); `videos` = public | Course media is not learner-specific or sensitive. If corporate content needs gating, add private buckets later. | Yes |
| Progress migration | Zustand localStorage stays as cache; Supabase becomes source of truth | Learners may be mid-course during migration. Zustand syncs to Supabase on next load. No data loss. | Yes |
| Guest mode | No guest mode after migration; all learners must authenticate | User wants every interaction tracked "for every learner" — requires identity. Guest mode is incompatible with per-learner tracking. | No — user requirement implies this |

## Findings (cited - path:lines)

### Current xAPI call sites (7 total across codebase)
1. `src/app/page.tsx:31` — `selected_template` verb (Module 0, project spine selection)
2. `src/app/modules/[id]/page.tsx:39` — `completed_module` verb (Module completion)
3. `src/components/lesson/assessment-runner.tsx:126` — `attempted` verb (assessment start)
4. `src/components/lesson/assessment-runner.tsx:143` — `answered` verb (question submitted)
5. `src/components/lesson/assessment-runner.tsx:205` — `completed` verb (assessment complete)
6. `src/components/lesson/lesson-viewer.tsx:20` — `launched` verb (legacy viewer, video play)
7. `src/components/lesson/lesson-viewer.tsx:31` — `paused` verb (legacy viewer, video pause)

### Current user model (mock)
- `src/hooks/use-user.ts` — generates localStorage UUID, "Guest Learner", `guest-{uuid}@local.learner`
- No real authentication, no team/organization concept
- Used by: canvas-viewer, assessment-runner, and xAPI (currently hardcoded "Guest Learner")

### Module 0 interactions (9 slides) — events to track
| Slide | Interaction | xAPI verb | Currently tracked? |
|---|---|---|---|
| welcome-attention | Slide viewed | experienced | ❌ No |
| welcome-vision-video | Slide viewed | experienced | ❌ No |
| what-is-gen-ai | Video watched | launched + completed | ❌ No (completion only, via onComplete) |
| confidence-pulse | Confidence level selected | answered | ❌ No (console.log only) |
| myth-busting | Slide viewed | experienced | ❌ No |
| diagnostic-attention | Slide viewed | experienced | ❌ No |
| diagnostic-assessment | Assessment attempted | attempted | ✅ Yes (via AssessmentRunner) |
| diagnostic-assessment | Question answered | answered | ✅ Yes (via AssessmentRunner) |
| diagnostic-assessment | Assessment completed | completed | ✅ Yes (via AssessmentRunner) |
| welcome-tie | Slide viewed | experienced | ❌ No |
| project-selector | Template selected | selected_template | ✅ Yes |
| — | Module 0 completed | completed | ❌ No (markModuleComplete only, no xAPI) |

### Module 1 interactions (28 slides) — events to track
| Slide | Interaction | xAPI verb | Currently tracked? |
|---|---|---|---|
| m1-title | Slide viewed | experienced | ❌ No |
| m1-video-whatis | Video watched | launched + completed | ❌ No |
| m1-timeline | Milestone clicked (5x) | interacted | ❌ No |
| m1-hollywood | Slide viewed | experienced | ❌ No |
| m1-assessment-1 | 10 MCQs | attempted + answered×10 + completed | ✅ Yes (via inline quiz, not AssessmentRunner) |
| m1-ml-intro | Slide viewed | experienced | ❌ No |
| m1-ml-supervised | Slide viewed | experienced | ❌ No |
| m1-ml-unsupervised | Slide viewed | experienced | ❌ No |
| m1-ml-reinforcement | Slide viewed | experienced | ❌ No |
| m1-neural-networks | Slide viewed | experienced | ❌ No |
| m1-generative-ai | Slide viewed | experienced | ❌ No |
| m1-next-token | Simulator adjusted | interacted | ❌ No |
| m1-llm-vs-slm | Toggle clicked | interacted | ❌ No |
| m1-ml-dnn-llm-assessment | 10 questions | attempted + answered×10 + completed | ✅ Yes (via KnowledgeCheck) |
| m1-anatomy | Component clicked (4x) | interacted | ❌ No |
| m1-prompt-iteration-intro | Slide viewed | experienced | ❌ No |
| m1-prompt-iteration-v1 | Slide viewed | experienced | ❌ No |
| m1-prompt-iteration-v2 | Slide viewed | experienced | ❌ No |
| m1-prompt-iteration-v3 | Slide viewed | experienced | ❌ No |
| m1-prompt-iteration-summary | Slide viewed | experienced | ❌ No |
| m1-prompt-models-intro | Slide viewed | experienced | ❌ No |
| m1-prompt-models-xml | Slide viewed | experienced | ❌ No |
| m1-prompt-models-json | Slide viewed | experienced | ❌ No |
| m1-prompt-models-markdown | Slide viewed | experienced | ❌ No |
| m1-prompt-models-summary | Slide viewed | experienced | ❌ No |
| m1-hallucination | Slide viewed | experienced | ❌ No |
| m1-bias | "Train AI Model" clicked | interacted | ❌ No |
| m1-quiz | 3 questions | attempted + answered×3 + completed | ✅ Yes (via inline quiz) |
| — | Module 1 completed | completed | ✅ Yes (via module page handleComplete) |

**Summary: Only 5 out of ~50+ interactions are currently tracked. The plan must add tracking for ~45+ additional interaction points.**

### Media assets to migrate to Supabase Storage
- `public/audio/` — 32 MP3 voiceover files (~12MB total, M1 only; Module 0 has ~10 more)
- `public/images/` — module images (neural_network.jpg, transformer_attention.jpg, ml_*.jpg, agi.jpg, narrow_ai.jpg, etc.)
- `public/video/` — tech-pulse.mp4 (Module 0 background video)
- Note: YouTube embeds (Google Cloud Tech video, Bernard Marr video) are external and don't need migration

### Supabase auth setup (from Context7 research)
- Browser client: `createBrowserClient(URL, KEY)` from `@supabase/ssr`
- Server client: `createServerClient(URL, KEY, { cookies })` from `@supabase/ssr`
- Middleware: `proxy()` function with `createServerClient` + `supabase.auth.getUser()` + redirect logic
- Cookie handling: `getAll()` / `setAll()` pattern

### xAPI statement storage schema (from web research — T-Square LRS article)
Best practice for PostgreSQL xAPI storage:
```sql
statements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  actor_id      TEXT NOT NULL,       -- normalized from actor.mbox
  verb_id       TEXT NOT NULL,       -- verb.id IRI
  object_id     TEXT NOT NULL,       -- object.id IRI
  verb_display  TEXT,                -- denormalized for quick reads
  object_name   TEXT,                -- denormalized for quick reads
  result_score  REAL,                -- denormalized for fast aggregation
  stored        TIMESTAMPTZ NOT NULL DEFAULT now(),
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
  statement     JSONB NOT NULL       -- full raw xAPI statement
)
```
Indexes:
- `(user_id, timestamp DESC)` — learner timeline (most common query)
- `(organization_id, timestamp DESC)` — team dashboard
- `(verb_id, timestamp DESC)` — verb analytics
- `GIN(statement)` — ad-hoc JSONB queries

### RLS patterns (from Context7 research)
- `auth.uid()` — returns current user's UUID
- `auth.jwt() ->> 'custom_claim'` — access custom JWT claims
- `AS RESTRICTIVE` — for additional policy constraints
- Separate policies for INSERT vs SELECT vs UPDATE vs DELETE

## Decisions (with rationale)
1. **Email/password + magic link auth** (no OAuth initially) — simplest to implement, can add Google/GitHub later
2. **Custom `app_role` enum in profiles** — values: `learner`, `team_admin`, `admin`. Admin = SmartSlate staff. Team admin = corporate team lead.
3. **Organization model: `organization_id` nullable FK on profiles** — one org per user. Simpler than join table. Can upgrade to multi-org later.
4. **xAPI statements table with JSONB + denormalized hot columns** — follows industry best practice. Raw JSONB for spec compliance + indexed columns for fast queries.
5. **CanvasViewer fires `experienced` on slide change** — centralizes slide-view tracking in one place rather than adding it to 37 individual slide components
6. **AssessmentRunner and inline quizzes fire their own xAPI** — they already do; just need to ensure they use the new Supabase-based server action
7. **Storage: public buckets for course media** — course content is not sensitive. Private buckets can be added for corporate-gated content later.
8. **Zustand localStorage stays as optimistic cache** — Supabase becomes source of truth. Zustand syncs on load. No data loss during migration.
9. **No guest mode** — all learners must authenticate. Every interaction must be attributable to a real user.

## Scope IN
- Install @supabase/supabase-js + @supabase/ssr + shadcn supabase components
- Create Supabase client utilities (browser + server)
- Create auth middleware
- Create database schema (SQL migration): profiles, organizations, xapi_statements, module_progress, assessment_results
- Create RLS policies for all tables (3-tier access)
- Create auth UI: login page, signup page, auth callback route
- Replace useUser hook with Supabase auth
- Rewrite sendXAPIStatement to insert into Supabase xapi_statements table
- Add xAPI tracking for all untracked interactions in modules 0 & 1
- Create Supabase Storage buckets (audio, images, videos)
- Migrate existing media assets to Supabase Storage
- Update all media references from /public/ paths to Supabase Storage URLs
- Create admin dashboard (basic — view all xAPI statements across all users/orgs)

## Scope OUT (Must NOT have)
- NO OAuth providers (Google, GitHub) in this phase — add later
- NO real-time xAPI streaming — inserts are fire-and-forget
- NO xAPI State API or Agent Profile API — only Statement API
- NO SCORM/cmi5 packaging — this is a custom xAPI implementation, not SCORM
- NO multi-org membership per user — one org per user (simplified)
- NO content authoring or admin CMS — admin dashboard is read-only
- NO changes to the visual design or slide content — only infrastructure
- NO changes to Module 2-7 (not yet built) — only modules 0 & 1
- NO LRS query API for third-party tools — internal use only
- NO migration of YouTube embeds to Supabase Storage — they stay as YouTube embeds

## Open questions
None — all forks resolved through research or best-practice defaults.

## Approval gate
status: awaiting-approval
This plan covers 7 phases of Supabase integration: foundation, database, auth, LRS, storage, event tracking, and testing. All decisions documented. User must review and approve before implementation begins.
