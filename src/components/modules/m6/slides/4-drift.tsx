import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { AlertTriangle, Users, Cpu } from "lucide-react";

// ─── Bar data ─────────────────────────────────────────────────────────────────
const BARS = [
  { height: 90, color: "#a7dadb", label: "W1" },  // teal – healthy
  { height: 88, color: "#a7dadb", label: "W2" },
  { height: 92, color: "#a7dadb", label: "W3" },
  { height: 85, color: "#a7dadb", label: "W4" },
  { height: 60, color: "#f59e0b", label: "W5" },  // amber – declining
  { height: 55, color: "#f59e0b", label: "W6" },
  { height: 30, color: "#ef4444", label: "W7" },  // red – danger (semantic only)
  { height: 25, color: "#ef4444", label: "W8" },
];

const CHART_H = 140; // px — fixed chart height to stay canvas-safe

export function DriftSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  // ── Refs for targeted animations ──────────────────────────────────────────
  const titleRef   = useRef<HTMLDivElement>(null);
  const cause1Ref  = useRef<HTMLDivElement>(null);
  const cause2Ref  = useRef<HTMLDivElement>(null);
  const barsRef    = useRef<HTMLDivElement[]>([]);
  const warningRef = useRef<HTMLDivElement>(null);
  const pillRef    = useRef<HTMLDivElement>(null);
  const resultRef  = useRef<HTMLDivElement>(null);

  // ── Build GSAP timeline ───────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });

      // Initial hidden state
      gsap.set(titleRef.current,   { opacity: 0, y: 16 });
      gsap.set(cause1Ref.current,  { opacity: 0, x: -24 });
      gsap.set(cause2Ref.current,  { opacity: 0, x: -24 });
      gsap.set(barsRef.current,    { scaleY: 0, transformOrigin: "bottom center" });
      gsap.set(warningRef.current, { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(pillRef.current,    { opacity: 0, y: 8 });
      gsap.set(resultRef.current,  { opacity: 0, y: 10 });

      // 0.5s — title reveal
      timeline.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      }, 0.5);

      // 2.5s — User Drift card slides in
      timeline.to(cause1Ref.current, {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
      }, 2.5);

      // 5.5s — Model Drift card slides in
      timeline.to(cause2Ref.current, {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
      }, 5.5);

      // 9s — bars stagger in from bottom
      timeline.to(barsRef.current, {
        scaleY: 1,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.12,
      }, 9);

      // 11s — warning icon slams in
      timeline.to(warningRef.current, {
        opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)",
      }, 11);

      // Brief shake
      timeline.to(warningRef.current, {
        rotation: 8, duration: 0.08, ease: "power1.inOut",
        yoyo: true, repeat: 5,
      }, 11.45);

      // 11.1s — pill label appears
      timeline.to(pillRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
      }, 11.1);

      // 12.5s — bottom note fades in
      timeline.to(resultRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      }, 12.5);

      tl.current = timeline;
    });

    return () => ctx.revert();
  }, []);

  // ── Sync with narration playback ──────────────────────────────────────────
  useEffect(() => {
    if (!tl.current) return;
    if (isPlaying) tl.current.play();
    else tl.current.pause();
  }, [isPlaying]);

  // ── Nav override ──────────────────────────────────────────────────────────
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

  // ── Bar ref collector ─────────────────────────────────────────────────────
  const setBarRef = (el: HTMLDivElement | null, i: number) => {
    if (el) barsRef.current[i] = el;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">

      {/* ── Ambient glow (purely decorative) ────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-60px] left-[30%] w-72 h-72
                   rounded-full bg-primary/10 blur-[90px] opacity-60"
      />

      {/* ── Title ────────────────────────────────────────────────────────── */}
      <div ref={titleRef} className="shrink-0 mb-5 z-10">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-white tracking-tight
                     leading-tight mb-1"
        >
          The Danger of{" "}
          <span className="text-primary">Drift</span>
        </h2>
        <p className="text-sm text-white/50 font-light">
          Why &ldquo;set and forget&rdquo; fails silently in production AI.
        </p>
      </div>

      {/* ── Two-column body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row gap-5 min-h-0 overflow-hidden">

        {/* ═══ LEFT 45% — drift-cause glass cards ═══════════════════════ */}
        <div className="flex flex-col gap-4 md:w-[45%] shrink-0 justify-center">

          {/* User Drift card */}
          <div
            ref={cause1Ref}
            className="relative overflow-hidden rounded-2xl border border-white/10
                       bg-card/40 backdrop-blur-xl p-5 shadow-lg"
          >
            {/* LEFT edge accent — full teal (bg-primary) */}
            <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-primary" />

            <div className="pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/25
                             flex items-center justify-center shrink-0"
                >
                  <Users className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-white">User Drift</h3>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">
                Users begin phrasing questions differently, or a new demographic
                adopts the app. Your prompt was optimised only for the original
                cohort — its assumptions quietly break.
              </p>
            </div>
          </div>

          {/* Model Drift card */}
          <div
            ref={cause2Ref}
            className="relative overflow-hidden rounded-2xl border border-white/10
                       bg-card/40 backdrop-blur-xl p-5 shadow-lg"
          >
            {/* LEFT edge accent — lighter teal (bg-primary/60) */}
            <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-primary/60" />

            <div className="pl-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20
                             flex items-center justify-center shrink-0"
                >
                  <Cpu className="w-3.5 h-3.5 text-primary/80" />
                </div>
                <h3 className="text-sm font-bold text-white">Model Drift</h3>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">
                The API provider silently updates their weights. The same{" "}
                <code
                  className="text-primary/90 bg-primary/10 px-1 py-0.5
                             rounded font-mono text-[10px]"
                >
                  gpt-4o
                </code>{" "}
                endpoint now responds with a subtly different tone or structure —
                no changelog, no warning.
              </p>
            </div>
          </div>

        </div>

        {/* ═══ RIGHT 55% — premium glass monitoring dashboard ════════════ */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          <div
            className="flex-1 flex flex-col rounded-2xl border border-white/10
                       bg-card/40 backdrop-blur-xl p-5 shadow-xl overflow-hidden"
          >

            {/* Dashboard title row with pulsing teal dot */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full
                             rounded-full bg-primary opacity-70"
                />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                Live Quality Monitor
              </span>
            </div>

            {/* ── Chart area ─────────────────────────────────────────── */}
            <div className="relative flex flex-col flex-1 min-h-0 overflow-hidden">

              {/* Y-axis label */}
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90
                           text-[10px] text-white/30 tracking-widest uppercase
                           pointer-events-none select-none"
                style={{ transformOrigin: "center center" }}
              >
                Quality
              </span>

              {/* Chart body */}
              <div
                className="flex-1 ml-5 min-h-0 relative"
                style={{ height: `${CHART_H}px`, maxHeight: `${CHART_H}px` }}
              >
                {/* Subtle grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                  {[100, 75, 50, 25].map((pct) => (
                    <div
                      key={pct}
                      className="w-full border-t border-white/[0.06] relative"
                    >
                      <span className="absolute -top-3 -left-5 text-[9px] text-white/25">
                        {pct}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bars — red is SEMANTIC (danger indicator), never brand */}
                <div
                  className="absolute inset-0 flex items-end gap-[5px] px-1"
                  style={{ height: `${CHART_H}px` }}
                >
                  {BARS.map((bar, i) => (
                    <div
                      key={bar.label}
                      className="flex-1 flex flex-col justify-end"
                      style={{ height: "100%" }}
                    >
                      <div
                        ref={(el) => setBarRef(el, i)}
                        className="w-full rounded-t-sm"
                        style={{
                          height: `${bar.height}%`,
                          backgroundColor: bar.color,
                          boxShadow: `0 0 8px ${bar.color}55`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Warning icon — appears at 11s */}
                <div
                  ref={warningRef}
                  className="absolute right-2 top-2 z-20"
                >
                  <div
                    className="w-8 h-8 rounded-xl bg-destructive/15 border border-destructive/30
                               flex items-center justify-center"
                    style={{ boxShadow: "0 0 18px rgba(239,68,68,0.30)" }}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                </div>

              </div>

              {/* X-axis label row */}
              <div className="flex items-center justify-between mt-1.5 ml-5 shrink-0">
                <div className="flex gap-[5px] flex-1 px-1">
                  {BARS.map((bar) => (
                    <span key={bar.label} className="flex-1 text-center text-[9px] text-white/25">
                      {bar.label}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-white/25 ml-1 whitespace-nowrap">
                  Time →
                </span>
              </div>

            </div>

            {/* ── 'Silent Degradation Detected' teal glass pill ─────── */}
            <div
              ref={pillRef}
              className="mt-3 shrink-0 flex items-center justify-center"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                           border border-primary/30 bg-primary/10 backdrop-blur-sm"
              >
                <AlertTriangle className="w-3 h-3 text-primary shrink-0" />
                <span className="text-xs font-semibold text-primary tracking-wide">
                  Silent Degradation Detected
                </span>
              </div>
            </div>

            {/* ── Bottom note about observability tools ─────────────── */}
            <div
              ref={resultRef}
              className="mt-3 shrink-0 rounded-xl border border-primary/15
                         bg-primary/5 px-4 py-2.5"
            >
              <p className="text-[11px] text-white/50 leading-relaxed text-center">
                Without continuous observability via{" "}
                <span className="text-primary/80 font-semibold">LangSmith</span>{" "}
                or{" "}
                <span className="text-primary/80 font-semibold">Langfuse</span>
                , this drop happens silently in production — no alerts, no logs,
                just quietly broken user experiences.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
