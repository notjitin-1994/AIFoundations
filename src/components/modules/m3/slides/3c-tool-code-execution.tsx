import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Terminal, BrainCircuit, Code2, ArrowRight, ArrowLeft } from "lucide-react";

export function ToolCodeExecutionSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  
  const jsonPayloadRef = useRef<HTMLDivElement>(null);
  const executionRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Another critical category is computational action. LLMs famously struggle with precise math and logic. By using a code interpreter tool, the AI can write a Python script, execute it in a secure sandbox, and return a flawless mathematical result."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && leftSideRef.current && rightSideRef.current && 
      jsonPayloadRef.current && executionRef.current && resultRef.current &&
      line1Ref.current && line2Ref.current
    ) {
      // 1. Initial State
      timeline.fromTo(leftSideRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      timeline.fromTo(rightSideRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0.2);
      
      // 2. Outbound Line
      timeline.fromTo(line1Ref.current, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 1.0);

      // 3. Code Payload Travels
      timeline.fromTo(jsonPayloadRef.current, { opacity: 0, scale: 0.5, x: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 3.5); // "write a Python script"
      timeline.to(jsonPayloadRef.current, { x: 300, duration: 1.0, ease: "power1.inOut" }, 4.0);
      
      // 4. Sandbox Executes
      timeline.fromTo(executionRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 5.2);
      timeline.to(rightSideRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.3))", duration: 0.3, yoyo: true, repeat: 1 }, 5.2);

      // 5. Inbound Line & Result
      timeline.fromTo(line2Ref.current, { scaleX: 0, transformOrigin: "right center" }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 7.0); // "return a flawless..."
      timeline.fromTo(resultRef.current, { opacity: 0, scale: 0.5, x: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 7.5);
      timeline.to(resultRef.current, { x: -300, duration: 1.0, ease: "power1.inOut" }, 8.0);
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
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Code Execution
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Offloading logic to a secure sandbox.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-center gap-8 md:gap-16">
        
        {/* Left: LLM Agent */}
        <div ref={leftSideRef} className="w-[300px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center z-10 relative">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl border border-primary/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(167,218,219,0.2)]">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-white mb-2">Agent</h3>
          <p className="text-[10px] text-white/50 text-center mb-4">"What is 2348 * 987?"</p>
          
          <div className="w-full bg-black/60 rounded-lg p-2 border border-white/5 mt-auto">
             <p className="text-[9px] text-white/40 text-center">Awaiting Result...</p>
          </div>
        </div>

        {/* Center: Lines & Payloads */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[300px] h-16 z-0 flex flex-col justify-between">
          
          {/* Outbound Line */}
          <div className="w-full h-0.5 bg-primary/20 relative mt-2">
            <div ref={line1Ref} className="w-full h-full bg-primary/50 relative">
              <ArrowRight className="absolute -right-3 -top-2.5 w-5 h-5 text-primary" />
            </div>
          </div>
          
          {/* Inbound Line */}
          <div className="w-full h-0.5 bg-primary/20 relative mb-2">
            <div ref={line2Ref} className="w-full h-full bg-primary/50 relative">
              <ArrowLeft className="absolute -left-3 -top-2.5 w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Outbound Code Payload */}
        <div ref={jsonPayloadRef} className="hidden md:block absolute left-[calc(50%-150px-100px)] top-[calc(50%-45px)] -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-primary/40 rounded-xl p-3 shadow-xl z-30 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <Code2 className="w-3 h-3 text-primary" />
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">run_python</span>
          </div>
          <pre className="text-[9px] font-mono text-white/80 leading-tight">
{`{
  "code": "print(2348 * 987)"
}`}
          </pre>
        </div>

        {/* Inbound Result Payload */}
        <div ref={resultRef} className="hidden md:block absolute right-[calc(50%-150px-70px)] top-[calc(50%+45px)] -translate-y-1/2 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-xl p-2 shadow-xl z-30">
          <span className="text-xs font-mono text-white font-bold bg-black/50 px-2 py-1 rounded">2317476</span>
        </div>

        {/* Right: Sandbox */}
        <div ref={rightSideRef} className="w-[300px] bg-black/40 backdrop-blur-2xl border border-primary/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center z-10 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center mb-4">
            <Terminal className="w-8 h-8 text-primary/80" />
          </div>
          <h3 className="font-bold text-white mb-4">Sandbox</h3>
          
          <div className="w-full bg-black/80 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono pb-2 border-b border-white/10">
              root@sandbox:~# python -c
            </div>
            <div ref={executionRef} className="opacity-0">
              <pre className="text-[10px] font-mono text-primary/90">
                &gt;&gt;&gt; 2348 * 987<br/>
                2317476
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
