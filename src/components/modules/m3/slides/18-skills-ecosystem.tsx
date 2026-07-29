import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FolderGit2, BookOpen, Layout, Server, Brain } from "lucide-react";

export function SkillsEcosystemSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (headerRef.current && coreRef.current) {
      timeline.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
      timeline.fromTo(coreRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" }, 2.5);
      
      branchesRef.current.forEach((branch, i) => {
        if (branch) {
          timeline.fromTo(branch, 
            { opacity: 0, x: -20 }, 
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
            5.0 + (i * 1.5)
          );
        }
      });
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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div ref={headerRef} className="text-center mb-10 relative z-10 w-full shrink-0">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
          The SKILL.md Ecosystem
        </h2>
        <p className="text-primary/70 text-lg md:text-xl font-medium max-w-3xl mx-auto">
          You can't fit everything into one file. Modular skills give the AI specific instructions exactly when it needs them.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 w-full min-h-0">
        
        {/* Central Hub */}
        <div ref={coreRef} className="flex flex-col items-center justify-center bg-black/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative z-10 w-full md:w-1/3 shadow-xl">
          <FolderGit2 className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-mono">/skills/</h3>
          <p className="text-center text-white/50 text-sm">
            A directory of isolated Markdown files. The agent reads the relevant file only when executing that specific task using Local RAG.
          </p>
        </div>

        {/* Branches */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div ref={el => { if(el) branchesRef.current[0] = el; }} className="bg-gradient-to-r from-teal-900/30 to-black/40 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-white font-mono font-bold text-sm">frontend-design/SKILL.md</div>
              <div className="text-primary/60 text-xs">Forces the AI to use specific Tailwind tokens, spacing rules, and animation libraries.</div>
            </div>
          </div>

          <div ref={el => { if(el) branchesRef.current[1] = el; }} className="bg-gradient-to-r from-teal-900/30 to-black/40 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-white font-mono font-bold text-sm">backend-architecture/SKILL.md</div>
              <div className="text-primary/60 text-xs">Defines how database schemas are designed, how API routes are structured, and error handling.</div>
            </div>
          </div>

          <div ref={el => { if(el) branchesRef.current[2] = el; }} className="bg-gradient-to-r from-teal-900/30 to-black/40 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-white font-mono font-bold text-sm">master-instructional-design/SKILL.md</div>
              <div className="text-primary/60 text-xs">An example from this very course! Instructs the AI on learning objectives and Bloom's Taxonomy.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
