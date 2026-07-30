import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { User, BrainCircuit, Server, MessageSquare, ChevronRight } from "lucide-react";

export function FunctionCallingLoopSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const arrow1Ref = useRef<HTMLDivElement>(null);
  const arrow2Ref = useRef<HTMLDivElement>(null);
  const arrow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Here is the full execution loop. The LLM signals intent, a separate execution harness runs the actual function, and the result is fed back into the LLM to generate your final answer."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && 
      step1Ref.current && step2Ref.current && step3Ref.current && step4Ref.current &&
      arrow1Ref.current && arrow2Ref.current && arrow3Ref.current
    ) {
      // Intro
      timeline.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 0);
      
      // Step 1
      timeline.fromTo(step1Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 0.5);
      
      // Arrow 1 & Step 2 (LLM Intent)
      timeline.fromTo(arrow1Ref.current, { width: "0%", opacity: 0 }, { width: "100%", opacity: 1, duration: 0.4, ease: "power2.inOut" }, 1.5);
      timeline.fromTo(step2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 1.9);

      // Arrow 2 & Step 3 (Execution Harness)
      timeline.fromTo(arrow2Ref.current, { width: "0%", opacity: 0 }, { width: "100%", opacity: 1, duration: 0.4, ease: "power2.inOut" }, 3.5);
      timeline.fromTo(step3Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 3.9);
      timeline.to(step3Ref.current, { filter: "drop-shadow(0 0 20px rgba(167,218,219,0.4))", duration: 0.5, yoyo: true, repeat: 1 }, 4.5);

      // Arrow 3 & Step 4 (Final Synthesis)
      timeline.fromTo(arrow3Ref.current, { width: "0%", opacity: 0 }, { width: "100%", opacity: 1, duration: 0.4, ease: "power2.inOut" }, 6.5);
      timeline.fromTo(step4Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 6.9);
    }

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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          The Full Execution Loop
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          From prompt to final answer.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8 px-4 lg:px-8">
        
        {/* Step 1: User */}
        <div ref={step1Ref} className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center relative shadow-lg">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
            <User className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-2">1. Prompt</h3>
          <p className="text-sm font-medium text-white/90">&quot;Search for the latest AI news.&quot;</p>
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex shrink-0 items-center justify-start w-10 xl:w-16">
          <div ref={arrow1Ref} className="h-0.5 bg-primary/40 relative">
             <ChevronRight className="absolute -right-3 -top-2.5 w-5 h-5 text-primary/60" />
          </div>
        </div>

        {/* Step 2: LLM Intent */}
        <div ref={step2Ref} className="flex-1 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-3xl p-6 flex flex-col items-center text-center relative shadow-[0_0_30px_rgba(167,218,219,0.15)]">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/40">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">2. Intent</h3>
          <p className="text-[11px] font-mono text-primary/80 bg-black/40 px-3 py-2 rounded-lg text-left w-full">
            &#123;<br/>
            &nbsp;&nbsp;"call": "search"<br/>
            &#125;
          </p>
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex shrink-0 items-center justify-start w-10 xl:w-16">
          <div ref={arrow2Ref} className="h-0.5 bg-primary/40 relative">
             <ChevronRight className="absolute -right-3 -top-2.5 w-5 h-5 text-primary/60" />
          </div>
        </div>

        {/* Step 3: Execution */}
        <div ref={step3Ref} className="flex-1 bg-black/60 backdrop-blur-xl border border-white/20 border-dashed rounded-3xl p-6 flex flex-col items-center text-center relative shadow-inner">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/20">
            <Server className="w-6 h-6 text-white/60" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">3. Execute</h3>
          <p className="text-xs text-white/70">
            Harness calls the search API and retrieves raw results.
          </p>
        </div>

        {/* Arrow 3 */}
        <div className="hidden md:flex shrink-0 items-center justify-start w-10 xl:w-16">
          <div ref={arrow3Ref} className="h-0.5 bg-primary/40 relative">
             <ChevronRight className="absolute -right-3 -top-2.5 w-5 h-5 text-primary/60" />
          </div>
        </div>

        {/* Step 4: Final Synthesis */}
        <div ref={step4Ref} className="flex-1 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-3xl p-6 flex flex-col items-center text-center relative shadow-[0_0_30px_rgba(167,218,219,0.15)]">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/40">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">4. Synthesis</h3>
          <p className="text-xs font-medium text-white/90 bg-black/40 px-3 py-2 rounded-lg text-left w-full border border-primary/20">
            "Here is the latest AI news based on my search..."
          </p>
        </div>

      </div>
    </div>
  );
}
