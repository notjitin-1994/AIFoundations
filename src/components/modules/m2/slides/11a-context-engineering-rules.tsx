import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion } from "motion/react";
import { Filter, ArrowDownToLine, HardDrive } from "lucide-react";

export function ContextEngineeringRulesSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "Context Engineering is the art of managing AI working memory. The three golden rules: keep the context clean by filtering noise, put the most important instructions at the very end to exploit the U-curve, and use external memory to offload large datasets."
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5);
    
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
    if (isFinished && onComplete) onComplete();
  }, [isFinished, onComplete]);

  const cards = [
    {
      icon: Filter,
      title: "Clean Context",
      description: "Signal over noise. Don't send entire email threads if you only need the summary. Filter out formatting, headers, and irrelevant chatter.",
      delay: 4.5,
    },
    {
      icon: ArrowDownToLine,
      title: "Strategic Ordering",
      description: "Exploit the U-shaped curve. Place your system prompts at the top, and your specific instructions or questions at the very bottom.",
      delay: 7.5,
    },
    {
      icon: HardDrive,
      title: "External Memory",
      description: "Never paste massive datasets into a prompt. Store the data in a database and let the AI retrieve only what it needs.",
      delay: 11.0,
    }
  ];

  const customEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-8 max-w-6xl mx-auto relative group">
      
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-10 z-10 text-center mt-4">
        <h2 ref={headingRef} className="text-4xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Context Engineering
        </h2>
        <p ref={pRef} className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          The 2026 Standards for managing the AI working memory.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[200px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full z-10">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40, rotateX: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                ease: customEase, 
                delay: card.delay 
              }}
              className="bg-black/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(167,218,219,0.15)] hover:border-primary/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="w-20 h-20 rounded-3xl bg-black/80 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-10 backdrop-blur-md">
                <card.icon className="w-8 h-8 text-white/50 group-hover:text-primary transition-colors duration-500 relative z-10 drop-shadow-md" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 relative z-10 tracking-tight transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(167,218,219,0.8)] group-hover:text-primary">{card.title}</h3>
              <p className="text-white/50 font-medium text-sm leading-relaxed relative z-10 group-hover:text-white/80 transition-colors duration-500">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
