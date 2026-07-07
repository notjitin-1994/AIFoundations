# AGENTS.md — AI Foundations Development Guide

This file is the canonical instruction set for any agent (Codex, Claude, OpenCode, etc.)
working on the AI Foundations codebase. **Read it in full before touching code.**

> **Skill precedence:** User-installed skills (master-instructional-design, design-taste-frontend,
> emil-design-eng, impeccable) **override** built-in defaults. Always route to them when the task
> domain matches. See §3 below.

---

## 0. Read the current docs before writing anything

Before implementing content, slides, animations, or design changes, **read these in order**:

1. **[./STYLE.md](./STYLE.md)** — the canonical global style system. Fonts, the two-accent rule
   (teal = design / indigo = CTA), glassmorphism ideology, motion, the **canvas-fit HARD rule**.
2. **[./AI-Foundations-Concept2Application-Blueprint.md](./AI-Foundations-Concept2Application-Blueprint.md)** —
   the course blueprint. Read §4 of the relevant module before authoring slides. Each Module spec
   ends with a "Built Implementation" subsection documenting what is already shipped — read it to
   avoid duplicating work.
3. This `AGENTS.md` — the development guide.
4. `src/components/lesson/canvas-viewer.tsx` — the deck engine, before authoring any module's slides.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

The repo runs **Next.js 16.2.10** with App Router, React 19.2.4, and `motion` (formerly
framer-motion) v12. This version has breaking changes vs. your training data — APIs, conventions,
and file structure may all differ. **Read the relevant guide in `node_modules/next/dist/docs/` before
writing any code.** Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 1. Architecture in one screen

```
src/app/
  layout.tsx                       # Root layout: Sidebar + Header + main
  page.tsx                         # Module 0 — Orientation (9-slide deck)
  modules/[id]/page.tsx            # Dynamic module router; routes "1" → MODULE_1_SLIDES
  globals.css                      # Theme tokens (dark-navy / teal / indigo / glass)

src/components/
  lesson/canvas-viewer.tsx         # ★ The slide deck engine — CanvasNavContext, audio nav
  lesson/assessment-runner.tsx     # Reusable quiz engine fed by the question bank
  lesson/lesson-viewer.tsx         # Legacy markdown+video viewer (rarely used now)
  layout/{sidebar,header,assets-modal,help-tour}.tsx
  modules/m1/index.tsx             # ★ Module 1 (17 slides, ~1900 LOC). Reference for new modules
  ui/                              # 38 shadcn-style components (Radix + Tailwind)

src/store/                         # Zustand stores
  progress.ts                      # Persisted: completedModules, projectSpine, slide indices
  narration.ts                     # Transient: isPlaying / progress / isFinished
  notes.ts                         # Persisted: per-slide user notes

src/actions/xapi.ts                # Server action POSTing xAPI statements to the LRS
src/hooks/use-user.ts              # Mock guest user (localStorage UUID)
src/lib/
  question-bank.ts                 # ★ Living question bank (4 types, per-module tagging)
  question-bank-extended-1.ts      # Extended question pool
  utils.ts                         # cn() helper
```

Stars (★) mark files agents **must read** before authoring slides or assessments.

---

## 2. The Canvas-Fit HARD RULE

> **Every slide must fit within the lesson canvas on all four sides — left, right, top, bottom.
> Nothing may bleed outside.**

The canvas is `CanvasViewer`'s `aspect-[16/10]` rounded container with an `h-20` nav footer. The
slide content area is what's left. That is the entire universe a slide can occupy.

### Mandatory slide patterns

- Outer wrapper: `w-full h-full flex flex-col overflow-hidden max-w-* mx-auto` (use `max-w-5xl`
  or `max-w-6xl` depending on content shape).
- No `position: fixed` inside slides — `fixed` escapes the canvas rectangle.
- No `100vw` / `100vh` units.
- No negative margins, no `absolute` children that escape the canvas.
- For long content inside a sector, give the sector `flex-1 min-h-0 overflow-y-auto`. Never let
  one sector push another out the bottom.
