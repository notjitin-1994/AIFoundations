import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { ShieldAlert, GitBranch, Activity, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BestPracticesSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    [0, 1, 2, 3].forEach((i) => {
      timeline.fromTo(`.card-${i}`, 
        { opacity: 0, y: 30, rotateX: 20 }, 
        { opacity: 1, y: 0, rotateX: 0, duration: 0.6, ease: "power2.out" },
        1.0 + (i * 1.5)
      )
      .call(() => setActiveIdx(i), [], 1.0 + (i * 1.5));
    });

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

  const practices = [
    { icon: GitBranch, title: "Version Control", desc: "Commit prompts and MCP definitions alongside code." },
    { icon: Activity, title: "Rate Limiting", desc: "Enforce strict token and API limits to prevent runaway loops." },
    { icon: ShieldAlert, title: "Zero Trust", desc: "Assume the agent will hallucinate dangerous commands." },
    { icon: Code2, title: "API Design", desc: "Build tools with narrow, strongly typed parameters." }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-6xl mx-auto overflow-hidden perspective-1000">
      
      <div className="text-center mb-10 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Production Guardrails</h2>
        <p className="text-white/60 font-light">Fundamental software engineering rules for <span className="text-primary font-medium">{data.title}</span>.</p>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          
          {practices.map((practice, i) => {
            const Icon = practice.icon;
            const isActive = activeIdx === i;
            return (
              <div 
                key={i} 
                className={cn(
                  `card-${i} bg-black/40 border p-6 rounded-2xl flex flex-col items-start transition-all duration-500 transform-style-3d`,
                  isActive ? "border-primary shadow-[0_0_30px_rgba(167,218,219,0.2)] bg-primary/5 scale-105" : "border-white/10"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-500",
                  isActive ? "bg-primary text-black" : "bg-white/5 text-white/50"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={cn("font-bold text-lg mb-2 transition-colors", isActive ? "text-primary" : "text-white")}>{practice.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{practice.desc}</p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
