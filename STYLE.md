# AI Foundations — Global Style Guide

> **Canonical design system for this codebase.** This document supersedes all prior brand guides and is the single source of truth for fonts, colors, motion, glass, and canvas layout in this project. If anything in `style.md`'s history disagrees with this file, this file wins.

---

## 1. Design Ideology

The AI Foundations experience is **a dark, calm, voiceover-narrated slide deck**. Three beliefs drive every visual decision:

1. **Calm deep navy base — teal as spotlight, indigo as action.**
   The dark navy background is the stage; teal is the acting light (where the eye should go), indigo is the CTA (what the learner should do next). Never invert these. Background fills the world, teal highlights it, indigo moves it forward.

2. **Glassmorphism as ideology, not decoration.**
   Every elevated surface is frosted glass over the navy — translucent fills, backdrop-blur, hairline borders, subtle glow. Glass is the language Ai Foundations speaks. Use it on cards, modals, overlays, feedback panels — anywhere a surface "lifts" off the canvas.

3. **Content must fit the lesson canvas — never bleed.**
   Slides render inside a 16:10 `CanvasViewer` rectangle. Every slide MUST fit within that rectangle on all sides (no horizontal scroll, no top/bottom clipping, no overflow outside the canvas). The canvas is the stage; the slide is the actor. Plan for overflow at every breakpoint or design defensively with `overflow-hidden` + internal `overflow-y-auto`.

---

## 2. Brand Color Tokens

Defined in `src/app/globals.css` under `:root` (dark-first; the `.dark` class mirrors the same values, so theme switching is a no-op).

### Background hierarchy (deep navy stage)

| Token | Value | Role |
|---|---|---|
| `--background` | `#020C1B` | Page background — the deepest layer |
| `--card` | `#0d1b2a` | Cards, popovers, elevated surfaces |
| `--muted` / `--accent` | `#142433` | Interactive surface (hover, raised elements) |
| `--border` / `--input` | `#2a3a4a` | Hairline borders, input outlines |

### Text hierarchy

| Token | Value | Contrast on `--background` |
|---|---|---|
| `--foreground` | `#e0e0e0` | 14.3:1 (AAA) — headings, body |
| `--muted-foreground` | `#b0c5c6` | 7.1:1 (AA) — subtext, metadata |
| (disabled) | `#7a8a8b` | 4.5:1 (AA) — disabled / placeholder text |

### The two brand accents (THE governing rule of this system)

| Accent | Token | Hex | Role | Use it for |
|---|---|---|---|---|
| **Brand Teal** (design accent) | `--primary` | `#a7dadb` | **Spotlight / "look here"** | Active slide indicators, highlights, links, icon emphasis, "this is the active path" cues, success/positive feedback, the active option in a quiz, sidebar active state, ring focus |
| **Brand Indigo** (CTA accent) | `--secondary` | `#4F46E5` | **Action / "do this"** | Primary buttons (Continue, Submit, Complete Module, "Begin Course"), main CTAs in marketing-style slides, primary submit actions |

> **The two-accent rule (HARD):** Teal ≠ Indigo. They are not interchangeable. Teal highlights *information* ("look"); Indigo triggers *actions* ("do"). A primary forward-movement button is Indigo. A selected quiz option ring is Teal. Mixing them reverses the visual semantics of the entire course.

### Semantic colors

| Token | Value | Use |
|---|---|---|
| `--destructive` | `#ef4444` | Incorrect answers, errors, hallucination warnings |
| (success) | `#22c55e` / emerald-500 | Correct answers, completion states |
| (warning) | `#f59e0b` / orange-500 | Caution, bias | risk indicators |

### Accent usage discipline

- **Teal is scarce.** A slide that uses teal on more than ~20% of its pixels is overusing it — it stops reading as a spotlight. Treat teal like paint on a statuette: hit only the parts you want learners to look at.
- **Indigo is for one CTA per slide.** Indigo buttons compete. If two indigo buttons appear on the same slide, demote the secondary one.
- Never use teal as a CTA background. Never use indigo for hypertext or in-content emphasis.
- Both accents support translucent variants (`/5`, `/10`, `/20`, `/30` opacity modifiers in Tailwind) — prefer these for backgrounds, glows, and tints.

---

## 3. Typography

Loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS custom properties.

