import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { CheckCircle2, Bot, Layers, Wrench, FileText, FastForward, Database } from "lucide-react";

export function RecapSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.fromTo(".fade-up", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }
    );

    const timeline = gsap.timeline({ paused: true });
    
    // "You know how to set up your harness..." (0-2s)
    // "wire tools and MCPs..." (2-4s)
    // "provide context..." (4-6s)
    // "and structure prompts." (6-8s)
    // "Now, we put it all to the test for your [Title]." (8s+)

    timeline.to(".step-1", { opacity: 1, x: 0, duration: 0.5 }, 1.0)
            .to(".step-2", { opacity: 1, x: 0, duration: 0.5 }, 3.0)
            .to(".step-3", { opacity: 1, x: 0, duration: 0.5 }, 5.0)
            .to(".step-4", { opacity: 1, x: 0, duration: 0.5 }, 7.0)
            .to(".final-reveal", { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 9.0);

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
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">
      <div className="fade-up text-center mb-10 w-full shrink-0">
        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Phase 1 Complete</h2>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Foundation Secured</h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light">
          You've mastered the core pillars of agentic engineering.
        </p>
      </div>

      <div className="flex-1 w-full flex flex-col md:flex-row gap-6 items-center justify-center relative min-h-0">
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
          <div className="step-1 opacity-0 -translate-x-10 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Layers className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-sm font-bold text-white">Harness Setup</h3>
          </div>
          <div className="step-2 opacity-0 -translate-x-10 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Wrench className="w-8 h-8 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Tools & MCPs</h3>
          </div>
          <div className="step-3 opacity-0 -translate-x-10 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <Database className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Context Injection</h3>
          </div>
          <div className="step-4 opacity-0 -translate-x-10 bg-black/40 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <FileText className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Structured Prompts</h3>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center px-4">
          <FastForward className="w-8 h-8 text-white/20" />
        </div>

        <div className="final-reveal opacity-0 scale-95 w-full md:w-1/2 bg-gradient-to-br from-primary/20 to-indigo-600/20 border border-primary/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(167,218,219,0.15)]">
          <div className="absolute inset-0 bg-[url('/courses/aifoundations-concept2application/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
          <Bot className="w-12 h-12 text-primary mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">{data.title}</h2>
          <p className="text-white/70 text-sm relative z-10">{data.description}</p>
          <div className="mt-6 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Ready for Assembly</span>
          </div>
        </div>

      </div>
    </div>
  );
}
