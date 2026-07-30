import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { CheckSquare, Wrench, Globe, ArrowRight } from "lucide-react";

export function ProjectCheckpointSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);
  const nextUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "At this point, you should have your engine and your harness hooked up, connected, and ready to go. On the next screen, you'll complete the module knowledge check. After that, we'll dive into the next module, where we will explore the toolbelt. You'll learn how to connect your agent to the outside world, allowing it to retrieve and generate answers based on real-time data, rather than just its static training data."
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && checklistRef.current && nextUpRef.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
      timeline.fromTo(checklistRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 2.0);
      timeline.fromTo(nextUpRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 8.0);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 max-w-5xl mx-auto items-center justify-center relative">
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-6 relative z-10 w-full">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 mb-3 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
          <CheckSquare className="w-6 h-6 text-teal-400" />
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight drop-shadow-md">
          Setup Complete
        </h2>
        <p className="text-teal-100/70 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Ensure your engine and harness are connected and ready to go.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Left: Checklist Status */}
        <div ref={checklistRef} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative flex flex-col items-start shadow-xl">
          <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-teal-500/30">
            Current Status
          </div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-400" /> Environment Ready
          </h3>
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-sm font-medium text-white/80">LLM API Key configured</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0">
                <CheckSquare className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-sm font-medium text-white/80">CLI or Desktop Harness installed</p>
            </div>
          </div>
        </div>

        {/* Right: Next Up */}
        <div ref={nextUpRef} className="bg-teal-900/20 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-6 relative flex flex-col items-start shadow-[0_0_50px_rgba(45,212,191,0.05)]">
          <div className="absolute top-4 right-4 bg-white/10 text-white/60 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/10">
            Up Next
          </div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-teal-400" /> Module 3: The Toolbelt
          </h3>
          <p className="text-sm text-teal-100/70 mb-4 leading-relaxed">
            After completing the knowledge check, we will enhance your agent and connect it to the outside world.
          </p>
          <div className="space-y-3 w-full mt-auto">
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Wrench className="w-4 h-4 text-teal-400" /> 
              <span>Real-time tool usage</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Globe className="w-4 h-4 text-teal-400" /> 
              <span>Dynamic data retrieval beyond training sets</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
