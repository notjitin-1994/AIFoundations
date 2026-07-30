import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { BrainCircuit, Database, MessageSquare, Search, FolderTree, X } from "lucide-react";

export function PluginChaosSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const modelsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  
  const initialLineRef = useRef<SVGPathElement>(null);
  const chaosLinesRef = useRef<SVGGElement>(null);
  const mathFormulaRef = useRef<HTMLDivElement>(null);

  // We will have 4 models and 4 tools to make N x M visually dense (16 lines)
  const models = [
    { id: 'm1', label: 'Model A' },
    { id: 'm2', label: 'Model B' },
    { id: 'm3', label: 'Model C' },
    { id: 'm4', label: 'Model D' },
  ];

  const tools = [
    { id: 't1', icon: Database, label: 'Database' },
    { id: 't2', icon: MessageSquare, label: 'Chat' },
    { id: 't3', icon: Search, label: 'Search' },
    { id: 't4', icon: FolderTree, label: 'Files' },
  ];

  useEffect(() => {
    // Narration: "In the early days, every AI company built their own proprietary way to connect to tools. If you had 5 models and 5 tools, you needed 25 custom, fragile integrations. We call this the N by M integration problem."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && modelsRef.current && toolsRef.current &&
      initialLineRef.current && chaosLinesRef.current && mathFormulaRef.current
    ) {
      // 1. Models and Tools appear
      timeline.fromTo(modelsRef.current.children, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0);
      timeline.fromTo(toolsRef.current.children, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.2);
      
      // 2. "built their own proprietary way to connect" (One line draws)
      timeline.fromTo(initialLineRef.current, { strokeDasharray: "1000", strokeDashoffset: "1000" }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 1.5);
      
      // 3. "If you had 5 models and 5 tools, you needed 25 custom, fragile integrations."
      timeline.fromTo(chaosLinesRef.current.children, 
        { strokeDasharray: "1000", strokeDashoffset: "1000", opacity: 0 }, 
        { strokeDashoffset: 0, opacity: 0.3, duration: 1, stagger: 0.05, ease: "power2.inOut" }, 
      5.0);

      // Make them flicker to represent "fragile integrations"
      timeline.to(chaosLinesRef.current.children, {
        opacity: 0.8,
        strokeWidth: 3,
        duration: 0.1,
        yoyo: true,
        repeat: 10,
        stagger: { amount: 1, from: "random" }
      }, 7.0);

      // 4. "We call this the N by M integration problem."
      timeline.fromTo(mathFormulaRef.current, { opacity: 0, scale: 0.5, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 10.5);
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

  // Helper to draw bezier curves between two points (assuming container is roughly 600px wide for the SVG)
  const drawLine = (startY: number, endY: number) => {
    return `M 0,${startY} C 200,${startY} 300,${endY} 500,${endY}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          The Integration Problem
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-between px-10">
        
        {/* Left: Models */}
        <div ref={modelsRef} className="flex flex-col gap-6 z-20">
          {models.map((model, i) => (
            <div key={model.id} className="w-[180px] bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl p-4 flex items-center gap-4 shadow-lg relative">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-white/90 text-sm">{model.label}</span>
              {/* Connection Node */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 border border-primary" />
            </div>
          ))}
        </div>

        {/* Center: The N x M Chaos Web (SVG) */}
        <div className="absolute left-[220px] right-[220px] top-0 bottom-0 pointer-events-none z-10 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="none">
            <g ref={chaosLinesRef}>
              {/* Draw 16 chaotic lines between 4 start nodes and 4 end nodes */}
              {[60, 150, 240, 330].map((startY, i) => (
                [60, 150, 240, 330].map((endY, j) => {
                  // Skip the first line as we animate it separately
                  if (i === 0 && j === 0) return null;
                  return (
                    <path 
                      key={`${i}-${j}`}
                      d={drawLine(startY, endY)}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      opacity="0"
                    />
                  );
                })
              ))}
            </g>
            {/* The single initial line */}
            <path 
              ref={initialLineRef}
              d={drawLine(60, 60)}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(167,218,219,0.1)" />
                <stop offset="50%" stopColor="rgba(167,218,219,0.8)" />
                <stop offset="100%" stopColor="rgba(167,218,219,0.1)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* The Giant Formula overlay */}
        <div ref={mathFormulaRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/80 backdrop-blur-3xl border border-primary rounded-3xl p-8 shadow-[0_0_50px_rgba(167,218,219,0.2)] flex flex-col items-center opacity-0">
          <span className="text-5xl font-black text-white tracking-widest mb-2 font-mono">N <X className="inline w-8 h-8 text-primary mx-2" /> M</span>
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Exponential Fragility</span>
        </div>

        {/* Right: Tools */}
        <div ref={toolsRef} className="flex flex-col gap-6 z-20">
          {tools.map((tool, i) => (
            <div key={tool.id} className="w-[180px] bg-black/60 backdrop-blur-xl border border-primary/20 rounded-xl p-4 flex items-center gap-4 shadow-lg relative">
              {/* Connection Node */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 border border-primary" />
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-white/90 text-sm">{tool.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
