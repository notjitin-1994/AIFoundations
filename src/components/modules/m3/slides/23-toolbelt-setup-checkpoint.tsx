import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { CheckSquare, Terminal, LayoutDashboard, ArrowRight } from "lucide-react";

export function ToolbeltSetupCheckpointSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const nextUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Awesome. You've identified the exact tools your project needs. Now, it's time to build it. Before moving on to the knowledge check, open your chosen harness and configure the MCPs and tools you just documented. In the next module, The Engine Room, we will turn this connected environment on."
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && checklistRef.current && nextUpRef.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
      timeline.fromTo(checklistRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 2.0);
      timeline.fromTo(nextUpRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 7.0);
    }

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
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 md:py-8 max-w-5xl mx-auto items-center justify-center relative">
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-6 relative z-10 w-full">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-3 shadow-[0_0_30px_rgba(167,218,219,0.2)]">
          <CheckSquare className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight drop-shadow-md">
          Action Required: Toolbelt Setup
        </h2>
        <p className="text-primary/70 text-base md:text-lg font-medium max-w-2xl mx-auto">
          Take a moment to configure your local harness before proceeding.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Left: Checklist Status */}
        <div ref={checklistRef} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative flex flex-col items-start shadow-xl">
          <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/30">
            Current Status
          </div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" /> Environment Checklist
          </h3>
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-white/80">Harness installed and logged in</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
              <p className="text-sm font-medium text-white/80">Documented MCPs Configured</p>
            </div>
          </div>
        </div>

        {/* Right: Next Up */}
        <div ref={nextUpRef} className="bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-3xl p-6 relative flex flex-col items-start shadow-[0_0_50px_rgba(167,218,219,0.05)]">
          <div className="absolute top-4 right-4 bg-white/10 text-white/60 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
            Up Next
          </div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" /> Module 4: The Engine Room
          </h3>
          <p className="text-sm text-primary/70 mb-4 leading-relaxed">
            After completing the knowledge check, we will actually turn this connected environment on and explore true agentic autonomy.
          </p>
          <div className="space-y-3 w-full mt-auto">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <LayoutDashboard className="w-4 h-4 text-primary" /> 
              <span>Building autonomous agent loops</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
