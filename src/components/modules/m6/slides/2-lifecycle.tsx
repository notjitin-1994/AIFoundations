import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { GitBranch, DatabaseZap, TestTube2, Rocket } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: GitBranch,
    title: "Prompt Versioning",
    desc: "Never hardcode prompts — treat them as versioned source artifacts.",
    gsapClass: "step-1",
    panelClass: "panel-1",
  },
  {
    num: "02",
    icon: DatabaseZap,
    title: "Golden Dataset",
    desc: "Curate 100 perfect Q&A pairs as the ground-truth regression baseline.",
    gsapClass: "step-2",
    panelClass: "panel-2",
  },
  {
    num: "03",
    icon: TestTube2,
    title: "Regression Test",
    desc: "Run every prompt change against the golden dataset via an LLM Judge.",
    gsapClass: "step-3",
    panelClass: "panel-3",
  },
  {
    num: "04",
    icon: Rocket,
    title: "A/B Deployment",
    desc: "Ship new prompts via canary release — 5% traffic before full rollout.",
    gsapClass: "step-4",
    panelClass: "panel-4",
  },
];

const PANEL_CONTENT = [
  {
    title: "prompt_store.yaml",
    lines: [
      { t: "comment", v: "# Prompt Registry — NEVER inline these in code" },
      { t: "key",     v: "summarise_v3:" },
      { t: "val",     v: '  model: gpt-4o' },
      { t: "val",     v: '  version: "3.1.2"' },
      { t: "val",     v: "  sha: a4f9c12" },
      { t: "key",     v: "classify_v2:" },
      { t: "val",     v: "  model: claude-3-5-sonnet" },
      { t: "val",     v: '  version: "2.0.8"' },
      { t: "val",     v: "  sha: 9d3e7b1" },
      { t: "comment", v: "" },
      { t: "comment", v: "# Change a prompt → bump version → PR → review" },
    ],
  },
  {
    title: "golden_dataset.jsonl",
    lines: [
      { t: "comment", v: "// 100 ground-truth Q&A pairs  (excerpt)" },
      { t: "val",     v: '{ "q": "Summarise the contract", "a": "The contract ..." }' },
      { t: "val",     v: '{ "q": "What is the renewal date?", "a": "March 2026" }' },
      { t: "val",     v: '{ "q": "List liabilities", "a": "Clauses 4, 7, 12" }' },
      { t: "comment", v: "" },
      { t: "comment", v: "// Each row = one immutable regression target" },
      { t: "comment", v: "// Curated by domain experts, locked in git" },
    ],
  },
  {
    title: "eval_runner.py",
    lines: [
      { t: "comment", v: "# Regression suite — runs on every PR" },
      { t: "key",     v: "for item in golden_dataset:" },
      { t: "val",     v: "    output = app_llm(item.query)" },
      { t: "val",     v: "    score  = judge_llm(item.query, output," },
      { t: "val",     v: "                       item.reference)" },
      { t: "key",     v: "    if score < PASS_THRESHOLD:" },
      { t: "val",     v: '        raise RegressionError(f"Score {score}")' },
      { t: "comment", v: "" },
      { t: "comment", v: "# PASS_THRESHOLD = 4 / 5 (LLM-as-Judge rubric)" },
    ],
  },
  {
    title: "deployment.yaml",
    lines: [
      { t: "comment", v: "# Canary rollout strategy" },
      { t: "key",     v: "strategy:" },
      { t: "val",     v: "  type: canary" },
      { t: "val",     v: "  steps:" },
      { t: "val",     v: "    - weight: 5      # 5% traffic → new prompt" },
      { t: "val",     v: "    - weight: 25     # promote if P95 score ≥ 4" },
      { t: "val",     v: "    - weight: 100    # full rollout" },
      { t: "key",     v: "rollback_trigger:" },
      { t: "val",     v: "  score_drop: 0.3   # auto-revert threshold" },
    ],
  },
];

