import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Workflow, Sparkles, ArrowRightLeft } from "lucide-react";

export function StandardConnectorsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Today, we've moved to standard connectors. Unlike rigid plugins, connectors act as fluid bridges using protocols like MCP. They give the agent dynamic access to workflows, whether it's querying a database or executing a server deployment."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && agentRef.current && systemsRef.current && bridgeRef.current
    ) {
      // 1. Initial
      timeline.fromTo(agentRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      
      const systemNodes = systemsRef.current.children;
      timeline.fromTo(systemNodes, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.5);

      // 2. Fluid Bridge appears
      // "Today, we've moved to standard connectors."
      timeline.fromTo(bridgeRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1, ease: "power2.inOut" }, 2.5);

      // 3. Fluidity animation
      // "Unlike rigid plugins, connectors act as fluid bridges..."
      timeline.to(".bridge-pulse", { opacity: 1, scaleX: 1.5, duration: 1, repeat: -1, yoyo: true, ease: "linear" }, 5.0);

      // 4. Glow target systems
      // "whether it's querying a database or executing a server deployment."
      timeline.to(systemNodes[0], { filter: "drop-shadow(0 0 20px rgba(167,218,219,0.8))", duration: 0.4, yoyo: true, repeat: 1 }, 10.0);
      timeline.to(systemNodes[1], { filter: "drop-shadow(0 0 20px rgba(167,218,219,0.8))", duration: 0.4, yoyo: true, repeat: 1 }, 12.0);
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

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight flex items-center justify-center gap-4">
          <Sparkles className="w-8 h-8 text-primary" /> Standard Connectors
        </h2>
        <p className="text-white/60 font-medium">Fluid bridges to dynamic workflows</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-center px-10">
        
        {/* Left: AI Agent */}
        <div ref={agentRef} className="w-48 h-48 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg opacity-0 z-20">
           <span className="text-lg font-bold text-white mb-2">Any Agent</span>
           <span className="text-[10px] text-primary/60 uppercase tracking-widest text-center bg-primary/10 px-3 py-1 rounded-full">Universal</span>
        </div>

        {/* Center: The Connector Bridge */}
        <div className="flex-1 h-32 relative flex items-center justify-center -mx-4 z-10">
           <div ref={bridgeRef} className="w-full h-12 bg-primary/10 border-y-2 border-primary/40 flex items-center justify-center relative overflow-hidden opacity-0 origin-center">
              <div className="bridge-pulse absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 origin-center" />
              
              <div className="bg-black border border-primary/50 px-4 py-2 rounded-full flex items-center gap-2 z-10">
                 <Workflow className="w-5 h-5 text-primary" />
                 <span className="text-xs font-black text-white uppercase tracking-widest">Connector</span>
              </div>
           </div>
        </div>

        {/* Right: Multiple Systems */}
        <div ref={systemsRef} className="flex flex-col gap-4 z-20">
           <div className="w-48 h-24 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg opacity-0">
              <span className="text-sm font-bold text-white mb-1">Database Cluster</span>
           </div>
           <div className="w-48 h-24 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg opacity-0">
              <span className="text-sm font-bold text-white mb-1">Server Deployment</span>
           </div>
           <div className="w-48 h-24 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg opacity-0">
              <span className="text-sm font-bold text-white mb-1">Stripe Billing</span>
           </div>
        </div>

      </div>
    </div>
  );
}
