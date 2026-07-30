import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";

export function TitleMetaphorSlide() {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const bowlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial entrance animations (independent of audio)
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }
    if (bowlRef.current) {
      gsap.fromTo(
        bowlRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
      );
    }

    // Audio-synced timeline (positioned in seconds against the narration track)
    // Narration: "What happens when the bowl is too small? Like a goldfish, an AI has limited short-term memory. When a conversation exceeds that window, early information simply falls out of reach."
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(
      p1Ref.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      2.5
    );
    timeline.fromTo(
      p2Ref.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      6.0
    );
    
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
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-12 max-w-6xl mx-auto relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-0">
        <div className="flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary/70 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              Module 2
            </span>
          </div>
          
          <h1 ref={headingRef} className="text-5xl md:text-6xl font-heading font-bold text-foreground leading-tight text-balance">
            The <span className="text-primary">Goldfish</span> Problem
          </h1>
          
          <div className="space-y-4 mt-4">
            <p ref={p1Ref} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Like a goldfish in a small bowl, an AI has <strong className="text-foreground">limited short-term memory</strong>.
            </p>
            <p ref={p2Ref} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              When a conversation exceeds that window, early information simply <strong className="text-primary">falls out of reach</strong>.
            </p>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center min-h-0 z-10 w-full max-w-[500px] aspect-square mx-auto">
          <div ref={bowlRef} className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_80px_rgba(167,218,219,0.15)] bg-black">
            <div className="absolute inset-0 pointer-events-none z-10 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] mix-blend-overlay" />
            <div className="absolute inset-0 z-0">
              <video
                src="https://upload.wikimedia.org/wikipedia/commons/9/92/Goldfish_in_a_bowl_-_Hakone_-_2025_Aug_1.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
            {/* Reflections */}
            <div className="absolute top-[10%] left-[15%] w-16 h-32 bg-white/10 rounded-full rotate-45 blur-md z-20 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
