"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2, XCircle, X, ArrowRight, ArrowLeft, RotateCcw,
  Trophy, Clock, ListChecks, PenLine, Shuffle, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/progress";
import { sendXAPIStatement } from "@/actions/xapi";
import {
  type Question, type AssessmentQuestion, type AssessmentConfig,
  generateAssessment, gradeQuestion, BANK_STATS,
} from "@/lib/question-bank";
import { CanvasNavContext } from "./canvas-viewer";
import { useContext } from "react";

const MODULES = [
  { id: "0", name: "Orientation" },
  { id: "1", name: "The Intelligence Illusion" },
  { id: "2", name: "The Goldfish Problem" },
  { id: "3", name: "The Toolbelt" },
  { id: "4", name: "The Engine Room" },
  { id: "5", name: "The Assembly Line" },
  { id: "6", name: "The Local Sandbox" },
  { id: "7", name: "The Horizon" },
];

type AssessmentKind = "baseline" | "module" | "final";

interface AssessmentRunnerProps {
  kind: AssessmentKind;
  /** number of questions per module */
  perModule?: number;
  /** exact total number of questions to pick from pooled modules */
  totalQuestions?: number;
  /** restrict to these modules (default: all 8) */
  moduleIds?: string[];
  /** filter by these specific tags */
  tags?: string[];
  /** title shown at top */
  title: string;
  description: string;
  onComplete: (result: {
    overall: number;
    byModule: Record<string, { correct: number; total: number; pct: number }>;
    questionsAnswered: number;
    takenAt: string;
    durationMs: number;
  }) => void;
}

const TYPE_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  "multiple-choice": { label: "Select one", icon: ListChecks },
  "multiple-select": { label: "Select all that apply", icon: ListChecks },
  "fill-blank": { label: "Fill in the blank", icon: PenLine },
  "match-pairs": { label: "Match the pairs", icon: Shuffle },
};

