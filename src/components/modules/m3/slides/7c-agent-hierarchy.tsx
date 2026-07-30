import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Database, FileCode2, Link } from "lucide-react";

export function AgentHierarchySlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "This creates a powerful hierarchy. You maintain a single AGENTS.md as your source of truth, while tool-specific files like CLAUDE.md or GEMINI.md act as thin entry points. This ensures your project's AI personality remains consistent across any platform."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && masterRef.current && branchesRef.current && pathsRef.current
    ) {
      // 1. AGENTS.md appears
      timeline.fromTo(masterRef.current, { opacity: 0, y: -30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)" }, 0.5);
      
      // 2. Paths draw down
      // "while tool-specific files like CLAUDE.md or GEMINI.md..."
      const paths = pathsRef.current.children;
      timeline.fromTo(paths, { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.2, ease: "power2.out", transformOrigin: "top" }, 3.5);

      // 3. Branches appear
      const branches = branchesRef.current.children;
      timeline.fromTo(branches, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.2)" }, 4.0);

      // 4. Pulse the master to show "consistent personality"
      // "ensures your project's AI personality remains consistent..."
      timeline.to(masterRef.current, { filter: "drop-shadow(0 0 40px rgba(167,218,219,0.8))", scale: 1.05, duration: 0.5, yoyo: true, repeat: 3 }, 8.5);
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
          The Agent Hierarchy
        </h2>
        <p className="text-white/60 font-medium">Single source of truth</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-col items-center justify-start mt-10">
        
        {/* Top: AGENTS.md */}
        <div ref={masterRef} className="bg-black/80 backdrop-blur-3xl border-2 border-primary/50 rounded-[2rem] p-6 flex flex-col items-center shadow-[0_0_50px_rgba(167,218,219,0.2)] w-64 z-20 relative opacity-0">
           <div className="absolute -top-4 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Source of Truth
           </div>
           <Database className="w-12 h-12 text-primary mb-3" />
           <h3 className="text-xl font-bold text-white tracking-tight">AGENTS.md</h3>
           <span className="text-xs text-white/50 text-center mt-2 font-medium">Core personality, rules, and architecture.</span>
        </div>

        {/* SVG Paths connecting them */}
        <div className="relative w-full max-w-2xl h-16 my-2 z-10">
           <div ref={pathsRef} className="absolute inset-0 flex justify-center w-full">
              {/* Left Path */}
              <div className="absolute left-1/4 top-0 w-1/4 h-full border-l-2 border-b-2 border-primary/30 rounded-bl-xl origin-top" />
              {/* Center Path */}
              <div className="absolute left-1/2 top-0 w-0 h-full border-l-2 border-primary/30 origin-top" />
              {/* Right Path */}
              <div className="absolute right-1/4 top-0 w-1/4 h-full border-r-2 border-b-2 border-primary/30 rounded-br-xl origin-top" />
           </div>
        </div>

        {/* Bottom: Tool-Specific Files */}
        <div ref={branchesRef} className="flex justify-between w-full max-w-2xl z-20">
           
           {/* CLAUDE.md */}
           <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center w-48 shadow-lg opacity-0">
              <Link className="w-6 h-6 text-primary/60 mb-2" />
              <span className="text-sm font-bold text-white">CLAUDE.md</span>
              <span className="text-[10px] text-primary/60 mt-1 uppercase tracking-wider">Thin Entrypoint</span>
           </div>

           {/* .cursorrules */}
           <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center w-48 shadow-lg opacity-0">
              <Link className="w-6 h-6 text-primary/60 mb-2" />
              <span className="text-sm font-bold text-white">.cursorrules</span>
              <span className="text-[10px] text-primary/60 mt-1 uppercase tracking-wider">Thin Entrypoint</span>
           </div>

           {/* GEMINI.md */}
           <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex flex-col items-center w-48 shadow-lg opacity-0">
              <Link className="w-6 h-6 text-primary/60 mb-2" />
              <span className="text-sm font-bold text-white">GEMINI.md</span>
              <span className="text-[10px] text-primary/60 mt-1 uppercase tracking-wider">Thin Entrypoint</span>
           </div>

        </div>

      </div>
    </div>
  );
}
