import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Coins, Globe2, Cpu } from "lucide-react";

export function TokenEconomicsSlide() {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const costCardRef = useRef<HTMLDivElement>(null);
  const languageCardRef = useRef<HTMLDivElement>(null);
  const limitCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Why does this distinction matter? Because every token has a cost. You are billed per token, both for input and output. Furthermore, tokens are heavily biased towards English. A single sentence in English might be five tokens, but translating that exact sentence to Hindi or Japanese could cost twenty tokens. Finally, tokens define the absolute limit of what the model can remember at once."
    const timeline = gsap.timeline({ paused: true });
    
    if (costCardRef.current && languageCardRef.current && limitCardRef.current) {
      // "Because every token has a cost" (~2.5s)
      timeline.fromTo(costCardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5);
      
      // "heavily biased towards English" (~8s)
      timeline.fromTo(languageCardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 8);
      
      // "absolute limit of what the model can remember" (~18s)
      timeline.fromTo(limitCardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 17.5);
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


  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto">
      <div className="shrink-0 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">Why Token Count Matters</h2>
        <p className="text-lg text-muted-foreground">Tokens are the fundamental unit of compute, memory, and billing.</p>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col lg:flex-row items-center justify-center w-full gap-6 lg:gap-8" ref={containerRef}>
        
        {/* Cost Card */}
        <div ref={costCardRef} className="w-full max-w-sm bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(167,218,219,0.1)] opacity-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Coins className="w-24 h-24 text-primary" />
          </div>
          <Coins className="w-10 h-10 text-primary mb-6 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
          <h3 className="text-2xl font-bold text-foreground mb-3">Financial Cost</h3>
          <p className="text-primary/80 leading-relaxed font-medium">
            API usage is billed strictly by tokens, not words. The more tokens you send and receive, the more you pay.
          </p>
        </div>

        {/* Language Bias Card */}
        <div ref={languageCardRef} className="w-full max-w-sm bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(167,218,219,0.1)] opacity-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Globe2 className="w-24 h-24 text-primary" />
          </div>
          <Globe2 className="w-10 h-10 text-primary mb-6 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
          <h3 className="text-2xl font-bold text-foreground mb-3">The Non-English Tax</h3>
          <p className="text-primary/80 leading-relaxed font-medium">
            Tokenizers are optimized for English. The exact same sentence translated to Hindi or Japanese can consume 3x to 5x more tokens.
          </p>
        </div>

        {/* Context Limits Card */}
        <div ref={limitCardRef} className="w-full max-w-sm bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(167,218,219,0.1)] opacity-0 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Cpu className="w-24 h-24 text-primary" />
          </div>
          <Cpu className="w-10 h-10 text-primary mb-6 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
          <h3 className="text-2xl font-bold text-foreground mb-3">Memory Limits</h3>
          <p className="text-primary/80 leading-relaxed font-medium">
            A model&apos;s context window is a hard token limit. Once you exceed it, the model physically cannot see the earliest parts of the conversation.
          </p>
        </div>

      </div>
    </div>
  );
}
