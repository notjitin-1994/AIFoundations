import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { Compass, Globe, Server, Code, Maximize2 } from "lucide-react";

export function AdvancedSkillsSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // Animate central node
    timeline.fromTo(".center-node", { scale: 0 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, 0.5);
    
    // Radiate out peripheral nodes
    const angles = [0, 90, 180, 270];
    angles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = Math.cos(rad) * 120;
      const y = Math.sin(rad) * 120;
      
      timeline.fromTo(`.sat-node-${i}`,
        { x: 0, y: 0, opacity: 0 },
        { x, y, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
        1.0 + (i * 0.4)
      );
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
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-6xl mx-auto overflow-hidden">
      
      <div className="text-center mb-16 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Expansion & Scale</h2>
        <p className="text-white/60 font-light">Evolving your <span className="text-primary font-medium">{data.title}</span> with advanced capabilities.</p>
      </div>

      <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Central Hub */}
          <div className="center-node absolute w-24 h-24 bg-primary/20 border-2 border-primary rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(167,218,219,0.3)] z-20">
            <Maximize2 className="w-8 h-8 text-primary mb-1" />
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Expand</span>
          </div>

          {/* Satellites */}
          <div className="sat-node-0 absolute w-16 h-16 bg-black/80 border border-white/20 rounded-full flex items-center justify-center z-10 hover:border-white/50 transition-colors cursor-pointer group">
            <Globe className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
            <div className="absolute top-full mt-2 w-max text-xs text-center text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Web Scraping</div>
          </div>
          
          <div className="sat-node-1 absolute w-16 h-16 bg-black/80 border border-white/20 rounded-full flex items-center justify-center z-10 hover:border-white/50 transition-colors cursor-pointer group">
            <Server className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
            <div className="absolute -left-full -ml-4 top-1/2 -translate-y-1/2 w-max text-xs text-right text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Systems Design</div>
          </div>
          
          <div className="sat-node-2 absolute w-16 h-16 bg-black/80 border border-white/20 rounded-full flex items-center justify-center z-10 hover:border-white/50 transition-colors cursor-pointer group">
            <Code className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
            <div className="absolute bottom-full mb-2 w-max text-xs text-center text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Custom MCP APIs</div>
          </div>
          
          <div className="sat-node-3 absolute w-16 h-16 bg-black/80 border border-white/20 rounded-full flex items-center justify-center z-10 hover:border-white/50 transition-colors cursor-pointer group">
            <Compass className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
            <div className="absolute -right-full -mr-4 top-1/2 -translate-y-1/2 w-max text-xs text-left text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">Advanced RAG</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
