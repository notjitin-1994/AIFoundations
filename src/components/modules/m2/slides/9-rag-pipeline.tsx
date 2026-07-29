import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion, AnimatePresence } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Database, FileText, Bot, User, CheckCircle2 } from "lucide-react";
import { useLRS } from "@/hooks/use-lrs";

export function RagPipelineSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();

  const [step, setStep] = useState(0);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Audio-synced timeline (just text reveals)
    const timeline = gsap.timeline({ paused: true });
    
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.0);
    timeline.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }, 3.5);

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
    // Auto-complete the final step when reaching it
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    setNavOverride({
      nextLabel: step === 4 ? "" : "Click Through Flow",
      nextDisabled: step < 4,
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [step, setNavOverride, onComplete]);

  const nodes = [
    { id: 'user', icon: User, title: 'User Query', subtitle: '"What is our policy?"', action: 'Start Query' },
    { id: 'retriever', icon: Database, title: 'Retriever', subtitle: 'Finds relevant docs', action: 'Extract Facts' },
    { id: 'prompt', icon: FileText, title: 'Augmented Prompt', subtitle: 'Query + Facts', action: 'Send to AI' },
    { id: 'llm', icon: Bot, title: 'Language Model', subtitle: 'Generates Answer', action: null },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 ref={headingRef} className="text-4xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          How RAG Works
        </h2>
        <p ref={pRef} className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Click the highlighted step to watch data flow through the RAG pipeline.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 relative overflow-visible flex flex-col justify-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-[3rem]" />
        
        <div className="relative w-full h-[60%] flex items-center">
          {/* Nodes Grid */}
          <div className="grid grid-cols-4 gap-4 relative z-10 w-full">
            {nodes.map((node, i) => {
              const isActive = step === i;
              const isPast = step > i;

              return (
                <div key={node.id} className="flex flex-col items-center justify-center gap-6 relative">
                  
                  <div className="w-full relative flex justify-center">
                    
                    {/* Connecting Line Segment (only for first 3 nodes) */}
                    {i < 3 && (
                      <div className="absolute top-1/2 left-[calc(50%+3rem)] lg:left-[calc(50%+3.5rem)] w-[calc(100%-5rem)] lg:w-[calc(100%-6rem)] h-[2px] bg-white/5 -translate-y-1/2 z-0">
                        {/* Active Path Highlight */}
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: isPast ? "100%" : "0%" }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          className="absolute top-0 bottom-0 left-0 bg-primary/20"
                        />
                        {/* The glowing transmission beam for this segment */}
                        <AnimatePresence>
                          {step === i + 1 && (
                            <motion.div
                              initial={{ left: "0%", opacity: 0 }}
                              animate={{ left: "calc(100% - 2rem)", opacity: [0, 1, 0] }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1, ease: "easeInOut", times: [0, 0.8, 1] }}
                              className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-primary shadow-[0_0_15px_rgba(167,218,219,1)]"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Glass Node */}
                    <div className={`w-24 h-24 lg:w-28 lg:h-28 rounded-3xl border flex items-center justify-center transition-all duration-700 relative overflow-hidden z-10 ${
                      isActive || isPast
                        ? 'bg-primary/10 border-primary/50 shadow-[0_0_30px_rgba(167,218,219,0.2)] backdrop-blur-xl' 
                        : 'bg-black/60 border-white/5 backdrop-blur-md shadow-inner'
                    }`}>
                      {/* Inner active pulse */}
                      {(isActive || (i === 3 && step >= 4)) && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl"
                        />
                      )}
                      
                      <node.icon className={`w-10 h-10 lg:w-12 lg:h-12 transition-colors duration-500 relative z-10 ${
                        isActive || isPast ? 'text-primary' : 'text-white/20'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Node Text */}
                  <div className="text-center h-12">
                    <div className={`font-black uppercase tracking-widest text-[10px] lg:text-xs mb-1 transition-colors duration-500 ${
                      isActive || isPast ? 'text-primary' : 'text-white/40'
                    }`}>
                      {node.title}
                    </div>
                    <div className="text-[10px] lg:text-xs font-medium text-white/50">{node.subtitle}</div>
                  </div>

                  {/* Action Button */}
                  <AnimatePresence>
                    {isActive && node.action && (
                      <motion.button 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => {
                          setStep(i + 1);
                          track("http://adlnet.gov/expapi/verbs/interacted", "interacted", `http://smartslate.com/activities/m2/slides/9/rag-pipeline/step-${i + 1}`, `RAG Pipeline Step ${i + 1}`);
                        }}
                        className="absolute -bottom-16 bg-background/80 backdrop-blur-md border border-primary/30 text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(167,218,219,0.4)] transition-all duration-300 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full z-50 whitespace-nowrap"
                      >
                        {node.action}
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Final Output Toast */}
                  <AnimatePresence>
                    {i === 3 && step >= 4 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -15, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                        className="absolute -top-20 bg-black/60 backdrop-blur-xl border border-primary/40 px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(167,218,219,0.2)] w-56 text-center z-50"
                      >
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_8px_rgba(167,218,219,0.8)]" />
                          <span className="text-primary font-black uppercase tracking-widest text-[10px] md:text-xs drop-shadow-sm">
                            Accurate Answer
                          </span>
                        </div>
                        <p className="text-[10px] md:text-xs font-medium text-white/60 leading-tight">
                          Based entirely on retrieved facts.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
