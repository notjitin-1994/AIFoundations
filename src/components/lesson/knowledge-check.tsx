"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useProgressStore } from "@/store/progress";

export interface KnowledgeCheckQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface KnowledgeCheckProps {
  id?: string;
  title?: string;
  description?: string;
  questions: KnowledgeCheckQuestion[];
  onComplete?: () => void;
  successHeadline?: string;
  successSubline?: string;
  isCompleted?: boolean;
}

const easeOutQuart: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function KnowledgeCheck({
  id,
  title = "Knowledge Check",
  description = "You must answer every question correctly to continue.",
  questions,
  onComplete,
  successHeadline = "Assessment Complete!",
  successSubline = "You've successfully demonstrated your understanding of this section.",
  isCompleted,
}: KnowledgeCheckProps) {
  const reduce = useReducedMotion();
  const { setNavOverride } = useCanvasNav();
  const { assessments, saveAssessmentState } = useProgressStore();
  const savedState = id ? assessments[id] : null;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"answering" | "feedback">("answering");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [initiallyCompleted] = useState(!!isCompleted || (savedState ? savedState.passed : false));
  const [incorrectAttempts, setIncorrectAttempts] = useState<Record<number, number>>(savedState?.incorrectAttempts || {});

  const total = questions.length;
  const q = useMemo(() => questions[currentQ], [questions, currentQ]);

  function handleSubmit() {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    setIsCorrect(correct);
    setStatus("feedback");
    
    if (!correct) {
      setIncorrectAttempts((prev) => {
        const updated = { ...prev, [currentQ]: (prev[currentQ] || 0) + 1 };
        if (id) {
          saveAssessmentState(id, {
            passed: false,
            currentIdx: currentQ,
            answers: {},
            incorrectAttempts: updated
          });
        }
        return updated;
      });
    }
  }

  function handleContinue() {
    if (isCorrect) {
      if (currentQ < total - 1) {
        setCurrentQ((idx) => idx + 1);
        setSelected(null);
        setStatus("answering");
        setIsCorrect(null);
      } else {
        setQuizFinished(true);
      }
    } else {
      setSelected(null);
      setStatus("answering");
      setIsCorrect(null);
    }
  }

  useEffect(() => {
    if (initiallyCompleted) {
      // If already completed, just clear any nav override and report onComplete so CanvasViewer knows
      if (onComplete) onComplete();
      setNavOverride(null);
      return;
    }
    if (quizFinished) {
      if (id) {
        saveAssessmentState(id, {
          passed: true,
          currentIdx: total - 1,
          answers: {},
          incorrectAttempts,
        });
      }
      if (onComplete) onComplete();
      setNavOverride(null);
      return;
    }
    if (status === "answering") {
      setNavOverride({
        nextLabel: "Submit",
        onNext: handleSubmit,
        nextDisabled: selected === null,
      });
    } else {
      setNavOverride({
        nextLabel: "Continue",
        onNext: handleContinue,
        nextDisabled: false,
      });
    }
    return () => setNavOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, selected, status, quizFinished, initiallyCompleted, onComplete]);

  if (initiallyCompleted) {
    return (
      <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/10 pb-4">
           <div>
             <h2 className="text-sm md:text-base font-bold text-emerald-500 tracking-widest uppercase">
               {successHeadline}
             </h2>
             <p className="text-xs text-muted-foreground mt-1">Review your answers below.</p>
           </div>
           <div className="text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-xs shrink-0 flex items-center gap-2">
             <CheckCircle2 className="w-3 h-3" />
             Completed
           </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pr-4 pb-12 custom-scrollbar">
          {questions.map((question, i) => (
            <div key={i} className="bg-card/40 border border-border/50 rounded-2xl p-5 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4">{i + 1}. {question.prompt}</h3>
              <div className="space-y-2 mb-4">
                {question.options.map((opt, j) => {
                  const isCorrectAnswer = j === question.correctIndex;
                  return (
                    <div key={j} className={`p-3 rounded-xl border flex gap-3 ${isCorrectAnswer ? "border-emerald-500/50 bg-emerald-500/10" : "border-border/30 bg-black/20 opacity-50"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 text-sm ${isCorrectAnswer ? "border-emerald-500 bg-emerald-500 text-emerald-950" : "border-border/50 text-muted-foreground"}`}>
                        {String.fromCharCode(65 + j)}
                      </div>
                      <span className={isCorrectAnswer ? "text-emerald-400 font-medium" : "text-muted-foreground"}>{opt}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-muted-foreground bg-black/30 p-4 rounded-xl border border-white/5">
                 <strong className="text-foreground">Explanation:</strong> {question.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
        <motion.div
          initial={reduce ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: easeOutQuart }}
          className="bg-card/60 backdrop-blur-2xl border border-border/60 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-2xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-500/5" />
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 relative z-10">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10 text-foreground">{successHeadline}</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 relative z-10">{successSubline}</p>
          <div className="text-5xl font-black text-emerald-500 relative z-10 tabular-nums">
            {total}/{total}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
          <div>
            <h2 className="text-sm md:text-base font-bold text-muted-foreground tracking-widest uppercase">{title}</h2>
            {description && (
              <p className="text-[11px] md:text-xs text-muted-foreground/70 mt-1 max-w-md text-balance">{description}</p>
            )}
          </div>
          <div className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-xs shrink-0 tabular-nums">
            Question {currentQ + 1} of {total}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={reduce ? false : { opacity: 0, transform: "translateX(16px)" }}
              animate={{ opacity: 1, transform: "translateX(0)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(-16px)" }}
              transition={{ duration: reduce ? 0 : 0.25, ease: easeOutQuart }}
              className="flex-1 flex flex-col min-h-0"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 leading-tight shrink-0 text-foreground text-balance">
                {q.prompt}
              </h3>

              <div className="space-y-2.5 w-full flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectOption = status === "feedback" && i === q.correctIndex;
                  const isWrongPick = status === "feedback" && isSelected && i !== q.correctIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={status === "feedback"}
                      onClick={() => setSelected(i)}
                      aria-pressed={isSelected}
                      className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] flex items-center gap-3 md:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                        isCorrectOption
                          ? "border-emerald-500 bg-emerald-500/10"
                          : isWrongPick
                          ? "border-destructive bg-destructive/10"
                          : isSelected
                          ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(167,218,219,0.15)]"
                          : "border-border/50 hover:border-primary/50 hover:bg-card bg-card/40"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 text-sm md:text-base ${
                          isCorrectOption
                            ? "border-emerald-500 bg-emerald-500 text-emerald-950"
                            : isWrongPick
                            ? "border-destructive bg-destructive text-destructive-foreground"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span
                        className={`text-sm md:text-base ${
                          isCorrectOption
                            ? "text-emerald-400"
                            : isWrongPick
                            ? "text-destructive"
                            : isSelected
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {status === "feedback" && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: easeOutQuart }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md p-6"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, transform: "translateY(12px) scale(0.96)", filter: "blur(4px)" }}
              animate={{ opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.98)", filter: "blur(2px)" }}
              transition={{ duration: reduce ? 0 : 0.32, ease: easeOutQuart }}
              className={`max-w-xl w-full p-8 rounded-[32px] border shadow-2xl relative overflow-hidden bg-background/85 backdrop-blur-2xl text-left ${
                isCorrect ? "border-primary/25" : "border-destructive/25"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -z-10 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 ${
                  isCorrect ? "bg-primary" : "bg-destructive"
                }`}
              />

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 pt-1">
                  <motion.div
                    animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`flex items-center justify-center w-14 h-14 rounded-full bg-background border shadow-sm ${
                      isCorrect ? "text-primary border-primary/25" : "text-destructive border-destructive/25"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-7 w-7" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="h-7 w-7" strokeWidth={2.5} />
                    )}
                  </motion.div>
                </div>

                <div className="flex-1 space-y-4 pt-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {isCorrect ? "Correct" : "Not quite"}
                    </h3>
                    <button
                      onClick={handleContinue}
                      className={`rounded-full ${isCorrect ? 'h-10 w-10 flex items-center justify-center' : 'px-6 py-2'} font-semibold text-sm transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isCorrect
                          ? "bg-emerald-500 hover:bg-emerald-600 text-emerald-950"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {isCorrect ? <ArrowRight className="w-5 h-5" /> : "Try Again"}
                    </button>
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