| Role | Family | Weights | CSS variable | Tailwind utility |
|---|---|---|---|---|
| Headings (H1–H6, display) | **Quicksand** | 300 / 400 / 500 / 600 / 700 | `--font-heading` | `font-heading` |
| Body, UI text | **Lato** | 300 / 400 / 700 / 900 | `--font-sans` | `font-sans` |
| Monospace | System / Tailwind default | — | `--font-mono` | `font-mono` |

- All headings automatically use Quicksand via the `@layer base` rule in `globals.css` (`h1..h6 { @apply font-heading text-primary; }`). Headings are teal by default.
- Use Lato for body text, paragraph markdown content, captions, microcopy.
- Type scale should use `clamp()` for fluid sizing across breakpoints (e.g. H1 ~`clamp(2.25rem, 2vw + 1.5rem, 3.5rem)`).
- Body line-length cap: ~65–75ch for readability (`max-w-xl` / `max-w-2xl` on prose).
- For large display headings, use `text-balance` (`text-wrap: balance`) so line breaks stay even; use `text-pretty` on long prose to avoid orphan words.

---

## 4. Glassmorphism (Core Ideology)

Every elevated surface is glass. The recipe, observed across this codebase:

```tsx
// Standard glass panel (button / card / overlay)
<div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">

// Light glass over a busy backdrop
<div className="bg-background/50 backdrop-blur-md border border-border/50 rounded-xl">

// Strong frosted glass (modals, feedback overlays)
<div className="bg-background/80 backdrop-blur-2xl border rounded-[32px] shadow-2xl">
```

### Rules

- **Translucent fills over the navy backdrop.** `bg-card/30`, `bg-card/40`, `bg-background/50`, `bg-background/80` — pick the opacity to match the visual weight. Heavier frosts (`backdrop-blur-2xl`) for full overlays; lighter frosts (`backdrop-blur-md`) for in-content cards.
- **Hairline white borders.** `border border-white/10` or `border border-white/20` — never solid border-color borders. Glass edges are whispers, not lines.
- **Accent-tinted borders for emphasis.** `border-primary/20` (teal) for active glass, `border-destructive/20` (red) for incorrect feedback, `border-primary/30` (emerald) for correct. Border tint color matches the slide's intent.
- **Subtle glow behind critical surfaces.** Use an absolutely-positioned, blurred `rounded-full` div at low opacity:

  ```tsx
  <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 rounded-full bg-primary pointer-events-none" />
  ```

- **No solid black/white surfaces.** The base navy shows through everything. If a card has full opacity, treat it as a `bg-card` surface, not glass.

---

## 5. Layout: The Canvas Constraint (HARD RULE)

This is the most important layout rule in the project.

### The lesson canvas

`CanvasViewer` (in `src/components/lesson/canvas-viewer.tsx`) renders the slide deck inside:

```html
<div class="relative w-full aspect-[16/10] max-h-[90vh] bg-card border shadow-2xl rounded-xl overflow-hidden flex flex-col">
  <div class="flex-1 relative overflow-hidden ...">{slide content}</div>
  <div class="h-20 border-t ...">{nav footer}</div>
</div>
```

The slide content area is `flex-1` inside this `16:10` rectangle, minus an 80px nav footer. **This is the ONLY space a slide has.**

### The rule, plainly

> **Every slide must fit inside the lesson canvas on all four sides — left, right, top, bottom. Nothing may bleed outside.**

- No horizontal scrolling anywhere in a slide. The waveform / timeline / answer cards / whatever you build lives inside the canvas width.
- No vertical bleed off the bottom. If content is taller than the canvas height, give *the inner content region* `overflow-y-auto` (never the canvas itself).
- No negative margins, no `absolute`-positioned children that escape the canvas, no `100vw`/`100vh` units, no `position: fixed` inside slides.

### Design patterns that satisfy the rule

1. **Outer slide wrapper:** always `w-full h-full flex flex-col overflow-hidden` plus `max-w-6xl mx-auto`.
2. **Inner scroll region:** for any list/cards/breakdown that might exceed vertical space, wrap it in `<div class="flex-1 overflow-y-auto min-h-0">`. Never let `flex-1` children stretch the parent.
3. **Constrain widths:** use `max-w-md` / `max-w-xl` / `max-w-3xl` / `max-w-5xl` on text columns so prose doesn't span the full canvas.
4. **Use `clamp()` on display headings** so they scale between mobile and desktop without breaking out of the rectangle.
5. **Always plan three breakpoints inside the canvas:** `<768px` (single column), `768px–1024px` (stacked / split), `>1024px` (desktop grid). Use `grid-cols-1 lg:grid-cols-2` patterns.
6. **Test at max-h-[90vh].** The canvas's tallest realistic state (when the browser is short, on a projector, in landscape mobile). If slide content is clipped at the bottom, the slide is broken — fix the overflow.
7. **Use `shrink-0` and `flex-1 min-h-0` deliberately** to make sectors claim only their fair share of vertical space; never let one sector push others out the bottom.

