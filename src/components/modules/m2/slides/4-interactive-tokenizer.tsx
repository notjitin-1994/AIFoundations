import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Lightbulb, Activity } from "lucide-react";
import { useLRS } from "@/hooks/use-lrs";

// Educational approximation of a tokenizer (BPE)
function mockTokenize(text: string): string[] {
  if (!text) return [];
  const chunks = text.match(/([a-zA-Z]+|\s+|[^\s\w]+)/g) || [];
  const tokens: string[] = [];
  
  chunks.forEach(chunk => {
    // Break up long words to simulate subword tokenization (e.g., "hamburger" -> "ham", "burger")
    if (chunk.match(/^[a-zA-Z]+$/) && chunk.length > 5) {
      const mid = Math.floor(chunk.length / 2);
      tokens.push(chunk.slice(0, mid));
      tokens.push(chunk.slice(mid));
    } else {
      tokens.push(chunk);
    }
  });
  
  return tokens;
}

const COLORS = [
  "bg-primary/20 text-primary border-primary/40 shadow-[0_0_15px_rgba(167,218,219,0.2)]",
  "bg-primary/10 text-primary/90 border-primary/20 shadow-[0_0_15px_rgba(167,218,219,0.1)]",
  "bg-primary/30 text-primary border-primary/50 shadow-[0_0_15px_rgba(167,218,219,0.3)]",
  "bg-primary/5 text-primary/80 border-primary/10 shadow-none",
  "bg-primary/25 text-primary border-primary/30 shadow-[0_0_15px_rgba(167,218,219,0.25)]"
];


export function InteractiveTokenizerSlide({ onComplete }: { onComplete?: () => void }) {
  const [text, setText] = useState("Artificial intelligence is fascinating!");
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const [interacted, setInteracted] = useState(false);

  const tokens = mockTokenize(text);

  useEffect(() => {
    setNavOverride({
      nextLabel: "",
      nextDisabled: !interacted && text === "Artificial intelligence is fascinating!",
      onNext: (defaultNext) => {
        if (onComplete) onComplete();
        defaultNext();
      }
    });
    return () => setNavOverride(null);
  }, [setNavOverride, onComplete, interacted, text]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="shrink-0 mb-6 lg:mb-8 z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3 drop-shadow-sm">Interactive Tokenizer</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Type a sentence below. Notice how a token isn&apos;t always a full word—sometimes it&apos;s a syllable, punctuation, or even just a space.
        </p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 pb-2 lg:pb-6 overflow-y-auto lg:overflow-hidden z-10">
        {/* Left: Input */}
        <div className="flex flex-col gap-4 lg:gap-6 min-h-0 h-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary/80">Human Text (Words)</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setInteracted(true);
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m2/slides/4/interactive-tokenizer/input", "Interactive Tokenizer Input");
            }}
            className="flex-1 w-full min-h-[150px] rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-3xl p-6 lg:p-8 text-xl md:text-2xl text-foreground leading-relaxed resize-none transition-all duration-300 focus-visible:border-primary/50 focus-visible:bg-card/60 focus-visible:ring-primary/20 focus-visible:ring-4 outline-none shadow-2xl"
            placeholder="Type something here..."
          />
          <div className="bg-primary/5 border border-primary/20 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              <strong className="text-primary tracking-wide uppercase text-xs mr-2">Rule of thumb:</strong> 
              In English, 1 token is roughly 4 characters, or about 0.75 of a word.
            </p>
          </div>
        </div>

        {/* Right: Tokens Output */}
        <div className="flex flex-col gap-4 lg:gap-6 min-h-0 h-full">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-primary">AI View (Tokens)</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-black bg-primary/20 text-primary px-4 py-1.5 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(167,218,219,0.2)]">
                {tokens.length} Tokens
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative">
            <div className="flex flex-wrap gap-3 content-start relative z-10">
              <AnimatePresence mode="popLayout">
                {tokens.map((token, i) => {
                  const isSpace = /^\s+$/.test(token);
                  const colorClass = COLORS[i % COLORS.length];
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      key={`${i}-${token}`}
                      className={`px-3 py-2 rounded-xl border text-lg font-mono font-medium flex items-center justify-center min-w-[36px] transition-transform hover:scale-110 ${
                        isSpace ? "bg-white/5 border-white/10 text-transparent shadow-none" : colorClass
                      }`}
                    >
                      {isSpace ? "␣" : token}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {tokens.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic font-medium">
                Start typing to see tokens...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
