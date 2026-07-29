import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Cpu, PlugZap, Database, FolderGit2, MessageSquare, Globe } from "lucide-react";

export function McpTranslatorSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const llmRef = useRef<HTMLDivElement>(null);
  const mcpHubRef = useRef<HTMLDivElement>(null);
  const mcpGlowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  
  const dataNodesRef = useRef<HTMLDivElement>(null);
  
  const mainPathRef = useRef<SVGPathElement>(null);
  const outPathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    // "In late 2024, the industry aligned on an open standard: The Model Context Protocol, or MCP. Think of it as the USB-C port for AI. It allows any model to securely connect to any external data source using one standardized plug."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && llmRef.current && mcpHubRef.current && labelRef.current &&
      dataNodesRef.current && mainPathRef.current
    ) {
      
      // Init paths
      gsap.set(mainPathRef.current, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      outPathRefs.current.forEach(path => {
        if (path) gsap.set(path, { strokeDasharray: 500, strokeDashoffset: 500 });
      });

      // 0.0s - LLM Entrance (Premium reveal)
      timeline.fromTo(llmRef.current, 
        { opacity: 0, scale: 0.9, filter: "blur(20px)", x: -60 }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, duration: 1.5, ease: "power4.out" }, 
        0
      );
      
      // 1.0s - The MCP Protocol Hub appears
      timeline.fromTo(mcpHubRef.current, 
        { opacity: 0, scale: 0.8, filter: "blur(15px)", y: 30 }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 1.2, ease: "back.out(1.2)" }, 
        1.0
      );

      // Connect LLM to Hub
      timeline.to(mainPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.inOut"
      }, 1.4);
      
      // Hub powers up!
      timeline.to(mcpGlowRef.current, {
        opacity: 1,
        scale: 1.2,
        duration: 1.0,
        ease: "power2.out"
      }, 2.6);
      
      // 4.5s - USB-C Label
      timeline.fromTo(labelRef.current, 
        { opacity: 0, y: 10, filter: "blur(5px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }, 
        4.5
      );

      // 7.0s - External Data Sources connect
      const externalNodes = dataNodesRef.current.children;
      timeline.fromTo(externalNodes,
        { opacity: 0, x: 40, filter: "blur(10px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" },
        6.8
      );

      // Draw outgoing connection lines to tools
      timeline.to(outPathRefs.current, {
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.inOut"
      }, 7.0);
      
      // Data pulsing effect (simulating packets moving)
      timeline.to([mainPathRef.current, ...outPathRefs.current], {
        strokeDasharray: "4 12",
        opacity: 0.6,
        duration: 0.5,
        ease: "linear"
      }, 8.0);
      
      timeline.to([mainPathRef.current, ...outPathRefs.current], {
        strokeDashoffset: -100,
        duration: 2,
        ease: "linear",
        repeat: -1
      }, 8.5);
    }

    tl.current = timeline;
    return () => { timeline.kill(); };
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
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,218,219,0.03),transparent_70%)] pointer-events-none" />
      
      {/* Title */}
      <div className="absolute top-8 left-0 right-0 z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">
          Enter MCP
        </h2>
      </div>

      {/* Main Diagram Area (Fixed Aspect Ratio for SVG precision) */}
      <div ref={containerRef} className="w-full max-w-[1000px] aspect-[2/1] relative mt-20 z-10">
        
        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 500">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(167,218,219,0.2)" />
              <stop offset="50%" stopColor="rgba(167,218,219,0.8)" />
              <stop offset="100%" stopColor="rgba(167,218,219,0.2)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Inbound path */}
          <path ref={mainPathRef} d="M 200 250 C 350 250, 350 250, 500 250" fill="none" stroke="url(#lineGrad)" strokeWidth="3" filter="url(#glow)" />
          
          {/* Outbound paths to tools */}
          {/* Tool 1 (y=100) */}
          <path ref={(el) => { outPathRefs.current[0] = el; }} d="M 500 250 C 650 250, 650 100, 800 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" />
          {/* Tool 2 (y=200) */}
          <path ref={(el) => { outPathRefs.current[1] = el; }} d="M 500 250 C 650 250, 650 200, 800 200" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" />
          {/* Tool 3 (y=300) */}
          <path ref={(el) => { outPathRefs.current[2] = el; }} d="M 500 250 C 650 250, 650 300, 800 300" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" />
          {/* Tool 4 (y=400) */}
          <path ref={(el) => { outPathRefs.current[3] = el; }} d="M 500 250 C 650 250, 650 400, 800 400" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" />
        </svg>

        {/* 1. Left: Any Model */}
        <div ref={llmRef} className="absolute left-[200px] top-[250px] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="w-full h-full rounded-[2rem] bg-[#0a0a0a] border border-white/10 backdrop-blur-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
              <Cpu className="w-10 h-10 text-white/80 mb-2" />
              <span className="font-bold text-[10px] tracking-[0.2em] text-white/50 uppercase">Any Model</span>
            </div>
          </div>
        </div>

        {/* 2. Center: MCP Hub */}
        <div ref={mcpHubRef} className="absolute left-[500px] top-[250px] -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
          
          <div className="relative w-28 h-40">
            {/* Ambient Glow */}
            <div ref={mcpGlowRef} className="absolute inset-0 bg-primary/40 rounded-full blur-3xl opacity-0" />
            
            {/* The Hardware Device */}
            <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-b from-primary/20 to-black/80 backdrop-blur-2xl border border-primary/30 shadow-[inset_0_0_20px_rgba(167,218,219,0.2),0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center relative overflow-hidden group">
              
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
              
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(167,218,219,0.5)]">
                <PlugZap className="w-7 h-7 text-primary" />
              </div>
              <span className="font-black text-sm tracking-widest text-white">MCP</span>
              
              {/* Hardware pins (Visual detail) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shadow-[0_0_5px_rgba(167,218,219,0.8)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shadow-[0_0_5px_rgba(167,218,219,0.8)]" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shadow-[0_0_5px_rgba(167,218,219,0.8)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shadow-[0_0_5px_rgba(167,218,219,0.8)]" />
              </div>
            </div>
          </div>
          
          <div ref={labelRef} className="absolute -bottom-12 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
             <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">The USB-C of AI</span>
          </div>
        </div>

        {/* 3. Right: Standardized Data Sources */}
        <div ref={dataNodesRef} className="absolute right-[200px] top-[250px] -translate-y-1/2 translate-x-1/2 flex flex-col gap-[3.25rem] z-20">
          
          <div className="w-56 h-12 rounded-xl bg-gradient-to-r from-black/80 to-[#111] backdrop-blur-xl border border-white/10 flex items-center px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute left-0 w-1 h-full bg-primary/50" />
            <Database className="w-4 h-4 text-primary mr-3 opacity-90" />
            <span className="font-bold text-sm text-white/90 tracking-wide">Databases</span>
          </div>
          
          <div className="w-56 h-12 rounded-xl bg-gradient-to-r from-black/80 to-[#111] backdrop-blur-xl border border-white/10 flex items-center px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute left-0 w-1 h-full bg-indigo-500/50" />
            <FolderGit2 className="w-4 h-4 text-indigo-400 mr-3 opacity-90" />
            <span className="font-bold text-sm text-white/90 tracking-wide">Local Filesystem</span>
          </div>

          <div className="w-56 h-12 rounded-xl bg-gradient-to-r from-black/80 to-[#111] backdrop-blur-xl border border-white/10 flex items-center px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute left-0 w-1 h-full bg-blue-500/50" />
            <MessageSquare className="w-4 h-4 text-blue-400 mr-3 opacity-90" />
            <span className="font-bold text-sm text-white/90 tracking-wide">Slack / Discord</span>
          </div>

          <div className="w-56 h-12 rounded-xl bg-gradient-to-r from-black/80 to-[#111] backdrop-blur-xl border border-white/10 flex items-center px-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
            <div className="absolute left-0 w-1 h-full bg-orange-500/50" />
            <Globe className="w-4 h-4 text-orange-400 mr-3 opacity-90" />
            <span className="font-bold text-sm text-white/90 tracking-wide">GitHub Repos</span>
          </div>

        </div>

      </div>
    </div>
  );
}
