import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { ClipboardCheck } from "lucide-react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";

export function AssessmentIntroSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "Before we move to the Engine Room, let's verify your understanding of function calling and MCP."
    const timeline = gsap.timeline({ paused: true });
    
    if (containerRef.current) {
        timeline.fromTo(
            containerRef.current, 
            { opacity: 0, scale: 0.95, y: 30 }, 
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }, 
            0
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
    setNavOverride({
      nextLabel: "", // Icon only
      nextDisabled: false,
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-5xl mx-auto items-center justify-center relative">
      
      {/* Background visual flair */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div ref={containerRef} className="w-full max-w-3xl bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center text-center shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30" />
        
        <div className="w-24 h-24 rounded-[2rem] bg-primary/20 border border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(167,218,219,0.2)] group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-white/5 pointer-events-none" />
          <ClipboardCheck className="w-12 h-12 text-primary" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 tracking-tight drop-shadow-md relative z-10">
          Module 3 Knowledge Check
        </h2>
        
        <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed max-w-xl mb-10 relative z-10">
          Before we proceed to Module 4 (The Engine Room), let&apos;s ensure you have a solid grasp on AI tools and the Model Context Protocol.
        </p>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left relative z-10">
          <div className="bg-black/40 border border-white/10 rounded-[1.5rem] p-6 shadow-inner backdrop-blur-md">
            <h3 className="font-black text-xs uppercase tracking-widest text-primary mb-4">Topics Covered</h3>
            <ul className="text-sm font-medium text-white/80 space-y-3">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" /> Function Calling Mechanics</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" /> The Role of the Harness</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" /> MCP (Model Context Protocol)</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-teal-400/50" /> Tool Capabilities</li>
            </ul>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-[1.5rem] p-6 shadow-inner backdrop-blur-md">
            <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 mb-4">Requirements</h3>
            <ul className="text-sm font-medium text-white/80 space-y-3">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50" /> 5 randomly drawn questions</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50" /> Must answer all correctly</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400/50" /> Cannot proceed until passed</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
