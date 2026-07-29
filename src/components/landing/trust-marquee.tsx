import { Sparkles, Layers, PenTool, BrainCircuit, BarChart3 } from "lucide-react";

/**
 * TrustMarquee — perpetually-scrolling row of Solara product tiles.
 *
 * Shows the sibling products in the Smartslate Solara ecosystem, positioning
 * Orbit as one module within a unified learning infrastructure platform.
 *
 * Animation: CSS @keyframes `marquee` (defined in globals.css), applied via
 * inline style. Duration is 30s linear infinite — "medium slow" so each pill
 * takes ~4.5s to cross any fixed point, giving the reader time to absorb
 * every label. Pause-on-hover via `.marquee-pause:hover .marquee-track` in
 * globals.css uses `!important` to override the inline style.
 *
 * Seamless loop: TILES has 5 unique entries; render duplicates them to 10.
 * The -50% translate moves exactly one set width, so the loop is invisible.
 *
 * Reduced-motion: animation disabled in globals.css; tiles render statically.
 */

type ProductTile = {
  name: string;
  tagline: string;
  icon: typeof Sparkles;
};

const TILES: ProductTile[] = [
  { name: "Polaris", tagline: "AI Design Generator", icon: Sparkles },
  { name: "Constellation", tagline: "Content Curation", icon: Layers },
  { name: "Nova", tagline: "AI Authoring", icon: PenTool },
  { name: "Nebula", tagline: "AI Tutor", icon: BrainCircuit },
  { name: "Spectrum", tagline: "Learning Analytics", icon: BarChart3 },
];

export function TrustMarquee() {
  return (
    <div className="marquee-pause relative w-full overflow-hidden">
      {/* Edge fade masks — fade tiles in/out at viewport edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-32"
        style={{
          background:
            "linear-gradient(to right, var(--background), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-32"
        style={{
          background:
            "linear-gradient(to left, var(--background), transparent)",
        }}
      />

      <div
        className="marquee-track flex w-max gap-4 py-2"
        style={{
          animation: "marquee 30s linear infinite",
          willChange: "transform",
        }}
      >
        {[...TILES, ...TILES].map((tile, i) => {
          const Icon = tile.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 backdrop-blur-md"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Icon
                  className="h-3.5 w-3.5 text-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-foreground">
                  {tile.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {tile.tagline}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