export function AssessmentRunner({
  kind, perModule = 1, totalQuestions, moduleIds, tags, title, description, onComplete,
}: AssessmentRunnerProps) {
  const canvasNav = useContext(CanvasNavContext);
  const thisModuleId = moduleIds?.[0] ?? kind;

  const { assessments, saveAssessmentState } = useProgressStore();
  
  const savedState = assessments[thisModuleId];
  const hasPassed = savedState?.passed;

  const [started, setStarted] = useState(!!savedState && !hasPassed);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(savedState?.questions || []);
  const [currentIdx, setCurrentIdx] = useState(savedState?.currentIdx || 0);
  const [answers, setAnswers] = useState<Record<number, unknown>>(savedState?.answers || {});
  const [graded, setGraded] = useState<Record<number, { correct: boolean; partial?: number; feedback?: string } | null>>(savedState?.graded || {});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>(savedState?.submitted || {});
  const [incorrectAttempts, setIncorrectAttempts] = useState<Record<number, number>>(savedState?.incorrectAttempts || {});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [finished, setFinished] = useState(false);

  // Hydrate local state from store after mount to fix SSR hydration ignoring local storage
  useEffect(() => {
    const storeState = useProgressStore.getState().assessments[thisModuleId];
    if (storeState && !storeState.passed && storeState.questions && storeState.questions.length > 0) {
      setQuestions(storeState.questions);
      setCurrentIdx(storeState.currentIdx || 0);
      setAnswers(storeState.answers || {});
      setGraded(storeState.graded || {});
      setSubmitted(storeState.submitted || {});
      setIncorrectAttempts(storeState.incorrectAttempts || {});
      setStarted(true);
    }
  }, [thisModuleId]);

  const questionsPool = useMemo(() => {
    if (savedState?.questions) return savedState.questions; // Use saved questions if resuming
    const config: AssessmentConfig = {
      perModule,
      totalQuestions,
      moduleIds,
      tags,
      shuffleOptions: true,
    };
    return generateAssessment(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perModule, totalQuestions, moduleIds?.join(','), tags?.join(','), kind, savedState?.questions]);

  // Persist state when answering or moving
  useEffect(() => {
    if (started && !finished && questions.length > 0) {
      saveAssessmentState(thisModuleId, {
        questions,
        currentIdx,
        answers,
        graded,
        submitted,
        incorrectAttempts,
        passed: false
      });
    }
  }, [started, finished, currentIdx, answers, graded, submitted, incorrectAttempts, questions, thisModuleId, saveAssessmentState]);

  useEffect(() => {
    if (finished || hasPassed) {
      canvasNav?.setNavOverride(null);
      return;
    }

    if (!started) {
      canvasNav?.setNavOverride({
        disablePrev: false,
        nextLabel: kind === "baseline" ? "Start Calibration" : kind === "final" ? "Start Final Exam" : "Start Assessment",
        nextDisabled: questionsPool.length === 0,
        onNext: start,
      });
      return;
    }

    const current = questions[currentIdx];
    const isSubmitted = submitted[currentIdx];

    if (isSubmitted) {
      canvasNav?.setNavOverride({
        disablePrev: true,
        nextLabel: "Proceed", // We handle the button inside the popup now, but provide a fallback string
        onNext: () => {}, // Disable default canvas next button, we want them to use the popup's button
        nextDisabled: true, // Disable canvas next button while feedback is shown
      });
    } else {
      const hasAns = hasAnswer(answers[currentIdx], current?.question.type);
      canvasNav?.setNavOverride({
        disablePrev: currentIdx === 0,
        nextLabel: "Submit answer",
        nextDisabled: !hasAns,
        onNext: submitAnswer,
      });
    }

    return () => {
      canvasNav?.setNavOverride(null);
    };
  }, [started, finished, hasPassed, currentIdx, submitted, answers, questions, kind, questionsPool]);

  function start() {
    setQuestions(questionsPool);
    setAnswers({});
    setGraded({});
    setSubmitted({});
    setIncorrectAttempts({});
    setCurrentIdx(0);
    setStartTime(Date.now());
    setStarted(true);
    setFinished(false);
    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/attempted",
      "attempted",
      `https://aifoundations.xapi/assessment/${kind}`,
      `${kind === "baseline" ? "Baseline" : "Final"} Knowledge Assessment`,
      `Learner attempted ${kind} assessment with ${questionsPool.length} questions`,
      { moduleId: thisModuleId, slideId: "assessment" }
    );
  }

  const current = questions[currentIdx];

  function submitAnswer() {
    if (!current) return;
    const response = answers[currentIdx];
    const result = gradeQuestion(current.question, response);
    const score = Math.round((result.partial ?? (result.correct ? 1 : 0)) * 100);
    setGraded((g) => ({ ...g, [currentIdx]: result }));
    setSubmitted((s) => ({ ...s, [currentIdx]: true }));
    
    if (!result.correct) {
      setIncorrectAttempts((prev) => ({
        ...prev,
        [currentIdx]: (prev[currentIdx] || 0) + 1
      }));
    }

    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/answered",
      "answered",
      `https://aifoundations.xapi/question/${current.question.id}`,
      `Question ${current.question.id}`,
      `Learner answered question (correct: ${result.correct})`,
      { moduleId: thisModuleId, slideId: "assessment", result: { score, success: result.correct, completion: false } }
    );
  }

  function next() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      finish();
    }
  }

  function prev() {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  }

  function retry() {
    setSubmitted((s) => ({ ...s, [currentIdx]: false }));
    setGraded((g) => {
      const copy = { ...g };
      delete copy[currentIdx];
      return copy;
    });
  }

  function finish() {
    const durationMs = Date.now() - startTime;
    // tally scores
    let correctCount = 0;
    const byModule: Record<string, { correct: number; total: number; pct: number }> = {};
    questions.forEach((aq, i) => {
      const mid = aq.question.moduleId;
      if (!byModule[mid]) byModule[mid] = { correct: 0, total: 0, pct: 0 };
      byModule[mid].total++;
      const g = graded[i];
      const isCorrect = g?.correct ?? false;
      const partialScore = g?.partial ?? (isCorrect ? 1 : 0);
      byModule[mid].correct += partialScore;
      if (isCorrect) correctCount++;
    });
    Object.keys(byModule).forEach((mid) => {
      byModule[mid].pct = byModule[mid].total > 0
        ? Math.round((byModule[mid].correct / byModule[mid].total) * 100)
        : 0;
    });
    const overall = questions.length > 0
      ? Math.round((Object.values(byModule).reduce((s, m) => s + m.correct, 0) / questions.length) * 100)
      : 0;
    const passingScore = 70;
    const result = {
      overall,
      byModule,
      questionsAnswered: questions.length,
      takenAt: new Date().toISOString(),
      durationMs,
    };
    onComplete(result);
    setFinished(true);
    
    // Save passed state
    if (overall >= passingScore) {
      saveAssessmentState(thisModuleId, { 
        questions, 
        currentIdx, 
        answers, 
        graded, 
        submitted,
        incorrectAttempts,
        passed: true 
      });
    }

    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/completed",
      "completed",
      `https://aifoundations.xapi/assessment/${kind}`,
      `${kind === "baseline" ? "Baseline" : "Final"} Knowledge Assessment`,
      `Learner completed assessment with score ${overall}%`,
      { moduleId: thisModuleId, slideId: "assessment", result: { score: overall, success: overall >= passingScore, completion: true } }
    );
  }

  // ---------- ALREADY PASSED SCREEN ----------
  if (hasPassed && !finished) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-10 max-w-4xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-primary/20 p-10 rounded-3xl shadow-2xl text-center max-w-2xl w-full"
        >
          <div className="mx-auto w-20 h-20 bg-primary/10 flex items-center justify-center rounded-full mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Assessment Passed</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            You have already demonstrated mastery of this module's concepts. 
            You may skip this knowledge check or re-take it for review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => {
                // Mock passing result to unlock the next slide
                onComplete({ overall: 100, byModule: {}, questionsAnswered: 0, takenAt: new Date().toISOString(), durationMs: 0 });
                setFinished(true);
              }}
              className="w-full sm:w-auto text-base h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-primary/25 transition-all"
            >
              Skip & Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => saveAssessmentState(thisModuleId, { currentIdx: 0, answers: {}, passed: false })}
              className="w-full sm:w-auto text-base h-12 px-8 rounded-full"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Re-take Assessment
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- INTRO SCREEN ----------
  if (!started) {
    const isBaseline = kind === "baseline";
    const headerTitle = isBaseline ? "Establishing Your Baseline" : kind === "final" ? "Final Assessment" : "Knowledge Check";
    const bodyText = isBaseline 
      ? "This isn't a test—it's a calibration. We are establishing your starting coordinates. By taking your baseline temperature now, we can accurately measure your growth and mastery by the end of this journey. Do not stress if the concepts feel unfamiliar; they won't for long."
      : kind === "final" 
        ? "This is the culmination of your journey. It is time to prove your mastery and claim your certificate. Take your time, rely on the mental models you've built, and show us what you know."
        : "Let's pause and verify your understanding before moving forward. Retention is built through active recall.";

    return (
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full text-center flex flex-col items-center p-8 space-y-10"
        >
          {/* A glowing, minimalist animated icon ring */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-[#a7dadb]/30 bg-[#a7dadb]/10 shadow-[0_0_60px_rgba(167,218,219,0.15)]">
            <Trophy className="h-10 w-10 text-[#a7dadb]" strokeWidth={1.5} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-[#a7dadb] opacity-30" 
              style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-[#a7dadb] opacity-20" 
              style={{ borderBottomColor: "transparent", borderLeftColor: "transparent" }}
            />
          </div>

          <div className="space-y-6 z-10 relative">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              {headerTitle}
            </h2>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl mx-auto font-light">
              {bodyText}
            </p>
          </div>


        </motion.div>
      </div>
    );
  }

  // ---------- RESULTS SCREEN ----------
  if (finished) {
    const result = {
      overall: 0,
      byModule: {},
      questionsAnswered: questions.length,
      takenAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
    };
    // recompute for display
    let totalCorrect = 0;
    const bm: Record<string, { correct: number; total: number; pct: number }> = {};
    questions.forEach((aq, i) => {
      const mid = aq.question.moduleId;
      if (!bm[mid]) bm[mid] = { correct: 0, total: 0, pct: 0 };
      bm[mid].total++;
      const g = graded[i];
      const partial = g?.partial ?? (g?.correct ? 1 : 0);
      bm[mid].correct += partial;
      if (g?.correct) totalCorrect++;
    });
    Object.keys(bm).forEach((mid) => {
      bm[mid].pct = bm[mid].total > 0 ? Math.round((bm[mid].correct / bm[mid].total) * 100) : 0;
    });
    const overallPct = questions.length > 0
      ? Math.round((Object.values(bm).reduce((s, m) => s + m.correct, 0) / questions.length) * 100)
      : 0;

    return (
      <Card className="h-full w-full flex flex-col relative overflow-hidden border-0 shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-primary" /> Assessment complete
          </CardTitle>
          <CardDescription>
            {kind === "baseline" ? "Baseline" : "Final"} knowledge score — recorded to your LRS.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="flex items-end gap-3">
            <div>
              <div className="text-5xl font-bold tabular-nums text-primary">{overallPct}<span className="text-2xl text-muted-foreground">%</span></div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalCorrect} of {questions.length} correct · {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
            <div className="flex-1 ml-4">
              <div className="text-xs text-muted-foreground mb-1">Overall</div>
              <Progress value={overallPct} className="h-3" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-2">Score by module</div>
            <div className="space-y-2">
              {Object.entries(bm).sort(([a], [b]) => Number(a) - Number(b)).map(([mid, m]) => {
                const mod = MODULES.find((x) => x.id === mid);
                return (
                  <div key={mid} className="flex items-center gap-3">
                    <div className="w-32 text-xs shrink-0">M{mid} · {mod?.name ?? "—"}</div>
                    <div className="flex-1"><Progress value={m.pct} className="h-2" /></div>
                    <div className="w-16 text-right text-xs tabular-nums text-muted-foreground" suppressHydrationWarning>
                      {m.pct}% ({Math.round(m.correct)}/{m.total})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button variant="outline" onClick={start}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Retake assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ---------- QUESTION SCREEN ----------
  if (!current) return null;
  const typeInfo = TYPE_LABELS[current.question.type];
  const TypeIcon = typeInfo.icon;
  const isSubmitted = submitted[currentIdx];
  const grade = graded[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
          <div>
            <h2 className="text-sm md:text-base font-bold text-muted-foreground tracking-widest uppercase">{title || "Knowledge Check"}</h2>
            {description && (
              <p className="text-[11px] md:text-xs text-muted-foreground/70 mt-1 max-w-md text-balance">{description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20 text-xs tabular-nums">
              Question {currentIdx + 1} of {questions.length}
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 mb-6 shrink-0" />

        <div className="flex-1 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-h-0"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 leading-tight shrink-0 text-foreground text-balance">
                {current.question.prompt}
              </h3>

              <div className="w-full flex-1 overflow-y-auto min-h-0 relative">
                {/* render by type */}
                {(current.question.type === "multiple-choice" || current.question.type === "multiple-select") && (
                  <QuestionOptions
                    question={current.question}
                    options={current.renderedOptions ?? []}
                    isMulti={current.question.type === "multiple-select"}
                    selected={answers[currentIdx] as (string | string[])}
                    onSelect={(val) => !isSubmitted && setAnswers((a) => ({ ...a, [currentIdx]: val }))}
                    isSubmitted={isSubmitted}
                  />
                )}

        {current.question.type === "fill-blank" && (
          <FillBlankInput
            question={current.question}
            value={(answers[currentIdx] as string) ?? ""}
            onChange={(v) => !isSubmitted && setAnswers((a) => ({ ...a, [currentIdx]: v }))}
            isSubmitted={isSubmitted}
            correct={grade?.correct ?? false}
          />
        )}

        {current.question.type === "match-pairs" && (
          <MatchPairsInput
            question={current.question}
            shuffledRight={current.shuffledRight ?? []}
            matches={(answers[currentIdx] as Record<string, string>) ?? {}}
            onChange={(m) => !isSubmitted && setAnswers((a) => ({ ...a, [currentIdx]: m }))}
            isSubmitted={isSubmitted}
          />
        )}

              </div>
            </motion.div>
          </AnimatePresence>

        {/* Animated Feedback Overlay */}
        <AnimatePresence>
          {isSubmitted && grade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.96, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }} // Strong ease-out
                className={cn(
                  "max-w-xl w-full p-8 rounded-[32px] border shadow-2xl relative overflow-hidden",
                  "bg-background/80 backdrop-blur-2xl text-left",
                  grade.correct ? "border-primary/20 shadow-primary/5" : "border-destructive/20 shadow-destructive/5"
                )}
              >
                {/* Subtle Glow */}
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 -z-10 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2",
                  grade.correct ? "bg-primary" : "bg-destructive"
                )} />

                <div className="flex items-start gap-6">
                  {/* Icon Area */}
                  <div className="flex-shrink-0 pt-1">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full bg-background border shadow-sm",
                        grade.correct ? "text-primary border-primary/20 shadow-primary/10" : "text-destructive border-destructive/20 shadow-destructive/10"
                      )}
                    >
                      {grade.correct ? (
                        <CheckCircle2 className="h-7 w-7" strokeWidth={2.5} />
                      ) : (
                        <XCircle className="h-7 w-7" strokeWidth={2.5} />
                      )}
                    </motion.div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-4 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={cn("text-2xl font-bold tracking-tight", grade.correct ? "text-foreground" : "text-foreground")}>
                          {grade.correct ? "Correct" : "Not quite"}
                        </h3>
                        {grade.partial !== undefined && grade.partial > 0 && !grade.correct && (
                          <Badge variant="outline" className="mt-2 font-medium">Partial Credit: {Math.round(grade.partial * 100)}%</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (grade.correct || kind === "baseline" || kind === "final") {
                            next();
                          } else {
                            retry();
                          }
                        }}
                        className={cn(
                          "rounded-full font-semibold text-sm transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          grade.correct
                            ? "h-10 w-10 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-emerald-950"
                            : kind === "baseline" || kind === "final"
                            ? "h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground"
                            : "px-6 py-2 bg-muted hover:bg-muted/80 text-foreground"
                        )}
                      >
                        {grade.correct || kind === "baseline" || kind === "final" ? (
                          <ArrowRight className="w-5 h-5" />
                        ) : (
                          "Try Again"
                        )}
                      </button>
                    </div>

                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {grade.feedback}
                    </p>

                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="bg-muted/40 border border-border/50 rounded-2xl p-5 mt-4"
                    >
                      <h4 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Explanation</h4>
                      <p className="text-[15px] text-foreground/90 leading-relaxed">
                        {current.question.explanation}
                      </p>
                      {current.question.source && (
                        <p className="text-xs text-muted-foreground/80 italic mt-3 pt-3 border-t border-border/40">
                          Source: {current.question.source}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}

function hasAnswer(ans: unknown, type: string): boolean {
  if (ans == null) return false;
  if (type === "multiple-choice") return typeof ans === "string" && ans.length > 0;
  if (type === "multiple-select") return Array.isArray(ans) && ans.length > 0;
  if (type === "fill-blank") return typeof ans === "string" && ans.trim().length > 0;
  if (type === "match-pairs") return typeof ans === "object" && ans !== null && Object.keys(ans).length > 0;
  return false;
}

// ---------- sub-components ----------

function QuestionOptions({
  question, options, isMulti, selected, onSelect, isSubmitted,
}: {
  question: Question;
  options: { id: string; text: string }[];
  isMulti: boolean;
  selected: string | string[];
  onSelect: (val: string | string[]) => void;
  isSubmitted: boolean;
}) {
  const selectedArr = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  // find correct ids for post-submit styling
  const correctIds = (question.type === "multiple-choice" || question.type === "multiple-select")
    ? question.options.filter((o) => o.correct).map((o) => o.id)
    : [];

  function toggle(id: string) {
    if (isMulti) {
      const set = new Set(selectedArr);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      onSelect(Array.from(set));
    } else {
      onSelect(id);
    }
  }

  if (isMulti) {
    return (
      <div className="space-y-2.5 w-full">
        {options.map((o, i) => {
          const isSelected = selectedArr.includes(o.id);
          const isCorrectOption = isSubmitted && correctIds.includes(o.id);
          const isWrongPick = isSubmitted && isSelected && !isCorrectOption;
          return (
            <button
              key={o.id}
              type="button"
              disabled={isSubmitted}
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitted) toggle(o.id);
              }}
              aria-pressed={isSelected}
              className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] flex items-center gap-3 md:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card select-none ${
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
                className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 rounded-md flex items-center justify-center border-2 transition-colors shrink-0 text-sm md:text-base ${
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
                className={`text-sm md:text-base flex-1 ${
                  isCorrectOption
                    ? "text-emerald-400"
                    : isWrongPick
                    ? "text-destructive"
                    : isSelected
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {o.text}
              </span>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="space-y-2.5 w-full">
      {options.map((o, i) => {
        const isSelected = selectedArr.includes(o.id);
        const isCorrectOption = isSubmitted && correctIds.includes(o.id);
        const isWrongPick = isSubmitted && isSelected && !isCorrectOption;
        return (
          <button
            key={o.id}
            type="button"
            disabled={isSubmitted}
            onClick={() => !isSubmitted && onSelect(o.id)}
            aria-pressed={isSelected}
            className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.99] flex items-center gap-3 md:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card select-none ${
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
              className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 text-sm md:text-base ${
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
              className={`text-sm md:text-base flex-1 ${
                isCorrectOption
                  ? "text-emerald-400"
                  : isWrongPick
                  ? "text-destructive"
                  : isSelected
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {o.text}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FillBlankInput({
  question, value, onChange, isSubmitted, correct,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  isSubmitted: boolean;
  correct: boolean;
}) {
  if (question.type !== "fill-blank") return null;
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        disabled={isSubmitted}
        className={cn(
          isSubmitted && correct && "border-primary/40 bg-primary/5",
          isSubmitted && !correct && "border-destructive/40 bg-destructive/5",
        )}
      />
      {isSubmitted && !correct && (
        <p className="text-xs text-muted-foreground mt-2">
          Accepted answers: <span className="font-mono text-foreground">{question.acceptedAnswers.join(", ")}</span>
        </p>
      )}
    </div>
  );
}

function MatchPairsInput({
  question, shuffledRight, matches, onChange, isSubmitted,
}: {
  question: Question;
  shuffledRight: string[];
  matches: Record<string, string>;
  onChange: (m: Record<string, string>) => void;
  isSubmitted: boolean;
}) {
  if (question.type !== "match-pairs") return null;
  const correctPairs = new Map(question.pairs.map((p) => [p.left, p.right]));
  return (
    <div className="space-y-2">
      {question.pairs.map((pair) => {
        const chosen = matches[pair.left] ?? "";
        const isCorrect = isSubmitted && chosen === pair.right;
        const isWrong = isSubmitted && chosen !== "" && chosen !== pair.right;
        return (
          <div key={pair.left} className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-muted/30 p-2.5 text-sm">{pair.left}</div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={chosen}
              onChange={(e) => onChange({ ...matches, [pair.left]: e.target.value })}
              disabled={isSubmitted}
              className={cn(
                "flex-1 rounded-lg border bg-background p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary",
                isCorrect && "border-primary/40 bg-primary/5",
                isWrong && "border-destructive/40 bg-destructive/5",
              )}
            >
              <option value="">— select —</option>
              {Array.from(new Set(shuffledRight)).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {isCorrect && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
            {isWrong && <XCircle className="h-4 w-4 text-destructive shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
