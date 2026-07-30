import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Zap, AlertTriangle, Compass } from "lucide-react";

// Items deemed "timeless" / durable paradigms get a teal tint
const TIMELESS = new Set(["MCP", "LlamaIndex"]);

const FRAMEWORKS = [
  "GPT-4o",
  "Claude 3.5",
  "Llama 3",
  "Mistral",
  "DSPy",
  "LangChain",
  "LlamaIndex",
  "LangSmith",
  "Pinecone",
  "Weaviate",
  "Ollama",
  "MCP",
];

export function PaceSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    // Initial hidden state
    timeline.set(".pace-title", { opacity: 0, y: 24 });
    timeline.set(".chip-item", { opacity: 0, scale: 0.7, y: 8 });
    timeline.set(".pace-warning", { opacity: 0, y: 28 });
    timeline.set(".pace-solution", { opacity: 0, y: 28 });

    // "The landscape is evolving at a breakneck pace." (0 – 3s)
    timeline.to(
      ".pace-title",
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.5
    );

    // "New models, frameworks, and techniques drop weekly." (3 – 7s)
    timeline.to(
      ".chip-item",
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "back.out(1.4)",
      },
      3
    );

    // "You cannot learn everything." (7 – 10s)
    timeline.to(
      ".pace-warning",
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      7
    );

    // "Focus on durable paradigms." (10s+)
    timeline.to(
      ".pace-solution",
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      10
    );

    tl.current = timeline;
    return () => {
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


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
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">
      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-48 blur-[100px] opacity-10 rounded-full bg-primary" />

      {/* ── Hero / Title ── */}
      <div className="pace-title flex flex-col items-center text-center mb-8 shrink-0">
        {/* Icon pill */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-5 shadow-[0_0_24px_rgba(167,218,219,0.15)]">
          <Zap className="w-7 h-7 text-primary" strokeWidth={1.8} />
        </div>

        <h2 className="text-3xl md:text-[2.6rem] font-extrabold text-white tracking-tight leading-tight mb-2">
          The Pace of Change
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md">
          New models, frameworks, and techniques drop every week.
        </p>
      </div>

      {/* ── Glass Chips ── */}
      <div className="w-full max-w-3xl flex flex-wrap justify-center gap-2 md:gap-2.5 mb-8 shrink-0">
        {FRAMEWORKS.map((name) => {
          const isTimeless = TIMELESS.has(name);
          return (
            <span
              key={name}
              className={[
                "chip-item",
                "px-3 py-1.5 rounded-full text-xs font-medium",
                "backdrop-blur-sm border transition-colors",
                isTimeless
                  ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(167,218,219,0.1)]"
                  : "bg-card/40 border-white/10 text-white/70",
              ].join(" ")}
            >
              {name}
            </span>
          );
        })}
      </div>

      {/* ── Bottom Cards ── */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        {/* Left — The Trap */}
        <div className="pace-warning flex flex-col gap-3 bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 shrink-0">
              <AlertTriangle
                className="w-4 h-4 text-primary"
                strokeWidth={1.8}
              />
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              The Trap
            </h3>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            You cannot learn everything.
          </p>
          <div className="mt-auto flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <p className="text-primary/80 text-xs leading-relaxed font-medium">
              Half-life of an AI tutorial:{" "}
              <strong className="text-primary">6 months.</strong>
            </p>
          </div>
        </div>

        {/* Right — The Strategy */}
        <div className="pace-solution flex flex-col gap-3 bg-primary/5 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(167,218,219,0.07)]">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 border border-primary/30 shrink-0">
              <Compass className="w-4 h-4 text-primary" strokeWidth={1.8} />
            </span>
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">
              The Strategy
            </h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Focus on{" "}
            <strong className="text-primary font-bold">Durable Paradigms</strong>
            : Context, Tokens, Agents.
          </p>
          <div className="mt-auto flex items-start gap-2 bg-card/40 border border-white/10 rounded-xl px-3 py-2">
            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              Syntax is temporary.{" "}
              <strong className="text-white/80">Principles are forever.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
