import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { ServerCrash, ShieldAlert, Activity } from "lucide-react";

export function IntroSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    // Initial states
    timeline.set(".intro-eyebrow", { opacity: 0, y: -16 });
    timeline.set(".intro-title", { opacity: 0, y: 24 });
    timeline.set(".intro-subtitle", { opacity: 0, y: 16 });
    timeline.set(".hazard-card", { opacity: 0, y: 32, scale: 0.94 });

    // "You've built your AI app." — eyebrow + heading at 0.3s
    timeline.to(
      ".intro-eyebrow",
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      0.1
    );
    timeline.to(
      ".intro-title",
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.3
    );

    // Subtitle at 1s
    timeline.to(
      ".intro-subtitle",
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      1.0
    );

    // "But a prompt that works once on your laptop isn't production-ready..."
    // Cards stagger at 3s / 5s / 7s per narration
    timeline.to(
      ".card-scale",
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" },
      3.0
    );
    timeline.to(
      ".card-edge",
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" },
      5.0
    );
    timeline.to(
      ".card-drift",
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.3)" },
      7.0
    );

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto">

      {/* ── Hero section ── */}
      <div className="flex flex-col items-center text-center mb-8 md:mb-10 gap-4">

        {/* Eyebrow pill */}
        <div className="intro-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
          <span className="font-mono text-xs tracking-widest uppercase text-primary font-semibold">
            Module 6 · LLMOps
          </span>
        </div>

        {/* H1 — plain white, no rose gradient */}
        <h1 className="intro-title text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          The Reality of Production
        </h1>

        {/* Subtitle — teal accent */}
        <p className="intro-subtitle text-base md:text-lg text-primary/80 font-light max-w-xl leading-relaxed">
          Prototyping is easy. Engineering for reliability is the real challenge.
        </p>
      </div>

      {/* ── 3 Hazard Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full">

        {/* Card 1 — Scale (red semantic border) */}
        <div className="hazard-card card-scale flex flex-col gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-red-500/25 shadow-[0_0_28px_rgba(239,68,68,0.07)]">
          {/* Icon wrapper — teal */}
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <ServerCrash className="w-5 h-5 text-primary" />
          </div>
          {/* Semantic badge */}
          <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20">
            Scale
          </span>
          {/* Body */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Concurrent load &amp; latency
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Rate limits, token quotas, and latency spikes hit hard when real
              users arrive simultaneously.
            </p>
          </div>
        </div>

        {/* Card 2 — Edge Cases (orange semantic border) */}
        <div className="hazard-card card-edge flex flex-col gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-orange-500/25 shadow-[0_0_28px_rgba(249,115,22,0.07)]">
          {/* Icon wrapper — teal */}
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-primary" />
          </div>
          {/* Semantic badge */}
          <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Edge Cases
          </span>
          {/* Body */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Malicious inputs &amp; hallucinations
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Adversarial prompts, unexpected inputs, and confident-sounding
              incorrect outputs expose fragile systems.
            </p>
          </div>
        </div>

        {/* Card 3 — Prompt Drift (amber semantic border) */}
        <div className="hazard-card card-drift flex flex-col gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-xl border border-amber-500/25 shadow-[0_0_28px_rgba(245,158,11,0.07)]">
          {/* Icon wrapper — teal */}
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          {/* Semantic badge */}
          <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Prompt Drift
          </span>
          {/* Body */}
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Silent model updates
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Providers update model weights without warning. A prompt that
              scored 95% can quietly regress to 60%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