export function LifecycleSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  // ── GSAP timeline ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    // Start state
    timeline.set(".step-card", { opacity: 0, x: -28 });
    timeline.set(".panel-block", { opacity: 0, y: 12 });
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
    }

    // Vertical line draws 3s → 13s
    timeline.to(lineRef.current, { scaleY: 1, duration: 10, ease: "none" }, 3);

    // Step 1 at 3s
    timeline.to(".step-1", { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 3);
    timeline.to(".panel-1", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 3);
    timeline.add(() => setActivePanel(0), 3);

    // Step 2 at 6s
    timeline.to(".step-2", { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 6);
    timeline.to(".panel-2", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 6);
    timeline.add(() => setActivePanel(1), 6);

    // Step 3 at 9s
    timeline.to(".step-3", { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 9);
    timeline.to(".panel-3", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 9);
    timeline.add(() => setActivePanel(2), 9);

    // Step 4 at 12s
    timeline.to(".step-4", { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 12);
    timeline.to(".panel-4", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 12);
    timeline.add(() => setActivePanel(3), 12);

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  // ── Play / pause sync ──────────────────────────────────────────────────────
  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  // ── Nav override ───────────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">

      {/* ── Header ── */}
      <div className="shrink-0 mb-5">
        {/* Teal pill label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs font-sans font-semibold text-primary uppercase tracking-widest">
            Lesson 1 · Lifecycle
          </span>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
          The LLMOps Pipeline
        </h2>
        <p className="mt-1 text-sm text-primary/80 font-sans">
          Engineering rigor applied to prompt development &amp; deployment.
        </p>
      </div>

      {/* ── Body: left pipeline + right terminal ── */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">

        {/* ── LEFT: Vertical pipeline (~40%) ── */}
        <div className="relative flex flex-col gap-3 w-[38%] shrink-0">

          {/* Animated vertical line track */}
          <div className="absolute left-[22px] top-4 bottom-4 w-[2px] bg-primary/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20 rounded-full"
              style={{ transformOrigin: "top center" }}
            />
          </div>

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`step-card ${step.gsapClass} relative flex items-start gap-3 bg-card/40 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 z-10`}
              >
                {/* Icon + number */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary/60 tracking-wider">
                    {step.num}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-sm font-heading font-semibold text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-sans text-white/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: Glass terminal panel (~60%) ── */}
        <div className="flex-1 min-w-0 relative">
          {/* Teal ambient glow */}
          <div className="absolute -top-4 -right-4 w-48 h-48 blur-[80px] opacity-15 rounded-full bg-primary pointer-events-none" />

          <div className="relative h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col">

            {/* Terminal chrome bar */}
            <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-3 text-[11px] font-mono text-primary/70 truncate">
                llmops /{" "}
                <span className="text-primary font-semibold">
                  {PANEL_CONTENT[activePanel].title}
                </span>
              </span>
              {/* Live indicator */}
              <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono text-primary uppercase tracking-widest">
                  live
                </span>
              </div>
            </div>

            {/* Stacked code panels — each fades in via GSAP */}
            <div className="relative flex-1 min-h-0 overflow-hidden">
              {PANEL_CONTENT.map((panel, i) => (
                <div
                  key={i}
                  className={`panel-block panel-${i + 1} absolute inset-0 p-4 overflow-auto`}
                >
                  <pre className="font-mono text-[11px] leading-6 whitespace-pre-wrap break-words">
                    {panel.lines.map((line, li) => {
                      if (line.t === "comment") {
                        return (
                          <span key={li} className="block text-white/30">
                            {line.v}
                          </span>
                        );
                      }
                      if (line.t === "key") {
                        return (
                          <span key={li} className="block text-primary font-semibold">
                            {line.v}
                          </span>
                        );
                      }
                      return (
                        <span key={li} className="block text-white/70">
                          {line.v}
                        </span>
                      );
                    })}
                  </pre>
                </div>
              ))}
            </div>

            {/* Bottom step-tab status bar */}
            <div className="shrink-0 flex items-center gap-4 px-4 py-2 border-t border-white/10 bg-white/5">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActivePanel(i)}
                  className={`text-[10px] font-mono transition-colors duration-200 ${
                    activePanel === i
                      ? "text-primary font-bold"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {s.num}
                </button>
              ))}
              <span className="ml-auto text-[9px] font-mono text-white/20 uppercase tracking-widest">
                LLMOps · m6
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
