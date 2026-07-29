import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion, AnimatePresence } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Book, Maximize2 } from "lucide-react";
import { useLRS } from "@/hooks/use-lrs";

export function ContextWindowsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();

  const [sliderValue, setSliderValue] = useState(0); // 0 to 100
  const [interacted, setInteracted] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "A context window is the absolute limit of tokens an AI can process at one time. In 2023, eight thousand tokens was considered large. By 2026, models can process over a million tokens in a single prompt."
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
    setNavOverride({
      nextLabel: "",
      nextDisabled: !interacted, // force them to play with the slider
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [interacted, setNavOverride, onComplete]);

  // Map slider 0-100 to tokens
  // Non-linear scale for dramatic effect: 0 = 8k, 50 = 128k, 100 = 1M
  const getTokens = (val: number) => {
    if (val < 50) {
      // 0 to 50 maps to 8k to 128k
      return Math.round(8000 + (val / 50) * 120000);
    } else {
      // 50 to 100 maps to 128k to 1M
      return Math.round(128000 + ((val - 50) / 50) * 872000);
    }
  };

  const tokens = getTokens(sliderValue);
  
  // Rule of thumb: 100,000 tokens ~ 1 average book
  const booksCount = Math.max(1, Math.round(tokens / 100000));
  
  // Format tokens nicely
  const formattedTokens = tokens > 1000000 
    ? `${(tokens / 1000000).toFixed(1)}M` 
    : `${Math.round(tokens / 1000)}k`;

  // Mapping logic for window width (5% to 100%)
  const windowWidth = Math.max(5, sliderValue);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background relative">
      
      {/* 1. DARK BACKGROUND DATA (Latent Memory) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none blur-[3px]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="data-pattern" width="60" height="40" patternUnits="userSpaceOnUse">
               <rect x="0" y="0" width="20" height="6" fill="currentColor" rx="3" opacity="0.4"/>
               <rect x="26" y="0" width="14" height="6" fill="currentColor" rx="3" opacity="0.7"/>
               <rect x="46" y="0" width="8" height="6" fill="currentColor" rx="3" opacity="0.3"/>
               
               <rect x="0" y="14" width="35" height="6" fill="currentColor" rx="3" opacity="0.5"/>
               <rect x="41" y="14" width="12" height="6" fill="currentColor" rx="3" opacity="0.8"/>
               
               <rect x="0" y="28" width="12" height="6" fill="currentColor" rx="3" opacity="0.6"/>
               <rect x="18" y="28" width="28" height="6" fill="currentColor" rx="3" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#data-pattern)" className="text-primary" />
        </svg>
      </div>

      {/* 2. ILLUMINATED DATA (Inside Context Window) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{ clipPath: `inset(0% ${50 - windowWidth/2}% 0% ${50 - windowWidth/2}%)` }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#data-pattern)" className="text-primary drop-shadow-[0_0_12px_rgba(167,218,219,1)]" />
        </svg>
      </motion.div>

      {/* 3. THE GLASS WINDOW PANE (Borders & Overlay) */}
      <motion.div
        className="absolute top-0 bottom-0 border-x-[3px] border-primary shadow-[0_0_80px_rgba(167,218,219,0.2)] bg-primary/5 z-20 pointer-events-none flex items-center justify-center"
        animate={{ 
          left: `${50 - windowWidth/2}%`, 
          right: `${50 - windowWidth/2}%` 
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        {/* Floating Equivalent Badge */}
        <motion.div 
          className="flex flex-col items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl whitespace-nowrap min-w-[200px]"
          animate={{ scale: sliderValue < 10 ? 0.8 : 1, opacity: sliderValue < 2 ? 0 : 1 }}
          transition={{ type: "spring" }}
        >
          <div className="flex items-center gap-2 text-primary/80">
            <Book className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Equivalent Volume</span>
          </div>
          <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ~{booksCount} Book{booksCount !== 1 ? 's' : ''}
          </span>
        </motion.div>
      </motion.div>

      {/* --- UI OVERLAYS --- */}
      
      {/* Header */}
      <div className="relative z-30 shrink-0 text-center p-6 md:p-10 pb-0">
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          Context Windows: The &quot;Working Memory&quot;
        </h2>
        <p ref={pRef} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto text-balance drop-shadow-md bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5">
          A context window is the absolute limit of tokens an AI can process at one time. This memory holds your prompt, attached files, and the entire response.
        </p>
      </div>

      <div className="flex-1" /> {/* Spacer */}

      {/* Bottom Floating Control Dock */}
      <div className="relative z-30 shrink-0 w-full max-w-5xl mx-auto mb-6 md:mb-10 px-6">
        <div className="bg-card/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">
          
          {/* Slider Section */}
          <div className="flex-1 w-full space-y-8">
            <div className="relative group/slider cursor-grab active:cursor-grabbing h-10 flex items-center">
              <div className="absolute left-0 right-0 h-4 bg-black/60 rounded-full border border-white/5 shadow-inner" />
              <div 
                className="absolute left-0 h-4 bg-gradient-to-r from-primary/40 to-primary rounded-full shadow-[0_0_20px_rgba(167,218,219,0.6)] transition-all duration-75"
                style={{ width: `${sliderValue}%` }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderValue} 
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                  setInteracted(true);
                  track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/5/context-windows/slider", "Context Windows Slider");
                }}
                className="w-full h-full opacity-0 appearance-none absolute cursor-[inherit] z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:h-12 [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:h-12 [&::-moz-range-thumb]:appearance-none"
              />
              {/* Custom Thumb */}
              <div 
                className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1)] border-[4px] border-primary pointer-events-none transition-transform group-active/slider:scale-110 z-10"
                style={{ left: `calc(${sliderValue}% - 16px)` }}
              />
            </div>
            <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-widest px-2">
              <span>2023 (8k)</span>
              <span>2024 (128k)</span>
              <span>2026 (1M+)</span>
            </div>
          </div>

          {/* Exact Value */}
          <div className="shrink-0 md:w-56 text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2">Capacity</div>
            <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-tighter drop-shadow-md">
              {formattedTokens}
            </div>
            <div className="text-sm font-medium text-primary/60 mt-2 uppercase tracking-widest">tokens</div>
          </div>

        </div>
      </div>
    </div>
  );
}
