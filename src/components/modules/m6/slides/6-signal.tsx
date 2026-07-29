import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Filter, Eye, CheckCircle2, X } from "lucide-react";

// ─── data ────────────────────────────────────────────────────────────────────

const NOISE_ITEMS = [
  {
    headline: "New model XYZ beats GPT-4 by 0.5%!",
    body: "…on an obscure benchmark no production system targets.",
  },
  {
    headline: "This framework wraps the API in 3 lines instead of 4.",
    body: "Same abstraction, different syntax. Not worth the migration.",
  },
  {
    headline: "100 ChatGPT prompts to make you a millionaire.",
    body: "Clickbait with no engineering substance underneath.",
  },
];

const SIGNAL_ITEMS = [
  {
    title: "Evaluation & Observability",
    subtitle: "LangSmith / Phoenix",
    body: "Tools that let you see inside the black box — trace calls, measure quality, and catch regressions before users do.",
  },
  {
    title: "Context Management",
    subtitle: "RAG · Reranking · Caching",
    body: "Advances in vector search, reranking, and semantic caching that directly improve answer quality at scale.",
  },
  {
    title: "Agentic Tooling",
    subtitle: "MCP · Function Calling",
    body: "Standardised protocols that give models secure, auditable access to external data and execution environments.",
  },
];

// ─── component ───────────────────────────────────────────────────────────────

export function SignalSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  // ── GSAP timeline ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    // Initial hidden states
    timeline.set(".sig-title", { opacity: 0, y: -16 });
    timeline.set(".sig-col-noise", { opacity: 0, x: -24 });
    timeline.set(".sig-col-signal", { opacity: 0, x: 24 });
    timeline.set(".sig-noise-card", { opacity: 1, filter: "blur(0px)" });
    timeline.set(".sig-signal-card", { opacity: 0, x: 40 });
    timeline.set(".sig-cta", { opacity: 0, y: 20 });

    // 0.5 s — title slides down
    timeline.to(
      ".sig-title",
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      0.5
    );

    // 1.2 s — both columns fade in together
    timeline.to(
      ".sig-col-noise",
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
      1.2
    );
    timeline.to(
      ".sig-col-signal",
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
      1.2
    );

    // 4 s — noise cards blur & fade (staggered)
    timeline.to(
      ".sig-noise-card",
      {
        opacity: 0.15,
        filter: "blur(3px)",
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.inOut",
      },
      4
    );

    // 9 s, 10 s, 11 s — signal cards slide in from right, one by one
    SIGNAL_ITEMS.forEach((_, i) => {
      timeline.to(
        `.sig-signal-card-${i}`,
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          ease: "back.out(1.2)",
        },
        9 + i
      );
    });

    // 13 s — CTA bar rises
    timeline.to(
      ".sig-cta",
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      13
    );

    tl.current = timeline;
    return () => {
      timeline.kill();
    };
  }, []);

  // ── play / pause sync ──────────────────────────────────────────────────────
  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  // ── nav override ───────────────────────────────────────────────────────────
  useEffect(() => {
    setNavOverride({
      nextDisabled: !isFinished,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      },
    });
    return () => setNavOverride(null);
  }, [isFinished, setNavOverride, onComplete]);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">

      {/* ── Title ──────────────────────────────────────────────────────────── */}
      <div className="sig-title shrink-0 flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Filter className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Signal vs.{" "}
          <span className="text-primary">Noise</span>
        </h2>
      </div>

      {/* ── Two-column body ────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex gap-6">

        {/* ── Left column — The Noise (45%) ─────────────────────────────── */}
        <div className="sig-col-noise w-[45%] shrink-0 flex flex-col min-h-0">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-rose-400/70">
              Filter Out
            </span>
            <div className="flex-1 h-px bg-rose-500/15" />
          </div>

          {/* Noise cards */}
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            {NOISE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="sig-noise-card relative bg-card/30 border border-white/5 rounded-xl p-3 flex gap-3"
              >
                {/* X badge */}
                <div className="shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                    <X className="w-3 h-3 text-rose-400/60" />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-white/40 text-xs font-semibold leading-snug mb-0.5">
                    {item.headline}
                  </p>
                  <p className="text-white/25 text-[11px] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — The Signal (55%) ───────────────────────────── */}
        <div className="sig-col-signal flex-1 flex flex-col min-h-0">
          {/* Section header */}
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary">
              Focus On
            </span>
            <Filter className="w-3 h-3 text-primary/60" />
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          {/* Signal cards */}
          <div className="flex flex-col gap-3 flex-1 min-h-0">
            {SIGNAL_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`sig-signal-card sig-signal-card-${i} bg-primary/5 border border-primary/20 rounded-xl p-4 backdrop-blur-sm flex gap-3`}
              >
                {/* Check icon */}
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <h4 className="text-primary font-bold text-sm leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-primary/50 text-[10px] font-medium">
                      {item.subtitle}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA bar ────────────────────────────────────────────────────────── */}
      <div className="sig-cta shrink-0 mt-5">
        <div className="bg-primary/[0.08] border border-primary/25 rounded-xl px-5 py-3.5 backdrop-blur-sm flex items-center gap-3">
          <div className="shrink-0 p-1.5 rounded-lg bg-primary/15 border border-primary/20">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <p className="text-primary/90 text-sm font-medium leading-snug">
            Maintain a curated{" "}
            <span className="font-bold text-primary">Tool Landscape doc.</span>{" "}
            Review it quarterly — drop what&apos;s noise, double down on what&apos;s signal.
          </p>
        </div>
      </div>

    </div>
  );
}
