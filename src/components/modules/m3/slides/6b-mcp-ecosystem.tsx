import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { BrainCircuit, Globe, Database, MessageSquare, GitBranch } from "lucide-react";

export function McpEcosystemSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerNodeRef = useRef<HTMLDivElement>(null);
  
  const nodeWebRef = useRef<HTMLDivElement>(null);
  const nodeGithubRef = useRef<HTMLDivElement>(null);
  const nodeDbRef = useRef<HTMLDivElement>(null);
  const nodeSlackRef = useRef<HTMLDivElement>(null);
  
  const orbitRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "This means your AI can instantly search the web, pull code from GitHub, query a local PostgreSQL database, or send messages in Slack—all using the exact same standard protocol."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && centerNodeRef.current && orbitRingRef.current &&
      nodeWebRef.current && nodeGithubRef.current && nodeDbRef.current && nodeSlackRef.current
    ) {
      // 1. Initial State
      timeline.fromTo(centerNodeRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, 0);
      timeline.fromTo(orbitRingRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 0.5);

      const nodes = [nodeWebRef.current, nodeGithubRef.current, nodeDbRef.current, nodeSlackRef.current];
      timeline.fromTo(nodes, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, 1.0);

      // Start infinite slow rotation for the orbit ring (which holds the nodes)
      gsap.to(orbitRingRef.current, { rotation: 360, duration: 40, repeat: -1, ease: "linear" });
      // Counter-rotate the nodes so they stay upright
      gsap.to(nodes, { rotation: -360, duration: 40, repeat: -1, ease: "linear" });

      // Highlights synced to audio
      const highlight = (node: HTMLElement, delay: number) => {
        timeline.to(node, { filter: "drop-shadow(0 0 40px rgba(167,218,219,0.8))", scale: 1.2, duration: 0.4, yoyo: true, repeat: 1 }, delay);
      };

      // "search the web" (approx 3.0s)
      highlight(nodeWebRef.current, 3.0);
      // "pull code from GitHub" (approx 5.0s)
      highlight(nodeGithubRef.current, 5.0);
      // "query a local PostgreSQL" (approx 7.0s)
      highlight(nodeDbRef.current, 7.0);
      // "send messages in Slack" (approx 9.5s)
      highlight(nodeSlackRef.current, 9.5);

      // "all using the exact same standard protocol" (approx 11.5s)
      timeline.to(orbitRingRef.current, { borderColor: "rgba(167,218,219,0.8)", borderWidth: 4, duration: 0.5, yoyo: true, repeat: 3 }, 11.5);
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
          Endless Capabilities
        </h2>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-center">
        
        {/* Center Node */}
        <div ref={centerNodeRef} className="absolute z-30 w-24 h-24 bg-black/80 backdrop-blur-3xl border-2 border-primary/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(167,218,219,0.2)]">
          <BrainCircuit className="w-8 h-8 text-primary mb-1" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/80 text-center">AI Agent</span>
        </div>

        {/* Orbiting Ring */}
        <div ref={orbitRingRef} className="absolute w-[280px] h-[280px] rounded-full border-2 border-primary/20 flex items-center justify-center z-20">
           
           {/* Node 1: Web (Top) */}
           <div className="absolute top-0 -translate-y-1/2">
             <div ref={nodeWebRef} className="w-20 h-20 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 flex flex-col items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-primary mb-1" />
                <span className="text-[9px] font-bold text-white text-center">Brave Web</span>
             </div>
           </div>

           {/* Node 2: GitHub (Right) */}
           <div className="absolute right-0 translate-x-1/2">
             <div ref={nodeGithubRef} className="w-20 h-20 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 flex flex-col items-center justify-center shadow-lg">
                <GitBranch className="w-6 h-6 text-primary mb-1" />
                <span className="text-[9px] font-bold text-white text-center">GitHub</span>
             </div>
           </div>

           {/* Node 3: Postgres (Bottom) */}
           <div className="absolute bottom-0 translate-y-1/2">
             <div ref={nodeDbRef} className="w-20 h-20 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 flex flex-col items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-primary mb-1" />
                <span className="text-[9px] font-bold text-white text-center">PostgreSQL</span>
             </div>
           </div>

           {/* Node 4: Slack (Left) */}
           <div className="absolute left-0 -translate-x-1/2">
             <div ref={nodeSlackRef} className="w-20 h-20 bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-2 flex flex-col items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-primary mb-1" />
                <span className="text-[9px] font-bold text-white text-center">Slack</span>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
