import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { MessageSquare, XCircle, CheckCircle2, Sparkles } from "lucide-react";

export function EnrichingPromptsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const badPromptRef = useRef<HTMLDivElement>(null);
  const goodPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && badPromptRef.current && goodPromptRef.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      
      // Reveal the generic prompt
      timeline.fromTo(badPromptRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 3.0);
      
      // Reveal the enriched prompt
      timeline.fromTo(goodPromptRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 9.0);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 md:py-8 max-w-5xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-6 relative z-10 w-full shrink-0">
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight">
          Enriching the Prompt
        </h2>
        <p className="text-primary/70 text-base md:text-lg font-medium max-w-3xl mx-auto">
          To trigger these capabilities, explicitly instruct the AI to read the skill document before it acts.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 w-full max-w-4xl mx-auto relative z-10 justify-center pb-4">
        
        {/* Bad Prompt */}
        <div ref={badPromptRef} className="bg-black/50 border border-white/10 rounded-3xl p-5 relative flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <div className="text-white font-bold text-base">Generic Prompt</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-white/80 text-base">
            <span className="text-white">"Build a hero section component for our landing page."</span>
          </div>
          <div className="mt-3 text-sm text-white/50 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> 
            Result: AI hallucinates styling and ignores your design system.
          </div>
        </div>

        {/* Good Prompt */}
        <div ref={goodPromptRef} className="bg-primary/20 border border-primary/40 rounded-3xl p-5 relative flex flex-col shadow-[0_0_40px_rgba(167,218,219,0.1)]">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <div className="text-white font-bold text-base flex items-center gap-2">
              Enriched Prompt <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="bg-black/40 border border-primary/30 rounded-2xl p-4 font-mono text-white/90 text-base">
            <span className="text-white">"Build a hero section component for our landing page. </span>
            <span className="text-primary font-bold bg-primary/20 px-2 py-0.5 rounded">First, use the frontend-design skill</span>
            <span className="text-white"> to apply our spacing and animation tokens."</span>
          </div>
          <div className="mt-3 text-sm text-primary/80 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> 
            Result: AI uses RAG to read the skill, then outputs perfectly compliant code.
          </div>
        </div>

      </div>
    </div>
  );
}
