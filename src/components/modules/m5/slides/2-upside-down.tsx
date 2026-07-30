import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { ArrowDown, Layers, Wrench, FileText, Sparkles, Database, ArrowUp } from "lucide-react";

export function UpsideDownSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // Initial State: Top-down arrow is visible, cards are dim
    timeline.set(".flow-arrow", { rotation: 0, color: "rgba(255,255,255,0.2)" });
    
    // "We're going upside down." (0-2s)
    // Flip the arrow to point UP and make it primary color
    timeline.to(".flow-arrow", { rotation: 180, color: "#a7dadb", duration: 1.0, ease: "back.out(1.5)" }, 1.0)
            .to(".direction-text", { opacity: 0, duration: 0.3 }, 1.0)
            .set(".direction-text", { textContent: "BOTTOM-UP ARCHITECTURE", color: "#a7dadb" }, 1.3)
            .to(".direction-text", { opacity: 1, duration: 0.3 }, 1.4);
            
    // "We look at your harness and toolset first..." (2-5s)
    timeline.to(".highlight-base", { 
      borderColor: "rgba(167,218,219,0.8)", 
      backgroundColor: "rgba(167,218,219,0.1)",
      scale: 1.02,
      duration: 0.6,
      stagger: -0.2 // Animates from bottom (Harness) to Tools
    }, 2.5);

    // "...and then use AI, skills, and MCPs to enrich your context and prompt engineering." (5-10s)
    timeline.to(".highlight-top", { 
      borderColor: "rgba(79,70,229,0.8)", 
      backgroundColor: "rgba(79,70,229,0.1)",
      scale: 1.02,
      duration: 0.6,
      stagger: -0.2 // Animates from Context up to Prompt
    }, 5.5)
    .to(".magic-particles", { opacity: 1, duration: 1.0 }, 6.5);

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
    setNavOverride({
      nextDisabled: !isFinished,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [isFinished, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-5xl mx-auto overflow-hidden">
      <div className="text-center mb-8 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">The Upside-Down Approach</h2>
        <p className="text-white/60 font-light">We don't start with the prompt. We start with the foundation.</p>
      </div>

      <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-center gap-10 relative min-h-0">
        
        {/* Flow Indicator (Left Side on Desktop, Hidden on Mobile if too small, but flex handles it) */}
        <div className="hidden md:flex flex-col items-center justify-center gap-4 w-1/4">
          <div className="flow-arrow w-16 h-16 rounded-full border-2 border-current flex items-center justify-center text-white/20 transition-colors">
            <ArrowDown className="w-8 h-8" />
          </div>
          <span className="direction-text text-sm font-bold tracking-widest text-white/20 uppercase text-center">
            Top-Down (Naive)
          </span>
        </div>

        {/* The Stack (Right Side) */}
        <div className="flex flex-col gap-4 w-full md:w-3/4 max-w-lg">
          
          {/* Top of normal stack (Prompt) */}
          <div className="highlight-top stack-item bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 relative overflow-hidden">
            <div className="magic-particles absolute inset-0 opacity-0 bg-[url('/courses/aifoundations-concept2application/noise.png')] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 magic-particles" />
            
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center relative z-10">
              <FileText className="w-6 h-6 text-white/70" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-white text-lg">4. Prompt Engineering</h3>
              <p className="text-sm text-white/50">Instruction Design & Output Formatting</p>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-400 opacity-0 magic-particles relative z-10 shrink-0" />
          </div>

          <div className="highlight-top stack-item bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 relative overflow-hidden">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center relative z-10">
              <Database className="w-6 h-6 text-white/70" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-white text-lg">3. Context Engineering</h3>
              <p className="text-sm text-white/50">Grounding, RAG & Memory Injection</p>
            </div>
          </div>

          {/* Bottom of normal stack (Harness & Tools) */}
          <div className="highlight-base stack-item bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 relative">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">2. Tools & MCPs</h3>
              <p className="text-sm text-white/50">Agent Capabilities & Executable Actions</p>
            </div>
          </div>

          <div className="highlight-base stack-item bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 relative">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center">
              <Layers className="w-6 h-6 text-white/70" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">1. Harness Selection</h3>
              <p className="text-sm text-white/50 leading-tight">Infrastructure for <span className="text-primary/80">{data.title}</span></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