- For interactive slide rows that may wrap, use `flex-wrap` and verify mobile fits inside the
  canvas width.
- Plan **three breakpoints inside the canvas**: `<768px`, `768–1024px`, `>1024px`.

### Verification before claiming a slide shipped

Open the dev server and load the slide at:
- A landscape phone width (~700×350)
- A tablet / projector 4:3 view (~1024×600)
- A desktop 16:10 view (~1500×940, max-h-[90vh] is the ceiling)

If you can see any of: a section clipped at the bottom, content hidden behind the nav footer,
horizontal scroll, or an element bleeding past the canvas left/right border — **the slide is broken**.
Fix it before declaring done. Do not expand the canvas. Redesign the slide.

### Reviewer fail rule

If reviewing a PR's slide and content does not fit the canvas at any of the three breakpoints,
**reject the PR** with a citation of STYLE.md §5. Do not rubber-stamp "looks fine" without
verifying the three sizes.

---

## 3. Skill discipline (REQUIRED)

Some agents have user-installed skills that **override** built-in defaults. Before any work that
matches the domain below, invoke the named skill via the agent's skill tool, then announce
"Using [skill] to [purpose]" and proceed per the skill's instructions.

| Task | Required skill(s) | Why |
|---|---|---|
| Writing or revising lesson content, learning objectives, assessment items, storyboards, branch scenarios, MCQs, the question bank, the blueprint, ID theory, Kirkpatrick evaluation, inclusive design of slides, emotional design of learner experience, ADHD/dyslexia-friendly pacing, or anything that touches the *learner experience* | **`master-instructional-design`** (user-installed, PRIORITY) | CPTD-veteran ID coach with 30 years hands-on. Covers ADDIE / SAM / Bloom's / spiral curriculum / LXD / inclusive design / emotional design / assessment validity. Use it before you design *any* lesson interaction. |
| Designing slides, components, animations, or any frontend surface — landing pages, canvas, hero cards, feedback overlays | **`frontend`** (builtin) **AND** **`design-taste-frontend`** (user-installed, PRIORITY) **AND** **`emil-design-eng`** (user-installed) **AND** **`impeccable`** (user-installed) | Anti-slop frontend craft. `frontend` routes the four rulesets (design-taste, perfection/lighthouse, ui-ux-db, designpowers). `design-taste-frontend` reads the brief and infers the design direction so the result does not look templated. `emil-design-eng` is the UI-polish layer (Emil Kowalski's animation philosophy, custom beziers, spring physics). `impeccable` audits and ships production-grade frontend code. |
| Reviewing or polishing existing UI, running an audit, hardening or distilling an interface, fixing responsive breakage or color contrast or typography drift | **`impeccable`** (user-installed) | Production-grade audit and craft iteration. |
| Animations, motion decisions, micro-interactions, hover/active/tap states, transitions between slides | **`emil-design-eng`** (user-installed) | "Should this animate at all? What is its purpose? What easing?" — the animation decision framework. |
| Investigating git history, blame, bisect, reflog, attribution, "who added this and when" | **`git-master`** (user-installed) | Atomic commits, squash/rebase/fixup discipline, searchable message style. |
| Debugging runtime crashes, silent failures, dead interactions | **`systematic-debugging`** (project skill) — pair with the `debugging` skill if reproducing | Hypothesis-driven investigation. Don't shotgun-debug. |
| Verifying work before declaring done (any file edit, build, behavioral change) | **`verification-before-completion`** (project skill) | Run verification commands and confirm output before any "done" or "passing" claim. |

### How to actually invoke a skill

When the task matches a row above:

1. Call the skill via the agent's native skill tool (e.g. `/master-instructional-design`,
   `/design-taste-frontend`, `/emil-design-eng`, `/impeccable`, `/frontend`,
   `/git-master`, `/systematic-debugging`, `/verification-before-completion`).
2. Read the returned skill instructions.
3. Announce "Using [skill] to [purpose]" so a human reviewer can see what you invoked.
4. Follow the skill exactly. If it has a checklist, create a todo per item via `todowrite`.

