import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FolderOpen, FileText, Database, BrainCircuit, Code, Sparkles } from "lucide-react";

export function FilesystemRagSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const folderZoneRef = useRef<HTMLDivElement>(null);
  const agentZoneRef = useRef<HTMLDivElement>(null);
  
  const file1Ref = useRef<HTMLDivElement>(null);
  const file2Ref = useRef<HTMLDivElement>(null);
  
  const pulseRef = useRef<HTMLDivElement>(null);
  const connectionLineRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const markdownPreviewRef = useRef<HTMLDivElement>(null);
  const exceptionalBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Filesystems are essentially local RAG. Saving markdown documents in a folder and initiating the agent there provides the most effective dynamic context management. This is the foundation of skills.md systems."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && folderZoneRef.current && agentZoneRef.current &&
      file1Ref.current && file2Ref.current && pulseRef.current && connectionLineRef.current &&
      rightTextRef.current && titleRef.current && markdownPreviewRef.current && exceptionalBadgeRef.current
    ) {
      // 0.0s "Filesystems are essentially local RAG."
      timeline.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0);
      timeline.fromTo(folderZoneRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 1.0);
      timeline.fromTo(agentZoneRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 1.0);

      // 3.0s "Saving markdown documents in a folder..."
      timeline.fromTo(file1Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, 3.0);
      timeline.fromTo(file2Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, 3.2);

      // 5.5s "...and initiating the agent there provides the most effective dynamic context management."
      timeline.fromTo(connectionLineRef.current, { width: "0%" }, { width: "100%", duration: 0.8, ease: "power2.inOut" }, 5.5);
      
      timeline.to(file1Ref.current, { x: 350, opacity: 0, scale: 0.5, duration: 1.2, ease: "power2.inOut" }, 6.5);
      timeline.to(file2Ref.current, { x: 350, opacity: 0, scale: 0.5, duration: 1.2, ease: "power2.inOut" }, 7.0);

      timeline.fromTo(pulseRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.2, duration: 0.5, ease: "back.out(1.5)" }, 7.5);
      timeline.to(pulseRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.8))", duration: 0.5, yoyo: true, repeat: 3 }, 8.0);
      
      // Text reveal on the right side
      timeline.fromTo(rightTextRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 7.5);

      // 9.5s "This is the foundation of skills.md systems."
      timeline.to(pulseRef.current, { scale: 1, opacity: 0.5, duration: 1 }, 9.5);
      
      // 11.0s "These documents simply teach the AI a certain skill—how to do something in a very specific way."
      timeline.fromTo(markdownPreviewRef.current, { opacity: 0, scale: 0.9, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 11.0);

      // 15.5s "All AI agents use this local RAG approach to read these skills and perform truly exceptional work."
      timeline.fromTo(exceptionalBadgeRef.current, { opacity: 0, scale: 0, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" }, 15.5);
      timeline.to(exceptionalBadgeRef.current, { filter: "drop-shadow(0 0 15px rgba(167,218,219,1))", duration: 0.5, yoyo: true, repeat: -1 }, 16.1);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Ambience strictly monochromatic teal */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={titleRef} className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Filesystems as Local RAG
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          The foundation of dynamic context management.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 mt-4 px-4 md:px-12">
        
        {/* Left: Local Folder (The Documents) */}
        <div ref={folderZoneRef} className="flex-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative flex flex-col items-center">
           <div className="absolute top-4 left-6 text-xs font-bold uppercase tracking-widest text-primary/60">
             1. Workspace Directory
           </div>
           
           <div className="w-20 h-20 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center mt-6 mb-8 relative shadow-[0_0_30px_rgba(167,218,219,0.1)]">
             <FolderOpen className="w-10 h-10 text-primary" />
           </div>

           <div className="w-full relative h-32 flex flex-col items-center gap-3">
             <div ref={file1Ref} className="bg-black/80 backdrop-blur-xl border border-primary/40 rounded-xl p-3 shadow-lg flex items-center gap-3 w-48 z-30">
               <FileText className="w-5 h-5 text-primary" />
               <span className="text-xs font-mono text-teal-100 font-bold">skills.md</span>
             </div>
             
             <div ref={file2Ref} className="bg-black/80 backdrop-blur-xl border border-primary/20 rounded-xl p-3 shadow-lg flex items-center gap-3 w-48 z-20">
               <FileText className="w-5 h-5 text-primary/70" />
               <span className="text-xs font-mono text-primary/70 font-bold">docs.md</span>
             </div>
           </div>
           
           <div ref={markdownPreviewRef} className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[110%] bg-black/90 backdrop-blur-3xl border border-primary/40 rounded-2xl p-4 shadow-2xl z-40 hidden md:block">
             <div className="flex items-center gap-2 mb-2 border-b border-primary/20 pb-2">
               <Code className="w-4 h-4 text-primary" />
               <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Skill Instruction</span>
             </div>
             <pre className="text-[10px] text-primary/80 font-mono leading-relaxed">
{`# How to execute
1. Read the environment variables
2. Build the exact command
3. DO NOT change the port`}
             </pre>
           </div>
        </div>

        {/* Center: The RAG Retrieval Connection */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-24 shrink-0 z-20">
           <div className="w-full flex items-center h-12 relative">
             <div ref={connectionLineRef} className="h-0.5 bg-primary/40 flex items-center justify-end overflow-visible">
                <Database className="absolute left-1/2 -translate-x-1/2 -top-4 w-6 h-6 text-primary/50 bg-black p-1 rounded-full border border-primary/30" />
             </div>
           </div>
        </div>

        {/* Right: The Agent Context Window */}
        <div ref={agentZoneRef} className="flex-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative flex flex-col items-center">
           <div className="absolute top-4 right-6 text-xs font-bold uppercase tracking-widest text-primary/60">
             2. Agent Context Window
           </div>
           
           <div className="w-24 h-24 mt-6 mb-8 relative flex items-center justify-center">
             <div ref={pulseRef} className="absolute inset-0 bg-primary/20 border-2 border-primary/50 rounded-full flex items-center justify-center">
               <div className="absolute inset-2 border border-primary/30 rounded-full animate-spin-slow" />
             </div>
             <BrainCircuit className="w-10 h-10 text-primary relative z-10" />
             
             <div ref={exceptionalBadgeRef} className="absolute -right-4 -bottom-2 bg-primary/90 text-black px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 z-30 shadow-lg border border-teal-300">
               <Sparkles className="w-3 h-3" />
               Exceptional
             </div>
           </div>
           
           <div ref={rightTextRef} className="flex flex-col items-center">
             <h3 className="text-lg font-bold text-white tracking-tight mb-2">Dynamic Expansion</h3>
             <p className="text-sm text-white/50 text-center max-w-[220px]">
               The agent autonomously reads workspace files to inject instructions exactly when needed.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
