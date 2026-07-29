import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { Terminal, Loader2, CheckCircle2, FlaskConical, ArrowRight, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TRACES: Record<string, { goal: string, trace: Array<{type: 'thought'|'action'|'observe'|'error', text: string}> }> = {
  bi_dashboard: {
    goal: "Generate a sales Recharts dashboard.",
    trace: [
      { type: 'thought', text: "I need the schema for the sales table to build the right chart." },
      { type: 'action', text: "run_sql(query='SELECT column_name FROM information_schema.columns WHERE table_name = \"sales\";')" },
      { type: 'observe', text: "Columns: id, date, revenue, region, product." },
      { type: 'thought', text: "I will group by region and sum the revenue for the dashboard." },
      { type: 'action', text: "write_file(path='Dashboard.tsx', content='...')" },
      { type: 'error', text: "SyntaxError: Unexpected token." },
      { type: 'thought', text: "Wait, I made a syntax error in the TSX. Let me fix the closing tag." },
      { type: 'action', text: "write_file(path='Dashboard.tsx', content='<fixed code>')" },
      { type: 'observe', text: "File written successfully." }
    ]
  },
  viral_clip_engine: {
    goal: "Extract a 30s viral hook from video.mp4.",
    trace: [
      { type: 'thought', text: "I need to read the transcript to find high-emotion moments." },
      { type: 'action', text: "read_transcript(file='video.srt')" },
      { type: 'observe', text: "... [00:15:22] 'This completely changed my life' ..." },
      { type: 'thought', text: "Found a strong hook at 15:22. I'll run ffmpeg to cut a 30s clip here." },
      { type: 'action', text: "run_ffmpeg(input='video.mp4', start='00:15:22', duration='30')" },
      { type: 'error', text: "Error: input file not found." },
      { type: 'thought', text: "Ah, the file is in the /raw directory. I need to update the path." },
      { type: 'action', text: "run_ffmpeg(input='raw/video.mp4', start='00:15:22', duration='30')" },
      { type: 'observe', text: "Clip saved to output/clip_1.mp4." }
    ]
  },
  default: {
    goal: "Execute primary task.",
    trace: [
      { type: 'thought', text: "I need to analyze the current state before proceeding." },
      { type: 'action', text: "analyze_context()" },
      { type: 'observe', text: "Context loaded. Proceeding with execution plan." },
      { type: 'thought', text: "I will now generate the required artifacts." },
      { type: 'action', text: "generate_artifacts()" },
      { type: 'error', text: "Timeout: generation took too long." },
      { type: 'thought', text: "The request timed out. I will break it down into smaller chunks." },
      { type: 'action', text: "generate_artifacts(chunk_size=100)" },
      { type: 'observe', text: "Artifacts generated successfully." }
    ]
  }
};

export function CapstoneSimSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const { projectSpine } = useProgressStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  
  const spineKey = projectSpine ?? "default";
  const projectData = PROJECT_TRACES[spineKey] || PROJECT_TRACES["default"];

  const [simState, setSimState] = useState<'idle' | 'running' | 'done'>('idle');
  const [activeStep, setActiveStep] = useState(-1);
  const [harnessVerified, setHarnessVerified] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" });

    const timeline = gsap.timeline({ paused: true });
    
    // Auto-start simulation at 3.0s ("Watch the terminal.")
    timeline.call(() => setSimState('running'), [], 3.0);
            
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
    if (simState === 'running') {
      const stepInterval = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= projectData.trace.length - 1) {
            clearInterval(stepInterval);
            setSimState('done');
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1.0s per step
      
      return () => clearInterval(stepInterval);
    }
  }, [simState, projectData.trace.length]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeStep]);

  useEffect(() => {
    const isDone = simState === 'done' && harnessVerified;
    setNavOverride({
      nextDisabled: !isDone,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [simState, harnessVerified, setNavOverride, onComplete]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-10 max-w-5xl mx-auto overflow-hidden relative">
      
      {/* Background Pulse */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000",
        simState === 'running' ? "bg-primary/10 animate-pulse" : "bg-primary/5"
      )} />

      <div ref={containerRef} className="w-full flex flex-col items-center flex-1 min-h-0 relative z-10">
        
        <div className="text-center mb-6 md:mb-8 w-full shrink-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white tracking-tight">
            Simulation: <span className="font-semibold text-primary">Your Capstone Loop</span>
          </h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto text-sm md:text-base font-light">
            Watch the agent think, act, observe, and self-correct in real-time.
          </p>
        </div>

        <div className="w-full flex-1 flex flex-col bg-black/80 border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(167,218,219,0.15)] backdrop-blur-md relative min-h-0">
          
          {/* Terminal Header */}
          <div className="h-12 bg-white/5 border-b border-primary/10 flex items-center px-4 gap-3 shrink-0">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-sm font-mono text-primary font-bold tracking-wider">ENGINE_ROOM_SIMULATOR</span>
            <div className="ml-auto flex items-center gap-4">
              {simState === 'idle' && (
                <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                  WAITING FOR INITIALIZATION...
                </div>
              )}
              {simState === 'running' && (
                <div className="flex items-center gap-2 text-primary/70 text-xs font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> EXECUTING
                </div>
              )}
              {simState === 'done' && (
                <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3" /> SUCCESS
                </div>
              )}
            </div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 font-mono text-xs md:text-sm flex-1 overflow-y-auto bg-[#0a0a0a]">
            {simState !== 'idle' && (
              <div className="text-white/40 pb-4 border-b border-white/10 mb-6">
                <span className="text-primary/70">Goal loaded:</span> {projectData.goal}
              </div>
            )}
            
            <div className="space-y-4 md:space-y-5">
              {projectData.trace.map((step, index) => {
                if (index > activeStep) return null;
                
                const isThought = step.type === 'thought';
                const isAction = step.type === 'action';
                const isObserve = step.type === 'observe';
                const isError = step.type === 'error';
                
                return (
                  <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-3">
                      <span className={cn(
                        "shrink-0 font-bold w-20 uppercase tracking-widest text-[10px] md:text-xs pt-0.5", 
                        isThought && "text-indigo-400/80",
                        isAction && "text-primary",
                        isObserve && "text-emerald-400/80",
                        isError && "text-amber-500"
                      )}>
                        {isThought && "Thought:"}
                        {isAction && "Action:"}
                        {isObserve && "Observe:"}
                        {isError && "Error:"}
                      </span>
                      <span className={cn(
                        "leading-relaxed",
                        isThought && "text-indigo-200/80 italic",
                        isAction && "text-white font-medium",
                        isObserve && "text-emerald-200/60",
                        isError && "text-amber-200/90"
                      )}>
                        {step.text}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {simState === 'done' && (
                <div className="mt-8 pt-6 border-t border-primary/20 animate-in fade-in duration-500 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary shadow-[0_0_20px_rgba(167,218,219,0.3)]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-primary font-bold text-base tracking-wide uppercase">Goal verified and completed.</span>
                </div>
              )}
              <div ref={logEndRef} className="h-4" />
            </div>
          </div>
        </div>

        {/* Action Checkpoint */}
        {simState === 'done' && (
          <div className="w-full mt-6 shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="p-1 rounded-2xl bg-gradient-to-r from-primary/30 to-indigo-500/30">
              <div className="bg-black/90 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Live Harness Checkpoint</h3>
                    <p className="text-sm text-white/60 leading-snug">
                      Open your actual Harness terminal. Enter a prompt related to your Capstone and watch the ReAct trace execute in real time.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setHarnessVerified(!harnessVerified);
                    track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m4/slides/4-capstone-sim/harness-verified", "Toggle Harness Verified");
                  }}
                  className={cn(
                    "shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 border",
                    harnessVerified 
                      ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(167,218,219,0.4)]" 
                      : "bg-white/5 text-white hover:bg-white/10 border-white/10"
                  )}
                >
                  <CheckSquare className={cn("w-5 h-5", harnessVerified ? "text-black" : "text-white/40")} />
                  {harnessVerified ? "Verified" : "Mark as Verified"}
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