### What does NOT count as following the skill

- "I already know what that skill says" — skills evolve. Re-read every time.
- "This is a small thing, I'll skip it" — if the trigger matches, use it.
- "I used it in another session" — re-invoke in this turn, today.

---

## 4. Authoring a new module

When authoring a new module (e.g. the not-yet-built Modules 2–7) follow this sequence:

### Step 1 — Course design first (master-instructional-design)

Before writing any slide code, invoke the master-instructional-design skill and:

- Read the module's blueprint section in `AI-Foundations-Concept2Application-Blueprint.md`.
- Draft or refine the lesson-level learning objectives. Each objective mapped to Bloom's level
  stated for the module (Remember / Understand / Apply / Analyze / Create / Evaluate).
- Storyboard the slide sequence: which slide teaches what, which is formative check, which is
  interactive lab, which is the closing knowledge check.
- Identify where the running project spine gets called in. The project spine is the central
  spiral device; every module should ask the learner to apply the new concept to their chosen
  template (Research Companion / Content Engine / Creative Studio).
- Define the assessment: which bank questions to draw from, how many, what distribution across
  the module's lessons.

### Step 2 — Frontend design plan (frontend + design-taste-frontend + emil-design-eng + impeccable)

Then invoke the frontend cluster to:

- Produce a per-slide *design read* in one line (per design-taste-frontend §0.B): what is the
  visual register, and what design-system moves satisfy the brief.
- Decide motion decisions *before writing code*: which animations are needed, which easing is
  appropriate, which slides use GSAP-narration timelines vs. Framer-Motion mount transitions.
- Verify the design fits the canvas-fit hard rule (§2 above) — sketch the layout in three
  viewports mentally before touching TSX.

### Step 3 — Implement

Create the module file as `src/components/modules/m{N}/index.tsx`, exporting a `MODULE_N_SLIDES`
array. The shape — copied from `m1/index.tsx` — is:

```tsx
import { Slide, useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useNarrationStore } from "@/store/narration";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "motion/react";
// … component definitions, each starting opacity-0 with refs, GSAP-timeline-driven …

export const MODULE_N_SLIDES: Slide[] = [
  {
    id: "mN-...",
    type: "interactive",
    fullWidth: true,                 // most slides fill the canvas
    requireCompletion: true,         // gate forward navigation if the slide has a checkpoint
    narrationText: "…",              // plain-text script; CanvasViewer auto-loads /audio/<id>.mp3
    hasCustomAudio: false,            // set true if the slide manages its own audio lifecycle
    component: <ComponentName />     // or (mark) => <ComponentName onComplete={mark} />
  },
  // …
];
```

Then wire the route in `src/app/modules/[id]/page.tsx`:

```tsx
import { MODULE_N_SLIDES } from "@/components/modules/mN";
// …
if (moduleId === "N") {
  return <CanvasViewer slides={MODULE_N_SLIDES} onComplete={handleComplete} moduleId={moduleId} />;
}
```

### Step 4 — Verify

For every slide:

- LSP diagnostics clean on the new file.
- Dev server run, slide visually verified at the three canvas breakpoints (§2).
- Narration audio file exists in `public/audio/` for any slide with `narrationText` (filenames
  must match the slide `id`). Generate voiceover via the repo's `generate-voiceovers*.mjs` scripts
  if missing.
- Reduced-motion path verified — slide content is still readable when `prefers-reduced-motion`
  is on.
- xAPI statements fire at the expected milestones (start of slide, completion, every assessment
  submit).

---

## 5. The slide authoring pattern (canonical)

Each Module 1 slide follows the same pattern. Copy this skeleton, do not invent.

```tsx
function SampleSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);

  // Initial entrance animations (independent of audio)
  useEffect(() => {
    if (headingRef.current)
      gsap.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

    // Audio-synced timeline (positioned in seconds against the narration track)
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(para1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3.0);
    timeline.fromTo(para2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 7.0);
    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  // Tie the GSAP timeline's play/pause to the global narration store
  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  // Optionally, react when the narration finishes (reveal a CTA, etc.)
  useEffect(() => {
    if (isFinished) { /* reveal end-of-slide CTA */ }
  }, [isFinished]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-5xl mx-auto">
      {/* All content goes here — must fit the canvas on all four sides */}
    </div>
  );
}
```

