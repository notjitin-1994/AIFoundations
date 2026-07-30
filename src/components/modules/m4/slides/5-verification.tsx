import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerificationSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  
  const [selected, setSelected] = useState<number | null>(null);
  const [timelineStep, setTimelineStep] = useState(0);
  const [apiCost, setApiCost] = useState(0);
  
  const tl = useRef<gsap.core.Timeline | null>(null);
  const costIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const options = [
    { id: 1, text: "Make the code better and more efficient.", correct: false, reason: "Too subjective. The agent will never know when it's 'better enough' and will loop infinitely." },
    { id: 2, text: "Refactor the file until all ESLint errors are resolved and tests pass.", correct: true, reason: "Perfect. This provides a rigid, programmatic 'Done' condition." },
    { id: 3, text: "Research competitors and write a good summary.", correct: false, reason: "Vague. How many competitors? What defines 'good'?" }
  ];

  useEffect(() => {
    gsap.fromTo(".fade-up", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power3.out" }
    );

    const timeline = gsap.timeline({ paused: true });
    
    // "The most dangerous thing you can do is give an agent a vague goal." (0-3s)
    // "'Make this better' is a recipe for an infinite loop and a massive API bill." (3-7s)
    // "A loop must have a rigid, mathematically verifiable 'Done' condition." (7-12s)

    timeline.call(() => setTimelineStep(1), [], 0.0)  // Vague Goal
            .call(() => setTimelineStep(2), [], 3.0)  // Infinite Loop & Bill
            .call(() => setTimelineStep(3), [], 7.0)  // Rigid Condition
            .call(() => setTimelineStep(4), [], 12.0); // Reveal Quiz
            
    tl.current = timeline;
    return () => { 
      timeline.kill(); 
      if (costIntervalRef.current) clearInterval(costIntervalRef.current);
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


  // Handle the ticking API bill during step 2
  useEffect(() => {
    if (timelineStep === 2 && isPlaying) {
      costIntervalRef.current = setInterval(() => {
        setApiCost(prev => prev + Math.random() * 2.5 + 0.5);
      }, 100);
    } else {
      if (costIntervalRef.current) clearInterval(costIntervalRef.current);
    }
  }, [timelineStep, isPlaying]);

  useEffect(() => {
    const isCorrect = selected === 2;
    setNavOverride({
      nextDisabled: !isCorrect,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [selected, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 lg:p-10 max-w-6xl mx-auto overflow-hidden relative">
      
      {/* Dynamic Background Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000",
        timelineStep === 2 ? "bg-red-500/10" : timelineStep >= 3 ? "bg-primary/10" : "bg-white/5"
      )} />

      <div className="fade-up text-center mb-6 md:mb-10 w-full shrink-0 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white mb-2 md:mb-3 tracking-tight">
          The <span className="font-semibold text-primary">"Done"</span> Condition
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto font-light">
          Why subjective goals destroy autonomous systems.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full flex-1 min-h-0 relative z-10">
        
        {/* Left: Cinematic Visualization */}
        <div className="flex-1 flex flex-col justify-center items-center h-[280px] lg:h-auto shrink-0 relative perspective-1000">
          
          {/* Default / Vague State */}
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 backface-hidden",
            timelineStep === 1 ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-180 pointer-events-none"
          )}>
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/50">
              <Cpu className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="text-white/40 text-xs font-mono mb-2">INITIALIZING_AGENT</div>
              <div className="text-2xl text-white font-medium">Waiting for Goal...</div>
            </div>
          </div>

          {/* Infinite Loop & Bill State */}
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 backface-hidden",
            timelineStep === 2 ? "opacity-100 rotate-y-0" : "opacity-0 -rotate-y-180 pointer-events-none"
          )}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/20 border-t-red-500 w-24 h-24 -left-12 -top-12 animate-spin" />
              <div className="w-24 h-24 -ml-12 -mt-12 rounded-full flex items-center justify-center text-red-500 absolute">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-16 text-center">
              <div className="text-red-400 text-sm font-bold uppercase tracking-widest mb-2">Goal: "Make it better"</div>
              <div className="text-3xl font-mono text-white font-bold bg-black/40 px-6 py-2 rounded-xl border border-red-500/30">
                ${apiCost.toFixed(2)}
              </div>
              <div className="text-red-400/60 text-xs mt-2 animate-pulse">Running infinite optimization loop...</div>
            </div>
          </div>

          {/* Verifiable State */}
          <div className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 backface-hidden",
            timelineStep >= 3 ? "opacity-100 rotate-y-0" : "opacity-0 rotate-y-180 pointer-events-none"
          )}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full border border-primary/30 w-24 h-24 -left-12 -top-12 animate-[spin_10s_linear_infinite]" />
              <div className="w-24 h-24 -ml-12 -mt-12 rounded-full flex items-center justify-center text-primary bg-primary/10 shadow-[0_0_30px_rgba(167,218,219,0.3)] absolute transition-all">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>
            <div className="mt-16 text-center w-full max-w-sm">
              <div className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Goal: ESLint = 0</div>
              <div className="bg-black/60 border border-primary/20 rounded-xl p-4 backdrop-blur-md">
                <div className="flex justify-between items-center mb-2 text-sm text-white/70 font-mono">
                  <span>Current Errors:</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full" />
                </div>
                <div className="text-primary font-bold text-xs mt-3 uppercase tracking-widest">
                  Condition Met. Loop Terminated.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right: The Interactive Quiz (Reveals at step 4) */}
        <div className="flex-1 w-full max-w-xl flex flex-col justify-center h-auto min-h-0 relative">
          <div className={cn(
            "w-full transition-all duration-1000",
            timelineStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          )}>
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-medium text-white">Identify the safe goal</h3>
              <p className="text-white/60 text-sm mt-1">Which of these is a mathematically verifiable Done condition?</p>
            </div>

            <div className="w-full space-y-3 md:space-y-4">
              {options.map((opt) => {
                const isSelected = selected === opt.id;
                const isCorrect = opt.correct;
                const showFeedback = isSelected;

                return (
                  <div key={opt.id} className="w-full">
                    <button
                      onClick={() => {
                        setSelected(opt.id);
                        track("http://adlnet.gov/expapi/verbs/interacted", "interacted", `http://smartslate.com/activities/m4/slides/5-verification/option/${opt.id}`, `Verification Option ${opt.id}`);
                      }}
                      className={cn(
                        "w-full p-4 md:p-5 rounded-xl border text-left transition-all duration-300 flex items-start gap-3 md:gap-4 group",
                        isSelected 
                          ? isCorrect 
                            ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(167,218,219,0.2)]" 
                            : "bg-red-500/10 border-red-500/50" 
                          : "bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5",
                        isSelected 
                          ? isCorrect ? "border-primary bg-primary text-black" : "border-red-400 bg-red-400 text-black"
                          : "border-white/20 group-hover:border-white/40 text-transparent"
                      )}>
                        {isSelected && (isCorrect ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> : <XCircle className="w-3 h-3 md:w-4 md:h-4" />)}
                      </div>
                      <span className={cn(
                        "text-sm md:text-base font-medium transition-colors leading-snug",
                        isSelected ? "text-white" : "text-white/70"
                      )}>
                        {opt.text}
                      </span>
                    </button>
                    
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      showFeedback ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                    )}>
                      <div className={cn(
                        "p-3 rounded-lg text-xs md:text-sm border flex items-start gap-2 backdrop-blur-md",
                        isCorrect ? "bg-primary/5 border-primary/20 text-primary/90" : "bg-red-500/5 border-red-500/20 text-red-200/90"
                      )}>
                        <p>{opt.reason}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
