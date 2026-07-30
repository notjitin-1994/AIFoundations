import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { CheckCircle2, Zap, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useLRS } from "@/hooks/use-lrs";

export function ProjectLLMSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  const GeminiLogo = () => (
    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#gemini-grad)"/>
        <defs>
          <linearGradient id="gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4A90E2"/>
            <stop offset="1" stopColor="#D94B68"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  useEffect(() => {
    // Narration: "It's time to choose your engine. When researching LLMs, look for providers offering free tiers with API access—this is different from a free chat interface! Some models require a subscription to use their API. For learning, we highly recommend Gemini, as it offers a generous free API tier perfect for getting started."
    const timeline = gsap.timeline({ paused: true });
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


  // Hook into canvas nav
  useEffect(() => {
    const isValid = selectedLLM === "gemini" || (selectedLLM === "custom" && customValue.trim().length > 0);
    
    setNavOverride({
      nextDisabled: !isValid,
      nextLabel: isValid ? "Continue" : "Select an Engine",
      onNext: (handleNext) => {
        if (onComplete) onComplete();
        handleNext();
      }
    });
    return () => setNavOverride(null);
  }, [selectedLLM, customValue, onComplete, setNavOverride]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto min-h-0 p-4 md:p-6 lg:py-8 max-w-4xl mx-auto items-center justify-center relative">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-6 relative z-10 w-full">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 mb-4">
          <Zap className="w-6 h-6 text-teal-400" />
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-3 tracking-tight drop-shadow-md">
          Choose Your Engine
        </h2>
        <p className="text-teal-100/70 text-base md:text-lg font-medium max-w-2xl mx-auto">
          Select the foundation model you will use for the rest of this project. You need API access, not just a web chat account.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 gap-4 relative z-10">
        
        {/* Gemini Option */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setSelectedLLM("gemini");
            track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/14/project-llm/select-gemini", "Select Gemini LLM");
          }}
          className={`relative flex items-center text-left p-5 rounded-2xl border transition-all duration-300 ${
            selectedLLM === "gemini" 
              ? "bg-teal-500/20 border-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.15)]" 
              : "bg-black/40 border-white/10 hover:border-teal-500/30"
          }`}
        >
          <div className="w-12 h-12 shrink-0 mr-5">
            <GeminiLogo />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-white">Google Gemini</h3>
              <span className="text-[10px] uppercase font-black tracking-wider bg-teal-400 text-black px-2 py-0.5 rounded-full">
                Recommended for Learning
              </span>
            </div>
            <p className={`text-sm ${selectedLLM === "gemini" ? "text-teal-100" : "text-white/50"}`}>
              Generous free API tier, extremely fast, excellent 2M+ context window.
            </p>
          </div>

          <div className="ml-4 shrink-0">
            <CheckCircle2 className={`w-8 h-8 transition-all ${
              selectedLLM === "gemini" ? "text-teal-400 scale-100 opacity-100" : "text-white/10 scale-50 opacity-0"
            }`} />
          </div>
        </motion.button>

        {/* Custom Input Option */}
        <motion.div
          whileHover={{ scale: selectedLLM === "custom" ? 1 : 1.01 }}
          className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
            selectedLLM === "custom"
              ? "bg-teal-500/10 border-teal-500/50" 
              : "bg-black/40 border-white/10 hover:border-teal-500/30"
          }`}
          onClick={() => {
            if (selectedLLM !== "custom") {
              setSelectedLLM("custom");
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/14/project-llm/select-custom", "Select Custom LLM");
            }
          }}
        >
          <div className="flex items-center w-full">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-5 transition-colors ${
              selectedLLM === "custom" ? "bg-teal-500/30 text-teal-400" : "bg-white/5 text-white/40 border border-white/10"
            }`}>
              <PenLine className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white">Custom LLM</h3>
                {selectedLLM !== "custom" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/60 px-2 py-0.5 rounded-full border border-white/5">
                    Other Provider
                  </span>
                )}
              </div>
              <p className={`text-sm ${selectedLLM === "custom" ? "text-teal-100/70" : "text-white/50"}`}>
                Enter the name of the foundation model or provider you will use.
              </p>
            </div>

            <div className="ml-4 shrink-0">
              <CheckCircle2 className={`w-8 h-8 transition-all ${
                selectedLLM === "custom" && customValue.trim().length > 0 ? "text-teal-400 scale-100 opacity-100" : "text-white/10 scale-50 opacity-0"
              }`} />
            </div>
          </div>

          {selectedLLM === "custom" && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              className="w-full"
            >
              <input 
                type="text" 
                placeholder="e.g. Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o..."
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/14/project-llm/custom-value", "Custom LLM Input");
                }}
                autoFocus
                className="w-full bg-black/50 border border-teal-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