For interactive slides, also `useCanvasNav()` to hijack the deck's "Next" button:

```tsx
const { setNavOverride } = useCanvasNav();

useEffect(() => {
  setNavOverride({
    nextLabel: "Submit Answer",
    nextDisabled: !hasSelection,
    onNext: (handleNext) => { /* submit logic */ handleNext(); },
  });
  return () => setNavOverride(null);
}, [hasSelection]);
```

---

## 6. Assessment authoring — use `AssessmentRunner`, don't reinvent

For any knowledge check, baseline diagnostic, or final exam, **do not write a custom quiz
component from scratch**. Use `AssessmentRunner` in `src/components/lesson/assessment-runner.tsx`:

```tsx
{
  id: "module-N-quiz",
  type: "interactive",
  requireCompletion: true,
  fullWidth: true,
  component: (mark) => (
    <AssessmentRunner
      kind="module"                    // "baseline" | "module" | "final"
      moduleIds={[`${moduleId}`]}      // restrict to this module's bank
      totalQuestions={5}              // exact count pulled randomly
      title="Module N Knowledge Check"
      description="Quick review before we move on."
      onComplete={(result) => mark()}
    />
  ),
}
```

The runner reads from `src/lib/question-bank.ts` (extended via `question-bank-extended-1.ts`).
To add new questions:

1. Read the bank's TypeScript interfaces (4 question types: `multiple-choice`,
   `multiple-select`, `fill-blank`, `match-pairs`).
2. Append questions to the relevant module section, with verified `explanation` and `source` per
   item.
3. The bank handles shuffling and drawing — never modify the runner logic unless asked.

Module 1's slide-local `Assessment1` (10 MCQs about what AI is) is an exception kept inside the
module for narrative pacing; **new assessment work uses the bank-driven runner**.

---

## 7. xAPI logging

Statements go through the `sendXAPIStatement` server action in `src/actions/xapi.ts`. The
canonical statement shape:

