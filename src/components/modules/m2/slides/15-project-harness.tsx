import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { CheckCircle2, LayoutTemplate, Terminal, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useLRS } from "@/hooks/use-lrs";

export function ProjectHarnessSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [selectedHarness, setSelectedHarness] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    // Narration: "Next, choose your harness. This is the application that will run your agent and give it access to your local environment. While there are many desktop and CLI options available, we highly recommend using the Antigravity CLI or Desktop tool to follow along with this course."
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
    const isValid = selectedHarness === "antigravity" || (selectedHarness === "custom" && customValue.trim().length > 0);

    setNavOverride({
      nextDisabled: !isValid,
      nextLabel: isValid ? "Continue" : "Select a Harness",
      onNext: (handleNext) => {
        if (onComplete) onComplete();
        handleNext();
      }
    });
    return () => setNavOverride(null);
  }, [selectedHarness, customValue, onComplete, setNavOverride]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto min-h-0 p-4 md:p-6 lg:py-8 max-w-4xl mx-auto items-center justify-center relative">
      <div className="absolute top-[20%] right-1/2 translate-x-1/2 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-6 relative z-10 w-full">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 mb-4">
          <LayoutTemplate className="w-6 h-6 text-teal-400" />
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-3 tracking-tight drop-shadow-md">
          Choose Your Harness
        </h2>
        <p className="text-teal-100/70 text-base md:text-lg font-medium max-w-2xl mx-auto">
          Select the environment that will host your agent. This application will run locally and access your files.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 gap-4 relative z-10">
        
        {/* Antigravity Option */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            setSelectedHarness("antigravity");
            track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/15/project-harness/select-antigravity", "Select Antigravity Harness");
          }}
          className={`relative flex items-center text-left p-5 rounded-2xl border transition-all duration-300 ${
            selectedHarness === "antigravity" 
              ? "bg-teal-500/20 border-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.15)]" 
              : "bg-black/40 border-white/10 hover:border-teal-500/30"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-5 transition-colors ${
            selectedHarness === "antigravity" ? "bg-teal-400 text-black" : "bg-white/5 text-teal-400 border border-white/10"
          }`}>
            <Terminal className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-white">Antigravity CLI / Desktop</h3>
              <span className="text-[10px] uppercase font-black tracking-wider bg-teal-400 text-black px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <p className={`text-sm ${selectedHarness === "antigravity" ? "text-teal-100" : "text-white/50"}`}>
              Native tool capability, built-in MCP registry, and skills management out of the box.
            </p>
          </div>

          <div className="ml-4 shrink-0">
            <CheckCircle2 className={`w-8 h-8 transition-all ${
              selectedHarness === "antigravity" ? "text-teal-400 scale-100 opacity-100" : "text-white/10 scale-50 opacity-0"
            }`} />
          </div>
        </motion.button>

        {/* Custom Input Option */}
        <motion.div
          whileHover={{ scale: selectedHarness === "custom" ? 1 : 1.01 }}
          className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
            selectedHarness === "custom"
              ? "bg-teal-500/10 border-teal-500/50" 
              : "bg-black/40 border-white/10 hover:border-teal-500/30"
          }`}
          onClick={() => {
            if (selectedHarness !== "custom") {
              setSelectedHarness("custom");
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/15/project-harness/select-custom", "Select Custom Harness");
            }
          }}
        >
          <div className="flex items-center w-full">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-5 transition-colors ${
              selectedHarness === "custom" ? "bg-teal-500/30 text-teal-400" : "bg-white/5 text-white/40 border border-white/10"
            }`}>
              <PenLine className="w-6 h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white">Custom Harness</h3>
                {selectedHarness !== "custom" && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/60 px-2 py-0.5 rounded-full border border-white/5">
                    Other Tool
                  </span>
                )}
              </div>
              <p className={`text-sm ${selectedHarness === "custom" ? "text-teal-100/70" : "text-white/50"}`}>
                Enter the name of the desktop app, CLI, or VSCode extension you will use.
              </p>
            </div>

            <div className="ml-4 shrink-0">
              <CheckCircle2 className={`w-8 h-8 transition-all ${
                selectedHarness === "custom" && customValue.trim().length > 0 ? "text-teal-400 scale-100 opacity-100" : "text-white/10 scale-50 opacity-0"
              }`} />
            </div>
          </div>

          {selectedHarness === "custom" && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              className="w-full"
            >
              <input 
                type="text" 
                placeholder="e.g. Claude Desktop, Cline, Cursor..."
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/15/project-harness/custom-value", "Custom Harness Input");
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
