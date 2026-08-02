# PRODUCT.md — AI Foundations: Concept to Application

**What it is:** A premium, interactive e-learning product for non-technical professionals learning
applied AI engineering. Learners pay for access (paywall gated via enrollments), then move through
7 narrated, interactive slide-deck modules with a running project spine (Research Companion /
Content Engine / Creative Studio) and a capstone deployment. Progress + gamification (XP, streaks,
badges) sync to Supabase; xAPI statements stream to an LRS; a verified certificate is issued on
completion.

**Register:** product UI that doubles as marketing — dark-navy stage, glassmorphism ideology,
teal spotlight + indigo CTA (STYLE.md is the canonical design system).

**Key surfaces:**
- Marketing page (`src/app/page.tsx`) — enrollment-check gate → pay link (Razorpay) or dashboard.
- Dashboard (`src/app/dashboard/page.tsx`) — stat hero, baseline prep, **Your Journey** module
  spine (this revamp's centerpiece), achievements/badges, deliverables modal.
- Lesson deck (`src/app/modules/[id]`, `src/app/modules/0`) — CanvasViewer 16:10 slide engine.
- Certificate (`src/app/certificate/page.tsx`).

**Product constraints (hard):** every slide fits the 16:10 canvas (STYLE.md §5); two-accent rule
teal/indigo never inverted; glass over navy, never solid zinc surfaces; no emojis; no fourth
global Zustand store; narration audio must exist for every narrated slide.
