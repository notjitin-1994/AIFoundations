import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Search, Flame, ShieldCheck, BookOpen, GitBranch, Code2 } from "lucide-react";

export function ImportantMcpsSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const essentialsTitleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const buildYourOwnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "To navigate the rapidly expanding MCP ecosystem, several powerful directories have emerged. Platforms like Smithery.ai, MCP.so, and Glama.ai offer thousands of integrations. For developers, the Official Registry and the Awesome MCP list on GitHub provide high-quality reference implementations."
    const timeline = gsap.timeline({ paused: true });

    if (
      containerRef.current && essentialsTitleRef.current && cardsRef.current &&
      buildYourOwnRef.current
    ) {
      // 1. Title Entrance
      timeline.fromTo(essentialsTitleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
      
      // 2. The 5 Directories
      const cards = cardsRef.current.children;
      timeline.fromTo(cards, 
        { opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }, 
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" }, 
        1.5
      );

      // 3. Build your own challenge
      timeline.fromTo(buildYourOwnRef.current, 
        { opacity: 0, scale: 0.9, filter: "blur(10px)", y: 30 }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 1, ease: "back.out(1.2)" }, 
        9.0
      );
      
      // Pulse the build your own box
      timeline.to(buildYourOwnRef.current, { filter: "drop-shadow(0 0 40px rgba(167,218,219,0.4))", duration: 2, yoyo: true, repeat: -1 }, 10.0);
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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-6xl mx-auto relative group">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,218,219,0.05),transparent_60%)] pointer-events-none" />

      <div ref={containerRef} className="flex-1 w-full flex flex-col items-center justify-center gap-4 relative z-10 px-2 py-2">
        
        {/* Top: The Ecosystem Hubs */}
        <div className="text-center shrink-0 mt-2">
          <h2 ref={essentialsTitleRef} className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight">
            Ecosystem Hubs
          </h2>
        </div>
        
        {/* Directory Cards Grid (Horizontal format to save vertical space) */}
        <div ref={cardsRef} className="flex flex-wrap justify-center gap-3 w-full max-w-5xl shrink-0 mt-2">
            
            {/* Smithery */}
            <a href="https://smithery.ai" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-primary/50 transition-colors">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(167,218,219,0.1)] group-hover:bg-primary/20 transition-colors">
                <img src="/images/favicons/smithery.png" alt="Smithery.ai" className="w-5 h-5 rounded-sm object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-primary transition-colors">Smithery.ai</h3>
                <p className="text-[10px] text-white/60 leading-tight">Largest collection. 1-click installs.</p>
              </div>
            </a>

            {/* MCP.so */}
            <a href="https://mcp.so" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:bg-indigo-500/20 transition-colors">
                <img src="/images/favicons/mcp-so.png" alt="MCP.so" className="w-5 h-5 rounded-sm object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-indigo-400 transition-colors">MCP.so</h3>
                <p className="text-[10px] text-white/60 leading-tight">Central discovery hub & marketplace.</p>
              </div>
            </a>

            {/* Glama.ai */}
            <a href="https://glama.ai" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-blue-500/50 transition-colors">
              <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:bg-blue-500/20 transition-colors">
                <img src="/images/favicons/glama.png" alt="Glama.ai" className="w-5 h-5 rounded-sm object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors">Glama.ai</h3>
                <p className="text-[10px] text-white/60 leading-tight">Curated, manually reviewed catalog.</p>
              </div>
            </a>

            {/* Official Registry */}
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:bg-emerald-500/20 transition-colors">
                <img src="/images/favicons/mcp-official.png" alt="Official Registry" className="w-5 h-5 rounded-sm object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors">Official Registry</h3>
                <p className="text-[10px] text-white/60 leading-tight">Standard reference implementations.</p>
              </div>
            </a>

            {/* Awesome MCP */}
            <a href="https://github.com/punkpeye/awesome-mcp-servers" target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 w-[240px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-orange-500/50 transition-colors">
              <div className="w-10 h-10 shrink-0 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.1)] group-hover:bg-orange-500/20 transition-colors">
                <img src="/images/favicons/github.png" alt="Awesome MCP" className="w-5 h-5 rounded-sm object-contain" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-orange-400 transition-colors">Awesome MCP</h3>
                <p className="text-[10px] text-white/60 leading-tight">Community-driven GitHub lists.</p>
              </div>
            </a>

        </div>

        {/* Bottom: Build Your Own */}
        <div className="flex justify-center w-full mt-4 shrink-0">
           <div ref={buildYourOwnRef} className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-3xl border-2 border-primary/30 rounded-2xl p-4 shadow-xl flex items-center gap-4 max-w-2xl opacity-0">
              <div className="w-12 h-12 bg-black/50 rounded-xl border border-primary/40 flex items-center justify-center shrink-0 shadow-[inset_0_0_15px_rgba(167,218,219,0.2)]">
                 <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-black text-white mb-0.5 uppercase tracking-wider">Build Your Arsenal</h3>
                <p className="text-xs font-medium text-white/70 leading-relaxed">
                  Explore these directories to discover and install MCPs into your preferred AI harness. Equip your tools to handle the exact use cases you care about. Then, when you spot a missing link in your workflow, take the ultimate challenge: build your own custom server.
                </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
