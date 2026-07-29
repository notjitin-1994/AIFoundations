import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { CheckCircle2, Scale } from "lucide-react";

// ─── Rubric row data ───────────────────────────────────────────────────────────
const RUBRIC = [
  { label: "Factuality", sub: "No hallucinations detected", score: 5, max: 5 },
  { label: "Tone Alignment", sub: "Matches brand voice", score: 4, max: 5 },
  { label: "Task Completion", sub: "All instructions followed", score: 5, max: 5 },
];

// ─── Score dot row ─────────────────────────────────────────────────────────────
function ScoreDots({ score, max }: { score: number; max: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-2.5 h-2.5 rounded-full border ${
            i < score
              ? "bg-primary border-primary shadow-[0_0_6px_rgba(167,218,219,0.6)]"
              : "bg-white/5 border-white/15"
          }`}
        />
      ))}
    </div>
  );
}

export function JudgeSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  // refs for imperative GSAP targets that need precise control
  const gaugeBarRef = useRef<HTMLDivElement>(null);
  const gaugeTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    // ── initial hidden states ──────────────────────────────────────────────
    gsap.set(".judge-title", { opacity: 0, y: -24 });
    gsap.set(".unit-test-block", { opacity: 0, y: 20 });
    gsap.set(".deprecated-badge", { opacity: 0, scale: 0.8 });
    gsap.set(".strikethrough-bar", { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".llm-judge-block", { opacity: 0, y: 20 });
    gsap.set(".scorecard-header", { opacity: 0, y: 12 });
    gsap.set(".gauge-track", { opacity: 0 });
    gsap.set(".rubric-row", { opacity: 0, x: 20 });
    gsap.set(".verdict-block", { opacity: 0, scale: 0.85, y: 10 });

    // 0.3s — slide title
    timeline.to(".judge-title", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    }, 0.3);

    // 2s — unit-test block appears
    timeline.to(".unit-test-block", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    }, 2);

    // 3.2s — DEPRECATED badge pops in
    timeline.to(".deprecated-badge", {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
    }, 3.2);

    // 3.6s — strikethrough animates across
    timeline.to(".strikethrough-bar", {
      scaleX: 1,
      duration: 0.5,
      ease: "power2.inOut",
    }, 3.6);

    // 4s — unit-test fades to grey
    timeline.to(".unit-test-block", {
      opacity: 0.28,
      filter: "grayscale(1) brightness(0.55)",
      duration: 0.7,
      ease: "power2.inOut",
    }, 4);

    // 5s — LLM-Judge panel slides in
    timeline.to(".llm-judge-block", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    }, 5);

    // 7s — scorecard header + gauge track
    timeline
      .to(".scorecard-header", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 7)
      .to(".gauge-track", {
        opacity: 1,
        duration: 0.4,
      }, 7.3);

    // 7.5s → 12s — animated gauge bar fills to 93%
    const barEl = gaugeBarRef.current;
    const textEl = gaugeTextRef.current;
    if (barEl && textEl) {
      const counter = { val: 0 };
      timeline.fromTo(
        barEl,
        { width: "0%" },
        { width: "93%", duration: 4.5, ease: "power1.inOut" },
        7.5
      );
      timeline.to(
        counter,
        {
          val: 93,
          duration: 4.5,
          ease: "power1.inOut",
          onUpdate() {
            textEl.textContent = `${Math.round(counter.val)}%`;
          },
        },
        7.5
      );
    }

    // 9s / 10s / 11s — rubric rows reveal sequentially
    timeline.to(".rubric-row-0", {
      opacity: 1,
      x: 0,
      duration: 0.55,
      ease: "power2.out",
    }, 9);
    timeline.to(".rubric-row-1", {
      opacity: 1,
      x: 0,
      duration: 0.55,
      ease: "power2.out",
    }, 10);
    timeline.to(".rubric-row-2", {
      opacity: 1,
      x: 0,
      duration: 0.55,
      ease: "power2.out",
    }, 11);

    // 12.5s — verdict stamp
    timeline.to(".verdict-block", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.55)",
    }, 12.5);

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
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-6xl mx-auto overflow-hidden">

      {/* ── ambient glow ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 blur-[120px] opacity-15 rounded-full bg-primary" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-56 h-56 blur-[100px] opacity-10 rounded-full bg-primary" />

      {/* ── TITLE ────────────────────────────────────────────────────────── */}
      <div className="judge-title flex-none mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 border border-primary/30">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.18em] text-primary/70">
            Evaluation Strategy
          </p>
        </div>
        <h2 className="text-3xl md:text-[2.1rem] font-heading font-bold text-primary tracking-tight leading-tight">
          LLM-as-a-Judge
        </h2>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Replacing brittle unit tests with semantic evaluation at scale.
        </p>
      </div>

      {/* ── TWO-COLUMN BODY ──────────────────────────────────────────────── */}
      <div className="flex-1 grid md:grid-cols-2 gap-5 min-h-0">

        {/* ════════════════════════════════════════════════════════════════
            LEFT PANEL — Before & After
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* ── BEFORE: deprecated unit test ──────────────────────────── */}
          <div className="unit-test-block relative flex-none">
            {/* glass card */}
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">

              {/* card top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-white/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                </div>
                <span className="text-[10px] font-mono text-white/30 tracking-wider">
                  test/output.test.js
                </span>
                {/* DEPRECATED badge */}
                <span className="deprecated-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-[9px] font-sans font-bold uppercase tracking-widest">
                  ✕ Deprecated
                </span>
              </div>

              {/* code area */}
              <div className="relative p-4">
                <pre className="font-mono text-[11px] leading-relaxed text-white/35 select-none whitespace-pre">
{`// ❌ Exact-match test — FAILS for
//    semantically correct variations
describe("LLM output", () => {
  it("should return expected string", () => {
    const output = runModel(userQuery);
    expect(output).toEqual(
      "Exactly this string."
    ); // Fails: "This string exactly."
  });
});`}
                </pre>

                {/* animated strikethrough overlay */}
                <div
                  className="strikethrough-bar absolute top-1/2 left-4 right-4 h-[2px] -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(239,68,68,0.85) 0%, rgba(239,68,68,0.4) 100%)",
                    boxShadow: "0 0 8px rgba(239,68,68,0.4)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── AFTER: LLM Judge prompt panel ─────────────────────────── */}
          <div className="llm-judge-block flex-1 min-h-0">
            <div className="h-full bg-card/40 backdrop-blur-xl border border-primary/25 rounded-2xl overflow-hidden shadow-xl flex flex-col">

              {/* teal top accent line */}
              <div
                className="flex-none h-[3px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #a7dadb 0%, rgba(167,218,219,0.3) 70%, transparent 100%)",
                }}
              />

              {/* panel header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-primary/[0.04]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/10" />
                </div>
                <span className="text-[10px] font-mono text-primary/50 tracking-wider">
                  evaluator-prompt.txt
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary text-[9px] font-sans font-bold uppercase tracking-widest">
                  ● Active
                </span>
              </div>

              {/* prompt code */}
              <div className="flex-1 overflow-hidden p-4">
                <pre className="font-mono text-[11px] leading-[1.75] text-primary/75 whitespace-pre-wrap h-full">
{`SYSTEM: You are an impartial, expert
evaluator. Grade the AI's response
on the following rubric.

INPUT:   {user_query}
OUTPUT:  {app_response}

RUBRIC:
  1. Factuality   — no hallucinations
  2. Tone         — matches brand voice
  3. Completion   — all tasks addressed

Respond in JSON:
{
  "factuality": <1-5>,
  "tone":       <1-5>,
  "completion": <1-5>,
  "rationale":  "<string>"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT PANEL — Evaluation Scorecard
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col min-h-0">
          <div className="h-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">

            {/* teal top accent line */}
            <div
              className="flex-none h-[3px] w-full"
              style={{
                background:
                  "linear-gradient(90deg, #a7dadb 0%, rgba(167,218,219,0.25) 80%, transparent 100%)",
              }}
            />

            <div className="flex-1 flex flex-col p-5 gap-4 min-h-0 overflow-hidden">

              {/* ── scorecard header ──────────────────────────────────── */}
              <div className="scorecard-header flex-none">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-sans font-bold text-foreground tracking-wide">
                    Evaluation Results
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    GPT-4o · judge-v2
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Semantic quality across 3 rubric dimensions
                </p>
              </div>

              {/* ── animated gauge / score meter ──────────────────────── */}
              <div className="gauge-track flex-none bg-white/[0.04] border border-white/10 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                    Composite Score
                  </span>
                  <span
                    ref={gaugeTextRef}
                    className="text-xl font-heading font-bold text-primary tabular-nums"
                  >
                    0%
                  </span>
                </div>

                {/* track */}
                <div className="relative h-2.5 w-full rounded-full bg-white/8 overflow-hidden">
                  {/* fill bar */}
                  <div
                    ref={gaugeBarRef}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: "0%",
                      background:
                        "linear-gradient(90deg, rgba(167,218,219,0.7) 0%, #a7dadb 100%)",
                      boxShadow: "0 0 12px rgba(167,218,219,0.5)",
                    }}
                  />
                </div>

                {/* gauge tick labels */}
                <div className="flex justify-between mt-1.5">
                  {["0%", "25%", "50%", "75%", "100%"].map((t) => (
                    <span key={t} className="text-[9px] font-mono text-white/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── rubric rows ───────────────────────────────────────── */}
              <div className="flex flex-col gap-2.5 flex-none">
                {RUBRIC.map((item, i) => (
                  <div
                    key={item.label}
                    className={`rubric-row rubric-row-${i} flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/8`}
                  >
                    {/* check icon */}
                    <CheckCircle2 className="flex-none w-4 h-4 text-primary" />

                    {/* label block */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-sans font-semibold text-foreground leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5 truncate">
                        {item.sub}
                      </p>
                    </div>

                    {/* dots + text score */}
                    <div className="flex-none flex flex-col items-end gap-1">
                      <ScoreDots score={item.score} max={item.max} />
                      <span className="text-[10px] font-mono text-primary font-bold">
                        {item.score}/{item.max}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── spacer ────────────────────────────────────────────── */}
              <div className="flex-1" />

              {/* ── VERDICT stamp ─────────────────────────────────────── */}
              <div className="verdict-block flex-none">
                <div
                  className="relative flex items-center justify-center gap-3 px-5 py-4 rounded-xl overflow-hidden border border-primary/40 bg-primary/8"
                  style={{
                    boxShadow:
                      "0 0 24px rgba(167,218,219,0.12), inset 0 0 20px rgba(167,218,219,0.04)",
                  }}
                >
                  {/* faint radial glow behind */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(167,218,219,0.08) 0%, transparent 70%)",
                    }}
                  />

                  {/* stamp icon */}
                  <Scale className="flex-none w-5 h-5 text-primary" />

                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-primary/60">
                      Evaluator Verdict
                    </span>
                    <span className="text-lg font-heading font-black text-primary tracking-tight leading-tight">
                      PROMPT ACCEPTED
                    </span>
                  </div>

                  {/* corner stamp mark */}
                  <div className="absolute top-1.5 right-2.5 text-[9px] font-mono text-primary/30 uppercase tracking-wider rotate-3">
                    93 / 100
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
