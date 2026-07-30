import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";

export function TokensIntroSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fullWordRef = useRef<HTMLDivElement>(null);
  const tile1Ref = useRef<HTMLDivElement>(null);
  const tile2Ref = useRef<HTMLDivElement>(null);
  const tile3Ref = useRef<HTMLDivElement>(null);
  const equalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Before we solve the problem, we need to understand how AI measures information. Let's talk about Tokens—the true currency of AI. An AI doesn't read words like we do. It breaks text into smaller chunks called tokens. A simple word might be one token, but a complex word like 'Hamburger' gets chopped into 'Ham', 'bur', and 'ger'. Three tokens for one word."
    
    const timeline = gsap.timeline({ paused: true, onComplete: () => setIsDone(true) });
    
    if (fullWordRef.current && tile1Ref.current && tile2Ref.current && tile3Ref.current && equalsRef.current) {
      // Show "Hamburger" initially
      // At "complex word like Hamburger" (~14s)
      timeline.fromTo(fullWordRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" }, 14);
      
      // "gets chopped into" (~16s)
      timeline.to(fullWordRef.current, { opacity: 0, y: -20, duration: 0.5 }, 16);
      timeline.fromTo(equalsRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }, 16.2);
      
      // "Ham" (~17s)
      timeline.fromTo(tile1Ref.current, { opacity: 0, y: 30, rotation: -10 }, { opacity: 1, y: 0, rotation: -2, duration: 0.6, ease: "back.out(1.5)" }, 17);
      // "bur" (~17.5s)
      timeline.fromTo(tile2Ref.current, { opacity: 0, y: 30, rotation: 10 }, { opacity: 1, y: 0, rotation: 3, duration: 0.6, ease: "back.out(1.5)" }, 17.5);
      // "ger" (~18s)
      timeline.fromTo(tile3Ref.current, { opacity: 0, y: 30, rotation: -5 }, { opacity: 1, y: 0, rotation: -1, duration: 0.6, ease: "back.out(1.5)" }, 18);
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
    setNavOverride({
      nextDisabled: !isDone,
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [isDone, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto">
      <div className="shrink-0 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">Tokens: The Currency of AI</h2>
        <p className="text-lg text-muted-foreground">AI models don&apos;t read words. They read subword chunks called tokens.</p>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center w-full" ref={containerRef}>
        
        {/* Scrabble Tile Animation Container */}
        <div className="relative w-full max-w-4xl h-72 rounded-[2.5rem] bg-background/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0 opacity-50" />
          
          {/* Full Word */}
          <div ref={fullWordRef} className="absolute text-5xl md:text-7xl font-black tracking-tight text-foreground z-10 opacity-0 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Hamburger
          </div>

          <div className="flex items-center gap-6 md:gap-10 z-20">
            {/* Tile 1 */}
            <div ref={tile1Ref} className="w-24 h-28 md:w-32 md:h-36 bg-gradient-to-br from-[#E2D4B7] to-[#D1C2A3] rounded-xl shadow-[2px_10px_0px_#9C8A6B,0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center relative opacity-0 transform-gpu">
              <div className="absolute inset-1 border border-black/10 rounded-lg pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay rounded-xl pointer-events-none" />
              <span className="text-3xl md:text-5xl font-black text-black/80 font-mono tracking-tighter">Ham</span>
              <span className="absolute bottom-2 right-3 text-sm md:text-base font-bold text-black/50">3</span>
            </div>

            <div ref={equalsRef} className="text-3xl md:text-5xl font-bold text-white/50 opacity-0">+</div>

            {/* Tile 2 */}
            <div ref={tile2Ref} className="w-24 h-28 md:w-32 md:h-36 bg-gradient-to-br from-[#E2D4B7] to-[#D1C2A3] rounded-xl shadow-[2px_10px_0px_#9C8A6B,0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center relative opacity-0 transform-gpu">
              <div className="absolute inset-1 border border-black/10 rounded-lg pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay rounded-xl pointer-events-none" />
              <span className="text-3xl md:text-5xl font-black text-black/80 font-mono tracking-tighter">bur</span>
              <span className="absolute bottom-2 right-3 text-sm md:text-base font-bold text-black/50">4</span>
            </div>

            <div className="text-3xl md:text-5xl font-bold text-white/50 opacity-0">+</div> {/* Invisible spacer to keep layout balanced if needed, or we just rely on flex */}

            {/* Tile 3 */}
            <div ref={tile3Ref} className="w-24 h-28 md:w-32 md:h-36 bg-gradient-to-br from-[#E2D4B7] to-[#D1C2A3] rounded-xl shadow-[2px_10px_0px_#9C8A6B,0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-center relative opacity-0 transform-gpu">
              <div className="absolute inset-1 border border-black/10 rounded-lg pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay rounded-xl pointer-events-none" />
              <span className="text-3xl md:text-5xl font-black text-black/80 font-mono tracking-tighter">ger</span>
              <span className="absolute bottom-2 right-3 text-sm md:text-base font-bold text-black/50">3</span>
            </div>
          </div>
          
          <div className="absolute bottom-6 font-mono text-sm text-primary/80 uppercase tracking-widest px-4 py-1 rounded-full border border-primary/20 bg-primary/10">
            1 Word = 3 Tokens
          </div>
        </div>

      </div>
    </div>
  );
}
