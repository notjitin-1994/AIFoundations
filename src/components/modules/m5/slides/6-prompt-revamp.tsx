import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { Terminal, ChevronRight, Check } from "lucide-react";

export function PromptRevampSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // Show basic prompt
    timeline.fromTo(".basic-prompt", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0);
    
    // Typing out the advanced prompt
    timeline.fromTo(".advanced-cursor", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 3.5)
            .to(".advanced-prompt", { width: "100%", duration: 3, ease: "none" }, 4.0)
            .to(".advanced-cursor", { opacity: 0, duration: 0.1 }, 7.5);

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
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">
      
      <div className="text-center mb-6 md:mb-10 w-full shrink-0">
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 md:mb-2 tracking-tight">Prompt Engineering Revamp</h2>
        <p className="text-sm md:text-base text-white/60 font-light">Evolving instruction design into strict chain-of-thought execution.</p>
      </div>

      <div className="flex-1 w-full max-w-6xl flex flex-col md:flex-row gap-6 lg:gap-10 relative min-h-0 items-center justify-center">
        
        {/* LEFT COLUMN: Context & Naive Prompt */}
        <div className="w-full md:w-5/12 flex flex-col gap-4 lg:gap-6 shrink-0">
          
          <div className="p-4 md:p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3 w-full shadow-lg">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-primary/80 leading-relaxed text-left">
              <span className="font-semibold text-primary block mb-1 md:mb-1.5 text-sm md:text-base tracking-tight">Foundational examples only.</span>
              The prompts shown are basic starting points. You must research and define the specific production-grade prompt chain for your project. Brainstorm directly with your agent and harness to execute the strict requirements needed for your unique use case.
            </p>
          </div>

          {/* Basic User Prompt */}
          <div className="basic-prompt bg-black/60 border border-white/10 rounded-2xl p-4 md:p-5 shadow-lg">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <span className="text-xs md:text-sm font-bold text-white/50 uppercase tracking-widest">Naive Prompt</span>
            </div>
            <div className="pl-8 md:pl-11">
              <p className="text-sm md:text-base text-white/40 line-through decoration-red-500/50 leading-relaxed">
                "{data.promptRevamp.before}"
              </p>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Structured Chain-of-Thought */}
        <div className="w-full md:w-7/12 flex flex-col relative h-full max-h-[400px] min-h-[300px]">
          <div className="bg-[#0a0a0a] border border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(167,218,219,0.15)] flex flex-col h-full">
            
            <div className="bg-black border-b border-primary/20 px-4 py-3 flex items-center gap-2 shrink-0">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20" />
              <span className="ml-2 text-[10px] md:text-xs font-mono text-primary/60 flex items-center gap-1.5 md:gap-2">
                <Terminal className="w-3 h-3 md:w-3.5 md:h-3.5" /> executor.sh
              </span>
            </div>
            
            <div className="p-5 md:p-8 flex-1 overflow-y-auto">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-8 md:h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <div className="flex-1 font-mono text-xs md:text-sm text-primary/90 leading-relaxed relative">
                  <div className="advanced-prompt overflow-hidden whitespace-normal break-words w-0">
                    {data.promptRevamp.after}
                  </div>
                  <span className="advanced-cursor inline-block w-1.5 h-3 md:w-2 md:h-4 bg-primary animate-pulse ml-1 align-middle opacity-0" />
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