### Anti-patterns (will fail review)

- `position: fixed` inside a slide (`fixed` escapes the canvas rectangle — it attaches to the viewport, not the slide)
- Slide children using `100vw` or `100vh`
- Heading `clamp()` `max` values above ~5rem on slides that have anything else on them
- Pill / chip rows that don't wrap on narrow canvases
- AnimatePresence children using scale/translate that push children outside the canvas into the nav footer

If a slide cannot fit honorably within the canvas at all target sizes, redesign the slide — do not expand the canvas.

---

## 6. Motion

Two motion systems, used together intentionally:

### GSAP — narration-synced timelines (use zeally for scripted reveals)

GSAP is the system for **voiceover-synced reveals**. Each slide that has a narration track produces a `gsap.timeline({ paused: true })` whose children are positioned against the audio time (in seconds):

```tsx
const timeline = gsap.timeline({ paused: true });
timeline.fromTo(headingRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
timeline.fromTo(p1Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3); // reveals at 3s in the audio
```

The store's `isPlaying` flag plays/pauses the timeline in sync with the narration audio element. Time positions in the timeline must map to the spoken script — see `narrationText` on each slide for the canonical script.

### Framer Motion (`motion/react`) — mount, exit, and micro-interactions

Use the `motion` package (formerly framer-motion) for:

