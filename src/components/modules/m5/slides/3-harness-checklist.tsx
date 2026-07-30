import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { CheckCircle2, Circle, Settings2 } from "lucide-react";
import { useLRS } from "@/hooks/use-lrs";

export function HarnessChecklistSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const { track } = useLRS();
  
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.fromTo(".checklist-item", 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" }
    );

    const timeline = gsap.timeline({ paused: true });
    // Audio is ~6 seconds
    timeline.to(".checklist-container", { scale: 1, duration: 0.1 }, 0.0);
    
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
    const allChecked = checkedItems.length === data.harnessChecklist.length;
    
    setNavOverride({
      nextDisabled: !allChecked,
      onNext: (handleNext) => {
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [checkedItems, data.harnessChecklist.length, setNavOverride, onComplete]);

  const toggleCheck = (index: number) => {
    setCheckedItems(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-4xl mx-auto overflow-hidden">
      
      <div className="text-center mb-3 md:mb-5 w-full shrink-0">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Harness Validation</h2>
        <p className="text-xs md:text-sm text-white/60 font-light">
          Verify the architectural prerequisites for your <span className="font-semibold text-primary">{data.title}</span>.
        </p>
      </div>

      <div className="checklist-container flex-1 w-full max-w-2xl flex flex-col gap-3 md:gap-4 min-h-0 justify-center shrink-0 pb-2">
        {data.harnessChecklist.map((item, index) => {
          const isChecked = checkedItems.includes(index);
          return (
            <button
              key={index}
              onClick={() => {
                toggleCheck(index);
                track(
                  "http://adlnet.gov/expapi/verbs/interacted",
                  "interacted",
                  `http://smartslate.com/activities/m5/slides/3/checklist/${index}`,
                  `Harness Checklist Item ${index}`
                );
              }}
              className={`checklist-item text-left w-full p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 flex items-center gap-3 md:gap-4 group shrink-0 ${
                isChecked 
                  ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(167,218,219,0.15)]" 
                  : "bg-black/40 border-white/10 hover:bg-white/5"
              }`}
            >
              <div className={`shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-colors ${
                isChecked ? "text-primary" : "text-white/20 group-hover:text-white/40"
              }`}>
                {isChecked ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Circle className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <span className={`text-xs md:text-sm transition-colors ${isChecked ? "text-white font-medium" : "text-white/70"}`}>
                {item}
              </span>
            </button>
          );
        })}
        
        <div className="mt-2 md:mt-4 p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2 md:gap-3 shrink-0">
          <Settings2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] md:text-xs text-primary/80 leading-relaxed text-left">
            <span className="font-semibold text-primary block mb-0.5 md:mb-1">These are foundational examples.</span>
            The items above are basic starting points. You must research and define the specific production-grade requirements for your project. We highly encourage you to brainstorm directly with your agent and harness to discover, install, and configure the complete architecture needed for your unique use case.
          </p>
        </div>
      </div>
      
    </div>
  );
}
