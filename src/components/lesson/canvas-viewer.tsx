"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Play, Pause, Volume2 } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { useNarrationStore } from "@/store/narration";
import { createContext, useContext } from "react";

export interface CanvasNavOverride {
  disablePrev?: boolean;
  nextLabel?: string;
  nextIcon?: React.ReactNode;
  onNext?: (handleNext: () => void) => void;
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
  component?: React.ReactNode | ((markCompleted: () => void) => React.ReactNode);
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

export function CanvasViewer({ slides, onComplete, moduleId = "unknown" }: CanvasViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completedSlides, setCompletedSlides] = useState<Record<number, boolean>>({});
  const [navOverride, setNavOverride] = useState<CanvasNavOverride | null>(null);
  
  // Use state for interaction so we can trigger the "Begin Course" UI update
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const reduce = useReducedMotion();
  const { setActiveLessonIndex, setActiveSlideProgress } = useProgressStore();
  const narration = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const markCompleted = useCallback(() => {
    setCompletedSlides((prev) => {
      if (prev[currentIndex]) return prev;
      return { ...prev, [currentIndex]: true };
    });
  }, [currentIndex]);

  useEffect(() => {
    const slide = slides[currentIndex];
    if (slide && slide.lessonIndex !== undefined) {
      setActiveLessonIndex(slide.lessonIndex);
    }

    // Broadcast granular slide progress
    setActiveSlideProgress(currentIndex, slides.length, moduleId);

    // Cleanup previous audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    if (slide?.narrationText && !slide.hasCustomAudio) {
      const audio = new Audio(`/audio/${slide.id}.mp3`);
      audioRef.current = audio;
      
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

  // Handle play/pause state from the global store
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
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

  const finalHandlePrev = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (navOverride?.disablePrev) return;
    handlePrev();
  };

  const finalHandleNext = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (navOverride?.onNext) {
      navOverride.onNext(handleNext);
    } else {
      handleNext();
    }
  };

  const nextLabel = navOverride?.nextLabel || (currentIndex === slides.length - 1 ? "Complete Module" : "Continue");
  // Temporarily disabled for course development speed
  const isNavDisabled = false; // (slides[currentIndex].requireCompletion && !completedSlides[currentIndex]) || !narration.isFinished;
  const nextDisabled = navOverride?.nextDisabled !== undefined 
    ? navOverride.nextDisabled 
    : isNavDisabled;
  const prevDisabled = navOverride?.disablePrev !== undefined ? navOverride.disablePrev : currentIndex === 0;
  const NextIcon = navOverride?.nextIcon || (currentIndex === slides.length - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />);

  return (
    <CanvasNavContext.Provider value={{ setNavOverride, goToSlide: setCurrentIndex }}>
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center relative">
        {/* Canvas Container */}
        <div className="relative w-full aspect-[16/10] max-h-[90vh] bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col">
          {/* Content Area */}
          <div className={`flex-1 relative overflow-hidden flex flex-col ${slides[currentIndex].fullWidth ? 'p-1 mt-1.5' : 'px-2 md:px-3 py-4 md:py-8'}`}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
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
                      ? (slides[currentIndex].component as Function)(markCompleted)
                      : slides[currentIndex].component
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="h-20 border-t border-border bg-card/50 backdrop-blur flex items-center justify-end px-8 z-10 shrink-0">
            {/* Right side: Next/Prev */}
            <div className="flex items-center space-x-3">
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
                    
                    if (narration.isPlaying) {
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
                      : narration.isPlaying 
                        ? "w-10 bg-primary/10 hover:bg-primary/20 text-primary" 
                        : "w-10 bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                  aria-label={narration.isPlaying ? "Pause Narration" : "Play Narration"}
                >
                  {narration.isPlaying ? (
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

              <button
                onClick={finalHandleNext}
                disabled={nextDisabled}
                className={`flex items-center justify-center h-10 ${
                  navOverride?.nextLabel ? "px-5 space-x-2" : "w-10"
                } rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-transform active:scale-95`}
              >
                {navOverride?.nextLabel && <span>{navOverride.nextLabel}</span>}
                {NextIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CanvasNavContext.Provider>
  );
}
