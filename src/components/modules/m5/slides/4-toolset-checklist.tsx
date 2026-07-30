import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { Wrench, Network, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToolsetChecklistSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const [activeNode, setActiveNode] = useState<number>(-1);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // Animate central hub
    timeline.fromTo(".hub", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, 0.5);
    
    // Connect nodes sequentially
    data.toolsetChecklist.forEach((_, i) => {
      timeline.fromTo(`.node-${i}`, 
        { opacity: 0, scale: 0.8, x: -30 }, 
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "power2.out" }, 
        1.0 + (i * 0.8)
      )
      .fromTo(`.line-${i}`, 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 0.3 }, 
        "-=0.2"
      )
      .call(() => setActiveNode(i), [], "-=0.1");
    });
    
    timeline.call(() => setActiveNode(-1), [], "+=0.5");

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, [data.toolsetChecklist]);

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
      
      <div className="text-center mb-4 md:mb-6 w-full shrink-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">Toolset Architecture</h2>
        <p className="text-xs md:text-sm text-white/60 font-light">
          Required capabilities and MCP integrations for <span className="text-primary font-medium">{data.title}</span>.
        </p>
      </div>

      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center gap-4 md:gap-6 relative min-h-0">
        
        {/* Tools Row */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-2 md:gap-4 w-full z-10 shrink-0">
          {data.toolsetChecklist.map((tool, i) => (
            <div key={i} className={`node-${i} flex-1 flex flex-col items-center justify-center`}>
              <div className={cn(
                "bg-black/60 border rounded-xl p-3 md:p-4 flex flex-col items-center gap-2 transition-all duration-300 w-full shadow-lg relative group h-full",
                activeNode === i ? "border-primary shadow-[0_0_20px_rgba(167,218,219,0.3)] bg-primary/10 scale-[1.02]" : "border-white/10 hover:bg-white/5"
              )}>
                <div className={cn(
                  "p-2 md:p-2.5 rounded-lg shrink-0 transition-colors",
                  activeNode === i ? "bg-primary/20 text-primary" : "bg-white/5 text-white/60 group-hover:text-white/80"
                )}>
                  <Wrench className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-white text-center leading-snug">{tool}</span>
                
                {/* Visual Connection line placeholder on desktop */}
                <div className="hidden md:block absolute -bottom-5 left-1/2 -translate-x-1/2 w-px h-5 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Central MCP Hub */}
        <div className="w-full flex flex-col items-center justify-center relative shrink-0">
          <div className="hub relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-indigo-500/30 bg-indigo-500/5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border border-indigo-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <Network className="w-4 h-4 md:w-6 md:h-6 text-indigo-400 mb-0.5" />
              <span className="text-[7px] md:text-[9px] font-mono font-bold text-white uppercase tracking-widest">MCP Core</span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-1 md:mt-2 p-2.5 md:p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2 w-full max-w-4xl shrink-0 z-20">
          <Wrench className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] md:text-xs text-primary/80 leading-relaxed text-left">
            <span className="font-semibold text-primary block mb-0.5">These are foundational examples.</span>
            The integrations above are basic starting points. You must research and define the specific production-grade tools for your project. Brainstorm directly with your agent and harness to discover and set up the complete toolset needed for your unique use case.
          </p>
        </div>

      </div>
    </div>
  );
}
