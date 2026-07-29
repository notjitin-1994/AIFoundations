import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Terminal, Download, Cpu } from "lucide-react";

export function EnhancingHarnessSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const rawHarnessRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const superHarnessRef = useRef<HTMLDivElement>(null);
  const floatersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && rawHarnessRef.current && arrowRef.current && superHarnessRef.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      
      // Reveal the generic harness
      timeline.fromTo(rawHarnessRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, 2.0);
      
      // Skills flowing in
      floatersRef.current.forEach((floater, i) => {
        if (floater) {
          timeline.fromTo(floater, 
            { opacity: 0, y: -50, scale: 0 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, 
            5.0 + (i * 0.8)
          );
        }
      });

      // Arrow and transformation
      timeline.fromTo(arrowRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, 8.0);
      timeline.fromTo(superHarnessRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "elastic.out(1, 0.7)" }, 9.0);
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
      <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-16 relative z-10 w-full shrink-0">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          Enhancing the Harness
        </h2>
        <p className="text-primary/70 text-lg md:text-xl font-medium max-w-3xl mx-auto">
          By installing skills into your workspace, you transform a generic assistant into a specialized team member.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 relative z-10 w-full min-h-0">
        
        {/* Left: Generic Harness */}
        <div ref={rawHarnessRef} className="flex flex-col items-center p-6 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md relative">
          <Terminal className="w-16 h-16 text-white/40 mb-4" />
          <div className="text-xl font-bold text-white mb-1">Generic Harness</div>
          <div className="text-sm text-white/40">Blank Slate</div>
          
          {/* Floaters falling into it */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-4">
            <div ref={el => { if(el) floatersRef.current[0] = el; }} className="bg-primary/20 border border-primary/30 text-primary text-[10px] font-mono px-3 py-1 rounded-full shadow-lg">
              AGENTS.md
            </div>
            <div ref={el => { if(el) floatersRef.current[1] = el; }} className="bg-primary/20 border border-primary/30 text-primary text-[10px] font-mono px-3 py-1 rounded-full shadow-lg">
              SKILL.md
            </div>
          </div>
        </div>

        {/* Middle: Transformation Arrow */}
        <div ref={arrowRef} className="flex flex-col items-center justify-center">
          <div className="w-16 h-1 bg-gradient-to-r from-white/10 to-primary/50 rounded-full relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-primary/50 rotate-45 transform origin-center" />
          </div>
        </div>

        {/* Right: Specialized Agent */}
        <div ref={superHarnessRef} className="flex flex-col items-center p-8 border border-primary rounded-3xl bg-primary/20 backdrop-blur-md shadow-[0_0_50px_rgba(167,218,219,0.2)]">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/50 shadow-inner">
            <Cpu className="w-10 h-10 text-primary" />
          </div>
          <div className="text-2xl font-black text-white mb-2">Specialized Agent</div>
          <div className="text-sm text-primary/70 text-center max-w-[200px]">
            Dynamically ingests context, strictly follows project architecture.
          </div>
        </div>

      </div>
    </div>
  );
}
