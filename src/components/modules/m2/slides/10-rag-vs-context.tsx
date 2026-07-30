import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion, AnimatePresence } from "motion/react";
import { Database, FileText, Zap, DollarSign, Target, AlertTriangle } from "lucide-react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";

export function RagCompareSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();

  const [activeTab, setActiveTab] = useState<"stuffing" | "rag">("stuffing");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "RAG is cheaper, faster, and far more accurate than just pasting a massive document into the prompt. It grounds the AI in reality."
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.0);
    
    // Automatically switch tabs during narration for visual interest
    timeline.add(() => setActiveTab("rag"), 4.0);

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
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    setNavOverride({
      nextLabel: "",
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 max-w-6xl mx-auto relative group">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000" style={{ opacity: activeTab === 'rag' ? 1 : 0 }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000" style={{ opacity: activeTab === 'stuffing' ? 1 : 0 }} />

      <div className="shrink-0 mb-6 z-10 text-center">
        <h2 ref={headingRef} className="text-3xl md:text-4xl font-heading font-black text-white mb-2 drop-shadow-sm tracking-tight">
          Context Stuffing vs. RAG
        </h2>
        <p ref={pRef} className="text-white/60 text-base md:text-lg font-medium max-w-2xl mx-auto">
          Compare the brute-force approach to the precision of Retrieval-Augmented Generation.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center">
        
        {/* Toggle Controls */}
        <div className="flex bg-black/40 backdrop-blur-2xl p-1 rounded-full border border-white/10 mb-6 shadow-2xl relative z-20">
          <button
            onClick={() => {
              setActiveTab("stuffing");
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/10/rag-vs-context/tab-stuffing", "Context Stuffing Tab");
            }}
            className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors z-10 ${
              activeTab === "stuffing" ? "text-white" : "text-white/40 hover:text-white"
            }`}
          >
            Context Stuffing
          </button>
          <button
            onClick={() => {
              setActiveTab("rag");
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/10/rag-vs-context/tab-rag", "RAG Pipeline Tab");
            }}
            className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors z-10 ${
              activeTab === "rag" ? "text-primary drop-shadow-[0_0_10px_rgba(167,218,219,0.8)]" : "text-white/40 hover:text-white"
            }`}
          >
            RAG Pipeline
          </button>
          
          {/* Animated Background Pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-lg ${
              activeTab === "rag" ? "bg-primary/10 border border-primary/30 right-1 shadow-[0_0_20px_rgba(167,218,219,0.3)]" : "bg-white/10 left-1 border border-white/10"
            }`}
          />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[300px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {activeTab === "stuffing" ? (
              <motion.div
                key="stuffing"
                initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full relative z-10"
              >
                {/* Left Visual: Stuffing */}
                <div className="flex flex-col items-center justify-center md:border-r border-white/10 pr-0 md:pr-10 relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 relative mb-6 group">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ y: -50, opacity: 0, rotate: (i - 2) * 15 }}
                        animate={{ y: i * -5, x: i * 5, opacity: 1, rotate: (i - 2) * 8 }}
                        transition={{ delay: i * 0.05, type: "spring", bounce: 0.5 }}
                        className="absolute inset-0"
                      >
                         <div className="w-full h-full bg-black/80 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl">
                           <FileText className="w-10 h-10 md:w-12 md:h-12 text-white/20" />
                         </div>
                      </motion.div>
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-balance text-center leading-tight text-white/80">
                    Pasting the entire 1,000 page manual into the prompt.
                  </h3>
                </div>
                
                {/* Right Features: Stuffing */}
                <div className="flex flex-col justify-center gap-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                      <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg mb-1">High Cost</h4>
                      <p className="text-xs md:text-sm font-medium text-white/40 leading-relaxed">You pay for all 1M tokens every single time you ask a question.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                      <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white/60" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg mb-1">Lost in the Middle</h4>
                      <p className="text-xs md:text-sm font-medium text-white/40 leading-relaxed">The AI forgets details buried in the middle of the massive text wall.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="rag"
                initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full relative z-10"
              >
                {/* Left Visual: RAG */}
                <div className="flex flex-col items-center justify-center md:border-r border-white/10 pr-0 md:pr-10 relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 relative mb-6 group">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.4 }}
                      className="w-full h-full bg-primary/10 border border-primary/30 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(167,218,219,0.2)] relative overflow-hidden"
                    >
                       <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
                       <Database className="w-12 h-12 md:w-14 md:h-14 text-primary drop-shadow-[0_0_15px_rgba(167,218,219,0.5)] relative z-10 transition-transform duration-500 group-hover:scale-110" />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: -20, x: 20, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                      className="absolute -right-4 -top-4 md:-right-6 md:-top-6 w-12 h-12 md:w-14 md:h-14 bg-black/80 backdrop-blur-xl border border-primary/50 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(167,218,219,0.4)] z-20 group-hover:rotate-12 transition-transform duration-500"
                    >
                      <Target className="w-6 h-6 md:w-7 md:h-7 text-primary drop-shadow-[0_0_10px_rgba(167,218,219,0.8)]" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-balance text-center text-primary leading-tight drop-shadow-sm">
                    Retrieving only the exact 3 pages needed.
                  </h3>
                </div>
                
                {/* Right Features: RAG */}
                <div className="flex flex-col justify-center gap-6">
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_20px_rgba(167,218,219,0.2)] group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg mb-1">Fast & Cheap</h4>
                      <p className="text-xs md:text-sm font-medium text-white/60 leading-relaxed">You only send 2,000 tokens of highly relevant context to the model.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_20px_rgba(167,218,219,0.2)] group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg mb-1">High Accuracy</h4>
                      <p className="text-xs md:text-sm font-medium text-white/60 leading-relaxed">No &quot;lost in the middle&quot; effect. The AI is grounded entirely in facts.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
