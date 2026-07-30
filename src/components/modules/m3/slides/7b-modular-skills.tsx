import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Blocks, TestTube2, GitPullRequest, LineChart, BrainCircuit } from "lucide-react";

export function ModularSkillsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const skill1Ref = useRef<HTMLDivElement>(null);
  const skill2Ref = useRef<HTMLDivElement>(null);
  const skill3Ref = useRef<HTMLDivElement>(null);
  const contextSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Instead of stuffing every rule into one massive prompt, we use modular capabilities. A SKILLS.md file defines specific, reusable workflows—like how to write a Pull Request—so the agent only loads that context when it's actively needed."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && agentRef.current && skill1Ref.current && 
      skill2Ref.current && skill3Ref.current && contextSlotRef.current
    ) {
      // 1. Initial agent and skills appear
      timeline.fromTo(agentRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      const skills = [skill1Ref.current, skill2Ref.current, skill3Ref.current];
      timeline.fromTo(skills, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.2)" }, 0.5);

      // 2. Specific skill (PR Creation) loads into context
      // "like how to write a Pull Request..."
      timeline.to(skill2Ref.current, { 
        x: 250, // Move towards the agent slot
        scale: 1.1,
        duration: 1, 
        ease: "power2.inOut",
        filter: "drop-shadow(0 0 20px rgba(167,218,219,0.8))"
      }, 7.5);

      timeline.to(contextSlotRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, 8.5);

      timeline.to(skill2Ref.current, { opacity: 0, duration: 0.2 }, 8.5);
      
      // Pulse the agent
      timeline.to(agentRef.current, { borderColor: "rgba(167,218,219,0.8)", duration: 0.5, yoyo: true, repeat: 3 }, 8.5);
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
          Modular Capabilities
        </h2>
        <p className="text-white/60 font-medium">Loading workflows on demand</p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex flex-row items-center justify-center gap-16 md:gap-32">
        
        {/* Left: Skill Modules */}
        <div className="flex flex-col gap-6 relative z-20">
           
           {/* Skill 1 */}
           <div ref={skill1Ref} className="bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg w-56 opacity-0">
              <div className="bg-primary/20 p-2 rounded-lg"><TestTube2 className="w-5 h-5 text-primary" /></div>
              <div>
                <span className="text-sm font-bold text-white block">Test Writing</span>
                <span className="text-[10px] text-primary/60 font-mono">SKILLS.md</span>
              </div>
           </div>

           {/* Skill 2 (The one that moves) */}
           <div ref={skill2Ref} className="bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg w-56 opacity-0 relative z-30">
              <div className="bg-primary/20 p-2 rounded-lg"><GitPullRequest className="w-5 h-5 text-primary" /></div>
              <div>
                <span className="text-sm font-bold text-white block">PR Creation</span>
                <span className="text-[10px] text-primary/60 font-mono">SKILLS.md</span>
              </div>
           </div>

           {/* Skill 3 */}
           <div ref={skill3Ref} className="bg-black/60 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg w-56 opacity-0">
              <div className="bg-primary/20 p-2 rounded-lg"><LineChart className="w-5 h-5 text-primary" /></div>
              <div>
                <span className="text-sm font-bold text-white block">Data Analysis</span>
                <span className="text-[10px] text-primary/60 font-mono">SKILLS.md</span>
              </div>
           </div>
        </div>

        {/* Right: AI Agent */}
        <div ref={agentRef} className="bg-primary/5 backdrop-blur-3xl border-2 border-primary/20 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl w-72 relative z-10">
           <BrainCircuit className="w-16 h-16 text-primary mb-4" />
           <h3 className="text-xl font-bold text-white mb-6">AI Agent</h3>
           
           {/* Context Slot */}
           <div className="w-full bg-black/40 border-2 border-dashed border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center min-h-[80px] relative">
              <span className="text-xs font-mono text-primary/40 absolute">Active Context</span>
              
              <div ref={contextSlotRef} className="absolute inset-0 bg-primary/20 border border-primary/50 rounded-xl flex items-center gap-3 p-3 opacity-0">
                 <GitPullRequest className="w-5 h-5 text-primary" />
                 <div>
                   <span className="text-xs font-bold text-white block">PR Creation</span>
                   <span className="text-[9px] text-primary/80 font-mono">Loaded in context</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
