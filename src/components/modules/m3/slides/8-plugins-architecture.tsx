import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Puzzle, XCircle } from "lucide-react";

export function PluginsArchitectureSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const pluginRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Now, how do agents connect to enterprise systems? Historically, this required proprietary plugins. A plugin is a rigid, hardcoded integration that only works for one specific tool, creating a fragile and siloed ecosystem."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && agentRef.current && systemRef.current &&
      pluginRef.current && errorRef.current
    ) {
      // 1. Initial
      timeline.fromTo(agentRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      timeline.fromTo(systemRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0.5);

      // 2. Rigid Plugin drops in
      // "Historically, this required proprietary plugins."
      timeline.fromTo(pluginRef.current, { opacity: 0, y: -50, rotation: 10 }, { opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: "bounce.out" }, 3.5);

      // 3. Tries to connect but it's rigid/fragile
      // "A plugin is a rigid, hardcoded integration..."
      timeline.to(pluginRef.current, { x: 30, duration: 0.2, yoyo: true, repeat: 3 }, 7.5);
      
      // Flash red error
      // "...creating a fragile and siloed ecosystem."
      timeline.fromTo(errorRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 12.0);
      timeline.to(pluginRef.current, { borderColor: "rgba(239,68,68,0.5)", backgroundColor: "rgba(239,68,68,0.1)", duration: 0.3 }, 12.0);
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
          Legacy Plugins
        </h2>
        <p className="text-white/60 font-medium">Rigid, hardcoded integrations</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-center gap-12">
        
        {/* AI Agent */}
        <div ref={agentRef} className="w-48 h-48 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg opacity-0">
           <span className="text-lg font-bold text-white mb-2">AI Agent A</span>
           <span className="text-[10px] text-primary/60 uppercase tracking-widest text-center">Specific Platform</span>
        </div>

        {/* The Plugin */}
        <div ref={pluginRef} className="relative w-40 h-24 bg-primary/10 border-2 border-primary/40 rounded-lg flex flex-col items-center justify-center shadow-[0_0_30px_rgba(167,218,219,0.1)] opacity-0">
           <Puzzle className="w-8 h-8 text-primary mb-2" />
           <span className="text-xs font-bold text-white uppercase tracking-wider">Proprietary Plugin</span>
           
           <div ref={errorRef} className="absolute -top-4 -right-4 bg-red-500/20 rounded-full opacity-0">
              <XCircle className="w-8 h-8 text-red-500" />
           </div>
           
           {/* Rigid connectors */}
           <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-2 bg-primary/40" />
           <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-2 bg-primary/40" />
        </div>

        {/* Enterprise System */}
        <div ref={systemRef} className="w-48 h-48 bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg opacity-0">
           <span className="text-lg font-bold text-white mb-2">Enterprise Tool</span>
           <span className="text-[10px] text-primary/60 uppercase tracking-widest text-center">Siloed Data</span>
        </div>

      </div>
    </div>
  );
}
