import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FileText, MessageSquareQuote, Wrench } from "lucide-react";

export function McpComponentsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "An MCP Server exposes three main capabilities to the LLM: Resources, which provide context like file contents; Prompts, which are reusable templates; and Tools, which are executable functions. This standardizes the entire AI workflow."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && card1Ref.current && card2Ref.current && card3Ref.current
    ) {
      // 1. Resources (approx 5.5s)
      timeline.fromTo(card1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 5.5);
      
      // 2. Prompts (approx 9.5s)
      timeline.fromTo(card2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 9.5);
      
      // 3. Tools (approx 13.0s)
      timeline.fromTo(card3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }, 13.0);

      // Flash all to emphasize standardization (approx 17.5s)
      timeline.to([card1Ref.current, card2Ref.current, card3Ref.current], {
        y: -10,
        filter: "drop-shadow(0 0 30px rgba(167,218,219,0.3))",
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        stagger: 0.1
      }, 17.5);
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
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-16 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          The Three Pillars
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          What an MCP Server exposes.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-center gap-8">
        
        {/* Card 1: Resources */}
        <div ref={card1Ref} className="flex-1 max-w-[300px] h-[350px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center opacity-0 group/card hover:border-primary/50 transition-colors">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/30 group-hover/card:bg-primary/20 transition-colors">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Resources</h3>
          <p className="text-sm text-white/60 font-medium">
            Provides static context, like file contents or database records.
          </p>
          <div className="mt-auto w-full bg-black/50 border border-white/5 rounded-lg py-2">
            <span className="text-[10px] font-mono text-primary/60">file://logs/error.log</span>
          </div>
        </div>

        {/* Card 2: Prompts */}
        <div ref={card2Ref} className="flex-1 max-w-[300px] h-[350px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center opacity-0 group/card hover:border-primary/50 transition-colors">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/30 group-hover/card:bg-primary/20 transition-colors">
            <MessageSquareQuote className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Prompts</h3>
          <p className="text-sm text-white/60 font-medium">
            Reusable, parameterized templates for common interactions.
          </p>
          <div className="mt-auto w-full bg-black/50 border border-white/5 rounded-lg py-2">
            <span className="text-[10px] font-mono text-primary/60">git_commit_template</span>
          </div>
        </div>

        {/* Card 3: Tools */}
        <div ref={card3Ref} className="flex-1 max-w-[300px] h-[350px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center opacity-0 group/card hover:border-primary/50 transition-colors">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/30 group-hover/card:bg-primary/20 transition-colors">
            <Wrench className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Tools</h3>
          <p className="text-sm text-white/60 font-medium">
            Executable functions that allow the LLM to take action.
          </p>
          <div className="mt-auto w-full bg-black/50 border border-white/5 rounded-lg py-2">
            <span className="text-[10px] font-mono text-primary/60">execute_query(sql)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
