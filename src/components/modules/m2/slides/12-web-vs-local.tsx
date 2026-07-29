import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Globe, Terminal, MonitorSmartphone, XCircle, CheckCircle2, ArrowRight } from "lucide-react";

export function WebVsLocalSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const leftZoneRef = useRef<HTMLDivElement>(null);
  const rightZoneRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Web versions of LLMs are often highly sandboxed and limited in the tools they can use. Going forward into the Toolbelt section, you'll need to set up tools and understand how API calls work. We recommend using CLI tools to install and run agents. Or, for a GUI experience, download a Desktop LLM application. The rest of the project steps will require a platform capable of tool calls, MCPs, and skills management."
    const timeline = gsap.timeline({ paused: true });

    if (leftZoneRef.current && rightZoneRef.current && dividerRef.current) {
      timeline.fromTo(leftZoneRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0.5);
      timeline.fromTo(dividerRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "power2.inOut" }, 1.0);
      timeline.fromTo(rightZoneRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 3.5);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto items-center justify-center relative">
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          Escaping the Browser
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Preparing your workspace for true agentic capabilities.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl relative z-10 gap-8 md:gap-0">
        
        {/* Left: Web UI */}
        <div ref={leftZoneRef} className="flex-1 bg-black/40 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-8 md:p-10 shadow-2xl relative md:rounded-r-none md:border-r-0">
          <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-500/30">
            <XCircle className="w-3 h-3" /> Sandboxed
          </div>
          
          <Globe className="w-16 h-16 text-white/40 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-3">Web LLMs</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Standard chat interfaces running in a browser are restricted. They cannot read your local filesystem, execute custom scripts, or connect directly to local MCP servers.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-3 rounded-lg border border-white/5">
              <XCircle className="w-4 h-4 text-red-400/70" /> No direct filesystem access
            </div>
            <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-3 rounded-lg border border-white/5">
              <XCircle className="w-4 h-4 text-red-400/70" /> Limited custom API integrations
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-12 z-20">
           <div ref={dividerRef} className="h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent origin-top" />
           <div className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center backdrop-blur-xl z-10 shadow-xl">
             <ArrowRight className="w-5 h-5 text-teal-400" />
           </div>
        </div>

        {/* Right: Desktop / CLI */}
        <div ref={rightZoneRef} className="flex-1 bg-teal-900/10 backdrop-blur-2xl border border-teal-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(45,212,191,0.1)] relative md:rounded-l-none md:border-l-0">
          <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-teal-500/30">
            <CheckCircle2 className="w-3 h-3" /> Full Access
          </div>
          
          <div className="flex gap-4 mb-6">
            <Terminal className="w-16 h-16 text-teal-400" />
            <MonitorSmartphone className="w-16 h-16 text-teal-400/70" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">CLI & Desktop Apps</h3>
          <p className="text-teal-100/70 text-sm leading-relaxed mb-6">
            To use the Toolbelt, you must move to a CLI harness or a Desktop application. You will need to understand APIs fundamentally (keys and endpoints) without needing to code them.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-teal-100/90 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Complete filesystem context (Local RAG)
            </div>
            <div className="flex items-center gap-3 text-sm text-teal-100/90 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> Native MCP & Skills Management
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
