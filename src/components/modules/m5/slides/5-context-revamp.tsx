import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { Database, AlertCircle, Sparkles } from "lucide-react";

export function ContextRevampSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // "Now, let's inject rich context." (0-2s)
    timeline.fromTo(".before-card", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, 0.5);
    
    // "A generic system prompt won't work." (2-5s)
    timeline.to(".before-card", { filter: "grayscale(1) opacity(0.5)", duration: 0.5 }, 3.0);
    
    // "We need to ground the model in your specific domain." (5-8s)
    timeline.fromTo(".after-card", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6 }, 5.0)
            .fromTo(".glow-effect", { opacity: 0 }, { opacity: 1, duration: 1.0 }, 5.5);

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
      }
    });
    return () => setNavOverride(null);
  }, [isFinished, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-6xl mx-auto overflow-hidden">
      
      <div className="text-center mb-8 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Context Engineering</h2>
        <p className="text-white/60 font-light">Upgrading the system prompt for <span className="font-medium text-primary">{data.title}</span>.</p>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 relative min-h-0">
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-6 relative min-h-0 flex-1">
          {/* Before */}
          <div className="before-card w-full md:w-1/2 flex flex-col bg-red-950/20 border border-red-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="bg-black/40 border-b border-red-500/20 p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-mono text-xs text-red-400 uppercase tracking-widest font-bold">Generic System Prompt (Zero-Shot)</h3>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center min-h-0 overflow-y-auto">
              <p className="font-mono text-sm text-white/50 leading-relaxed text-center">
                "{data.contextRevamp.before}"
              </p>
            </div>
          </div>

          {/* After */}
          <div className="after-card relative w-full md:w-1/2 flex flex-col bg-primary/5 border border-primary/30 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="glow-effect absolute inset-0 bg-primary/10 shadow-[0_0_40px_rgba(167,218,219,0.2)] pointer-events-none" />
            <div className="bg-black/40 border-b border-primary/20 p-4 flex items-center gap-3 relative z-10">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-mono text-xs text-primary uppercase tracking-widest font-bold">Enriched Context Pipeline</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center relative z-10 min-h-0 overflow-y-auto">
              <div className="mb-4 inline-flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/10 w-fit shrink-0">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-mono">Dynamic Injection: {data.contextRevamp.title}</span>
              </div>
              <p className="font-mono text-sm md:text-base text-white/90 leading-relaxed">
                {data.contextRevamp.after}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3 w-full shrink-0">
          <Database className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-primary/80 leading-relaxed text-left">
            <span className="font-semibold text-primary block mb-0.5 md:mb-1">These are foundational examples.</span>
            The context elements above are basic starting points. You must research and define the specific production-grade context schema for your project. Brainstorm directly with your agent and harness to discover and inject the precise context needed for your unique use case.
          </p>
        </div>
      </div>
    </div>
  );
}
