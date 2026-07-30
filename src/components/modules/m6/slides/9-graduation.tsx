import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useProgressStore } from "@/store/progress";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";

export function GraduationSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { projectSpine, markModuleComplete, markLessonComplete } = useProgressStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    timeline.set(".grad-elem", { opacity: 0, y: 30 });
    
    // "Congratulations." (0-2s)
    timeline.to(".grad-title", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
    
    // "Your capstone is complete, your foundations are solid, and your horizon is clear." (2-8s)
    timeline.to(".grad-subtitle", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 2.5);
    
    // "Share your work with the community, keep building, and never stop experimenting. Class dismissed." (8-16s)
    timeline.to(".grad-actions", { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "back.out(1.2)" }, 8);

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


  const router = useRouter();

  useEffect(() => {
    setNavOverride({
      nextLabel: "Apply for Certificate & Finish Course",
      nextDisabled: !isFinished,
      onNext: () => {
        markLessonComplete("6", 3);
        markModuleComplete("6");
        router.push("/certificate");
      }
    });
    return () => setNavOverride(null);
  }, [isFinished, setNavOverride, router, markModuleComplete, markLessonComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-10 max-w-4xl mx-auto overflow-hidden relative">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="grad-elem grad-title flex flex-col items-center mb-6 z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight text-center">
          Congratulations.
        </h1>
      </div>

      <div className="grad-elem grad-subtitle text-center mb-12 z-10">
        <p className="text-xl text-white/70 font-light max-w-lg mx-auto">
          You have mastered the foundations and built your <span className="text-white font-bold">{projectSpine ? projectSpine.replace(/_/g, ' ') : "capstone"}</span>. The horizon is clear.
        </p>
      </div>
    </div>
  );
}
