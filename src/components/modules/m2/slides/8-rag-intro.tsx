import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion, AnimatePresence } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { BookOpen, Search, BrainCircuit, FileText, Sparkles } from "lucide-react";

export function RagIntroSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();

  const [ragActive, setRagActive] = useState(false);
  const [ragPhase, setRagPhase] = useState(0);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "So, if stuffing a massive context window doesn't work, what does? The answer is Retrieval-Augmented Generation, or RAG. It's like giving the AI an open-book test."
    const timeline = gsap.timeline({ paused: true });
    
    timeline.fromTo(headingRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0.5);
    timeline.fromTo(pRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 2.5);
    
    // Fade in the entire visual apparatus
    timeline.fromTo(visualRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.5, ease: "expo.out" }, 4.0);
    
    // Trigger the RAG animation loop
    timeline.add(() => setRagActive(true), 6.5);
    
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

  // The Animation Cycle Engine
  useEffect(() => {
    if (!ragActive) {
      setRagPhase(0);
      return;
    }
    
    let timeoutId: NodeJS.Timeout;
    
    const cycle = (phase: number) => {
      setRagPhase(phase);
      
      let nextDelay = 1000;
      let nextPhase = 0;
      
      switch(phase) {
        case 1: nextDelay = 800; nextPhase = 2; break; // Search queries book
        case 2: nextDelay = 800; nextPhase = 3; break; // Book highlights chunk
        case 3: nextDelay = 1200; nextPhase = 4; break; // Transmitting to LLM
        case 4: nextDelay = 2000; nextPhase = 1; break; // LLM Generates & Restarts
      }
      
      timeoutId = setTimeout(() => cycle(nextPhase), nextDelay);
    };
    
    cycle(1);
    
    return () => clearTimeout(timeoutId);
  }, [ragActive]);



  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Dynamic Ambient Background (Full Bleed) */}
      <div 
        className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] pointer-events-none transition-all duration-1000 ease-out z-0" 
        style={{ 
          background: 'radial-gradient(circle, rgba(167, 218, 219, 0.05) 0%, rgba(167, 218, 219, 0) 70%)',
        }} 
      />

      <div className="w-full h-full flex flex-col md:flex-row relative p-6 md:p-10 max-w-7xl mx-auto gap-8 lg:gap-16 items-center z-10">
        
        {/* LEFT COLUMN: Header & Text */}
        <div className="w-full md:w-[40%] shrink-0 flex flex-col justify-center">
          <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 drop-shadow-sm text-balance tracking-tight">
            The Open-Book Test
          </h2>
          <p ref={pRef} className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-md">
            If stuffing a massive context window fails, what works? <br/><br/>
            Enter <strong className="text-white font-bold tracking-wide">RAG</strong>. It allows the AI to dynamically look up exactly what it needs, exactly when it needs it.
          </p>
        </div>

        {/* RIGHT COLUMN: The RAG Interactive Visual */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center">
          
          <div ref={visualRef} className="w-full max-w-2xl rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px] border border-white/5">
            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
              style={{
                backgroundImage: 'url(/images/rag_background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(20%)'
              }}
            />
            {/* Dark Glass Overlay to ensure UI readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

            {/* Subtle inner top glare */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            
            <div className="flex items-center justify-between w-full relative z-10">
              
              {/* 1. The Open Book (Knowledge Base) */}
              <div className="flex flex-col items-center gap-4 relative z-20">
                <div className="w-32 lg:w-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-inner flex flex-col gap-2.5 relative overflow-hidden">
                  <div className="text-[9px] font-black uppercase tracking-widest text-primary/50 text-center mb-1 flex items-center justify-center gap-1.5">
                    <BookOpen className="w-3 h-3" />
                    Knowledge Base
                  </div>
                  
                  {/* Database Rows */}
                  <div className="h-4 w-full rounded bg-white/5" />
                  <div className="h-4 w-[85%] rounded bg-white/5" />
                  
                  {/* The Targeted Chunk */}
                  <div className="relative">
                    <div className={`h-5 w-full rounded transition-all duration-500 border ${
                      ragPhase >= 2 && ragPhase <= 3 
                        ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(167,218,219,0.3)]' 
                        : 'bg-white/5 border-transparent'
                    }`} />
                  </div>
                  
                  <div className="h-4 w-[90%] rounded bg-white/5" />
                  <div className="h-4 w-full rounded bg-white/5" />
                </div>
              </div>

              {/* 2. The Retrieval Engine Bridge */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 relative h-32">
                
                {/* Track */}
                <div className="w-full h-12 relative overflow-hidden flex items-center">
                  <div className="w-full h-[2px] bg-white/5 absolute" />
                  
                  {/* Search Ping Animation (Phase 1) */}
                  <AnimatePresence>
                    {ragPhase === 1 && (
                      <motion.div 
                        initial={{ left: "50%", width: 0, opacity: 1 }}
                        animate={{ left: "0%", width: "50%", opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute h-[2px] bg-primary blur-[1px]"
                      />
                    )}
                  </AnimatePresence>

                  {/* Data Transmission (Phase 3) */}
                  <AnimatePresence>
                    {ragPhase === 3 && (
                      <motion.div 
                        initial={{ left: "0%", opacity: 0 }}
                        animate={{ left: "100%", opacity: [0, 1, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "circIn", times: [0, 0.2, 1] }}
                        className="absolute w-8 h-[2px] bg-primary shadow-[0_0_10px_rgba(167,218,219,1)]"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Node */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-background ${
                  ragPhase === 1 || ragPhase === 2
                    ? 'border-primary shadow-[0_0_20px_rgba(167,218,219,0.4)] scale-110' 
                    : 'border-white/10 shadow-none scale-100'
                }`}>
                  <Search className={`w-4 h-4 transition-colors duration-500 ${ragPhase === 1 || ragPhase === 2 ? 'text-primary' : 'text-white/30'}`} />
                </div>
                
                <span className={`absolute top-[calc(50%+1.5rem)] text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  ragPhase === 1 ? 'text-primary' : 'text-white/30'
                }`}>
                  Retrieve
                </span>
              </div>

              {/* 3. The Language Model */}
              <div className="flex flex-col items-center gap-4 relative z-20">
                <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-3xl backdrop-blur-xl border flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden ${
                  ragPhase === 4 
                    ? 'bg-primary/10 border-primary shadow-[0_0_40px_rgba(167,218,219,0.3)]' 
                    : 'bg-black/40 border-white/10 shadow-inner'
                }`}>
                  
                  {ragPhase === 4 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl"
                    />
                  )}

                  <BrainCircuit className={`w-10 h-10 lg:w-12 lg:h-12 transition-colors duration-500 mb-3 ${
                    ragPhase === 4 ? 'text-primary' : 'text-white/20'
                  }`} />
                  
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/50 text-center">
                    Language Model
                  </div>
                </div>

                {/* Generated Output Popover */}
                <AnimatePresence>
                  {ragPhase === 4 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-background px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl whitespace-nowrap z-50"
                    >
                      <Sparkles className="w-3 h-3 text-primary" />
                      Accurate Answer
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
