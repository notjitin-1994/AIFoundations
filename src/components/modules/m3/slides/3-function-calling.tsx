import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { BrainCircuit, ShieldAlert, Code2, Server } from "lucide-react";

export function FunctionCallingSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const llmZoneRef = useRef<HTMLDivElement>(null);
  const executionZoneRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  
  const promptRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const jsonRef = useRef<HTMLDivElement>(null);
  const textJsonRef = useRef<HTMLPreElement>(null);
  
  const harnessContainerRef = useRef<HTMLDivElement>(null);
  const harnessIconRef = useRef<HTMLDivElement>(null);
  const harnessTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Narration: "The AI itself doesn't browse the internet or run code. It strictly analyzes your prompt and generates a structured request—usually in JSON. This architectural separation is critical for system safety and control."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && llmZoneRef.current && executionZoneRef.current && shieldRef.current &&
      promptRef.current && brainRef.current && jsonRef.current && textJsonRef.current &&
      harnessContainerRef.current && harnessIconRef.current && harnessTextRef.current
    ) {
      // 1. Initial State: Zones appear
      timeline.fromTo(llmZoneRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      timeline.fromTo(executionZoneRef.current, { opacity: 0, x: 30 }, { opacity: 0.3, x: 0, duration: 1, ease: "power3.out" }, 0);
      
      // 2. The Shield / Separation wall drops in
      timeline.fromTo(shieldRef.current, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.8, ease: "back.out(1.2)" }, 0.5);

      // 3. User Prompt hits LLM
      timeline.fromTo(promptRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.5);
      timeline.to(brainRef.current, { scale: 1.1, filter: "brightness(1.5)", duration: 0.3, yoyo: true, repeat: 1 }, 2.0);

      // 4. LLM outputs JSON
      timeline.fromTo(jsonRef.current, { opacity: 0, scale: 0.8, x: -40 }, { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: "back.out(1.2)" }, 3.5);
      
      // JSON typing effect
      timeline.fromTo(textJsonRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 1.5, ease: "power2.out" }, 4.2);

      // 5. "Architectural separation is critical for safety..."
      timeline.to(executionZoneRef.current, { opacity: 1, duration: 1, ease: "power2.inOut" }, 7.0);
      timeline.to(shieldRef.current, { filter: "drop-shadow(0 0 20px rgba(167,218,219,0.8))", duration: 0.5, yoyo: true, repeat: 3 }, 7.5);
      
      // JSON crosses the gap
      timeline.to(jsonRef.current, { x: 350, duration: 1.5, ease: "power2.inOut" }, 8.5);
      
      // 6. Harness executes
      timeline.to(harnessContainerRef.current, { borderColor: "rgba(167,218,219, 0.8)", backgroundColor: "rgba(167,218,219, 0.2)", scale: 1.1, duration: 0.3 }, 10.0);
      timeline.to(harnessIconRef.current, { color: "rgba(167,218,219, 1)", filter: "drop-shadow(0 0 10px rgba(167,218,219,0.8))", duration: 0.3 }, 10.0);
      timeline.to(harnessTextRef.current, { color: "rgba(255, 255, 255, 1)", duration: 0.3 }, 10.0);
      timeline.to(harnessContainerRef.current, { scale: 1, duration: 0.2, yoyo: true, repeat: 3 }, 10.3);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Ambience strictly monochromatic teal */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Anatomy of a Tool Call
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          The Architectural Handoff
        </p>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 w-full relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16 mt-4">
        
        {/* Left: LLM Boundary */}
        <div ref={llmZoneRef} className="flex-1 z-30 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative flex flex-col items-center">
           <div className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-primary/60">
             1. LLM Boundary
           </div>
           
           <div ref={promptRef} className="mt-8 bg-white/10 border border-white/10 rounded-2xl p-4 self-center shadow-lg relative">
             <p className="text-sm text-white/90 font-medium">&quot;Search for latest AI news&quot;</p>
           </div>
           
           <div className="w-px h-8 bg-gradient-to-b from-white/20 to-primary/50 my-2" />
           
           <div ref={brainRef} className="w-20 h-20 bg-primary/20 rounded-2xl border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(167,218,219,0.2)] z-10 relative">
             <BrainCircuit className="w-10 h-10 text-primary" />
           </div>
           
           <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-primary/20 my-2" />
           
           {/* JSON Payload (Animates across) */}
           <div ref={jsonRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-primary/40 rounded-xl p-4 shadow-xl z-30 min-w-[240px]">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Structured Intent</span>
              </div>
              <pre ref={textJsonRef} className="text-[10px] md:text-xs font-mono text-white/80 leading-relaxed overflow-hidden">
{`{
  "name": "web_search",
  "arguments": {
    "query": "latest AI news"
  }
}`}
              </pre>
           </div>
        </div>

        {/* Center: The Airgap */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-12 shrink-0 z-20">
           <div ref={shieldRef} className="h-full w-px bg-gradient-to-b from-transparent via-primary to-transparent relative flex items-center justify-center">
              <div className="bg-black border border-primary/50 text-primary px-3 py-1.5 rounded-full absolute -rotate-90 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(167,218,219,0.3)] flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" />
                Safety Airgap
              </div>
           </div>
        </div>

        {/* Right: Execution Boundary */}
        <div ref={executionZoneRef} className="flex-1 bg-black/20 backdrop-blur-2xl border border-white/5 border-dashed rounded-[3rem] p-8 shadow-inner relative flex flex-col items-center justify-center">
           <div className="absolute top-4 right-6 text-xs font-bold uppercase tracking-widest text-primary/40">
             2. Execution Boundary
           </div>
           
           <div ref={harnessContainerRef} className="w-24 h-24 bg-primary/5 rounded-full border-2 border-primary/20 border-dashed flex items-center justify-center mb-6 relative">
              <div className="absolute inset-2 border border-primary/10 rounded-full animate-spin-slow" />
              <div ref={harnessIconRef} className="text-primary/40 flex items-center justify-center">
                <Server className="w-10 h-10" />
              </div>
           </div>
           
           <h3 ref={harnessTextRef} className="text-lg font-bold text-white/50 tracking-tight">The Harness</h3>
           <p className="text-sm text-white/30 text-center mt-2 max-w-[200px]">
             Waits for structured instructions. Runs the actual code.
           </p>
        </div>

      </div>
    </div>
  );
}
