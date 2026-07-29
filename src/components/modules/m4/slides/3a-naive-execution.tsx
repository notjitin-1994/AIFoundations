import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Terminal, Wrench, AlertTriangle, Target, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function NaiveExecutionSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  
  const [activeStep, setActiveStep] = useState(0);
  
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Initial entrance
    gsap.fromTo(".fade-up", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" });

    const timeline = gsap.timeline({ paused: true });
    
    // "Before ReAct, we used naive zero-shot execution." (0-3s)
    // "We gave the agent a goal, and it immediately fired a tool." (3-6s)
    // "But without a space to plan, it hallucinated arguments," (6-9s)
    // "misunderstood context, and ultimately crashed." (9-13s)

    timeline.call(() => setActiveStep(1), [], 3.0) // Goal appears
            .call(() => setActiveStep(2), [], 5.0) // Action fires immediately
            .call(() => setActiveStep(3), [], 7.5) // Hallucinated argument error
            .call(() => setActiveStep(4), [], 10.0); // Total crash
            
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
    const isDone = activeStep === 4;
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
        activeStep >= 3 ? "bg-red-500/10" : "bg-white/5"
      )} />

      <div className="fade-up text-center mb-6 md:mb-8 relative z-10 w-full shrink-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white tracking-tight">
          The <span className="font-semibold text-white/50">Zero-Shot</span> Fallacy
        </h2>
        <p className="text-white/50 mt-3 max-w-xl mx-auto text-sm md:text-base font-light">
          Why "prompting and praying" fails in complex autonomous systems.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-10 w-full relative z-10 flex-1 min-h-0">
        
        {/* Left: The Naive Architecture */}
        <div className="fade-up flex-1 flex flex-col justify-center items-center space-y-4 md:space-y-6 bg-black/20 rounded-3xl border border-white/5 p-8 relative overflow-hidden backdrop-blur-sm">
          
          <div className="text-center mb-4">
            <h3 className="text-xl text-white font-medium">Naive Architecture</h3>
            <p className="text-xs text-white/40 mt-1">Direct Goal → Action</p>
          </div>

          <div className={cn(
            "w-full max-w-xs p-5 rounded-2xl border transition-all duration-500 flex items-center gap-4",
            activeStep >= 1 ? "bg-white/10 border-white/20 shadow-lg" : "bg-white/5 border-transparent opacity-50"
          )}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Step 1</div>
              <div className="text-white font-medium">Goal Injected</div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-0.5 h-12 transition-all duration-500 origin-top",
              activeStep >= 2 ? "bg-white/40 scale-y-100" : "bg-white/10 scale-y-0"
            )} />
            <ArrowRight className={cn(
              "w-5 h-5 rotate-90 -mt-2 transition-all duration-500",
              activeStep >= 2 ? "text-white/60 opacity-100" : "text-white/10 opacity-0"
            )} />
          </div>

          <div className={cn(
            "w-full max-w-xs p-5 rounded-2xl border transition-all duration-500 flex items-center gap-4 relative overflow-hidden",
            activeStep >= 2 && activeStep < 4 ? "bg-white/10 border-white/20 shadow-lg" : "",
            activeStep === 4 ? "bg-red-500/20 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse" : "",
            activeStep < 2 ? "bg-white/5 border-transparent opacity-50" : ""
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500",
              activeStep === 4 ? "bg-red-500/30 text-red-200" : "bg-white/10 text-white"
            )}>
              {activeStep === 4 ? <AlertTriangle className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
            </div>
            <div>
              <div className={cn(
                "text-xs uppercase tracking-widest font-bold mb-1 transition-colors duration-500",
                activeStep === 4 ? "text-red-400" : "text-white/50"
              )}>Step 2</div>
              <div className={cn(
                "font-medium transition-colors duration-500",
                activeStep === 4 ? "text-red-200" : "text-white"
              )}>
                {activeStep === 4 ? "System Crash" : "Immediate Action"}
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Failing Terminal */}
        <div className="fade-up w-full md:w-[450px] lg:w-[500px] bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col shrink-0">
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-3 shrink-0">
            <Terminal className="w-4 h-4 text-white/40" />
            <span className="text-xs font-mono text-white/40 tracking-wider">AGENT_TRACE</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
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
                <div className="flex gap-2">
                  <span className="shrink-0 text-white font-bold">Action:</span>
                  <span className="text-primary/90">book_flight(destination="Tokyo", date="today")</span>
                </div>
                <div className="mt-2 ml-4 pl-4 border-l-2 border-white/10 text-white/40 text-xs">
                  Agent bypassed search and guessed arguments...
                </div>
              </div>
            )}

            {activeStep >= 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
                <div className="flex gap-2 items-start text-amber-400">
                  <span className="shrink-0 font-bold mt-0.5">Observation:</span>
                  <span>Error 400: Missing required argument 'passenger_name'.</span>
                </div>
              </div>
            )}

            {activeStep >= 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
                <div className="flex gap-2">
                  <span className="shrink-0 text-white font-bold">Action:</span>
                  <span className="text-primary/90">book_flight(destination="Tokyo", date="today", passenger_name="John Doe")</span>
                </div>
                <div className="mt-2 ml-4 pl-4 border-l-2 border-red-500/30 text-red-400">
                  <span className="font-bold">FATAL ERROR:</span> Hallucinated passenger name. Transaction declined. Context window overflow. Execution halted.
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
