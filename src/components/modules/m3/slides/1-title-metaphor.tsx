import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Globe, Terminal, Wrench, Zap, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";

export function TitleMetaphorSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Narration: "A raw AI is like a brain trapped in a jar. It can think and talk, but it can't touch the outside world. To take action—to search the web, read files, or control software—it needs a Toolbelt."
    const timeline = gsap.timeline({ paused: true });

    if (headlineRef.current && textRef.current && brainRef.current && toolsRef.current && linesRef.current) {
      // Intro entrance
      timeline.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0);
      
      // Brain appears (trapped)
      timeline.fromTo(brainRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, 0.5);
      
      // Text appears
      timeline.fromTo(textRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 1.5);

      // Reveal tools cascading around the brain
      const toolIcons = toolsRef.current.children;
      const svgLines = linesRef.current.children;
      
      timeline.fromTo(
        toolIcons,
        { opacity: 0, scale: 0, rotate: -45 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" },
        5.5 // "To take action..."
      );
      
      timeline.fromTo(
        svgLines,
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
        5.6 // Connect the lines slightly after tools appear
      );
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
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-8 max-w-6xl mx-auto relative group">
      {/* Background Ambience - Monochromatic Teal */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div ref={containerRef} className="z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
        
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h1 ref={headlineRef} className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-6 tracking-tight drop-shadow-md">
            The Toolbelt
          </h1>
          
          <p ref={textRef} className="text-lg md:text-xl font-medium text-white/60 max-w-xl leading-relaxed">
            A raw AI is like a brain trapped in a jar. It can think and talk, but it can&apos;t touch the outside world. To take action—to search the web, read files, or control software—it needs a Toolbelt.
          </p>
        </div>

        {/* Right Visualizer */}
        <div className="flex-1 relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
          
          {/* Connection Lines */}
          <svg ref={linesRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: "drop-shadow(0 0 8px rgba(167,218,219,0.5))" }}>
            <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="2" className="text-primary/40" strokeDasharray="200" strokeDashoffset="200" />
            <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="2" className="text-primary/40" strokeDasharray="200" strokeDashoffset="200" />
            <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="currentColor" strokeWidth="2" className="text-primary/40" strokeDasharray="200" strokeDashoffset="200" />
            <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="currentColor" strokeWidth="2" className="text-primary/40" strokeDasharray="200" strokeDashoffset="200" />
          </svg>

          {/* Central AI Brain */}
          <div ref={brainRef} className="relative z-20">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1.05 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            />
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black/80 backdrop-blur-2xl border-2 border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(167,218,219,0.3)] relative z-10 group-hover:border-primary/80 transition-all duration-500">
              <BrainCircuit className="w-10 h-10 md:w-14 md:h-14 text-primary drop-shadow-[0_0_15px_rgba(167,218,219,0.8)]" />
            </div>
          </div>

          {/* Orbiting Tools */}
          <div ref={toolsRef} className="absolute inset-0 pointer-events-none">
            {/* Top Left - Globe */}
            <div className="absolute top-[10%] left-[10%] md:top-[15%] md:left-[15%] w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 hover:border-primary/50 transition-all duration-300">
              <Globe className="w-8 h-8 md:w-10 md:h-10 text-white/50 hover:text-primary transition-colors duration-300" />
            </div>
            {/* Top Right - Terminal */}
            <div className="absolute top-[10%] right-[10%] md:top-[15%] md:right-[15%] w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 hover:border-primary/50 transition-all duration-300">
              <Terminal className="w-8 h-8 md:w-10 md:h-10 text-white/50 hover:text-primary transition-colors duration-300" />
            </div>
            {/* Bottom Left - Wrench */}
            <div className="absolute bottom-[10%] left-[10%] md:bottom-[15%] md:left-[15%] w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 hover:border-primary/50 transition-all duration-300">
              <Wrench className="w-8 h-8 md:w-10 md:h-10 text-white/50 hover:text-primary transition-colors duration-300" />
            </div>
            {/* Bottom Right - Zap */}
            <div className="absolute bottom-[10%] right-[10%] md:bottom-[15%] md:right-[15%] w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-xl pointer-events-auto hover:scale-110 hover:border-primary/50 transition-all duration-300">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-white/50 hover:text-primary transition-colors duration-300" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
