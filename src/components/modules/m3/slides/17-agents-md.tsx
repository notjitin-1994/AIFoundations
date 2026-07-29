import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FileCode2, Scale, Target, ShieldCheck } from "lucide-react";

export function AgentsMdSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const centerIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && centerIconRef.current && card1Ref.current && card2Ref.current && card3Ref.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      
      timeline.fromTo(centerIconRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }, 2.0);
      
      timeline.fromTo(card1Ref.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 4.0);
      timeline.fromTo(card2Ref.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 6.0);
      timeline.fromTo(card3Ref.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 8.0);
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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-12 relative z-10 w-full shrink-0">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          System Prompt as Code
        </h2>
        <p className="text-primary/70 text-lg md:text-xl font-medium max-w-3xl mx-auto">
          Modern AI agents rely on Markdown documentation like AGENTS.md placed directly in your repository.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 w-full min-h-0">
        
        {/* Left: The Central File */}
        <div ref={centerIconRef} className="flex flex-col items-center justify-center w-64 h-64 bg-primary/20 rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(167,218,219,0.1)] shrink-0 relative">
          <div className="absolute -inset-4 bg-primary/10 blur-xl rounded-full" />
          <FileCode2 className="w-20 h-20 text-primary mb-4 relative z-10" />
          <div className="font-mono text-xl font-bold text-white relative z-10">AGENTS.md</div>
          <div className="text-xs text-primary/50 mt-2 font-mono uppercase tracking-widest relative z-10">Root Directory</div>
        </div>

        {/* Right: What it provides */}
        <div className="flex-1 flex flex-col justify-center gap-4 w-full">
          <div ref={card1Ref} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Global Rules & Ethics</h4>
              <p className="text-white/60 text-sm">Defines the baseline behavior, permitted actions, and ethical boundaries for all agents.</p>
            </div>
          </div>
          
          <div ref={card2Ref} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Style & Architecture Constraints</h4>
              <p className="text-white/60 text-sm">Forces the AI to write React, Python, or Markdown in your exact project style, not generic boilerplate.</p>
            </div>
          </div>
          
          <div ref={card3Ref} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Consistent Context</h4>
              <p className="text-white/60 text-sm">Replaces the need to copy-paste the same system prompt into your chat window every single session.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
