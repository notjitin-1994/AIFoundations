import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Layers, DownloadCloud, BrainCircuit, Workflow } from "lucide-react";

export function SkillsDeepDiveSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2 + i * 0.15, ease: "power3.out" }
        );
      }
    });
  }, []);

  useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  const cards = [
    {
      icon: <Layers className="w-6 h-6 text-primary" />,
      title: "Types of Skills",
      description: "Agents use specialized skill sets: Workflow Skills for step-by-step processes, Context Skills for deep domain knowledge, and Expert Skills to emulate senior roles.",
    },
    {
      icon: <DownloadCloud className="w-6 h-6 text-primary" />,
      title: "Discovery & Installation",
      description: "Search community repositories or use built-in CLI commands to instantly pull verified skills into your workspace, injecting them into the agent's context.",
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: "Digitize Your SME",
      description: "Pour your Subject Matter Expertise (SME) into a markdown file. Codify your mental models and standard operating procedures to clone your workflow.",
    },
    {
      icon: <Workflow className="w-6 h-6 text-primary" />,
      title: "Meta-Skills",
      description: "The ultimate leverage: create a 'Skill Creator' skill. Teach the AI how to analyze a new domain and automatically generate highly optimized skills for itself.",
    }
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,218,219,0.05),transparent_70%)] pointer-events-none" />

      <div ref={containerRef} className="flex-1 w-full flex flex-col items-center justify-center gap-4 md:gap-6 relative z-10 px-2 py-2">
        
        {/* Title Section */}
        <div ref={titleRef} className="text-center shrink-0 mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <Workflow className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Mastering Skills</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight mb-3">
            The Power of Modularity
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
            Skills are the building blocks of AI autonomy. By modularizing instructions, you prevent context bloat and empower agents to dynamically load exactly what they need, when they need it.
          </p>
        </div>

        {/* 2x2 Grid of Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl mx-auto shrink-0 min-h-0">
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-xl p-4 md:p-5 flex gap-4 hover:border-primary/30 hover:bg-white/5 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                {card.icon}
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">{card.title}</h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