```ts
await sendXAPIStatement(
  verbId,           // e.g. "http://adlnet.gov/expapi/verbs/completed"
  verbDisplay,     // short English verb (e.g. "completed")
  objectId,         // activity IRI (e.g. `http://smartslate.com/activities/modules/${moduleId}`)
  objectName,       // human-readable name (e.g. "Module 1")
  objectDescription // optional description
);
```

Standard xAPI milestones you SHOULD fire:

- `launched` when a learner starts a video
- `paused` when a learner pauses that video
- `attempted` when a learner starts an assessment
- `answered` after each question submission
- `completed` when an assessment / module / lesson completes
- `selected_template` when the learner picks the running project spine (Module 0)

If `LRS_*` env vars aren't set, the action gracefully degrades to console logging — so dev-time
development is fine without a configured LRS. Never pipe learner PII through xAPI statements
without first reviewing the `use-user.ts` mock (replace with real auth provider when integrating
Phase 5+).

---

## 8. Voiceover assets

Slides with `narrationText` carry a plain-text script; `CanvasViewer` auto-loads `/audio/<slide.id>.mp3`
and ties it into the global narration store. For slides that own a custom audio lifecycle
(`hasCustomAudio: true`), the slide constructs the `Audio` element itself.

To (re)generate voiceover MP3s, use:

- `generate-voiceovers.mjs` — generic per-module voiceover generation
- `generate-voiceovers-m1.mjs` — Module 1 specific
- `generate-myth-busting.mjs` — one-off for the myth-busting slide script

Always place files under `public/audio/` and name them exactly matching the slide `id`. Do not
leave stray MP3s or un-referenced narration text in any module file.

---

## 9. State management — Zustand only

**No new global state libraries.** The project uses Zustand with `persist` middleware for
survival across reloads.

| Store | Persist | Use |
|---|---|---|
| `useProgressStore` | ✅ (`completedModules`, `projectSpine`) | Course completion + selected project template |
| `useNarrationStore` | ❌ (transient) | Audio playback state shared across the slide deck |
| `useNotesStore` | ✅ (all notes) | Per-(module, lesson, slide) note drafts |

For component-local state, use `useState`. If a value truly needs to be shared across sibling
slides (rare), reach for `useNarrationStore` or a small React Context scoped to the deck — never
a fourth global store without discussion.

---

## 10. Code quality bars

- **Type safety:** no `as any` casts except where a third-party type genuinely breaks (and the
  exception must be inline + commented + traced to the upstream bug). The codebase already uses
  one `as any` for `react-player` and an `as any` for framer-motion variant typing — that budget
  is spent. Do not add more.
- **No `@ts-ignore` / `@ts-expect-error`.** Fix the type or change the implementation.
- **No empty catch blocks.** At minimum log the error name and `error.message`.
- **Run `npm run lint`** before declaring a change shipped. The project's `eslint.config.mjs`
  extends `eslint-config-next`; surface lint errors must be cleared.
- **Module file ceiling:** A module's slide deck should not grow beyond ~2000 LOC. Module 1's
  ~1900 is at the edge. If a new module will exceed this, split into `m{N}/slides/` subdirectory
  with one file per slide component, all aggregated by `m{N}/index.tsx`.

---

## 11. Branch, commit, PR discipline

Per repo style — invoke the **`git-master`** skill for any non-trivial git work.

- **Branch per task.** Never commit directly to `main`.
- **Atomic commits.** One logical change per commit. If a commit spans "added slide 14" + "fixed
  bug in slide 7", split it.
- **Commit message style:** imperative, present tense, ≤72-char head. Body if non-obvious.
- **Do not force-push without explicit instruction**, especially on shared branches.
- **Run `npm run lint` and `npm run build`** before requesting review. Use the
  **`verification-before-completion`** skill — never claim "done" without running verification
  yourself and including the output in the PR description.

---

## 12. When stuck

- 1 failed attempt — re-read the error and the relevant file. Try once.
- 2 failed attempts — invoke **`systematic-debugging`**.
- 3 failed attempts — escalate to **Oracle** or stop and ask the user. Do not shotgun-debug by
  random change.
- For unfamiliar external libraries (e.g. GSAP edge cases, motion v12 migrations),
  reach for the **librarian** agent to pull official docs and OSS usage examples.
- For architectural or security tradeoffs across multiple systems, reach for **Oracle**.

---

## 13. Things that must NEVER happen

1. **A slide that bleeds outside the lesson canvas on any side** at any supported breakpoint —
   this is the canonical failure mode. STYLE.md §5 governs.
2. **Adding a second accent color that competes with teal or indigo.** The two-accent rule
   (STYLE.md §2) is hard. Do not introduce a "blue button" or "purple highlight" in slides.
3. **Skipping the skills listed in §3** when the task domain matches them.
4. **Reinventing AssessmentRunner** when authoring a knowledge check.
5. **Committing `as any`, `@ts-ignore`, or empty `catch` blocks** to silence a type error or
   a runtime warning.
6. **Adding a fourth or fifth global Zustand store** beyond the established three.
7. **Hardcoding any URL or asset path that should be a `public/audio/<id>.mp3`** convention —
   stick with the slide-id-naming pattern.
8. **Burning narration scripts and not producing the matching MP3.** Steel-thread the audio
   asset; an unreferenced narration script in TSX is meaningless to a learner.
9. **Authoring Module 2–7 content without first invoking master-instructional-design** to
   produce lesson-level objectives and storyboard.
10. **Deleting or rewriting the blueprint document's planned-spec content.** The blueprint's
    "Built Implementation" subsection is additive — it documents *what shipped*, it does not
    replace the original planned-spec section.

---

*This document is the development contract for this codebase. When it disagrees with stale
prior agent behavior, this file wins.*