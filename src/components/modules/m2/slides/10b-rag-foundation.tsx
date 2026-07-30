import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Database, Workflow, Blocks, Link, BrainCircuit, ArrowRight } from "lucide-react";

export function RagFoundationSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const mcpRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const pluginsRef = useRef<HTMLDivElement>(null);
  const beam1Ref = useRef<HTMLDivElement>(null);
  const beam2Ref = useRef<HTMLDivElement>(null);
  const beam3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "But RAG isn't just a trick for chatting with PDFs. It is the architectural foundation of modern AI. Every time an MCP fetches live data, or an agent loads a specific skill, they are using RAG principles to dynamically manage their context window. This is the essence of Context Engineering."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && coreRef.current && mcpRef.current &&
      skillsRef.current && pluginsRef.current
    ) {
      // 1. Core appears
      timeline.fromTo(coreRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, 0.5);
      
      // Pulse core gently
      gsap.to(coreRef.current, { filter: "drop-shadow(0 0 40px rgba(167,218,219,0.3))", duration: 2, repeat: -1, yoyo: true });

      // 2. Beams shoot out (approx 4.0s - "Every time an MCP...")
      timeline.fromTo(beam1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 4.0);
      timeline.fromTo(mcpRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.5)" }, 4.3);

      timeline.fromTo(beam2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 5.5);
      timeline.fromTo(skillsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.5)" }, 5.8);

      timeline.fromTo(beam3Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 7.0);
      timeline.fromTo(pluginsRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.5)" }, 7.3);

      // 3. Emphasize "Context Engineering" (approx 12.0s)
      timeline.to([mcpRef.current, skillsRef.current, pluginsRef.current], {
        borderColor: "rgba(167,218,219,0.8)",
        backgroundColor: "rgba(167,218,219,0.1)",
        duration: 0.5,
        stagger: 0.1,
        yoyo: true,
        repeat: 3
      }, 12.0);
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

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          The Universal Engine
        </h2>
        <p className="text-white/60 font-medium">RAG is the foundation of all context management</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-center gap-12 md:gap-24">
        
        {/* Left: The RAG Core */}
        <div ref={coreRef} className="w-64 h-64 bg-black/80 backdrop-blur-3xl border-2 border-primary/50 rounded-[3rem] p-8 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(167,218,219,0.2)] relative z-20 opacity-0">
           <div className="absolute -top-4 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Foundation
           </div>
           <Database className="w-16 h-16 text-primary mb-4" />
           <h3 className="text-2xl font-bold text-white tracking-tight text-center">RAG Principles</h3>
           <span className="text-xs text-white/50 text-center mt-2 font-medium">Dynamic context routing</span>
        </div>

        {/* Connections and Nodes */}
        <div className="flex flex-col gap-8 relative z-10">
           
           {/* Row 1: MCPs */}
           <div className="flex items-center gap-4 relative">
             <div ref={beam1Ref} className="absolute right-full w-24 md:w-36 h-1 bg-gradient-to-r from-primary/10 to-primary/60 origin-left opacity-80" />
             <div ref={mcpRef} className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex items-center gap-4 w-56 shadow-lg opacity-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity" />
                <Workflow className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">MCP Servers</h4>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest">Live Data Fetching</p>
                </div>
             </div>
           </div>

           {/* Row 2: Skills */}
           <div className="flex items-center gap-4 relative">
             <div ref={beam2Ref} className="absolute right-full w-24 md:w-36 h-1 bg-gradient-to-r from-primary/10 to-primary/60 origin-left opacity-80" />
             <div ref={skillsRef} className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex items-center gap-4 w-56 shadow-lg opacity-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity" />
                <Blocks className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Agent Skills</h4>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest">Workflow Loading</p>
                </div>
             </div>
           </div>

           {/* Row 3: Plugins */}
           <div className="flex items-center gap-4 relative">
             <div ref={beam3Ref} className="absolute right-full w-24 md:w-36 h-1 bg-gradient-to-r from-primary/10 to-primary/60 origin-left opacity-80" />
             <div ref={pluginsRef} className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 flex items-center gap-4 w-56 shadow-lg opacity-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity" />
                <Link className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Plugins</h4>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest">Legacy Integrations</p>
                </div>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
