import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { MessageSquare, Bot, Activity, ArrowRight, ServerCrash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function TextVsActionSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const textResponseRef = useRef<HTMLDivElement>(null);
  const actionPipelineRef = useRef<HTMLDivElement>(null);
  const finalResponseRef = useRef<HTMLDivElement>(null);
  const modeBadgeRef = useRef<HTMLDivElement>(null);
  
  const [mode, setMode] = useState<"text" | "action">("text");

  useEffect(() => {
    // Narration: "Without tools, an LLM can only generate text based on its past training. With tools, it becomes an active participant in your workflow, capable of fetching live data or executing code."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && textResponseRef.current && 
      actionPipelineRef.current && finalResponseRef.current && modeBadgeRef.current
    ) {
      // 1. Initial State: Chat container appears
      timeline.fromTo(containerRef.current, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, 0);
      
      // 2. Text-only response appears
      timeline.fromTo(textResponseRef.current, { opacity: 0, height: 0, scale: 0.9 }, { opacity: 1, height: "auto", scale: 1, duration: 0.6, ease: "back.out(1.2)" }, 1);

      // 3. Transformation ("With tools..." at ~4.5s)
      timeline.call(() => setMode("action"), [], 4.2);
      
      // Fade out the text response
      timeline.to(textResponseRef.current, { opacity: 0, height: 0, scale: 0.9, duration: 0.4, ease: "power2.in" }, 4.3);
      
      // Mode badge flips
      timeline.fromTo(modeBadgeRef.current, { rotateX: 90, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 4.5);

      // 4. Action Pipeline appears
      timeline.fromTo(actionPipelineRef.current, { opacity: 0, height: 0 }, { opacity: 1, height: "auto", duration: 0.5, ease: "power2.out" }, 4.8);
      
      const pipelineNodes = actionPipelineRef.current.querySelectorAll('.pipeline-node');
      const pipelineLine = actionPipelineRef.current.querySelector('.pipeline-line');
      
      timeline.fromTo(pipelineNodes[0], { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }, 5.0);
      timeline.fromTo(pipelineLine, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, 5.2);
      timeline.fromTo(pipelineNodes[1], { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.5)" }, 5.6);
      
      // 5. Final Rich Response appears
      timeline.fromTo(finalResponseRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 6.2);
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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-8 max-w-5xl mx-auto relative group">
      
      {/* Background Ambience strictly monochromatic teal */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000" style={{ opacity: mode === 'action' ? 1 : 0.3 }} />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000" style={{ opacity: mode === 'action' ? 1 : 0.3 }} />

      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          Text vs. Action
        </h2>
        <p className="text-white/60 text-lg font-medium max-w-xl mx-auto">
          How connecting an LLM to external tools transforms it into an agent.
        </p>
      </div>

      {/* Central Single-Column Cinematic Container */}
      <div ref={containerRef} className="w-full max-w-3xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col relative overflow-hidden group/card z-10 min-h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-50 pointer-events-none" />
        
        {/* Dynamic Header */}
        <div className="flex items-center justify-between mb-10 relative z-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-700 ${mode === 'text' ? 'bg-white/5 border-white/10' : 'bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(167,218,219,0.3)]'}`}>
              <Bot className={`w-6 h-6 transition-colors duration-700 ${mode === 'text' ? 'text-white/60' : 'text-primary'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight transition-colors duration-700">
                {mode === 'text' ? 'Standard Chatbot' : 'Agent with Tools'}
              </h3>
              <div className="h-6 relative overflow-hidden w-32 mt-1">
                <AnimatePresence mode="wait">
                  {mode === 'text' ? (
                    <motion.div key="text" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute inset-0 flex items-center">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Text Only</p>
                    </motion.div>
                  ) : (
                    <motion.div key="action" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute inset-0 flex items-center">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Takes Action</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div ref={modeBadgeRef} className="hidden md:flex items-center">
             <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(167,218,219,0.2)]">
               Toolbelt Active
             </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col gap-6 relative z-10 w-full max-w-2xl mx-auto">
          
          {/* User Prompt */}
          <div className="bg-white/10 border border-white/5 rounded-2xl p-5 self-end max-w-[85%] rounded-tr-sm shadow-md">
            <p className="text-base text-white/90 font-medium">What is Apple&apos;s current stock price?</p>
          </div>
          
          {/* Text-Only Failure State */}
          <div ref={textResponseRef} className="bg-black/60 border border-white/5 rounded-2xl p-5 self-start max-w-[85%] rounded-tl-sm flex gap-4 overflow-hidden">
             <div className="shrink-0 mt-0.5">
               <ServerCrash className="w-5 h-5 text-white/30" />
             </div>
             <p className="text-base text-white/40 leading-relaxed font-medium">
               I don&apos;t have access to real-time information. My training data only goes up to October 2023...
             </p>
          </div>
          
          {/* Action Pipeline State */}
          <div ref={actionPipelineRef} className="self-start w-full flex flex-col gap-6 overflow-hidden">
            
            {/* The visual pipeline */}
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="pipeline-node w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(167,218,219,0.2)]">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 h-px bg-white/10 relative">
                <div className="pipeline-line absolute inset-0 bg-primary/50 origin-left" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-2 text-[9px] font-black tracking-widest text-primary uppercase">
                  Fetching Live Data
                </div>
              </div>
              
              <div className="pipeline-node bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-2xl p-3 flex items-center gap-3 shadow-lg shrink-0">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider">AAPL API</p>
                  <p className="text-sm text-primary font-mono font-bold">$185.92</p>
                </div>
              </div>
            </div>
            
            {/* Final Rich Output */}
            <div ref={finalResponseRef} className="bg-primary/5 border border-primary/20 rounded-2xl p-5 self-start max-w-[85%] rounded-tl-sm shadow-[0_5px_30px_rgba(167,218,219,0.05)]">
               <p className="text-base text-white/90 leading-relaxed font-medium">
                 Apple Inc. (AAPL) is currently trading at <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">185.92 USD</span>.
               </p>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
