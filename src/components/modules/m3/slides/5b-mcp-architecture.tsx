import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Server, Monitor, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export function McpArchitectureSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const clientRef = useRef<HTMLDivElement>(null);
  const serverRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<HTMLDivElement>(null);
  
  const equationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Instead of a chaotic web, MCP uses a clean client-server architecture. An AI application runs an MCP Client, which speaks the standard protocol to any MCP Server. This transforms the N by M nightmare into a simple N plus M equation."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && clientRef.current && serverRef.current &&
      connectionRef.current && equationRef.current
    ) {
      // 1. Initial State
      timeline.fromTo(clientRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      timeline.fromTo(serverRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0.5);
      
      // 2. Connection Pipe Appears
      // "MCP uses a clean client-server architecture."
      timeline.fromTo(connectionRef.current, { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 1.5);
      timeline.to(".protocol-data-dot", { x: 200, duration: 1.5, repeat: -1, ease: "linear" }, 2.0);

      // 3. Highlight Client
      // "An AI application runs an MCP Client..."
      timeline.to(clientRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.5))", duration: 0.3, yoyo: true, repeat: 1 }, 3.5);

      // 4. Highlight Server
      // "...which speaks the standard protocol to any MCP Server."
      timeline.to(serverRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.5))", duration: 0.3, yoyo: true, repeat: 1 }, 7.5);

      // 5. N + M Equation
      // "This transforms the N by M nightmare into a simple N plus M equation."
      timeline.fromTo(equationRef.current, { opacity: 0, scale: 0.5, y: -20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 12.0);
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

      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          Client-Server Architecture
        </h2>
      </div>

      {/* The N + M Equation */}
      <div ref={equationRef} className="absolute top-[20%] left-1/2 -translate-x-1/2 z-30 bg-primary/20 border border-primary/50 px-6 py-2 rounded-full shadow-[0_0_30px_rgba(167,218,219,0.3)] flex items-center gap-3 opacity-0">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <span className="text-xl font-mono font-black tracking-widest text-white">N + M = <span className="text-primary">Scalable</span></span>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-center px-10">
        
        {/* Left: Client */}
        <div ref={clientRef} className="w-[300px] h-[250px] bg-black/60 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center z-20">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
             <Monitor className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Host App</h3>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary/80 bg-primary/10 px-3 py-1 rounded">MCP Client</span>
        </div>

        {/* Center: Protocol Pipe */}
        <div className="flex-1 max-w-[300px] h-12 relative flex items-center justify-center z-10 mx-4">
           <div ref={connectionRef} className="w-full h-full bg-primary/5 border-y border-primary/20 flex items-center overflow-hidden rounded">
              {/* Animated data dots flowing */}
              <div className="protocol-data-dot w-2 h-2 rounded-full bg-primary absolute left-0 shadow-[0_0_10px_rgba(167,218,219,0.8)]" />
              <div className="protocol-data-dot w-2 h-2 rounded-full bg-primary absolute left-[-100px] shadow-[0_0_10px_rgba(167,218,219,0.8)]" />
              
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-black/80 px-3 py-1 border border-primary/30 rounded-full">
                 <ArrowRightLeft className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">Standardized</span>
              </div>
           </div>
        </div>

        {/* Right: Server */}
        <div ref={serverRef} className="w-[300px] h-[250px] bg-black/60 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center z-20">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
             <Server className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Data Source</h3>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary/80 bg-primary/10 px-3 py-1 rounded">MCP Server</span>
        </div>

      </div>
    </div>
  );
}
