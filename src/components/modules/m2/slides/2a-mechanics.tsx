import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FileText, Bot, ArrowRight } from "lucide-react";

export function MechanicsSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "To understand why this happens, you have to look at how an AI processes conversation history. It doesn't read the chat like a book; it treats it like a conveyor belt with a strict length limit. This is called a First-In-First-Out, or FIFO, queue. When you paste in a massive document, the newest tokens push the oldest tokens—like your critical system instructions—right off the edge of the belt."
    
    const timeline = gsap.timeline({ paused: true });
    
    if (blocksRef.current && promptRef.current) {
      // 1. Show normal state (prompt is safe inside the window)
      // Wait for audio "conveyor belt with a strict length limit" (~6.5s)
      timeline.to(promptRef.current, { x: 0, duration: 0.1 }, 6.5);
      
      // 2. Simulate "massive document" pushing it out
      // Audio "When you paste in a massive document" (~15s)
      timeline.to(
        blocksRef.current,
        { 
          x: -420, 
          duration: 3.5, 
          ease: "power3.inOut"
        },
        14.5
      );
      
      // 3. Prompt falls off the edge
      timeline.to(
        promptRef.current,
        {
          y: 120,
          x: "-=60",
          opacity: 0,
          rotateZ: -12,
          scale: 0.9,
          duration: 1.2,
          ease: "power3.in"
        },
        15.5
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto">
      <div className="shrink-0 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">The Mechanics of Forgetting</h2>
        <p className="text-lg text-muted-foreground">The context window acts as a First-In-First-Out (FIFO) queue.</p>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center w-full" ref={containerRef}>
        
        {/* High-End Glassmorphism Context Window */}
        <div className="relative w-full max-w-5xl h-64 rounded-[2.5rem] bg-background/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(167,218,219,0.15)] flex items-center overflow-hidden">
          
          {/* Glowing Track Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 z-0" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          
          {/* Label */}
          <div className="absolute top-6 left-8 flex items-center gap-2 z-20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-primary tracking-widest uppercase text-xs">Context Window Limit: 4,000 Tokens</span>
          </div>

          <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
            Newest Tokens Ingested <ArrowRight className="ml-2 w-4 h-4" />
          </div>
          
          <div className="w-full flex items-center justify-start pl-16 h-full gap-6 relative z-10" ref={blocksRef}>
            
            {/* The Oldest Token (System Prompt) */}
            <div 
              ref={promptRef}
              className="w-56 shrink-0 h-36 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(167,218,219,0.15)] flex flex-col items-center justify-center p-5 gap-3 relative transition-all z-20"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
              <Bot className="w-8 h-8 text-primary" />
              <div className="text-sm font-bold text-foreground text-center">System Instructions</div>
              <div className="text-xs text-primary/80 text-center line-clamp-2 px-2">&quot;CRITICAL RULE: Call me Captain&quot;</div>
            </div>

            {/* Conversation History */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-32 shrink-0 h-28 bg-primary/5 backdrop-blur-md border border-primary/10 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 gap-2 opacity-70 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl" />
                <div className="text-xs font-bold text-primary/60 uppercase tracking-wider">Message {i}</div>
                <div className="w-12 h-1 bg-primary/20 rounded-full mt-2" />
                <div className="w-8 h-1 bg-primary/20 rounded-full" />
              </div>
            ))}
            
            {/* The Massive Document pushing in */}
            <div className="w-[450px] shrink-0 h-36 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(167,218,219,0.2)] flex flex-col items-center justify-center p-5 gap-3 ml-12 relative overflow-hidden z-20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 pointer-events-none" />
              <FileText className="w-10 h-10 text-primary z-10 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
              <div className="text-base font-bold text-foreground z-10">Massive Document</div>
              <div className="text-xs font-bold text-primary/80 z-10 uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full">3,500 Tokens</div>
            </div>

          </div>

          {/* Falloff Edge Indicator (Left side) */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-30 pointer-events-none border-r border-primary/20 flex items-center justify-start opacity-90">
            <div className="h-full w-1 bg-primary/50 shadow-[0_0_20px_rgba(167,218,219,0.8)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
