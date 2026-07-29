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
  const [coords, setCoords] = useState<{ top?: number; left?: number; bottom?: number; right?: number } | null>(null);

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
        setCoords(null);
        return;
      }

      const rect = el.getBoundingClientRect();
      const padding = 16; // distance from element to tooltip

      let newCoords: any = {};

      if (step.placement === "right") {
        newCoords = {
          top: rect.top + rect.height / 2, // Will translate -Y 50%
          left: rect.right + padding,
        };
      } else if (step.placement === "top") {
        newCoords = {
          bottom: window.innerHeight - rect.top + padding,
          left: rect.left + rect.width / 2, // Will translate -X 50%
        };
      }
      
      setCoords(newCoords);
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);
    return () => window.removeEventListener("resize", updateCoords);
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />

          <div className="absolute top-6 right-6 pointer-events-auto">
            <button
              onClick={onClose}
              className="p-3 bg-card/50 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Highlight Target Box */}
          {coords && (
            <motion.div
              layoutId="highlight-box"
              initial={false}
              animate={{
                top: document.getElementById(currentStepData.targetId)?.getBoundingClientRect().top ?? 0,
                left: document.getElementById(currentStepData.targetId)?.getBoundingClientRect().left ?? 0,
                width: document.getElementById(currentStepData.targetId)?.getBoundingClientRect().width ?? 0,
                height: document.getElementById(currentStepData.targetId)?.getBoundingClientRect().height ?? 0,
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute pointer-events-none border-2 border-primary rounded-xl shadow-[0_0_30px_rgba(var(--primary),0.3)] z-10"
              style={{
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.4), 0 0 20px rgba(var(--primary),0.5)",
              }}
            />
          )}

          {/* Tooltip Card */}
          {coords && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: currentStepData.placement === 'top' ? 20 : 0, x: currentStepData.placement === 'right' ? -20 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
              className="absolute w-80 pointer-events-auto z-20"
              style={{
                top: coords.top !== undefined ? coords.top : "auto",
                bottom: coords.bottom !== undefined ? coords.bottom : "auto",
                left: coords.left !== undefined ? coords.left : "auto",
                transform: currentStepData.placement === "right"
                  ? "translateY(-50%)"
                  : "translateX(-50%)",
              }}
            >
              {/* Tooltip Tail */}
              <div
                className={`absolute w-4 h-4 bg-card border-border rotate-45 pointer-events-none
                  ${currentStepData.placement === 'right' ? 'border-b border-l -left-2 top-1/2 -translate-y-1/2' : ''}
                  ${currentStepData.placement === 'top' ? 'border-b border-r -bottom-2 left-1/2 -translate-x-1/2' : ''}
                `}
              />

              <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative">
                {/* Header line accent */}
                <div className="h-1 w-full bg-gradient-to-r from-primary to-indigo-500" />
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px]">
                        {currentStep + 1}
                      </span>
                      {currentStepData.title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">
                      {currentStep + 1} of {TOUR_STEPS.length}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
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
                      className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 py-1.5 transition-colors flex items-center gap-1 active:scale-95 shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    >
                      {currentStep === TOUR_STEPS.length - 1 ? (
                        <>Got it <Check className="w-3 h-3" /></>
                      ) : (
                        <>Next <ChevronRight className="w-3 h-3" /></>
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
