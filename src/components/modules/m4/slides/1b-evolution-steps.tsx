import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { MessageSquare, Database, Wrench, Repeat, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EvolutionStepsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const [activeStep, setActiveStep] = useState(0);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const steps = [
    { id: 1, title: "Prompt Engineering", module: "Module 1", icon: MessageSquare, desc: "Perfecting the single-turn instruction." },
    { id: 2, title: "Context Engineering", module: "Module 2", icon: Database, desc: "Injecting external data into the prompt window." },
    { id: 3, title: "Harness Engineering", module: "Module 3", icon: Wrench, desc: "Building the environment and toolbelt connections." },
    { id: 4, title: "Loop Engineering", module: "Module 4", icon: Repeat, desc: "Designing autonomous, self-correcting agent loops." }
  ];

  useEffect(() => {
    // Initial entrance
    gsap.fromTo(".timeline-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

    const timeline = gsap.timeline({ paused: true });
    
    // Text: "This is the evolution of AI engineering. (0-2.5s)
    // We started with Prompt Engineering in Module 1, (2.5-5.5s)
    // moved to Context Engineering in Module 2, (5.5-8.5s)
    // built our Harness in Module 3, (8.5-11.0s)
    // and now, we scale up to designing autonomous, self-correcting agent systems in Module 4." (11.0-16.0s)
    timeline.call(() => setActiveStep(1), [], 2.5)
            .call(() => setActiveStep(2), [], 5.5)
            .call(() => setActiveStep(3), [], 8.5)
            .call(() => setActiveStep(4), [], 11.0);
            
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
    <div className="w-full h-full flex flex-col items-center p-6 md:p-10 max-w-5xl mx-auto relative overflow-hidden">
      
      {/* Background ambient glow based on active step */}
      <div className="absolute inset-0 transition-colors duration-1000 bg-black/40" />
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000",
        activeStep === 4 ? "bg-primary/10 opacity-100" : "bg-primary/5 opacity-50"
      )} />

      <div className="timeline-header text-center mb-10 w-full relative z-10 shrink-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white tracking-tight">
          The <span className="font-semibold text-primary">Evolution</span> of AI Engineering
        </h2>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center relative z-10 min-h-0">
        
        {/* The active stage showcase */}
        <div className="relative w-full max-w-3xl mx-auto h-64 md:h-72 flex items-center justify-center">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-1000",
                  isActive 
                    ? "opacity-100 scale-100 bg-gradient-to-b from-primary/10 to-transparent border-primary/30 backdrop-blur-md shadow-[0_0_40px_rgba(167,218,219,0.15)]" 
                    : "opacity-0 scale-95 pointer-events-none border-transparent"
                )}
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-1000 border bg-black/50 backdrop-blur-sm",
                  isActive ? "border-primary/50 shadow-[0_0_20px_rgba(167,218,219,0.2)] text-primary" : "border-white/10 text-white/30"
                )}>
                  <Icon className="w-10 h-10" />
                </div>
                
                <div className="text-sm font-bold uppercase tracking-widest text-white/50 mb-2">
                  {step.module}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-3 text-center">
                  {step.title}
                </h3>
                
                <p className="text-base md:text-lg text-white/70 text-center max-w-md font-light">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* The Stepper Navigation */}
        <div className="mt-16 w-full max-w-2xl mx-auto flex items-center justify-between relative">
          
          {/* Connecting line background */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 z-0" />
          
          {/* Active progress line */}
          <div 
            className="absolute top-1/2 left-0 h-px bg-primary -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(167,218,219,0.5)]"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = activeStep > step.id;
            const isActive = activeStep === step.id;
            const isPending = activeStep < step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => {
                    setActiveStep(step.id);
                    track("http://adlnet.gov/expapi/verbs/interacted", "interacted", `http://smartslate.com/activities/m4/slides/1b-evolution-steps/step/${step.id}`, `Evolution Step ${step.id}`);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    isActive ? "bg-black border-primary scale-125 shadow-[0_0_20px_rgba(167,218,219,0.4)]" :
                    isCompleted ? "bg-primary border-primary text-black" :
                    "bg-black border-white/20 text-white/30 hover:border-white/50"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className={cn(
                      "text-sm font-bold", 
                      isActive ? "text-primary" : "text-white/30"
                    )}>
                      {step.id}
                    </span>
                  )}
                </button>
                <div className={cn(
                  "absolute top-14 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-500",
                  isActive ? "text-primary opacity-100 translate-y-0" : "text-white/30 opacity-0 -translate-y-2 pointer-events-none"
                )}>
                  {step.module}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
