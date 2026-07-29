import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Search, AlertTriangle, CheckCircle2, Scan, BrainCircuit } from "lucide-react";
import { useLRS } from "@/hooks/use-lrs";

export function AttentionHeatmapSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();

  const [scanPosition, setScanPosition] = useState(0);
  const [interacted, setInteracted] = useState(false);
  
  // Track if user has scanned both ends and the middle
  const [explored, setExplored] = useState({ top: false, mid: false, bottom: false });

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1);
    
    tl.current = timeline;
    return () => timeline.kill();
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // Update explored zones
    if (scanPosition < 20) setExplored(e => ({ ...e, top: true }));
    if (scanPosition > 40 && scanPosition < 60) setExplored(e => ({ ...e, mid: true }));
    if (scanPosition > 80) setExplored(e => ({ ...e, bottom: true }));
    
    if (scanPosition > 0) setInteracted(true);
  }, [scanPosition]);

  const hasCompletedExploration = explored.top && explored.mid && explored.bottom;

  useEffect(() => {
    setNavOverride({
      nextLabel: "Continue",
      nextDisabled: !interacted,
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [interacted, setNavOverride, onComplete]);

  // Calculate attention metrics based on scan position
  // U-Curve: High at ends (0, 100), Low in middle (50)
  const distanceToCenter = Math.abs(scanPosition - 50); // 0 to 50
  const attentionScore = Math.max(12, Math.round((distanceToCenter / 50) * 100));
  
  const isLost = attentionScore < 40;
  const isPerfect = attentionScore > 85;

  return (
    <div className="w-full h-full relative overflow-hidden">


      {/* Content Container */}
      <div className="w-full h-full flex flex-col md:flex-row relative p-6 md:p-10 max-w-7xl mx-auto gap-8 md:gap-12 items-center z-10">
        
        {/* LEFT COLUMN: 30% - Header & Description */}
      <div className="w-full md:w-[30%] shrink-0 z-20 flex flex-col justify-center">
        <h2 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 tracking-tight drop-shadow-sm text-balance">
          Lost in the Middle
        </h2>
        <p ref={pRef} className="text-base md:text-lg text-white/70 text-balance leading-relaxed">
          Scan through the document to see how an AI&apos;s attention span behaves. Notice what happens to its recall ability when important details are buried in the middle of a massive prompt.
        </p>
      </div>

      {/* RIGHT COLUMN: 70% - Main Interactive Workspace */}
      <div className="flex-1 w-full flex flex-col z-20 relative gap-6 h-full min-h-0 py-4">
        
        {/* Top Interactive Area: Split into Document & AI Brain */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 relative">
          
          {/* Left: The Document Scanner */}
          <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-3xl rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative">
            
            <div className="shrink-0 bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5 z-20">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">Context Buffer (50 Pages)</span>
              </div>
            </div>

            <div className="flex-1 relative flex flex-col justify-between overflow-hidden">
              
              {/* The Document Content Map (Enriched) */}
              <div className="absolute inset-x-6 lg:inset-x-10 inset-y-6 lg:inset-y-10 flex flex-col gap-4 opacity-50 z-0 overflow-hidden">
                {/* Page 1 Skeleton */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4 shadow-inner">
                   <div className="h-3 w-1/3 bg-primary/30 rounded-md" />
                   <div className="space-y-2">
                     <div className="h-1.5 w-full bg-white/20 rounded-full" />
                     <div className="h-1.5 w-11/12 bg-white/20 rounded-full" />
                     <div className="h-1.5 w-full bg-white/20 rounded-full" />
                   </div>
                </div>
                {/* Pages 2-49 Skeleton */}
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4 flex-1 flex flex-col justify-center">
                   <div className="h-3 w-1/2 bg-white/10 rounded-md" />
                   <div className="space-y-3">
                     <div className="h-1.5 w-full bg-white/10 rounded-full" />
                     <div className="h-1.5 w-full bg-white/10 rounded-full" />
                     <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
                     <div className="h-1.5 w-full bg-white/10 rounded-full" />
                     <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                     <div className="h-1.5 w-full bg-white/10 rounded-full" />
                     <div className="h-1.5 w-5/6 bg-white/10 rounded-full" />
                   </div>
                </div>
                {/* Page 50 Skeleton */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4 shadow-inner">
                   <div className="h-3 w-1/4 bg-primary/30 rounded-md" />
                   <div className="space-y-2">
                     <div className="h-1.5 w-full bg-white/20 rounded-full" />
                     <div className="h-1.5 w-5/6 bg-white/20 rounded-full" />
                   </div>
                </div>
              </div>

              {/* The Physical Scanning Beam */}
              <div 
                className="absolute left-0 right-0 h-48 -mt-24 z-10 pointer-events-none flex items-center transition-all duration-75"
                style={{ top: `calc(6rem + (100% - 12rem) * ${scanPosition / 100})` }}
              >
                {/* Beam Glow */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent opacity-20"
                  style={{ color: isLost ? '#ef4444' : '#a7dadb' }}
                />
                {/* Laser Line */}
                <div 
                  className="w-full h-[2px] shadow-[0_0_20px_currentColor] transition-colors duration-300"
                  style={{ backgroundColor: isLost ? '#ef4444' : '#a7dadb', color: isLost ? '#ef4444' : '#a7dadb' }}
                />
                
                {/* Illuminated Text Content that travels with the beam */}
                <div className="absolute inset-x-6 lg:inset-x-10 inset-y-0 flex flex-col justify-center items-start pl-6 pointer-events-none">
                  <div 
                    className="font-mono text-xs md:text-sm lg:text-base font-black max-w-[90%] transition-colors duration-300 bg-black/60 p-4 rounded-xl border backdrop-blur-xl shadow-2xl"
                    style={{ 
                      color: isLost ? '#ef4444' : '#ffffff',
                      borderColor: isLost ? 'rgba(239, 68, 68, 0.4)' : 'rgba(167, 218, 219, 0.4)',
                      boxShadow: isLost ? '0 10px 30px rgba(239, 68, 68, 0.2)' : '0 10px 30px rgba(167, 218, 219, 0.15)'
                    }}
                  >
                    {scanPosition < 25 && "SYSTEM PROMPT: Extract all compliance risk factors and format as JSON."}
                    {scanPosition >= 25 && scanPosition < 75 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-destructive/90 text-[10px] md:text-xs tracking-widest uppercase">Page 28 (Ignored)</span>
                        <span className="opacity-80 blur-[0.5px]">New local ordinance requires tax form 409-B. Penalty is $50,000 per missing form...</span>
                      </div>
                    )}
                    {scanPosition >= 75 && "USER: Based on the document above, list the top 3 compliance risks."}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: AI Brain Analysis */}
          <div className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col gap-4">
            
            <div className="bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 lg:p-4 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500" style={{ borderColor: isLost ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)' }}>
              
              <BrainCircuit className="w-4 h-4 lg:w-5 lg:h-5 text-white/20 absolute top-4 left-4 lg:top-5 lg:left-5" />
              
              <div className="text-center w-full flex flex-col items-center justify-center gap-1 lg:gap-2 z-10">
                <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-white/50">Attention Score</div>
                
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-16 h-16 lg:w-24 lg:h-24 -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <motion.circle 
                      cx="50%" cy="50%" r="45%" fill="none" 
                      stroke={isLost ? '#ef4444' : '#a7dadb'} 
                      strokeWidth="4" 
                      strokeDasharray="283"
                      animate={{ strokeDashoffset: 283 - (283 * attentionScore) / 100 }}
                      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-lg lg:text-2xl font-black font-mono" style={{ color: isLost ? '#ef4444' : '#ffffff' }}>
                      {attentionScore}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {isLost ? (
                    <div className="flex flex-col items-center gap-1.5 text-destructive animate-pulse">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-balance leading-tight">Details Ignored<br/>by Model</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-balance leading-tight">Perfect Recall<br/>Guaranteed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-3 lg:p-4 shadow-inner flex flex-col gap-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">Checklist</div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className={`w-2 h-2 rounded-full ${explored.top ? 'bg-primary' : 'bg-white/20'}`} />
                Scan Top Context
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className={`w-2 h-2 rounded-full ${explored.mid ? 'bg-destructive' : 'bg-white/20'}`} />
                Scan Middle Context
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className={`w-2 h-2 rounded-full ${explored.bottom ? 'bg-primary' : 'bg-white/20'}`} />
                Scan Bottom Context
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Slider Control */}
        <div className="shrink-0 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-4 flex items-center gap-4 shadow-xl z-20">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50 w-12 text-right">Top</span>
          <div className="flex-1 relative h-10 group/slider flex items-center cursor-grab active:cursor-grabbing">
            <div className="absolute left-0 right-0 h-3 bg-black/60 rounded-full shadow-inner border border-white/5" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={scanPosition} 
              onChange={(e) => {
                setScanPosition(Number(e.target.value));
                track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/7/attention-heatmap/slider", "Attention Heatmap Slider");
              }}
              className="w-full h-full opacity-0 appearance-none absolute cursor-[inherit] touch-none z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:h-12 [&::-moz-range-thumb]:w-12 [&::-moz-range-thumb]:h-12 [&::-moz-range-thumb]:appearance-none"
            />
            <div 
              className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-[3px] border-primary pointer-events-none transition-transform group-active/slider:scale-110 z-10"
              style={{ left: `calc(${scanPosition}% - 16px)`, borderColor: isLost ? '#ef4444' : '#a7dadb' }}
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/50 w-12">Bottom</span>
        </div>

      </div>
    </div>
    </div>
  );
}
