import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FileCode2, BookOpen, ArrowRight, BrainCircuit } from "lucide-react";

export function MarkdownSkillsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const arrow1Ref = useRef<HTMLDivElement>(null);
  const arrow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Beyond external tools, modern AI agents rely on Markdown-based documentation like AGENTS.md or SKILLS.md. These files act as the system prompt or instruction manual, providing the agent with the project's coding standards and architectural context every time it opens your repository."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && fileRef.current && bookRef.current &&
      brainRef.current && arrow1Ref.current && arrow2Ref.current
    ) {
      // 1. Markdown file appears
      timeline.fromTo(fileRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.5)" }, 0);
      
      // 2. Transforms to Instruction Manual
      // "These files act as the system prompt or instruction manual..."
      timeline.fromTo(arrow1Ref.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4, ease: "power2.out" }, 2.5);
      timeline.fromTo(bookRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 3.0);

      // 3. Feeds into Brain
      // "providing the agent with the project's coding standards..."
      timeline.fromTo(arrow2Ref.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4, ease: "power2.out" }, 5.5);
      timeline.fromTo(brainRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.5)" }, 6.0);

      // Pulse brain
      timeline.to(brainRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.6))", scale: 1.05, duration: 0.8, yoyo: true, repeat: 3 }, 6.5);
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
          System Prompts as Code
        </h2>
        <p className="text-white/60 font-medium">Controlling behavior via Markdown</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-center gap-6 md:gap-10">
        
        {/* Left: Markdown File */}
        <div ref={fileRef} className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 flex flex-col items-center shadow-lg w-40">
           <FileCode2 className="w-12 h-12 text-primary mb-4" />
           <span className="text-sm font-bold text-white tracking-widest">AGENTS.md</span>
           <span className="text-[10px] text-primary/60 mt-1">Markdown</span>
        </div>

        <div ref={arrow1Ref} className="shrink-0 origin-left">
           <ArrowRight className="w-8 h-8 text-primary/40" />
        </div>

        {/* Middle: Instruction Manual */}
        <div ref={bookRef} className="bg-primary/10 backdrop-blur-xl border-2 border-primary/40 rounded-[2rem] p-8 flex flex-col items-center shadow-[0_0_40px_rgba(167,218,219,0.1)] w-56 relative">
           <div className="absolute -top-4 bg-primary/20 border border-primary/40 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Source of Truth</span>
           </div>
           <BookOpen className="w-16 h-16 text-primary mb-4" />
           <h3 className="text-lg font-bold text-white text-center mb-2">Instruction Manual</h3>
           <ul className="text-xs text-white/60 space-y-2 w-full">
             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"/> Coding Standards</li>
             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"/> Architecture</li>
             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full"/> Taboos</li>
           </ul>
        </div>

        <div ref={arrow2Ref} className="shrink-0 origin-left">
           <ArrowRight className="w-8 h-8 text-primary/40" />
        </div>

        {/* Right: AI Brain */}
        <div ref={brainRef} className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 flex flex-col items-center shadow-lg w-40">
           <BrainCircuit className="w-12 h-12 text-primary mb-4" />
           <span className="text-sm font-bold text-white tracking-widest">AI Agent</span>
           <span className="text-[10px] text-primary/60 mt-1">Context Window</span>
        </div>

      </div>
    </div>
  );
}
