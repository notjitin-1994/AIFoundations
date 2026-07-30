import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { TerminalSquare, Copy, CheckCircle } from "lucide-react";

export function SkillsDirectoriesSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const [copied, setCopied] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bottomActionRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx skills add anthropic/skill-creator");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && titleRef.current && cardsRef.current &&
      bottomActionRef.current
    ) {
      // 1. Title Entrance
      timeline.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
      
      // 2. The 3 Directories
      const cards = cardsRef.current.children;
      timeline.fromTo(cards, 
        { opacity: 0, y: 40, scale: 0.95, filter: "blur(5px)" }, 
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.2, ease: "back.out(1.2)" }, 
        1.0
      );

      // 3. Bottom Action
      timeline.fromTo(bottomActionRef.current, 
        { opacity: 0, scale: 0.95, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
        3.0
      );
      
      // Pulse the bottom box border
      timeline.to(bottomActionRef.current, { filter: "drop-shadow(0 0 25px rgba(167,218,219,0.3))", duration: 2, yoyo: true, repeat: -1 }, 4.0);
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,218,219,0.05),transparent_60%)] pointer-events-none" />

      <div ref={containerRef} className="flex-1 w-full flex flex-col items-center justify-center gap-6 relative z-10 px-2 py-2">
        
        {/* Top: Title */}
        <div className="text-center shrink-0 mt-2">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
            Skills Repositories
          </h2>
          <p className="text-white/60 mt-3 text-sm max-w-lg mx-auto">
            Don't start from scratch. Tap into community-driven registries to discover, install, and share production-grade AI agent skills.
          </p>
        </div>
        
        {/* Directory Cards Grid */}
        <div ref={cardsRef} className="flex flex-wrap justify-center gap-4 w-full max-w-5xl shrink-0 mt-4">
            
            {/* skills.sh */}
            <a href="https://skills.sh" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center gap-3 w-[260px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(167,218,219,0.1)] group-hover:bg-primary/20 transition-colors">
                <img src="/courses/aifoundations-concept2application/images/favicons/skills-sh.png" alt="skills.sh" className="w-6 h-6 rounded-sm object-contain" onError={(e) => { e.currentTarget.src = "/courses/aifoundations-concept2application/images/favicons/github.png" }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">skills.sh</h3>
                <p className="text-xs text-white/60 leading-relaxed">The open-source registry for modular AI Agent skills. CLI-native installations.</p>
              </div>
            </a>

            {/* Cursor Directory */}
            <a href="https://cursor.directory" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center gap-3 w-[260px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:bg-blue-500/20 transition-colors">
                <img src="/courses/aifoundations-concept2application/images/favicons/cursor-directory.png" alt="Cursor Directory" className="w-6 h-6 rounded-sm object-contain" onError={(e) => { e.currentTarget.src = "/courses/aifoundations-concept2application/images/favicons/github.png" }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">cursor.directory</h3>
                <p className="text-xs text-white/60 leading-relaxed">Massive community-curated collection of framework-specific .cursorrules.</p>
              </div>
            </a>

            {/* Awesome Skills */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center gap-3 w-[260px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-orange-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 shrink-0 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:bg-orange-500/20 transition-colors">
                <img src="/courses/aifoundations-concept2application/images/favicons/github-skills.png" alt="GitHub" className="w-6 h-6 rounded-sm object-contain" onError={(e) => { e.currentTarget.src = "/courses/aifoundations-concept2application/images/favicons/github.png" }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">GitHub Collections</h3>
                <p className="text-xs text-white/60 leading-relaxed">Search 'awesome ai skills' on GitHub for curated lists of advanced workflows.</p>
              </div>
            </a>

        </div>

        {/* Bottom: Build Your Own */}
        <div className="flex justify-center w-full mt-6 shrink-0">
           <div ref={bottomActionRef} className="bg-primary/10 backdrop-blur-3xl border border-primary/30 rounded-2xl p-5 shadow-xl flex items-center gap-4 max-w-3xl opacity-0 relative group/action">
              <div className="w-12 h-12 bg-black/40 rounded-xl border border-primary/40 flex items-center justify-center shrink-0">
                 <TerminalSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="pr-12">
                <h3 className="text-base font-black text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                  The Meta-Skill Challenge
                  <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/20">Recommended</span>
                </h3>
                <p className="text-sm font-medium text-primary/70 leading-relaxed">
                  A true AI developer doesn't write skills manually. Click the copy button to grab the command for <strong>Anthropic's Skill Creator</strong> (the current gold standard on skills.sh). Install it, and run it to automatically generate highly optimized skills on the fly!
                </p>
              </div>
              
              <button 
                onClick={handleCopy}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 border border-primary/30 flex items-center justify-center transition-all group-hover/action:border-primary shadow-[0_0_15px_rgba(167,218,219,0.2)] hover:shadow-[0_0_20px_rgba(167,218,219,0.5)] active:scale-95"
                title="Copy installation command"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
