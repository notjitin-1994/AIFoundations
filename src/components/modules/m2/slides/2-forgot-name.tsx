import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Bot, User, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";

export function ForgotNameSlide() {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { setNavOverride } = useCanvasNav();

  const containerRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [diagnosed, setDiagnosed] = useState(false);

  useEffect(() => {
    // Audio-synced timeline
    // Narration: "Have you ever given an AI a long document, set a strict rule at the top, and found it completely ignoring that rule by the end? Let's look at the Goldfish Problem in action. In this chat, we told the AI to always call us 'Captain'. Watch what happens when we feed it a massive 3,500 token report."
    const timeline = gsap.timeline({ paused: true });
    
    // Auto-scroll the chat down slowly to simulate a long document/conversation
    if (chatRef.current) {
        const proxy = { y: 0 };
        timeline.to(
            proxy,
            { 
              y: 5000, 
              duration: 4, 
              ease: "power1.inOut",
              onUpdate: () => {
                if (chatRef.current) chatRef.current.scrollTop = proxy.y;
              }
            },
            13.0 // Wait until narration reaches "Watch what happens..."
        );
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
      nextLabel: diagnosed ? "Continue" : "Diagnose Issue",
      nextDisabled: false,
      onNext: (defaultNext) => {
        if (!diagnosed) {
          setDiagnosed(true);
        } else {
          defaultNext();
        }
      }
    });
    return () => setNavOverride(null);
  }, [diagnosed, setNavOverride]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-5xl mx-auto">
      <div className="shrink-0 mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">The &quot;Forgot My Name&quot; Simulator</h2>
        <p className="text-muted-foreground">Scroll through the chat to see the Goldfish Problem in action.</p>
      </div>

      <div className="flex-1 min-h-0 relative flex items-center justify-center">
        {/* Chat UI Mockup */}
        <div ref={containerRef} className="w-full max-w-2xl h-full max-h-[500px] bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <div className="h-14 border-b border-white/10 flex items-center px-4 bg-background/50 shrink-0 z-20">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/30">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">AI Assistant</div>
              <div className="text-xs text-primary">Context limit: 4,000 tokens</div>
            </div>
          </div>

          {/* Chat Scroll Area */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
            {/* System Prompt / Top Rule */}
            <div className="flex flex-col gap-1 opacity-90 transition-opacity duration-1000" style={{ opacity: diagnosed ? 0.2 : 1 }}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-12">System Instructions</span>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-secondary/20 border border-secondary/30 mt-1">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div className="bg-secondary/10 border border-secondary/20 rounded-2xl rounded-tl-sm p-3 text-sm text-foreground/90 leading-relaxed shadow-sm">
                  <strong>CRITICAL RULE:</strong> You must always address me as &quot;Captain&quot;. Never use any other title.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-background/60 border border-white/5 rounded-2xl rounded-tl-sm p-3 text-sm text-foreground/90 leading-relaxed shadow-sm">
                Understood, Captain. I am ready for your instructions.
              </div>
            </div>

            {/* Filler content to push the top out of context */}
            <div className="py-8 flex items-center gap-4">
              <div className="h-px bg-white/5 flex-1" />
              <div className="text-xs text-muted-foreground/50 font-mono">... 3,500 tokens of conversation ...</div>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            {/* Bottom interaction where it forgets */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-secondary/20 border border-secondary/30 mt-1">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div className="bg-secondary/10 border border-secondary/20 rounded-2xl rounded-tl-sm p-3 text-sm text-foreground/90 leading-relaxed shadow-sm">
                  Thanks for analyzing that massive report. Based on the findings, what should my next move be?
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 relative pb-10">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-background/60 border border-white/5 rounded-2xl rounded-tl-sm p-3 text-sm text-foreground/90 leading-relaxed shadow-sm">
                Based on the report, I recommend focusing on Q3 logistics. Let me know if you need a detailed breakdown, <span className="text-destructive font-bold underline decoration-destructive/50 underline-offset-4">friend</span>.
              </div>
              
              <AnimatePresence>
                {diagnosed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 bg-destructive/10 border border-destructive/30 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-2xl z-30"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <div className="text-sm font-bold text-destructive">Constraint Forgotten</div>
                      <div className="text-xs text-foreground/80">The rule at the top fell out of the context window.</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Diagnosis overlay */}
          <AnimatePresence>
            {diagnosed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none z-10"
              >
                {/* Darken the top area to show it's "forgotten" */}
                <div className="absolute top-14 left-0 right-0 h-48 bg-gradient-to-b from-background/90 to-transparent" />
                
                {/* Context window frame */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 280 }}
                  transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-primary/50 bg-primary/5"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    Active Context Window
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
