import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { Terminal, Send, Search, CheckCircle2 } from "lucide-react";

export function TriggerSimulatorSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSimulate = () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    setFeedback("");

    // Simulate processing
    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      // Simple heuristic: requires "search", "live", "current", "today", "now", "weather" to trigger a tool.
      if (lowerPrompt.includes("search") || lowerPrompt.includes("current") || lowerPrompt.includes("today") || lowerPrompt.includes("now") || lowerPrompt.includes("weather") || lowerPrompt.includes("live") || lowerPrompt.includes("latest")) {
        setSuccess(true);
        setFeedback('Tool triggered successfully! The LLM realized it needed external data and generated a tool call: {"function": "web_search", "query": "..."}');
      } else {
        setIsSubmitting(false);
        setFeedback("The AI tried to answer from its training data. Try asking for something that requires live or current information (e.g., 'Search for the latest news on...').");
      }
    }, 1200);
  };

  useEffect(() => {
    // Narration: "Now it's your turn. Write a prompt that requires the AI to look up a real-time value rather than relying on its training data."
    const timeline = gsap.timeline({ paused: true });

    if (containerRef.current) {
      timeline.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 0);
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
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    setNavOverride({
      nextLabel: success ? "" : "Complete Exercise",
      nextDisabled: !success,
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [success, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-5xl mx-auto relative group">
      
      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Trigger a Tool Call
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Write a prompt that forces the AI to use a tool instead of relying on its training memory.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] flex flex-col relative z-10">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Terminal className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Agent Terminal</h3>
            <p className="text-sm font-medium text-indigo-400 uppercase tracking-widest">Available Tools: Web Search</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-6">
          
          <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4 relative overflow-y-auto">
            {/* System message */}
            <div className="self-start max-w-[80%]">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1 ml-2">System</p>
              <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 border border-white/10">
                <p className="text-sm text-white/80">I am ready. I have access to a web search tool. What would you like me to do?</p>
              </div>
            </div>

            {/* Feedback message */}
            {feedback && (
              <div className={`self-center max-w-[90%] mt-4 p-4 rounded-2xl border ${success ? 'bg-primary/10 border-primary/30' : 'bg-orange-500/10 border-orange-500/30'} flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2`}>
                {success ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> : <Search className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />}
                <p className={`text-sm ${success ? 'text-teal-200' : 'text-orange-200'}`}>
                  {feedback}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-black/60 rounded-full border border-white/10 p-2 pl-6 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
            <input
              type="text"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/7/prompt_input", "Prompt Input");
              }}
              disabled={isSubmitting || success}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSimulate();
              }}
              placeholder="E.g., What is the weather in Tokyo right now?"
              className="flex-1 bg-transparent text-white font-medium outline-none placeholder:text-white/30 disabled:opacity-50"
            />
            <button
              onClick={() => {
                handleSimulate();
                track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/7/simulate_button", "Simulate Button");
              }}
              disabled={isSubmitting || success || !prompt.trim()}
              className="w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 flex items-center justify-center shrink-0 transition-colors"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
