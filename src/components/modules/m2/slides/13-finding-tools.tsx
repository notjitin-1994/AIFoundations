import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Zap, LayoutTemplate } from "lucide-react";

export function FindingToolsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "If you're wondering how to find the best stack for your project, don't worry. The ecosystem is moving fast, but the strategy is simple. For this project tie in, you just need two things. First, select a foundation model known for strong function-calling capabilities. Then, choose a CLI harness or desktop application to host your agent. We will tackle the rest of the toolbelt in the next module."
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && card1Ref.current && card2Ref.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
      
      timeline.fromTo(card1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 2.0);
      timeline.fromTo(card2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 4.0);
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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group items-center justify-center">
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={headerRef} className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          Assembling Your Stack
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          How to find the best models and harnesses.
        </p>
      </div>

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Models */}
        <div ref={card1Ref} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative flex flex-col items-center text-center shadow-xl hover:border-teal-500/50 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">1. The Engine</h3>
          <p className="text-sm text-white/60 mb-6">
            Search for foundation models that excel at <strong>function calling</strong>. You pay per-token, so look for "Flash" or "Haiku" class models for cost-efficiency.
          </p>
          <div className="mt-auto flex gap-2">
            <span className="text-[10px] uppercase font-bold text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">Anthropic API</span>
            <span className="text-[10px] uppercase font-bold text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">OpenAI API</span>
          </div>
        </div>

        {/* Card 2: Harnesses */}
        <div ref={card2Ref} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative flex flex-col items-center text-center shadow-xl hover:border-teal-500/50 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <LayoutTemplate className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">2. The Harness</h3>
          <p className="text-sm text-white/60 mb-6">
            You need an environment to run the agent. Search for <strong>Desktop AI assistants</strong> or <strong>CLI AI coding tools</strong> that natively support MCP.
          </p>
          <div className="mt-auto flex gap-2 flex-wrap justify-center">
            <span className="text-[10px] uppercase font-bold text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">Antigravity</span>
            <span className="text-[10px] uppercase font-bold text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">Claude Desktop</span>
            <span className="text-[10px] uppercase font-bold text-teal-400/80 bg-teal-500/10 px-2 py-1 rounded">Cline</span>
          </div>
        </div>

      </div>
    </div>
  );
}
