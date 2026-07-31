"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Play, Pause, Volume2, VolumeX, Library, HelpCircle, ShieldAlert } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { useNarrationStore } from "@/store/narration";
import { sendXAPIStatement } from "@/actions/xapi";
import { createContext, useContext } from "react";
import { COURSE_MODULES } from "@/lib/course-data";
import { M5_TEMPLATE_DATA } from "@/lib/m5-template-data";
import { syncModuleProgress, wipeDatabaseProgress } from "@/actions/sync-progress";
import { useNotesStore } from "@/store/notes";
import { AssetsModal } from "@/components/layout/assets-modal";
import { HelpTour } from "@/components/layout/help-tour";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface CanvasNavOverride {
  disablePrev?: boolean;
  nextLabel?: string;
  nextIcon?: React.ReactNode;
  onNext?: (handleNext: () => void) => void;
  onPrev?: (handlePrev: () => void) => void;
  nextDisabled?: boolean;
}

interface CanvasNavContextType {
  setNavOverride: (override: CanvasNavOverride | null) => void;
  goToSlide: (index: number) => void;
}

export const CanvasNavContext = createContext<CanvasNavContextType | null>(null);

export function useCanvasNav() {
  const ctx = useContext(CanvasNavContext);
  if (!ctx) throw new Error("useCanvasNav must be used within CanvasViewer");
  return ctx;
}

export interface Slide {
  id: string;
  type: "content" | "interactive";
  content?: string;
  component?: React.ReactNode | ((markCompleted: () => void, isCompleted: boolean) => React.ReactNode);
  lessonIndex?: number;
  requireCompletion?: boolean;
  fullWidth?: boolean;
  narrationText?: string;
  hasCustomAudio?: boolean;
}

interface CanvasViewerProps {
  slides: Slide[];
  onComplete?: () => void;
  moduleId?: string;
}

