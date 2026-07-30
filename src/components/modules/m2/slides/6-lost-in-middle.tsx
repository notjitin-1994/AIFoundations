import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

export function LostInMiddleSlide() {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const citationRef = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(false);
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  
  useEffect(() => {
    // Audio-synced timeline
    // Narration: "But bigger isn't always better. Research consistently shows a U-shaped performance curve. Models pay close attention to the beginning and end of a prompt, but often ignore what's buried in the middle."
    const timeline = gsap.timeline({ paused: true });
    
    timeline.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    timeline.fromTo(pRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5);
    
    timeline.add(() => {
      setShowChart(true);
    }, 4.0);
    
    timeline.fromTo(citationRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 5.5);
    
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


  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-8 md:mb-12 z-10 text-center">
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight drop-shadow-sm">
          The &quot;Lost in the Middle&quot; Phenomenon
        </h2>
        <p ref={pRef} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
          A massive context window does not equal massive comprehension. Models suffer from positional bias, recalling the edges perfectly while ignoring the center.
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center relative z-20">
        <div className="w-full max-w-4xl h-full max-h-[450px] bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative flex flex-col overflow-hidden">
          
          <div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
            {showChart && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full h-full relative"
                onMouseLeave={() => setHoverPos(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setHoverPos(x);
                }}
              >
                {/* SVG Bespoke Chart */}
                <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(175, 40%, 65%)" />
                      <stop offset="25%" stopColor="hsl(175, 40%, 65%)" />
                      <stop offset="50%" stopColor="hsl(0, 80%, 60%)" />
                      <stop offset="75%" stopColor="hsl(175, 40%, 65%)" />
                      <stop offset="100%" stopColor="hsl(175, 40%, 65%)" />
                    </linearGradient>
                    <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(175, 40%, 65%)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="hsl(175, 40%, 65%)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 100, 200, 300].map((y) => (
                    <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  ))}

                  {/* The U-Curve Path: Starts high, dips in middle, goes high */}
                  <motion.path
                    d="M 0 50 C 200 50, 300 350, 500 350 C 700 350, 800 50, 1000 50"
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Fill Area underneath curve */}
                  <motion.path
                    d="M 0 50 C 200 50, 300 350, 500 350 C 700 350, 800 50, 1000 50 L 1000 400 L 0 400 Z"
                    fill="url(#fillGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                  />

                  {/* Interactive Hover Line & Tooltip */}
                  {hoverPos !== null && (
                    <g>
                      <line 
                        x1={hoverPos * 1000} 
                        y1="0" 
                        x2={hoverPos * 1000} 
                        y2="400" 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="2" 
                        strokeDasharray="4 4" 
                      />
                      {/* Calculate Y on the bezier curve approx. (1-t)^3*P0 + 3(1-t)^2*t*P1 + ... simplified for symmetrical curve */}
                      {(() => {
                        const x = hoverPos * 1000;
                        let y = 50;
                        // Rough bezier approximation for the y-coordinate based on x
                        if (x < 500) {
                          const t = x / 500;
                          y = 50 * Math.pow(1 - t, 3) + 50 * 3 * Math.pow(1 - t, 2) * t + 350 * 3 * (1 - t) * Math.pow(t, 2) + 350 * Math.pow(t, 3);
                        } else {
                          const t = (x - 500) / 500;
                          y = 350 * Math.pow(1 - t, 3) + 350 * 3 * Math.pow(1 - t, 2) * t + 50 * 3 * (1 - t) * Math.pow(t, 2) + 50 * Math.pow(t, 3);
                        }
                        const recall = Math.round(100 - ((y - 50) / 300) * 80);
                        const isLost = recall < 50;
                        
                        return (
                          <g>
                            <circle cx={x} cy={y} r="8" fill="white" filter="url(#glow)" />
                            <circle cx={x} cy={y} r="4" fill={isLost ? "#ef4444" : "#2dd4bf"} />
                            {/* Tooltip Float */}
                            <foreignObject x={x > 800 ? x - 160 : x + 20} y={Math.max(20, y - 60)} width="150" height="80" className="overflow-visible">
                              <div className={`p-3 rounded-xl border backdrop-blur-md shadow-2xl ${isLost ? 'bg-destructive/20 border-destructive/30 text-destructive-foreground' : 'bg-card/80 border-white/20 text-foreground'}`}>
                                <div className="text-xs font-bold uppercase opacity-80 mb-1">Recall Accuracy</div>
                                <div className="text-xl font-black">{recall}%</div>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })()}
                    </g>
                  )}
                </svg>

                {/* X Axis Labels overlayed absolutely */}
                <div className="absolute -bottom-2 left-0 text-sm font-bold text-primary tracking-widest uppercase bg-background/50 px-3 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
                  Start of Prompt
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm font-bold text-destructive tracking-widest uppercase bg-destructive/10 px-3 py-1 rounded-lg border border-destructive/20 backdrop-blur-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Lost in the Middle
                </div>
                <div className="absolute -bottom-2 right-0 text-sm font-bold text-primary tracking-widest uppercase bg-background/50 px-3 py-1 rounded-lg border border-white/5 backdrop-blur-sm">
                  End of Prompt
                </div>

                {/* Y Axis Labels overlayed absolutely */}
                <div className="absolute top-[5%] -left-4 md:-left-12 text-xs font-bold text-muted-foreground uppercase h-[400px] flex flex-col justify-between items-end pb-[10%]">
                  <span>100%</span>
                  <span>50%</span>
                  <span>0%</span>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="shrink-0 mt-8 flex flex-col items-center gap-4 relative z-20">
            <div ref={citationRef} className="text-xs text-muted-foreground/50 bg-white/5 backdrop-blur-md py-2 px-6 rounded-full border border-white/5 uppercase tracking-widest font-bold">
              Source: &quot;Lost in the Middle: How Language Models Use Long Contexts&quot; (Stanford)
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
