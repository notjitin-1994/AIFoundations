import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Brain, Wrench, GitMerge, Server } from "lucide-react";

export function JourneySlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    timeline.set(".milestone", { opacity: 0, scale: 0.8, y: 20 });
    timeline.set(".journey-line", { scaleY: 0, transformOrigin: "top" });
    
    // "Look how far you've come." (0-3s)
    timeline.to(".journey-title", { opacity: 1, duration: 1, ease: "power3.out" }, 0.5);
    
    // "From understanding tokens and context windows," (3-6s)
    timeline.to(".journey-line", { scaleY: 0.25, duration: 1, ease: "none" }, 3)
            .to(".milestone-1", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 3.5);
            
    // "to wiring tools and MCPs," (6-9s)
    timeline.to(".journey-line", { scaleY: 0.5, duration: 1, ease: "none" }, 6)
            .to(".milestone-2", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 6.5);
            
    // "to orchestrating autonomous agents," (9-12s)
    timeline.to(".journey-line", { scaleY: 0.75, duration: 1, ease: "none" }, 9)
            .to(".milestone-3", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 9.5);
            
    // "and finally deploying robust LLMOps. You are now an AI Engineer." (12-18s)
    timeline.to(".journey-line", { scaleY: 1, duration: 1, ease: "none" }, 12)
            .to(".milestone-4", { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }, 12.5)
            .to(".engineer-badge", { opacity: 1, scale: 1, rotation: 360, duration: 1, ease: "elastic.out(1, 0.4)" }, 14);

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
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-4xl mx-auto overflow-hidden">
      
      <div className="journey-title opacity-0 text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">The Journey</h2>
      </div>

      <div className="flex-1 relative flex justify-center py-4">
        
        {/* The central line */}
        <div className="absolute top-0 bottom-12 w-1 bg-white/10 left-1/2 -translate-x-1/2">
          <div className="journey-line w-full h-full bg-gradient-to-b from-indigo-500 via-teal-500 to-rose-500" />
        </div>

        <div className="w-full max-w-2xl relative flex flex-col justify-between z-10">
          
          <div className="milestone milestone-1 flex items-center justify-end w-[calc(50%-1.5rem)] ml-auto mr-auto pl-[50%] relative">
            <div className="absolute right-[calc(100%+1.5rem)] text-right w-48">
              <h3 className="font-bold text-indigo-300">The LLM Brain</h3>
              <p className="text-xs text-white/50">Tokens & Context</p>
            </div>
            <div className="absolute -left-5 w-10 h-10 rounded-full bg-indigo-900 border-2 border-indigo-400 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-300" />
            </div>
          </div>

          <div className="milestone milestone-2 flex items-center justify-start w-[calc(50%-1.5rem)] ml-auto mr-auto pr-[50%] relative">
            <div className="absolute left-[calc(100%+1.5rem)] text-left w-48">
              <h3 className="font-bold text-teal-300">The Toolbelt</h3>
              <p className="text-xs text-white/50">RAG & MCP</p>
            </div>
            <div className="absolute -right-5 w-10 h-10 rounded-full bg-teal-900 border-2 border-teal-400 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-teal-300" />
            </div>
          </div>

          <div className="milestone milestone-3 flex items-center justify-end w-[calc(50%-1.5rem)] ml-auto mr-auto pl-[50%] relative">
            <div className="absolute right-[calc(100%+1.5rem)] text-right w-48">
              <h3 className="font-bold text-amber-300">The Assembly Line</h3>
              <p className="text-xs text-white/50">Multi-Agent Workflows</p>
            </div>
            <div className="absolute -left-5 w-10 h-10 rounded-full bg-amber-900 border-2 border-amber-400 flex items-center justify-center">
              <GitMerge className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          <div className="milestone milestone-4 flex items-center justify-start w-[calc(50%-1.5rem)] ml-auto mr-auto pr-[50%] relative">
            <div className="absolute left-[calc(100%+1.5rem)] text-left w-48">
              <h3 className="font-bold text-rose-300">LLMOps</h3>
              <p className="text-xs text-white/50">Production Reliability</p>
            </div>
            <div className="absolute -right-5 w-10 h-10 rounded-full bg-rose-900 border-2 border-rose-400 flex items-center justify-center">
              <Server className="w-5 h-5 text-rose-300" />
            </div>
          </div>

        </div>

      </div>
      
      <div className="engineer-badge opacity-0 mt-4 text-center">
        <span className="inline-block px-6 py-2 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          AI Engineer
        </span>
      </div>

    </div>
  );
}