function ModuleCoverCard({ moduleId }: { moduleId: string }) {
  const moduleData = COURSE_MODULES.find(m => m.id === moduleId);
  const { projectSpine } = useProgressStore();
  if (!moduleData) return null;

  const modNum = parseInt(moduleData.id, 10) || 0;
  const isEven = modNum % 2 === 0;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-white overflow-hidden relative bg-zinc-950">
      {/* Background Video or Image */}
      {moduleData.videoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
          src={moduleData.videoUrl}
        />
      ) : moduleData.imageUrl ? (
        <img
          src={moduleData.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
      ) : null}
      
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
      
      {/* Glassmorphism Content Box */}
      <div className="relative z-10 w-[92%] md:w-[75%] p-8 md:p-10 mt-4 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col text-left transform transition-all hover:bg-zinc-900/50 mr-auto ml-4 md:ml-12 lg:ml-20">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest shadow-[0_0_10px_#a7dadb30]">
            Module {moduleData.id}
          </div>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary drop-shadow-sm">
          {moduleData.title.replace(/^\d+\.\s*/, '')}
        </h1>
        
        <p className="text-lg text-zinc-300 max-w-3xl mb-8 leading-relaxed font-light">
          {moduleData.overview}
        </p>
        
        <div className="w-full text-left bg-black/40 rounded-xl p-6 border border-white/5 backdrop-blur-sm shadow-inner">
          <h3 className="text-xs font-semibold text-primary/80 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Curriculum Path
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {moduleData.lessons.map((lesson, idx) => {
              let displayLesson = lesson;
              if (moduleId === "5" && projectSpine && displayLesson.includes("[Selected Project]")) {
                const spineData = M5_TEMPLATE_DATA.find(t => t.id === projectSpine);
                if (spineData) displayLesson = displayLesson.replace("[Selected Project]", spineData.title);
              }
              
              return (
                <li key={idx} className="flex items-center text-zinc-300 text-sm">
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-3 shrink-0" />
                  <span className="truncate">{displayLesson.replace(/^\d+\.\d+\s*/, '')}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CanvasViewer({ slides, onComplete, moduleId = "unknown" }: CanvasViewerProps) {
  const searchParams = useSearchParams();
  const lessonParam = searchParams ? searchParams.get("lesson") : null;

  const initialIndex = useMemo(() => {
    if (lessonParam !== null) {
      const targetLessonIndex = parseInt(lessonParam, 10);
      if (!isNaN(targetLessonIndex)) {
        const index = slides.findIndex(s => s.lessonIndex === targetLessonIndex);
        if (index !== -1) return index;
      }
    }
    return 0;
  }, [lessonParam, slides]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [replayCount, setReplayCount] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completedSlides, setCompletedSlides] = useState<Record<number, boolean>>({});
  const [navOverride, setNavOverride] = useState<CanvasNavOverride | null>(null);
  
  // Use state for interaction so we can trigger the "Begin Course" UI update
  const [hasInteracted, setHasInteracted] = useState(initialIndex > 0);
  
  const reduce = useReducedMotion();
  const router = useRouter();
  const { setActiveLessonIndex, setActiveSlideProgress, markLessonComplete, completedModules, completedLessons, resetProgress } = useProgressStore();
  const narration = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const scheduledSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeTrackerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRestart = async () => {
    await wipeDatabaseProgress();
    useNotesStore.getState().clearAllNotes();
    resetProgress();
    router.push("/modules/0");
    router.refresh();
  };

  const markCompleted = useCallback(() => {
    setCompletedSlides((prev) => {
      if (prev[currentIndex]) return prev;
      return { ...prev, [currentIndex]: true };
    });
  }, [currentIndex]);

  const [lastSeenLessonParam, setLastSeenLessonParam] = useState(lessonParam);

  // Reset entirely if the module changes (e.g. from Module 1 to Module 2)
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setHasInteracted(initialIndex > 0);
    setLastSeenLessonParam(lessonParam);
    setCompletedSlides({});
  }, [moduleId]);

  // Only jump to a new lesson index if the URL param actually changed via Next.js router
  useEffect(() => {
    if (lessonParam !== lastSeenLessonParam) {
      setLastSeenLessonParam(lessonParam);
      const targetLessonIndex = lessonParam !== null ? parseInt(lessonParam, 10) : null;
      if (targetLessonIndex !== null && !isNaN(targetLessonIndex)) {
        const index = slides.findIndex(s => s.lessonIndex === targetLessonIndex);
        if (index !== -1) {
          setCurrentIndex(index);
          setHasInteracted(true);
        }
      }
    }
  }, [lessonParam, lastSeenLessonParam, slides]);

  useEffect(() => {
    const slide = slides[currentIndex];
    if (slide && slide.lessonIndex !== undefined) {
      setActiveLessonIndex(slide.lessonIndex);
      // Sync URL silently
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("lesson", slide.lessonIndex.toString());
        window.history.replaceState({}, "", url.toString());
      }
    }

    // Broadcast granular slide progress
    setActiveSlideProgress(currentIndex, slides.length, moduleId);

    // Removed manual debounce sync, useSyncEngine handles this now

    // Cleanup previous audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }

    if (slide?.narrationText && !slide.hasCustomAudio) {
      const basePath = "/courses/aifoundations-concept2application";
      const audio = new Audio(`${basePath}/audio/${slide.id}.mp3`);
      audioRef.current = audio;
      audio.muted = narration.isMuted; // inherit current mute state across slide changes
      
      audio.onended = () => {
        narration.finish();
      };

      if (!hasInteracted) {
        // Strict lockout for the first load
        narration.pause();
      } else {
        // Subsequent loads (user has interacted)
        // We initialize with 0 duration, it will be updated on loadedmetadata
        narration.play(slide.id, 0); 
        audio.play().catch(e => {
          console.warn("Autoplay prevented on subsequent slide:", e);
        });
      }
      
      audio.onloadedmetadata = () => {
        useNarrationStore.setState({ durationMs: audio.duration * 1000 });
      };

      audio.ontimeupdate = () => {
        if (audio.duration > 0) {
          narration.setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
    } else if (slide?.hasCustomAudio) {
      if (!hasInteracted) {
        narration.pause();
      }
    } else {
      narration.finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, slides, setActiveLessonIndex]);

  useEffect(() => {
    const slide = slides[currentIndex];
    if (!slide) return;

    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/experienced",
      "experienced",
      `http://smartslate.com/activities/${moduleId}/slides/${slide.id}`,
      `Slide ${currentIndex + 1}: ${slide.id}`,
      undefined,
      { moduleId, slideId: slide.id, lessonIndex: currentIndex }
    ).catch(() => {}); // fire and forget, never block UI
  }, [currentIndex, moduleId, slides]);

  // Handle play/pause state from the global store
  useEffect(() => {
    // Sync mute state to audio element whenever it changes
    if (audioRef.current) {
      audioRef.current.muted = narration.isMuted;
    }
  }, [narration.isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (narration.isPlaying && audioRef.current.paused) {
        // Only attempt to play via effect if we have interacted
        if (!hasInteracted) return;
        audioRef.current.play().catch(e => console.warn("Playback error:", e));
      } else if (!narration.isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [narration.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    // Start time tracker (adds 60 seconds of XP/Time every minute)
    timeTrackerRef.current = setInterval(() => {
      // Only track if document is visible
      if (document.visibilityState === 'visible') {
        useProgressStore.getState().updateTimeSpent(60);
      }
    }, 60000);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (scheduledSyncRef.current) {
        clearTimeout(scheduledSyncRef.current);
      }
      if (timeTrackerRef.current) {
        clearInterval(timeTrackerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const currentLesson = slides[currentIndex]?.lessonIndex;
      const nextLesson = slides[currentIndex + 1]?.lessonIndex;
      
      if (currentLesson !== undefined && nextLesson !== undefined && currentLesson !== nextLesson) {
        if (moduleId !== "unknown") {
          markLessonComplete(moduleId, currentLesson);
        }
      }
      
      setDirection(1);
      setReplayCount(0);
      setCurrentIndex((prev) => prev + 1);
    } else if (onComplete) {
      const currentLesson = slides[currentIndex]?.lessonIndex;
      if (currentLesson !== undefined && moduleId !== "unknown") {
        markLessonComplete(moduleId, currentLesson);
      }
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setReplayCount(0);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / slides.length) * 100);

  const slideVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * 24,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduce ? 0 : dir * -24,
    }),
  };
  // Keyboard navigation & Window Freeze

  const currentLessonIndex = slides[currentIndex]?.lessonIndex;
  const isModuleCompleted = moduleId !== "unknown" && completedModules.includes(moduleId);
  const isLessonCompleted = moduleId !== "unknown" && currentLessonIndex !== undefined && (completedLessons[moduleId] || []).includes(currentLessonIndex);
  const isAlreadyCompleted = isModuleCompleted || isLessonCompleted;

  const isAssessment = slides[currentIndex]?.id.toLowerCase().includes("assessment") || slides[currentIndex]?.id.toLowerCase().includes("quiz");

  const rawNextLabel = navOverride?.nextLabel || (currentIndex === slides.length - 1 ? "Complete Module" : "");
  const displayNextLabel = rawNextLabel.toLowerCase() === "continue" ? "" : rawNextLabel;

  const isNavDisabled = slides[currentIndex]?.requireCompletion && !completedSlides[currentIndex] && !isAlreadyCompleted;
  
  let nextDisabled = navOverride?.nextDisabled !== undefined ? navOverride.nextDisabled : isNavDisabled;

  // Force unlock the Next button if the learner has already completed this part of the module.
  // Assessment slides are handled separately via a "Skip" button.
  if (isAlreadyCompleted && !isAssessment) {
    nextDisabled = false;
  }

  const finalHandleNext = () => {
    if (!hasInteracted) setHasInteracted(true);
    
    // If the slide is locking us, but we bypassed it via isAlreadyCompleted, just force handleNext()
    // without calling the slide's onNext, which might expect valid internal state that hasn't been set.
    if (navOverride?.onNext && !nextDisabled && !navOverride?.nextDisabled) {
      navOverride.onNext(handleNext);
    } else if (navOverride?.onNext && navOverride?.nextDisabled && isAlreadyCompleted) {
      handleNext();
    } else if (navOverride?.onNext) {
      navOverride.onNext(handleNext);
    } else {
      handleNext();
    }
  };

  const prevDisabled = navOverride?.disablePrev !== undefined ? navOverride.disablePrev : currentIndex === 0;
  const NextIcon = navOverride?.nextIcon || (currentIndex === slides.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />);

  const finalHandlePrev = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (navOverride?.disablePrev) return;
    if (navOverride?.onPrev) {
      navOverride.onPrev(handlePrev);
    } else {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !nextDisabled) finalHandleNext();
      if (e.key === 'ArrowLeft' && !prevDisabled) finalHandlePrev();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
        narration.pause();
      } else {
        setIsBlurred(false);
      }
    };

    const handleBlur = () => {
      setIsBlurred(true);
      narration.pause();
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [nextDisabled, prevDisabled, currentIndex, narration]);

  return (
    <>
      <CanvasNavContext.Provider value={{ setNavOverride, goToSlide: setCurrentIndex }}>
      {isBlurred && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <ShieldAlert className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-2">Course Paused</h2>
          <p className="text-zinc-300">Please return to the window to continue learning.</p>
        </div>
      )}
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center relative">
        {/* Canvas Container */}
        <div className="relative w-full aspect-[16/10] max-h-[90vh] bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col">
          {/* Content Area */}
          <div className={`flex-1 relative overflow-hidden flex flex-col ${slides[currentIndex].fullWidth ? 'p-1 mt-1.5' : 'px-2 md:px-3 py-4 md:py-8'}`}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentIndex}-${replayCount}`}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1], // Emil's recommended ease-out curve
                }}
                className={`w-full max-h-full h-full mx-auto flex flex-col justify-center relative ${
                  slides[currentIndex].fullWidth ? "max-w-full" : slides[currentIndex].type === "content" ? "max-w-3xl" : "max-w-5xl"
                }`}
              >
                <div className="w-full h-full opacity-100 transition-all duration-700">
                  {slides[currentIndex].type === "content" ? (
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-primary prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground pb-4">
                      <ReactMarkdown>{slides[currentIndex].content || ""}</ReactMarkdown>
                    </div>
                  ) : (
                    typeof slides[currentIndex].component === "function"
                      ? (slides[currentIndex].component as (markCompleted: () => void, isCompleted: boolean) => React.ReactNode)(
                          markCompleted,
                          !!completedSlides[currentIndex] || isAlreadyCompleted
                        )
                      : slides[currentIndex].component
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* OVERLAY COVER CARD */}
            <AnimatePresence>
              {!hasInteracted && currentIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950"
                >
                  <ModuleCoverCard moduleId={moduleId} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-20 border-t border-border bg-card/50 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center space-x-3 w-full max-w-[200px]">
            {/* Left side actions */}
            <div className="flex items-center space-x-2">
              {/* Restart */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button 
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 hover:bg-primary/10 text-zinc-500 hover:text-primary dark:bg-zinc-800 dark:hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary transition-all active:scale-95"
                    title="Restart Course"
                  >
                    <RotateCcw className="w-[15px] h-[15px]" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-primary/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Restart full course?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This will reset all your progress and knowledge check scores. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white border-0">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Restart Course
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Help */}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 hover:bg-primary/10 text-zinc-500 hover:text-primary dark:bg-zinc-800 dark:hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary transition-all active:scale-95"
                title="Guided Tour"
              >
                <HelpCircle className="w-[15px] h-[15px]" />
              </button>

              {/* Assets */}
              <button
                id="tour-assets"
                onClick={() => setIsAssetsOpen(true)}
                className="group flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full bg-zinc-100 hover:bg-primary/10 text-zinc-500 hover:text-primary dark:bg-zinc-800 dark:hover:bg-primary/10 dark:text-zinc-400 dark:hover:text-primary transition-all active:scale-95 text-sm font-semibold"
              >
                <Library className="w-[15px] h-[15px] group-hover:-rotate-6 transition-transform duration-200" />
                <span>Assets</span>
              </button>
            </div>
          </div>

          {/* Right side: Mute / Prev / Play / Next */}
          <div id="tour-nav" className="flex items-center space-x-3">
            {/* Mute / Unmute — only shown when the slide has audio */}
            {(slides[currentIndex].narrationText || slides[currentIndex].hasCustomAudio) && (
              <button
                onClick={() => narration.toggleMute()}
                aria-label={narration.isMuted ? "Unmute narration" : "Mute narration"}
                title={narration.isMuted ? "Unmute" : "Mute"}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 transition-all active:scale-95"
              >
                {narration.isMuted
                  ? <VolumeX className="w-4 h-4" />
                  : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={finalHandlePrev}
              disabled={prevDisabled}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {(slides[currentIndex].narrationText || slides[currentIndex].hasCustomAudio) && (
              <button
                id="tour-play"
                onClick={() => {
                  if (!hasInteracted) setHasInteracted(true);
                  
                  if (narration.isFinished) {
                    setReplayCount(c => c + 1);
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      audioRef.current.play().catch(e => console.warn("Replay error:", e));
                    }
                    narration.play(slides[currentIndex].id, audioRef.current?.duration ? audioRef.current.duration * 1000 : 0);
                  } else if (narration.isPlaying) {
                    narration.pause();
                    if (audioRef.current) audioRef.current.pause();
                  } else {
                    if (currentIndex === 0 && !hasInteracted) {
                       // First launch
                       narration.play(slides[currentIndex].id, 5000);
                    } else {
                       narration.resume();
                    }
                    if (audioRef.current && !slides[currentIndex].hasCustomAudio) {
                      audioRef.current.play().catch(e => console.warn("Play error:", e));
                    }
                  }
                }}
                className={`flex items-center justify-center h-10 rounded-full transition-all active:scale-95 ${
                  !hasInteracted && currentIndex === 0 
                    ? "px-4 space-x-2 bg-primary text-primary-foreground hover:bg-primary/90" 
                    : narration.isFinished
                      ? "px-4 space-x-2 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 font-semibold"
                      : narration.isPlaying 
                        ? "w-10 bg-primary/10 hover:bg-primary/20 text-primary" 
                        : "w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                aria-label={narration.isFinished ? "Replay Slide" : narration.isPlaying ? "Pause Narration" : "Play Narration"}
              >
                {narration.isFinished ? (
                  <>
                    <RotateCcw className="w-[18px] h-[18px] mr-1.5" strokeWidth={2.5} />
                    <span className="font-semibold text-[15px] pr-1 tracking-wide">Replay</span>
                  </>
                ) : narration.isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {!hasInteracted && currentIndex === 0 && (
                      <span className="font-bold text-sm pr-1">Begin Module</span>
                    )}
                  </>
                )}
              </button>
            )}

              {isAlreadyCompleted && isAssessment && (
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center h-10 px-4 rounded-full bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 hover:text-white transition-all active:scale-95"
                >
                  <span>Skip Knowledge Check</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}

              <button
                onClick={finalHandleNext}
                disabled={nextDisabled}
                className={`flex items-center justify-center h-10 ${
                  displayNextLabel ? "px-5 space-x-2" : "w-10"
                } rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-95`}
              >
                {displayNextLabel && <span>{displayNextLabel}</span>}
                {NextIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
      </CanvasNavContext.Provider>
      <AssetsModal isOpen={isAssetsOpen} onClose={() => setIsAssetsOpen(false)} />
      <HelpTour isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
