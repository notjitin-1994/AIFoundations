import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion } from "motion/react";
import { Database, Workflow, Shield, Plug, ArrowRight } from "lucide-react";

export function MCPTeaserSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "To implement this External Memory, the industry standard is MCP: the Model Context Protocol. MCPs are standardized servers that securely connect your AI to databases, APIs, and file systems. You can find pre-built MCPs at smithery.ai or mcp.so, or even build your own."
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.0);
    
    timeline.fromTo(boxRef.current, { opacity: 0, scale: 0.9, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "expo.out" }, 4.0);

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
    if (isFinished && onComplete) onComplete();
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-8 max-w-6xl mx-auto relative group">
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-8 z-10 text-center mt-4">
        <h2 ref={headingRef} className="text-4xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          How to implement External Memory
        </h2>
        <p ref={pRef} className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Enter the <strong className="text-primary">Model Context Protocol (MCP)</strong>
        </p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center relative z-10">
        <div ref={boxRef} className="w-full max-w-4xl bg-black/40 backdrop-blur-3xl border border-primary/20 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
           
           <div className="shrink-0 relative">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
             <div className="w-32 h-32 rounded-[2rem] bg-black border border-primary/50 flex items-center justify-center shadow-[0_0_50px_rgba(167,218,219,0.3)] relative z-10">
               <Plug className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(167,218,219,0.8)]" />
             </div>
           </div>

           <div className="flex-1">
             <h3 className="text-2xl font-bold text-white mb-4">Standardized Data Bridges</h3>
             <p className="text-white/60 leading-relaxed mb-6">
               MCPs securely connect your AI to live data sources—like your local filesystem, a PostgreSQL database, or the GitHub API—dynamically injecting exactly what the AI needs, right when it needs it.
             </p>
             <div className="flex flex-wrap gap-4">
               <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-white/80">
                 <Shield className="w-4 h-4 text-primary" /> Secure Local Execution
               </div>
               <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-white/80">
                 <Database className="w-4 h-4 text-primary" /> Live Data Fetching
               </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">Where to find them</div>
                  <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                    <span className="hover:text-primary transition-colors cursor-default">smithery.ai</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="hover:text-primary transition-colors cursor-default">mcp.so</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="hover:text-primary transition-colors cursor-default">github.com/modelcontextprotocol</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-white/20" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
