/**
 * AuroraBackground — atmospheric backdrop for the marketing hero.
 *
 * Three composited layers, all `pointer-events-none` and pure-CSS so they
 * stay at 60fps with zero JS cost:
 *   1. Radial-gradient wash (teal top-left + indigo bottom-right) — the brand
 *      two-accent rule rendered as ambient light, never as solid fills.
 *   2. Faint 48px grid with radial mask — adds technical register without
 *      competing with content.
 *   3. SVG fractal noise at 4% opacity — kills the "cheap gradient" banding
 *      that pure CSS radial gradients produce on high-bit-depth displays.
 *
 * The wash layer carries the slow `aurora-drift` animation (defined in
 * globals.css). Reduced-motion users get a static composition.
 *
 * Tokens: --background, --primary (teal), --secondary (indigo). See STYLE.md §2.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Layer 1 — aurora wash (animated) */}
      <div
        className="aurora-drift-layer absolute -inset-[10%]"
        style={{
          background:
            "radial-gradient(50% 50% at 18% 12%, rgba(167, 218, 219, 0.18), transparent 60%)," +
            "radial-gradient(45% 55% at 85% 88%, rgba(79, 70, 229, 0.20), transparent 60%)," +
            "radial-gradient(35% 35% at 60% 50%, rgba(167, 218, 219, 0.06), transparent 70%)",
          animation: "aurora-drift 28s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Layer 2 — faint grid (static) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 35%, transparent 80%)",
        }}
      />

      {/* Layer 3 — fractal noise (static, kills gradient banding) */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
