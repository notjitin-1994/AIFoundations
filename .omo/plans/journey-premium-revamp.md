# World-Class Plan — Enrollment Loading Gate + "Your Journey" Premium Revamp

**Owner:** Atlas (direct implementation — no subagents, per user constraint)
**Targets:** `src/app/page.tsx` (marketing gate), `src/app/dashboard/page.tsx` (Your Journey), shared gate component
**Design system:** STYLE.md is canonical (navy stage + teal spotlight + indigo CTA + glassmorphism). `DESIGN.md` extends it (subordinate; STYLE.md wins on conflict).

---

## Design Read (design-taste-frontend §0.B)

> Reading this as: the AI Foundations learner dashboard + course marketing page for paid
> professionals, with a **calm-luxury dark-navy glass** language — the project's own STYLE.md
> glassmorphism elevated to premium material craft: edge-light hairlines, ambient teal light
> fields, a glowing journey spine, and one indigo CTA moment per state.

**Dials:** DESIGN_VARIANCE 6 · MOTION_INTENSITY 5 (all motion motivated: state reveal, progression,
affordance) · VISUAL_DENSITY 3 (airy, premium).

**Research anchors (web):** Brilliant × ustwo "Level Gameboard" (learning path with clear direction
+ freedom of choice — each module gets identity), dark-glass craft (edge-light 1px hairlines,
ambient light fields behind frosted surfaces), Maven cohort-path clarity.

---

## TODOs

- [x] 1. Create `src/components/auth/enrollment-check.tsx` — shared `EnrollmentCheckScreen` full-screen brand loading state (navy stage, ambient teal orb, glass ring, teal `Loader2` spin, `motion-safe:` spin so reduced-motion users get a calm static glyph, optional label like "Verifying your enrollment"). Reusable by all 5 gates.
- [x] 2. `src/app/page.tsx` — replace the flash-then-redirect with a real gate: while `authLoading || (user && enrollmentState === "checking")` render `EnrollmentCheckScreen` INSTEAD of marketing content; on resolve: enrolled → `router.push("/dashboard")` from the loading screen (no marketing flash, no "refresh without cause"); not enrolled → render marketing. Anonymous visitors skip the check and see marketing immediately (+ AuthModal, unchanged). Preserve the `intent=enroll` auto-checkout flow.
- [x] 3. `src/app/dashboard/page.tsx` — swap the blank `return null` gate for `EnrollmentCheckScreen` ("Preparing your course…").
- [x] 4. `src/app/modules/[id]/page.tsx`, `src/app/modules/0/page.tsx`, `src/app/certificate/page.tsx` — same null→spinner swap for consistency (no blank screens anywhere the gate holds).
- [x] 5. **Your Journey revamp** (`src/app/dashboard/page.tsx` Module Tracker):
  - Glass waypoint cards per module: `bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl` + inner edge-light `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`, hover lift + `hover:border-primary/30`.
  - **Three distinct material states:** Complete = teal-fill node + check + teal hairline `border-primary/20` + soft teal bloom; Active = indigo-ring node (indigo = "go here") + indigo CTA button + card elevated `bg-card/60` + ambient indigo orb + `aria-current="step"`; Locked = dimmed glass, lock chip, dashed hairline (no dead opacity-30 void).
  - **Two-accent rule repair:** forward "Continue" = INDIGO `bg-secondary` (was teal — a CTA in teal violates STYLE.md); "Review" = ghost; info chips (project spine, deliverables) stay teal (spotlight).
  - **Chapter identity:** per-module lucide glyph (Compass/Brain/Fish/Wrench/Network/Factory/Rocket) in the node + mono `MODULE n` chip — Brilliant-style game-board identity, order carries the sequence (numbered sequence allowed).
  - **Progression caption** under the heading: "N of M chapters complete".
  - **Motion (emil discipline, <300ms, transform/opacity only):** rows stagger in on load (GSAP, 60ms stagger), active-node breathing glow gated `motion-safe:animate-pulse`, buttons get `active:scale-95` press, hover transitions ≤250ms. Spine fill keeps its animated gradient + teal bloom.
  - **Token alignment (contained):** adjacent surfaces the section touches — the 4 stat tiles, Baseline panel shell, Achievements panel — swap `zinc-900/950` fills for `bg-card/… backdrop-blur-xl border-white/10` + foreground/muted-foreground text so the glass journey section doesn't read as bolted onto a zinc page. Top "Continue Course" CTA → indigo (same one-accent-CTA rule).
  - **Responsive:** node rail on mobile (w-12, rail at left-[31px]), single column; verify 375/768/1280.
- [x] 6. Verify: `npx tsc --noEmit` exit 0, `npm run lint` no NEW errors, `npm run build` compiles, `npm run test` 51/51.
- [x] 7. Browser QA via dev server + Playwright at 375 / 768 / 1280: marketing gate shows spinner then marketing (anonymous) / dashboard redirect (enrolled mock); journey section states (locked/active/complete) render on brand, no overflow, focus rings visible, reduced-motion safe.
- [ ] 8. Commit (git-master discipline, one branch `fix/journey-premium` off `origin/main`), push, PR, merge, deploy, verify live on orbit.smartslate.io.

## Final Verification Wave

- [x] F1. Enrollment gate: no marketing flash — spinner until resolution, then one clean destination (marketing or dashboard). Anonymous visitors unaffected.
- [x] F2. Your Journey: brand-compliant (STYLE.md tokens only, two-accent rule respected), premium material craft (edge-light glass, ambient bloom, glowing spine), all three module states distinct and readable, keyboard-accessible, responsive at 3 breakpoints.
- [x] F3. No regressions: tsc/lint/build clean, 51/51 tests, paywall gating still enforced on all 5 routes.

## Acceptance Criteria

- The marketing page never renders before the enrollment decision for logged-in users.
- Every state (checking/enrolled/blocked) has a distinct, designed visual — never a blank screen.
- The journey section uses zero `zinc-*` classes (its own surfaces), zero raw hex, no new deps, no emojis.
- Forward CTAs indigo, informational highlights teal — the two-accent rule holds within the section.
