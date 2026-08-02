# DESIGN.md — AI Foundations (extends STYLE.md)

> **This file is subordinate to [STYLE.md](./STYLE.md), the canonical design system.** Every token,
> rule, and pattern here resolves against STYLE.md; where they disagree, STYLE.md wins. New
> primitives introduced by the "Your Journey" revamp and the enrollment gate are documented below.

## 1. Primitives introduced by this design pass

### 1.1 `EnrollmentCheckScreen` — full-screen gate state (used on 5 routes)

- Stage: `bg-background` navy with one ambient teal orb (`w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full`), centered.
- Glass ring: `w-20 h-20 rounded-full bg-card/40 backdrop-blur-xl border border-white/10` holding a teal
  `Loader2` (`text-primary`, `animate-spin`, gated `motion-safe:`).
- Copy: `text-muted-foreground text-sm` label ("Verifying your enrollment" / "Preparing your course…").
- Rules: replaces blank `return null` everywhere the enrollment gate holds; no marketing content
  renders before the decision; spinner communicates state, spin is the only motion (reduced-motion
  users get a static glyph — the glass ring + label still communicate loading).

### 1.2 Journey Spine — the dashboard "Your Journey" module tracker

- **Spine:** 1px vertical rail `bg-white/5`; active progress fill is a teal gradient
  (`from-primary via-primary/80 to-primary/40`) with a `rgba(167,218,219,0.5)` bloom
  (`shadow-[0_0_15px_…]`), height = `totalFraction / (totalModules-1)` clamped 0–100%.
- **Waypoint card** (per module): `bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl`
  + inner edge-light `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`; hover:
  `hover:border-primary/30` + 4px translate (200ms ease-out). **Never `zinc-*` fills.**
- **Three material states:**
  | State | Node | Card | CTA |
  |---|---|---|---|
  | Complete | teal fill + `CheckCircle2`, `shadow-[0_0_25px_rgba(167,218,219,0.3)]` | `border-primary/20` + teal bloom | ghost "Review" |
  | Active | indigo ring `border-secondary` + chapter glyph, `scale-110` + `motion-safe:animate-pulse` halo | `bg-card/60 border-primary/30` + ambient indigo orb | **indigo `bg-secondary`** "Continue" |
  | Locked | dim glass + `Lock`, `text-muted-foreground/60` | `bg-card/20 border-white/5`, dashed hairline, no CTA | — |
- **Chapter glyph:** one lucide icon per module (Compass / Brain / Fish / Wrench / Network / Factory / Rocket)
  in the node — gives each row identity (game-board direction) while the `MODULE n` mono chip keeps
  the sequence explicit (numbered sequencing is meaningful here, not scaffolding).
- **CTA discipline (STYLE.md §2):** forward actions indigo; informational chips (project spine,
  deliverables) teal. Exactly one indigo CTA visible per state moment.
- **Progression caption:** "N of M chapters complete" under the section heading.

## 2. Token compliance

- All colors resolve to STYLE.md tokens (`--background`, `--card`, `--primary`, `--secondary`,
  `--muted-foreground`, `--border`); translucent variants use Tailwind `/40 /60 /80` opacity
  modifiers. No raw hex in component code; no `zinc-*` in revamped surfaces.
- Motion: `<300ms` UI transitions, `transform`/`opacity`/`filter` only, `motion-safe:` gates for
  infinite loops, `[0.23,1,0.32,1]` ease-out for entrances, press = `active:scale-95`.
