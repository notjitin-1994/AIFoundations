import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { FolderTree, FileCode2, ArrowRight, BrainCircuit, Code2 } from "lucide-react";

export function ToolFilesystemSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const jsonPayloadRef = useRef<HTMLDivElement>(null);
  const fileEditorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "Beyond simple web APIs, one of the most powerful tool categories is filesystem access. By exposing tools like read_file and write_file, an LLM can analyze your local codebase, review logs, and even rewrite entire documents."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && leftSideRef.current && rightSideRef.current && 
      jsonPayloadRef.current && fileEditorRef.current && lineRef.current
    ) {
      // 1. Initial State
      timeline.fromTo(leftSideRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0);
      timeline.fromTo(rightSideRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0.2);
      
      // 2. Connecting Line
      timeline.fromTo(lineRef.current, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 1.0);

      // 3. Payload Appears and travels
      timeline.fromTo(jsonPayloadRef.current, { opacity: 0, scale: 0.5, x: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 2.0);
      timeline.to(jsonPayloadRef.current, { x: 300, duration: 1.5, ease: "power1.inOut" }, 4.0); // Wait until "rewrite entire documents"
      
      // 4. Filesystem Updates
      timeline.fromTo(fileEditorRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 5.5);
      timeline.to(rightSideRef.current, { filter: "drop-shadow(0 0 30px rgba(167,218,219,0.3))", duration: 0.3, yoyo: true, repeat: 1 }, 5.5);
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
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="shrink-0 mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Filesystem Access
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Reading and writing your local codebase.
        </p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative z-10 flex items-center justify-center gap-8 md:gap-16">
        
        {/* Left: LLM Agent */}
        <div ref={leftSideRef} className="w-[300px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center z-10 relative">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl border border-primary/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(167,218,219,0.2)]">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-white mb-2">Agent</h3>
          <p className="text-xs text-white/50 text-center">Formulates the edit.</p>
        </div>

        {/* Center: Payload & Line */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[300px] h-0.5 bg-primary/20 z-0">
          <div ref={lineRef} className="w-full h-full bg-primary/50 relative">
            <ArrowRight className="absolute -right-3 -top-2.5 w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Moving JSON Payload */}
        <div ref={jsonPayloadRef} className="hidden md:block absolute left-[calc(50%-150px-100px)] top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-primary/40 rounded-xl p-3 shadow-xl z-30 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <Code2 className="w-3 h-3 text-primary" />
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">write_file</span>
          </div>
          <pre className="text-[9px] font-mono text-white/80 leading-tight">
{`{
  "path": "app.ts",
  "content": "console.log('fixed');"
}`}
          </pre>
        </div>

        {/* Right: Filesystem */}
        <div ref={rightSideRef} className="w-[300px] bg-black/40 backdrop-blur-2xl border border-primary/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center z-10 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center mb-4">
            <FolderTree className="w-8 h-8 text-primary/80" />
          </div>
          <h3 className="font-bold text-white mb-4">Local Filesystem</h3>
          
          <div className="w-full bg-black/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-white/60 font-mono pb-2 border-b border-white/10">
              <FileCode2 className="w-4 h-4 text-primary" /> app.ts
            </div>
            <div ref={fileEditorRef} className="opacity-0">
              <pre className="text-[10px] font-mono text-primary/90">
                + console.log('fixed');
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
