import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { AlertTriangle, Server, Database, Code2, Cpu, Braces, Terminal } from "lucide-react";

export function PluginChaosCostSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const llmRef = useRef<HTMLDivElement>(null);
  const tool1Ref = useRef<HTMLDivElement>(null);
  const tool2Ref = useRef<HTMLDivElement>(null);
  const tool3Ref = useRef<HTMLDivElement>(null);
  
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);
  
  const errorContainerRef = useRef<HTMLDivElement>(null);
  const nightmareLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && llmRef.current && tool1Ref.current && tool2Ref.current && tool3Ref.current &&
      path1Ref.current && path2Ref.current && path3Ref.current && nightmareLabelRef.current
    ) {
      // Setup initial SVG path stroke-dasharray
      gsap.set([path1Ref.current, path2Ref.current, path3Ref.current], { 
        strokeDasharray: 1000, 
        strokeDashoffset: 1000,
        opacity: 0
      });
      
      gsap.set(errorContainerRef.current?.children || [], { opacity: 0, scale: 0.8, y: 20 });

      // 0.0s - Entrance
      timeline.fromTo(llmRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "expo.out" }, 0);
      
      timeline.fromTo([tool1Ref.current, tool2Ref.current, tool3Ref.current], 
        { opacity: 0, x: 50, filter: "blur(10px)" }, 
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, stagger: 0.15, ease: "expo.out" }, 
        0.4
      );

      // 1.5s - "This plugin chaos meant..." Lines draw out
      timeline.to([path1Ref.current, path2Ref.current, path3Ref.current], {
        opacity: 0.8,
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.inOut"
      }, 1.5);

      // 2.4s - Connection Fails! (Bounce & turn destructive)
      const shakeConfig = { x: 8, duration: 0.05, yoyo: true, repeat: 7, ease: "linear" };
      
      timeline.to(path1Ref.current, { stroke: "rgb(239 68 68)", duration: 0.2 }, 2.4);
      timeline.to(tool1Ref.current, shakeConfig, 2.4);
      
      timeline.to(path2Ref.current, { stroke: "rgb(239 68 68)", duration: 0.2 }, 3.5);
      timeline.to(tool2Ref.current, shakeConfig, 3.5);

      timeline.to(path3Ref.current, { stroke: "rgb(239 68 68)", duration: 0.2 }, 4.5);
      timeline.to(tool3Ref.current, shakeConfig, 4.5);

      // 5.5s - "Maintenance Nightmare"
      timeline.to([path1Ref.current, path2Ref.current, path3Ref.current], {
        strokeDashoffset: -1000,
        duration: 0.6,
        ease: "power2.in"
      }, 5.5);
      
      timeline.to([tool1Ref.current, tool2Ref.current, tool3Ref.current], {
        opacity: 0.3,
        filter: "grayscale(100%)",
        duration: 0.5
      }, 5.8);

      timeline.to("#chaos-bg", { opacity: 1, duration: 2 }, 5.5);

      timeline.fromTo(nightmareLabelRef.current, 
        { opacity: 0, scale: 2, filter: "blur(20px)" }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "expo.out" }, 
        6.2
      );

      // 6.5s - Pop up error toasts chaotically
      if (errorContainerRef.current) {
        timeline.to(errorContainerRef.current.children, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }, 6.5);
      }
    }

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


  useEffect(() => {
    if (isFinished && onComplete) onComplete();
  }, [isFinished, onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/10 blur-[150px] rounded-full pointer-events-none opacity-0 transition-opacity duration-1000 z-0" id="chaos-bg" />

      {/* Slide Title */}
      <div className="absolute top-10 left-0 right-0 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-4 tracking-tight opacity-80">
          The Cost of Chaos
        </h2>
      </div>

      <div ref={containerRef} className="w-full max-w-5xl h-[500px] relative mt-16 z-10">
        
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <path ref={path1Ref} d="M 250 250 C 500 250, 600 100, 750 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/60" />
          <path ref={path2Ref} d="M 250 250 C 500 250, 600 250, 750 250" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/60" />
          <path ref={path3Ref} d="M 250 250 C 500 250, 600 400, 750 400" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-primary/60" />
        </svg>

        {/* LLM Engine Node */}
        <div ref={llmRef} className="absolute left-[150px] top-[250px] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-32 h-32 rounded-3xl bg-background/60 backdrop-blur-2xl border-2 border-primary/30 shadow-[0_0_40px_rgba(167,218,219,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <Cpu className="w-12 h-12 text-primary mb-2" />
            <span className="font-bold text-xs tracking-widest text-primary uppercase">Core LLM</span>
          </div>
        </div>

        {/* Tools Nodes */}
        <div className="absolute right-[150px] top-[250px] -translate-y-1/2 -translate-x-1/2 flex flex-col gap-12 z-20">
          <div ref={tool1Ref} className="w-56 h-16 rounded-2xl bg-muted/40 backdrop-blur-xl border border-border/50 flex items-center px-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3 shrink-0">
              <Braces className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-foreground truncate">Custom REST API</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">v1.2 Legacy</span>
            </div>
          </div>
          
          <div ref={tool2Ref} className="w-56 h-16 rounded-2xl bg-muted/40 backdrop-blur-xl border border-border/50 flex items-center px-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-foreground truncate">GraphQL Endpoint</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Incompatible Schema</span>
            </div>
          </div>
          
          <div ref={tool3Ref} className="w-56 h-16 rounded-2xl bg-muted/40 backdrop-blur-xl border border-border/50 flex items-center px-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mr-3 shrink-0">
              <Code2 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-foreground truncate">Legacy SOAP XML</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Malformed Payload</span>
            </div>
          </div>
        </div>

        {/* The Nightmare Label */}
        <div ref={nightmareLabelRef} className="absolute left-[500px] top-[250px] -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none opacity-0 w-[600px]">
          <div className="bg-destructive/20 text-destructive p-4 rounded-full mb-4 shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-xl border border-destructive/30">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-foreground drop-shadow-xl text-center leading-tight">
            Maintenance <br/><span className="text-destructive">Nightmare</span>
          </h3>
        </div>

        {/* Chaotic Error Toasts */}
        <div ref={errorContainerRef} className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute top-[10%] left-[20%] bg-background/90 border border-destructive/40 text-destructive text-xs font-mono py-2 px-4 rounded-lg shadow-xl -rotate-6 backdrop-blur-md">
            TypeError: Cannot read properties of undefined
          </div>
          <div className="absolute top-[80%] left-[30%] bg-background/90 border border-destructive/40 text-destructive text-xs font-mono py-2 px-4 rounded-lg shadow-xl rotate-3 backdrop-blur-md">
            401 Unauthorized: Invalid Auth Protocol
          </div>
          <div className="absolute top-[20%] right-[30%] bg-background/90 border border-destructive/40 text-destructive text-xs font-mono py-2 px-4 rounded-lg shadow-xl rotate-12 backdrop-blur-md">
            ECONNRESET: Socket hung up
          </div>
          <div className="absolute top-[70%] right-[25%] bg-background/90 border border-destructive/40 text-destructive text-xs font-mono py-2 px-4 rounded-lg shadow-xl -rotate-12 backdrop-blur-md">
            Error: Expected JSON, received XML
          </div>
          <div className="absolute top-[45%] left-[10%] bg-background/90 border border-destructive/40 text-destructive text-xs font-mono py-2 px-4 rounded-lg shadow-xl rotate-2 backdrop-blur-md">
            RateLimitExceeded: Missing backoff adapter
          </div>
        </div>

      </div>
    </div>
  );
}