- Slide-to-slide deck transition (see `CanvasViewer`'s `AnimatePresence mode="wait"`)
- Slam-in feedback overlays on quiz answers (the correct/incorrect glass card)
- Interactive component state (whileHover, whileTap)
- Loop animations (e.g. radar ping ring around the next-target node)

### Standard easing

| Use | Easing |
|---|---|
| Entrance (anything entering) | `power3.out`, `power4.out`, or custom `[0.23, 1, 0.32, 1]` (Emil's recommended ease-out curve) |
| Exits | `power2.in` or `[0.32, 0, 0.67, 0]` |
| Component state changes | `ease: "easeOut"` |
| Spring physics | `type: "spring", stiffness: 90, damping: 20` (subtle bounce for tactile components) |
| Avoid | `ease-in` on entrances (feels sluggish), bounce/elastic on default reveals |

### Reduced motion (REQUIRED)

Every animation path must respect `prefers-reduced-motion: reduce`. `CanvasViewer` already imports `useReducedMotion` and zeroes the deck-slide x delta — extend the same discipline to slide internals. Reveal via opacity-only at low duration when reduced motion is on.

---

## 7. Spacing, Radius, Layout primitives

### Spacing scale (8px base, Tailwind defaults)

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Tight icon padding |
| `sm` | 8px | Default inter-item gap |
| `md` | 16px | Section padding, default gap |
| `lg` | 24px | Card padding, separation |
| `xl` | 32px | Hero / module padding |
| `2xl` | 48px | Module breaks |
| `3xl`, `4xl` | 64px, 96px | Major section breaks |

### Radius scale (defined in `globals.css`)

`--radius: 0.5rem`. The numeric Tailwind utilities scale off it: `--radius-md = 0.4rem`, `--radius-lg = 0.5rem`, `--radius-xl = 0.7rem`, `--radius-2xl = 0.9rem`, `--radius-3xl = 1.1rem`, `--radius-4xl = 1.3rem`.

| Use case | Tailwind utility |
|---|---|
| Inputs, small buttons | `rounded-md` (`8px`) |
| Cards, default glass | `rounded-2xl` (`1rem`–`1.8rem` depending on theme) |
| Hero cards, feedback overlays | `rounded-3xl` / `rounded-[32px]` |
| Pills, avatar, CTA circles | `rounded-full` |

### Z-index scale

| Layer | Z |
|---|---|
| Base content | 1 – 10 |
| Sticky (Header overlay) | 10 |
| Dropdown | 20 |
| Sticky nav footer (CanvasViewer) | 10 |
| Glass overlays within a slide | 40 – 50 |
| Modals, full-screen overlays | 200 |
| Toast / Sonner notifications | 500 |

---

## 8. UI Component library

The project uses a **shadcn-style** component library (Radix primitives + Tailwind classes) located in `src/components/ui/`. 38 components are installed via `components.json` (registry: base-nova, alias `@/components/ui`).

### Patterns

- **Variants:** via `class-variance-authority` (see `button.tsx`, `badge.tsx`).
- **ClassName merge:** via `clsx` + `tailwind-merge`, wrapped in `src/lib/utils.ts` `cn()`.
- **Toasts:** `sonner` is the toast primitive.
- **Icons:** `lucide-react` only. No other icon set.
- **Popovers, dialogs, dropdowns:** use Radix primitives directly. Don't author custom portals.

### When to add a new shadcn component

Use `npx shadcn@latest add <component>`. Always verify the installed component matches the dark-navy glass ideology — adjust borders, opacity, and radius if the default install drifts. Never ship a shadcn component in its default light/white style.

---

## 9. Brand expression — the Smartslate logos and asset kit

- Logo and brand assets load from the Smartslate Supabase public bucket — see `Header` and `Sidebar` for the canonical `img src` URLs.
- Imagery style: photographic backgrounds desaturated and Dimensioned with the navy gradient overlay (`bg-gradient-to-t from-background via-background/20 to-transparent`), so all imagery reads as **part of the navy stage**, not as a foreign element.
- Avoid bright primary-color imagery. If a stock image is too saturated, dim it with `opacity-70` + a dark gradient overlay.

---

## 10. Quick-reference cheat sheet

When authoring a slide, run through this checklist:

- [ ] Outer wrapper is `w-full h-full flex flex-col overflow-hidden max-w-* mx-auto`
- [ ] No `position: fixed`, no `100vh` / `100vw` units
- [ ] Internal content has explicit `max-w-*` constraint (Narrow columns read better on wide canvases)
- [ ] Glass surfaces: `bg-card/40 backdrop-blur-xl border border-white/10`
- [ ] Active state / spotlight: teal (`text-primary`, `border-primary`, `bg-primary/20`)
- [ ] Primary button / CTA: indigo (`bg-secondary` or `bg-indigo-600` — both reach `#4F46E5`)
- [ ] Heading: `font-heading` defaults automatically; display-size via `clamp()`
- [ ] Body: `font-sans` (Lato) defaults via `body { @apply font-sans }`
- [ ] If narration-synced reveals: GSAP timeline positioned against audio seconds
- [ ] If interactive component state: `motion` package with `[0.23, 1, 0.32, 1]` ease-out
- [ ] Reduced motion path: opacity-only, low duration
- [ ] Slide fits inside the 16:10 canvas at mobile, tablet, desktop — no bleed on any side

---

## 11. Token reference (copy-paste ready)

```css
:root {
  /* Background hierarchy */
  --background: #020C1B;
  --card:       #0d1b2a;
  --muted:      #142433;
  --accent:     #142433;
  --border:     #2a3a4a;
  --input:      #2a3a4a;

  /* Two brand accents */
  --primary:    #a7dadb;  /* BRAND TEAL — design accent / spotlight */
  --secondary:  #4F46E5;  /* BRAND INDIGO — CTA accent / action */

  /* Text */
  --foreground:        #e0e0e0;
  --muted-foreground:  #b0c5c6;
  --accent-foreground: #a7dadb;

  /* Semantic */
  --destructive: #ef4444;   /* errors, hallucination warnings */
  --ring:        #a7dadb;   /* focus ring */

  /* Sidebar (mirrors base) */
  --sidebar:               #0d1b2a;
  --sidebar-foreground:    #e0e0e0;
  --sidebar-primary:       #a7dadb;
  --sidebar-accent:        #142433;
  --sidebar-border:        #2a3a4a;

  /* Radius */
  --radius: 0.5rem;

  /* Fonts */
  --font-heading: 'Quicksand', system-ui, -apple-system, sans-serif;
  --font-sans:    'Lato', Georgia, serif;
}
```

---

*This document is the canonical style guide for the AI Foundations codebase. If you change a color, font, or layout principle here, change it in `globals.css` and the slide components too — these three places must never drift.*