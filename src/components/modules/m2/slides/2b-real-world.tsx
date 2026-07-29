import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { Code, LineChart, PenTool } from "lucide-react";

export function RealWorldConsequencesSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Narration: "This isn't just an annoyance; it's a critical failure point in production. If you're coding, the AI might revert to older framework versions. In data analysis, it might forget your specific exclusion rules. And in content creation, your carefully crafted brand voice is replaced by generic AI speak. Understanding this limitation is the first step to becoming an AI engineer."
    
    const timeline = gsap.timeline({ paused: true });
    
    if (card1Ref.current && card2Ref.current && card3Ref.current) {
      // Audio "If you're coding..." (~4.5s)
      timeline.fromTo(card1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 4.5);
      
      // Audio "In data analysis..." (~8.5s)
      timeline.fromTo(card2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 8.5);
      
      // Audio "And in content creation..." (~12s)
      timeline.fromTo(card3Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" }, 12.0);
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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-5xl mx-auto">
      <div className="shrink-0 mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Real-World Consequences</h2>
        <p className="text-muted-foreground">When the context window overflows, critical instructions are lost.</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-wrap lg:flex-nowrap items-center justify-center gap-6 w-full px-4">
        
        {/* Card 1: Software Engineering */}
        <div ref={card1Ref} className="opacity-0 w-full md:w-[30%] min-w-[250px] bg-card border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
            <Code className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Software Engineering</h3>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="mb-2"><strong>The Setup:</strong> &quot;Use strictly Next.js App Router.&quot;</p>
            <p className="text-primary/90"><strong>The Failure:</strong> After 30 prompts of debugging, the AI forgets the framework and outputs deprecated Pages Router code.</p>
          </div>
        </div>

        {/* Card 2: Data Analysis */}
        <div ref={card2Ref} className="opacity-0 w-full md:w-[30%] min-w-[250px] bg-card border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
            <LineChart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Data Analysis</h3>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="mb-2"><strong>The Setup:</strong> &quot;Exclude any Q1 anomalous data points.&quot;</p>
            <p className="text-primary/90"><strong>The Failure:</strong> After generating 5 different charts, it includes the outliers, skewing your final presentation.</p>
          </div>
        </div>

        {/* Card 3: Content Creation */}
        <div ref={card3Ref} className="opacity-0 w-full md:w-[30%] min-w-[250px] bg-card border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:bg-primary/20 transition-colors" />
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2">
            <PenTool className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Content Creation</h3>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="mb-2"><strong>The Setup:</strong> &quot;Write in a punchy, Gen-Z friendly brand voice.&quot;</p>
            <p className="text-primary/90"><strong>The Failure:</strong> Halfway through drafting a campaign, it reverts to generic, corporate &quot;Dear Valued Customer&quot; speak.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
