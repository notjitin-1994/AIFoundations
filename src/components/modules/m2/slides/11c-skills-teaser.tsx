import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion } from "motion/react";
import { FileCode2, BookOpen, UserCog, ArrowRight, Bot, PenTool } from "lucide-react";

export function SkillsTeaserSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "To implement Clean Context, you use Markdown Skills. Instead of giving an agent one massive, confusing prompt, you create modular dot-MD files that define highly specific behaviors. You can find community skills on GitHub, or simply instruct your agent to research and write new skills for itself."
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5);
    
    timeline.fromTo(leftColRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.0, ease: "power3.out" }, 4.5);
    timeline.fromTo(rightColRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1.0, ease: "power3.out" }, 7.5);

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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-8 max-w-7xl mx-auto relative group">
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-8 z-10 text-center mt-2">
        <h2 ref={headingRef} className="text-4xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          How to implement Clean Context
        </h2>
        <p ref={pRef} className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Enter modular <strong className="text-primary">Markdown Skills (.md)</strong>
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center relative z-10 w-full px-4">
        
        {/* Left Column: What it is */}
        <div ref={leftColRef} className="flex-1 w-full max-w-xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group/card hover:border-primary/30 transition-colors duration-500">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover/card:bg-primary/10 group-hover/card:border-primary/30 transition-colors">
              <FileCode2 className="w-8 h-8 text-white/50 group-hover/card:text-primary transition-colors" />
           </div>
           <h3 className="text-2xl font-bold text-white mb-3">Behavioral Modularity</h3>
           <p className="text-white/60 leading-relaxed text-sm">
             Instead of overloading the system prompt, you write standalone `SKILL.md` files (like `master-instructional-design` or `writing-skills`). The agent loads them strictly when needed, keeping its baseline context perfectly clean.
           </p>
        </div>

        {/* Arrow connector */}
        <div className="hidden md:flex shrink-0">
          <ArrowRight className="w-8 h-8 text-white/20" />
        </div>

        {/* Right Column: How to get them */}
        <div ref={rightColRef} className="flex-1 w-full max-w-xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Acquiring Skills</h3>
             
             <div className="space-y-4">
               <div className="flex items-start gap-4">
                 <div className="mt-1 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                   <BookOpen className="w-4 h-4 text-white/60" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-white">Community Repositories</h4>
                   <p className="text-xs text-white/50 mt-1">Download pre-written Markdown skills directly from GitHub repositories.</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="mt-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_15px_rgba(167,218,219,0.2)]">
                   <Bot className="w-4 h-4 text-primary" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-primary drop-shadow-[0_0_5px_rgba(167,218,219,0.5)]">AI-Authored Skills</h4>
                   <p className="text-xs text-white/60 mt-1">Command your agent to research best practices and write its own `SKILL.md` file for a new domain.</p>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
