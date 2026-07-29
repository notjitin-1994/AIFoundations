import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Server, ArrowRight, BrainCircuit, Box } from "lucide-react";

export function ToolRegistrySlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const registryHubRef = useRef<HTMLDivElement>(null);
  const serversRef = useRef<HTMLDivElement>(null);
  
  const workflowRef = useRef<HTMLDivElement>(null);
  const targetServerRef = useRef<HTMLDivElement>(null);

  // Generate 9 dummy server blocks for the visual marketplace
  const serverBlocks = Array.from({ length: 9 }, (_, i) => i);

  useEffect(() => {
    // Narration: "Because MCP is an open standard, a massive community registry of servers has emerged. You don't have to build integrations from scratch. Instead, you can simply pull pre-built servers directly into your AI workflow."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && registryHubRef.current && serversRef.current &&
      workflowRef.current && targetServerRef.current
    ) {
      // 1. Registry Hub appears
      timeline.fromTo(registryHubRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      
      // 2. Servers cascade in
      const blocks = serversRef.current.children;
      timeline.fromTo(blocks, 
        { opacity: 0, y: -20, scale: 0.8 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: { amount: 1.0, from: "random" }, ease: "back.out(1.5)" }, 
      1.0);

      // 3. Workflow Box appears
      timeline.fromTo(workflowRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 5.5);

      // 4. One server is pulled across from the registry into the workflow
      const specificBlock = blocks[5]; // Pick middle-right block
      
      timeline.to(specificBlock, { 
        x: 350, // Move it right towards the workflow box
        scale: 1.2,
        duration: 1,
        ease: "power2.inOut",
        filter: "drop-shadow(0 0 20px rgba(167,218,219,0.8))"
      }, 7.0);

      timeline.to(targetServerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(2)"
      }, 8.0);

      timeline.to(specificBlock, { opacity: 0, duration: 0.2 }, 8.0);
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
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-6 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          The Open Registry
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-between px-4 md:px-12 gap-8">
        
        {/* Left: The Registry */}
        <div className="flex-1 max-w-[400px]">
          <div ref={registryHubRef} className="bg-black/60 backdrop-blur-2xl border border-primary/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(167,218,219,0.1)] w-full flex flex-col items-center relative z-20">
             <div className="absolute -top-6 bg-primary/20 border border-primary/40 px-4 py-1 rounded-full flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary tracking-widest uppercase whitespace-nowrap">Community Registry</span>
             </div>
             
             {/* The Grid of Servers */}
             <div ref={serversRef} className="grid grid-cols-3 gap-4 w-full mt-4">
                {serverBlocks.map((i) => (
                  <div key={i} className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg relative">
                    <Server className="w-8 h-8 text-primary/80 mb-2" />
                    <span className="text-[10px] font-mono text-primary/60">Server</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Middle: Arrow */}
        <div className="shrink-0 flex items-center justify-center w-12">
           <ArrowRight className="w-8 h-8 text-primary/40 animate-pulse" />
        </div>

        {/* Right: The Local Workflow */}
        <div className="flex-1 max-w-[400px]">
          <div ref={workflowRef} className="bg-black/80 backdrop-blur-3xl border-2 border-primary/40 rounded-[2rem] p-8 shadow-2xl w-full flex flex-col items-center gap-6 z-10 relative">
             
             <div className="flex flex-col items-center gap-3 text-center">
               <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40">
                  <BrainCircuit className="w-10 h-10 text-primary" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">Your AI Agent</h3>
                 <span className="text-xs font-mono text-white/50">Local Workflow</span>
               </div>
             </div>

             <div className="w-0.5 h-8 bg-primary/30" />
             
             {/* The Target Slot for the pulled server */}
             <div className="w-full h-24 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center bg-black/40 relative">
                <span className="text-sm font-mono text-primary/40 absolute">Drop Server Here</span>
                <div ref={targetServerRef} className="absolute inset-2 bg-primary border-2 border-white/20 rounded-xl flex items-center justify-center opacity-0 shadow-[0_0_30px_rgba(167,218,219,0.8)] z-10">
                  <Server className="w-8 h-8 text-black mb-1 mr-2" />
                  <span className="text-sm font-bold text-black uppercase tracking-wider">Mounted</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
