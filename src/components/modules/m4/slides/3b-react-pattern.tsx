import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Terminal, Lightbulb, Wrench, ArrowRight, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReactPatternSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  
  const [activeStep, setActiveStep] = useState(0);
  
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initial entrance
    gsap.fromTo(".fade-up", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" });

    const timeline = gsap.timeline({ paused: true });
    
    // "Enter ReAct: Reason, then Act." (0-4s)
    // "ReAct forces the model into an internal monologue." (4-8s)
    // "By thinking out loud in a scratchpad," (8-11s)
    // "the agent catches its own logical flaws before it ever touches your systems." (11-14s)

    timeline.call(() => setActiveStep(1), [], 4.0) // Goal
            .call(() => setActiveStep(2), [], 6.0) // Thought 1
            .call(() => setActiveStep(3), [], 8.0) // Action 1
            .call(() => setActiveStep(4), [], 11.0) // Thought 2 (catching error)
            .call(() => setActiveStep(5), [], 13.0); // Safe Action
            
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
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    const isDone = activeStep === 5;
    setNavOverride({
      nextDisabled: !isDone,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [activeStep, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-10 max-w-6xl mx-auto overflow-hidden relative">
      
      {/* Background Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000",
        activeStep >= 2 ? "bg-primary/10" : "bg-white/5"
      )} />

      <div className="fade-up text-center mb-6 md:mb-8 relative z-10 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white tracking-tight">
          The <span className="font-semibold text-primary">ReAct</span> Pattern
        </h2>
        <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm md:text-base font-light">
          Reason, then Act. The internal scratchpad that prevents hallucination.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-10 w-full relative z-10 flex-1 min-h-0">
        
        {/* Left: The ReAct Architecture */}
        <div className="fade-up flex-1 flex flex-col justify-center items-center space-y-3 lg:space-y-4 bg-primary/5 rounded-3xl border border-primary/20 p-6 lg:p-8 relative overflow-hidden backdrop-blur-sm">
          
          <div className="text-center mb-2 lg:mb-4">
            <h3 className="text-lg lg:text-xl text-white font-medium">ReAct Architecture</h3>
            <p className="text-xs text-white/40 mt-1">Goal → Reason → Act</p>
          </div>

          <div className={cn(
            "w-full max-w-xs p-3 lg:p-4 rounded-xl border transition-all duration-500 flex items-center gap-3",
            activeStep >= 1 ? "bg-black/40 border-primary/30 shadow-lg" : "bg-white/5 border-transparent opacity-50"
          )}>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Goal Injected</div>
            </div>
          </div>

          <div className="flex justify-center -my-1 lg:-my-2">
            <ArrowRight className="w-4 h-4 rotate-90 text-primary/50" />
          </div>

          <div className={cn(
            "w-full max-w-xs p-3 lg:p-4 rounded-xl border transition-all duration-500 flex items-center gap-3",
            activeStep === 2 || activeStep === 4 ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(167,218,219,0.3)]" : 
            activeStep > 1 ? "bg-black/40 border-primary/30" : "bg-white/5 border-transparent opacity-50"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500",
              activeStep === 2 || activeStep === 4 ? "bg-primary text-black" : "bg-primary/20 text-primary"
            )}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className={cn(
                "text-[10px] uppercase tracking-widest font-bold transition-colors duration-500",
                activeStep === 2 || activeStep === 4 ? "text-primary-foreground" : "text-primary/70"
              )}>Reason (Thought)</div>
            </div>
          </div>

          <div className="flex justify-center -my-1 lg:-my-2">
            <ArrowRight className="w-4 h-4 rotate-90 text-primary/50" />
          </div>

          <div className={cn(
            "w-full max-w-xs p-3 lg:p-4 rounded-xl border transition-all duration-500 flex items-center gap-3",
            activeStep === 3 || activeStep === 5 ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(167,218,219,0.3)]" : 
            activeStep > 2 ? "bg-black/40 border-primary/30" : "bg-white/5 border-transparent opacity-50"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-500",
              activeStep === 3 || activeStep === 5 ? "bg-primary text-black" : "bg-primary/20 text-primary"
            )}>
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className={cn(
                "text-[10px] uppercase tracking-widest font-bold transition-colors duration-500",
                activeStep === 3 || activeStep === 5 ? "text-primary-foreground" : "text-primary/70"
              )}>Act (Execution)</div>
            </div>
          </div>

        </div>

        {/* Right: The Succeeding Terminal */}
        <div className="fade-up w-full md:w-[450px] lg:w-[500px] bg-[#0A0A0A] border border-primary/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(167,218,219,0.1)] flex flex-col shrink-0">
          <div className="h-12 bg-primary/10 border-b border-primary/20 flex items-center px-4 gap-3 shrink-0">
            <Terminal className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-mono text-primary/70 tracking-wider">REACT_TRACE</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <div className="w-3 h-3 rounded-full bg-primary/30" />
              <div className="w-3 h-3 rounded-full bg-primary/30" />
            </div>
          </div>
          
          <div className="p-5 font-mono text-[13px] md:text-sm flex-1 overflow-y-auto space-y-4">
            
            {activeStep >= 1 && (
              <div className="text-white/50 pb-3 border-b border-white/5 mb-4 animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-white/80 font-semibold">User Goal:</span> "Find the weather in Tokyo and book a flight if it's sunny."
              </div>
            )}
            
            {activeStep >= 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-2 text-white/70">
                  <span className="shrink-0 font-bold text-white/50">Thought:</span>
                  <span className="italic">I need to check the weather in Tokyo before booking. Let's do that first.</span>
                </div>
              </div>
            )}

            {activeStep >= 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-2">
                  <span className="shrink-0 text-white font-bold">Action:</span>
                  <span className="text-primary/90">search_web(query="Tokyo weather today")</span>
                </div>
              </div>
            )}

            {activeStep >= 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4 border-t border-white/10 pt-4">
                <div className="flex gap-2 items-start text-white/70">
                  <span className="shrink-0 font-bold text-white/50 mt-0.5">Observation:</span>
                  <span>"Tokyo is currently 24°C and sunny."</span>
                </div>
                <div className="flex gap-2 text-white/70 mt-2">
                  <span className="shrink-0 font-bold text-white/50">Thought:</span>
                  <span className="italic">It's sunny. I should book the flight now. Wait, I don't know the passenger's name. I must ask the user before calling book_flight().</span>
                </div>
              </div>
            )}

            {activeStep >= 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
                <div className="flex gap-2">
                  <span className="shrink-0 text-white font-bold">Action:</span>
                  <span className="text-primary/90">ask_user(question="Who should I book the flight for?")</span>
                </div>
                <div className="mt-4 pt-4 border-t border-primary/20 animate-in fade-in duration-500">
                  <span className="text-primary font-bold">Agent safely paused. Fatal error avoided.</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
