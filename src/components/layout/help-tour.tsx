"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

const TOUR_STEPS = [
  {
    id: "sidebar",
    targetId: "tour-sidebar",
    title: "Course Navigation",
    content: "The sidebar contains your syllabus. You can see all modules and your overall completion progress here.",
    placement: "right",
  },
  {
    id: "assets",
    targetId: "tour-assets",
    title: "Learning Assets",
    content: "Access your global Glossary and context-aware Notebook here at any time to review concepts and jot down ideas.",
    placement: "top",
  },
  {
    id: "play",
    targetId: "tour-play",
    title: "Audio Narration",
    content: "Click here to play or pause the expert voiceover. Many slides feature synchronized animations that follow the audio!",
    placement: "top",
  },
  {
    id: "nav",
    targetId: "tour-nav",
    title: "Slide Controls",
    content: "Use these to move forward or backward through the module. Some buttons unlock only after you interact with the content.",
    placement: "top",
  },
];

export function HelpTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [coords, setCoords] = useState<{ top?: number; left?: number; bottom?: number; right?: number; placement?: string; tailLeft?: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updateCoords = () => {
      const step = TOUR_STEPS[currentStep];
      const el = document.getElementById(step.targetId);
      
      if (!el) {
        setTargetRect(null);
        setCoords(null);
        return;
      }

      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      
      const padding = 20; 
      const tooltipWidth = 320; 
      const halfWidth = tooltipWidth / 2;

      let newCoords: any = {};

      if (step.placement === "right") {
        let leftPos = rect.right + padding;
        if (leftPos + tooltipWidth > document.documentElement.clientWidth) {
            // fallback to left side if no space on right
            leftPos = rect.left - tooltipWidth - padding;
        }
        
        newCoords = {
          top: rect.top + rect.height / 2, 
          left: leftPos,
          placement: "right"
        };
      } else if (step.placement === "top") {
        let idealCenter = rect.left + rect.width / 2;
        let idealLeft = idealCenter - halfWidth;
        let clampedLeft = Math.max(padding, Math.min(document.documentElement.clientWidth - tooltipWidth - padding, idealLeft));
        
        newCoords = {
          bottom: window.innerHeight - rect.top + padding,
          left: clampedLeft,
          tailLeft: idealCenter - clampedLeft,
          placement: "top"
        };
      }
      
      setCoords(newCoords);
    };

    // Need slight delay for DOM settling on resize
    updateCoords();
    const handleResize = () => requestAnimationFrame(updateCoords);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, currentStep]);

  if (!mounted) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = TOUR_STEPS[currentStep];
  const t = targetRect;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          {/* 4-Panel Dynamic Un-blurred Hole Masking */}
          {t ? (
            <>
              {/* Top Panel */}
              <motion.div
                initial={false}
                animate={{ top: 0, left: 0, right: 0, height: t.top }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bg-background/80 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
              />
              {/* Bottom Panel */}
              <motion.div
                initial={false}
                animate={{ top: t.bottom, left: 0, right: 0, bottom: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bg-background/80 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
              />
              {/* Left Panel */}
              <motion.div
                initial={false}
                animate={{ top: t.top, left: 0, width: t.left, height: t.height }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bg-background/80 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
              />
              {/* Right Panel */}
              <motion.div
                initial={false}
                animate={{ top: t.top, left: t.right, right: 0, height: t.height }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bg-background/80 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
              />
            </>
          ) : (
            /* Fallback generic backdrop if target not found */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md pointer-events-auto"
              onClick={onClose}
            />
          )}

          {/* Close Button */}
          <div className="absolute top-6 right-6 pointer-events-auto z-50">
            <button
              onClick={onClose}
              className="p-3 bg-card/50 backdrop-blur-xl border border-primary/20 rounded-full hover:bg-primary/10 hover:text-primary transition-all shadow-2xl active:scale-95 text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Highlight Target Box Inner Border */}
          {t && (
            <motion.div
              layoutId="highlight-box"
              initial={false}
              animate={{
                top: t.top,
                left: t.left,
                width: t.width,
                height: t.height,
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute pointer-events-none rounded-xl z-10 border-2 border-primary"
              style={{
                boxShadow: "0 0 20px var(--color-primary) inset, 0 0 20px var(--color-primary)",
              }}
            />
          )}

          {/* Tooltip Card */}
          {coords && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: coords.placement === 'top' ? 20 : "-50%", x: coords.placement === 'right' ? -20 : 0 }}
              animate={{ opacity: 1, scale: 1, y: coords.placement === 'right' ? "-50%" : 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
              className="absolute w-80 pointer-events-auto z-20"
              style={{
                top: coords.top !== undefined ? coords.top : "auto",
                bottom: coords.bottom !== undefined ? coords.bottom : "auto",
                left: coords.left !== undefined ? coords.left : "auto",
              }}
            >
              {/* Tooltip Tail */}
              <div
                className={`absolute w-4 h-4 bg-card border-border rotate-45 pointer-events-none z-[-1]
                  ${currentStepData.placement === 'right' ? 'border-b border-l -left-2 top-1/2 -translate-y-1/2' : ''}
                  ${currentStepData.placement === 'top' ? 'border-b border-r -bottom-2' : ''}
                `}
                style={{
                  ...(currentStepData.placement === 'top' && coords.tailLeft 
                    ? { left: coords.tailLeft, marginLeft: '-8px' } 
                    : {})
                }}
              />

              <div className="bg-card border border-primary/20 shadow-2xl rounded-2xl overflow-hidden relative">
                {/* Header line accent (all-teal brand) */}
                <div className="h-1 w-full bg-primary" />
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground text-sm tracking-wider flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px]">
                        {currentStep + 1}
                      </span>
                      {currentStepData.title}
                    </h3>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      {currentStep + 1} / {TOUR_STEPS.length}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {currentStepData.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2 py-1.5 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Back
                    </button>

                    <button
                      onClick={handleNext}
                      className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 transition-colors flex items-center gap-1 active:scale-95 shadow-md"
                    >
                      {currentStep === TOUR_STEPS.length - 1 ? (
                        <>Got it <Check className="w-3 h-3 ml-1" /></>
                      ) : (
                        <>Next <ChevronRight className="w-3 h-3 ml-1" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
