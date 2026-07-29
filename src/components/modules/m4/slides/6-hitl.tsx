import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { Hand, GitCommit, DatabaseZap, Globe2, ShieldCheck, Mail, AlertTriangle, Fingerprint, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_ACTIONS = [
  { id: 'git', title: 'git push --force origin main', icon: GitCommit, risk: 'high', desc: 'Overwrites production codebase.' },
  { id: 'sql', title: 'DROP TABLE users;', icon: DatabaseZap, risk: 'high', desc: 'Destructive data deletion.' },
  { id: 'email', title: 'Send Marketing Email', icon: Mail, risk: 'high', desc: 'Subjective brand communication.' },
  { id: 'web', title: 'Search Google Docs', icon: Globe2, risk: 'low', desc: 'Safe read-only operation.' }
];

export function HitlSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  
  const [protectedNodes, setProtectedNodes] = useState<string[]>([]);
  const [timelineStep, setTimelineStep] = useState(0);
  
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.fromTo(".fade-up", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
    );

    const timeline = gsap.timeline({ paused: true });
    
    // "True autonomy is earned, not given." (0-3s)
    // "For destructive actions like dropping a database..." (3-7s)
    // "...or subjective decisions like writing a marketing email, you must engineer a Human-in-the-Loop gate." (7-11s)
    // "The loop pauses, alerts you, and waits for your cryptographic approval." (11-15s)

    timeline.call(() => setTimelineStep(1), [], 0.0)  // Intro
            .call(() => setTimelineStep(2), [], 3.0)  // Destructive Action
            .call(() => setTimelineStep(3), [], 7.0)  // Subjective Action
            .call(() => setTimelineStep(4), [], 11.0); // Approval Gate
            
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
    if (isFinished) {
      setTimelineStep(5);
    }
  }, [isFinished]);

  useEffect(() => {
    // Nav unlocks when all high-risk actions are protected (only after interactive part begins)
    const allHighRiskProtected = RISK_ACTIONS
      .filter(a => a.risk === 'high')
      .every(a => protectedNodes.includes(a.id));

    const isDone = timelineStep >= 5 && allHighRiskProtected;

    setNavOverride({
      nextDisabled: !isDone,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [protectedNodes, timelineStep, setNavOverride, onComplete]);

  const toggleProtection = (id: string) => {
    if (timelineStep < 5) return; // Ignore clicks before interactive phase
    setProtectedNodes(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 lg:p-10 max-w-6xl mx-auto overflow-hidden relative">
      
      {/* Background Glow */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000",
        timelineStep >= 2 && timelineStep < 4 ? "bg-red-500/10" : 
        timelineStep >= 4 ? "bg-primary/10" : "bg-white/5"
      )} />

      <div className="fade-up text-center mb-6 md:mb-10 w-full relative z-10 shrink-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-white mb-2 tracking-tight">
          Human-in-the-Loop <span className="font-semibold text-primary">(HITL)</span>
        </h2>
        <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto font-light">
          True autonomy is earned, not given. Engineer a verification gate.
        </p>
      </div>

      <div className="flex-1 w-full min-h-0 relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-12">
        
        {/* Left: Cinematic Execution Stream */}
        <div className="flex-1 bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-6 shrink-0">
            <span className="text-xs font-mono font-bold tracking-widest text-white/50 uppercase">Agent Execution Stream</span>
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6">
            
            {/* Step 1: Normal Flow */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
              timelineStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                <Globe2 className="w-8 h-8" />
              </div>
              <div className="mt-4 text-center">
                <div className="text-white font-mono text-sm">action: search_web()</div>
                <div className="text-emerald-400 text-xs mt-2 uppercase tracking-widest font-bold">Auto-Approved</div>
              </div>
            </div>

            {/* Step 2: Destructive Action Warning */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
              timelineStep === 2 ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            )}>
              <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                <DatabaseZap className="w-10 h-10" />
              </div>
              <div className="mt-6 text-center">
                <div className="text-red-400 font-mono text-lg font-bold">action: DROP TABLE users;</div>
                <div className="text-red-400/70 text-sm mt-2 font-medium">CRITICAL DESTRUCTIVE ACTION</div>
              </div>
            </div>

            {/* Step 3: Subjective Action Warning */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700",
              timelineStep === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}>
              <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">
                <Mail className="w-10 h-10" />
              </div>
              <div className="mt-6 text-center">
                <div className="text-amber-400 font-mono text-lg font-bold">action: send_marketing_email()</div>
                <div className="text-amber-400/70 text-sm mt-2 font-medium">HIGH-RISK SUBJECTIVE ACTION</div>
              </div>
            </div>

            {/* Step 4: Cryptographic Approval Gate */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 bg-primary/5",
              timelineStep >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            )}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full border border-primary w-24 h-24 -left-2 -top-2 animate-ping opacity-20" />
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_40px_rgba(167,218,219,0.4)]">
                  <Fingerprint className="w-10 h-10" />
                </div>
              </div>
              <div className="mt-8 text-center px-4">
                <div className="text-primary font-bold text-lg uppercase tracking-widest mb-1">Execution Paused</div>
                <div className="text-white/70 text-sm font-light">Awaiting Human Cryptographic Approval</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: The Interactive Firewall Builder */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-1000",
          timelineStep >= 5 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
        )}>
          
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-medium text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Configure HITL Firewall
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Select all high-risk actions that require human verification before execution.
            </p>
          </div>

          <div className="w-full space-y-3 flex-1 overflow-y-auto pr-2">
            {RISK_ACTIONS.map((action) => {
              const isProtected = protectedNodes.includes(action.id);
              const Icon = action.icon;
              const isHighRisk = action.risk === 'high';

              return (
                <button
                  key={action.id}
                  onClick={() => {
                    toggleProtection(action.id);
                    track("http://adlnet.gov/expapi/verbs/interacted", "interacted", `http://smartslate.com/activities/m4/slides/6-hitl/action/${action.id}`, `Toggle Protection ${action.id}`);
                  }}
                  className={cn(
                    "w-full relative p-4 md:p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                    isProtected 
                      ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(167,218,219,0.15)]" 
                      : "bg-black/60 border-white/10 hover:border-white/30"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
                      isProtected ? "bg-primary text-black" : "bg-white/10 text-white/50"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={cn("font-mono text-xs md:text-sm font-semibold mb-1 transition-colors", isProtected ? "text-primary" : "text-white/90")}>
                        {action.title}
                      </h3>
                      <p className="text-white/50 text-xs hidden sm:block">{action.desc}</p>
                    </div>
                  </div>

                  <div className="relative z-10 shrink-0 self-end sm:self-center">
                    {isProtected ? (
                      <div className="flex items-center gap-2 text-primary bg-black/40 px-3 py-1.5 rounded-full border border-primary/30">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-white/40 group-hover:text-white/80 transition-colors">
                        <Hand className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Unprotected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
