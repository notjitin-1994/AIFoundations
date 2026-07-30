import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { Target, Brain, Wrench, Eye, ShieldCheck, AlertTriangle, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoopAnatomySlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  
  const [activeNode, setActiveNode] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  
  const tl = useRef<gsap.core.Timeline | null>(null);

  const nodes = [
    { id: 1, title: "Goal", icon: Target, desc: "The unyielding anchor. A mathematically verifiable end-state that grounds the agent and prevents hallucinated drift." },
    { id: 2, title: "Reason", icon: Brain, desc: "The internal scratchpad. The model analyzes its prompt, memory, and environment to logically deduce the optimal next step." },
    { id: 3, title: "Act", icon: Wrench, desc: "The execution phase. The agent reaches outside its sandbox to invoke a tool, run code, or interact with the real world." },
    { id: 4, title: "Observe", icon: Eye, desc: "The feedback ingestion. The agent reads the raw output, error stack, or system response from its previous action." },
    { id: 5, title: "Verify", icon: ShieldCheck, desc: "The strict internal exit gate. A rigid check comparing the observed state against the initial Goal. If not met, the loop restarts." },
    { id: 6, title: "HITL", icon: UserCheck, desc: "The ultimate external gate. Once the loop is complete, it pauses at this checkpoint for you to review and verify the agent's work before authorizing the next step." }
  ];

  useEffect(() => {
    // Initial entrance
    gsap.fromTo(".loop-header", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.fromTo(".engine-core", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.7)", delay: 0.5 });

    const timeline = gsap.timeline({ paused: true });
    
    // "An autonomous loop isn't magic; it's a structured control system." (0-4s)
    // "After each prompt you give, the agent runs this entire loop until the task is complete." (4s-9s)
    // "It starts with a Goal," (9s)
    // "Reasons about the next step," (10.5s)
    // "Acts using tools," (12.5s)
    // "Observes the result," (14.5s)
    // "and crucially, Verifies if it's done." (16.5s)
    // "Without verification, agents drift into infinite loops." (19.5s)
    // "Once the goal is finally verified, the loop pauses at a Human-in-the-loop checkpoint, where you check the agent's work before proceeding." (23.5s)

    timeline.call(() => setActiveNode(1), [], 9.0)
            .call(() => setActiveNode(2), [], 10.5)
            .call(() => setActiveNode(3), [], 12.5)
            .call(() => setActiveNode(4), [], 14.5)
            .call(() => setActiveNode(5), [], 16.5)
            .call(() => setShowWarning(true), [], 19.5)
            .call(() => setActiveNode(6), [], 23.5)
            .call(() => setShowWarning(false), [], 23.5);
            
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
    const isDone = activeNode === 6; // Done when the HITL node is activated
    setNavOverride({
      nextDisabled: !isDone,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [activeNode, setNavOverride, onComplete]);

  // Stagger reveal the content of the active panel
  useEffect(() => {
    if (activeNode > 0) {
      gsap.fromTo(".panel-content-stagger", 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", overwrite: true }
      );
    }
  }, [activeNode]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-10 max-w-6xl mx-auto overflow-hidden relative">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="loop-header text-center mb-4 md:mb-6 lg:mb-8 relative z-10 w-full shrink-0">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-light text-white tracking-tight">
          Anatomy of a <span className="font-semibold text-primary">Loop</span>
        </h2>
        <p className="text-white/50 mt-2 max-w-xl mx-auto text-sm md:text-base font-light">
          After each prompt, the agent autonomously cycles through this loop until the task is complete.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-16 w-full relative z-10 flex-1 min-h-0">
        
        {/* Left: The High-Tech Circular Diagram */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-[360px] lg:h-[360px] shrink-0 flex items-center justify-center engine-core mx-auto md:mx-0">
          
          {/* Orbital Rings */}
          <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]" />
          <div className={cn(
            "absolute inset-16 rounded-full border transition-colors duration-1000",
            activeNode > 0 ? "border-primary/20 shadow-[0_0_50px_rgba(167,218,219,0.1)]" : "border-white/5"
          )} />
          
          {/* The Nodes */}
          {nodes.map((node, index) => {
            const angle = (index * -60) + 90; // 6 nodes = 60 degrees apart
            const rad = angle * (Math.PI / 180);
            // On smaller screens, use a smaller radius to prevent bleeding
            // We can approximate by checking if we are on a small screen or just using CSS
            // but for safety, we'll use a responsive CSS transform approach or just a safe fixed size.
            // Let's use a safe fixed size that fits mobile, but scales with the container
            // Actually, we can use percentages for x and y!
            const xPercent = Math.cos(rad) * 40; // 40% distance from center
            const yPercent = -Math.sin(rad) * 40;
            
            const Icon = node.icon;
            const isActive = activeNode === node.id;
            const isCompleted = activeNode > node.id;
            const isVisible = activeNode >= node.id; // Only show nodes that have been introduced

            // We will render all nodes so they can animate in when isVisible becomes true

            return (
              <button
                key={node.id}
                onClick={() => {
                  // Only allow clicking if the narration has reached this node or finished
                  if (activeNode !== 0) {
                    setActiveNode(node.id);
                    setShowWarning(node.id === 5); // Only show warning when manually clicking Verify
                    track("http://adlnet.gov/expapi/verbs/interacted", "interacted", `http://smartslate.com/activities/m4/slides/2-loop-anatomy/node/${node.id}`, `Loop Node ${node.id}`);
                  }
                }}
                className={cn(
                  "absolute w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 -ml-6 -mt-6 md:-ml-7 md:-mt-7 lg:-ml-8 lg:-mt-8 rounded-full flex flex-col items-center justify-center transition-all duration-700 backdrop-blur-md group",
                  isActive 
                    ? "bg-black border-2 border-primary scale-125 shadow-[0_0_30px_rgba(167,218,219,0.3)] z-30 opacity-100" 
                    : isCompleted
                      ? "bg-primary/10 border border-primary/50 text-primary z-20 hover:scale-110 opacity-100"
                      : activeNode === 0
                        ? "bg-black/60 border border-white/10 text-white/30 z-10 opacity-50 grayscale"
                        : "opacity-0 scale-50 pointer-events-none" // Hidden nodes
                )}
                style={{
                  left: `calc(50% + ${xPercent}%)`,
                  top: `calc(50% + ${yPercent}%)`,
                  transform: `scale(${isActive ? 1.25 : 1})`,
                }}
              >
                <Icon className={cn(
                  "w-5 h-5 md:w-6 md:h-6 transition-colors duration-500", 
                  isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-white/30"
                )} />
                <span className={cn(
                  "absolute -bottom-6 md:-bottom-8 text-[9px] md:text-[11px] font-bold uppercase tracking-widest transition-all duration-500",
                  isActive ? "opacity-100 text-primary translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 text-white/50"
                )}>
                  {node.title}
                </span>
              </button>
            );
          })}
          
          {/* Core Engine Center */}
          <div className={cn(
            "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-1000",
            activeNode > 0 
              ? "bg-primary/10 border border-primary/30 shadow-[inset_0_0_20px_rgba(167,218,219,0.2)]" 
              : "bg-white/5 border border-white/10"
          )}>
            <div className="text-center">
              <div className={cn(
                "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mx-auto mb-1 md:mb-2 transition-colors duration-300",
                activeNode > 0 ? "bg-primary shadow-[0_0_10px_rgba(167,218,219,0.8)] animate-pulse" : "bg-white/20"
              )} />
              <span className="text-[8px] md:text-[10px] font-mono text-white/40 tracking-widest leading-tight block">CORE<br/>ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right: The Dynamic Info Panel */}
        <div className="flex-1 w-full max-w-xl relative min-h-0 h-full flex flex-col justify-center">
          {activeNode === 0 ? (
            <div className="w-full h-40 md:h-full rounded-2xl md:rounded-3xl border border-white/5 bg-black/20 flex items-center justify-center backdrop-blur-sm">
              <p className="text-white/30 font-mono text-xs md:text-sm tracking-widest uppercase animate-pulse">Waiting for loop...</p>
            </div>
          ) : (
            <div className="w-full h-full relative flex-1 min-h-0">
              {nodes.map((node) => {
                const isActive = activeNode === node.id;
                const Icon = node.icon;
                
                return (
                  <div 
                    key={node.id}
                    className={cn(
                      "absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl border p-4 md:p-6 lg:p-8 flex flex-col justify-center transition-all duration-700 backdrop-blur-md overflow-y-auto",
                      isActive 
                        ? "opacity-100 translate-x-0 bg-primary/5 border-primary/30 shadow-xl pointer-events-auto z-10" 
                        : "opacity-0 translate-x-4 border-transparent pointer-events-none z-0"
                    )}
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5 panel-content-stagger opacity-0 shrink-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-black border border-primary/50 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(167,218,219,0.2)]">
                        <Icon className="w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[9px] md:text-[11px] uppercase tracking-widest text-primary/70 font-bold mb-0.5 md:mb-1">Stage 0{node.id}</div>
                        <h3 className="text-xl md:text-3xl font-medium text-white">{node.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-white/80 leading-snug md:leading-relaxed text-sm md:text-base lg:text-lg font-light panel-content-stagger opacity-0 shrink-0">
                      {node.desc}
                    </p>

                    {/* Infinite Loop Warning specific to the Verify stage */}
                    <div className={cn(
                      "p-2 md:p-3 rounded-lg md:rounded-xl border transition-all duration-1000 overflow-hidden bg-black/60 shrink-0",
                      showWarning && node.id === 5
                        ? "border-red-500/30 opacity-100 max-h-40 mt-3 md:mt-4" 
                        : "border-transparent opacity-0 max-h-0 py-0 mt-0"
                    )}>
                      <div className="flex items-start gap-2 md:gap-3">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs md:text-sm font-bold text-red-400 uppercase tracking-wider mb-0.5 md:mb-1">Critical Failure</h4>
                          <p className="text-xs md:text-sm text-red-200/70 leading-snug">
                            Without verification, agents drift into infinite loops, repeating mistakes and consuming API credits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
