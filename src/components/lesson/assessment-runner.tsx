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

type AssessmentKind = "baseline" | "final";

interface AssessmentRunnerProps {
  kind: AssessmentKind;
  /** number of questions per module */
  perModule?: number;
  /** exact total number of questions to pick from pooled modules */
  totalQuestions?: number;
  /** restrict to these modules (default: all 8) */
  moduleIds?: string[];
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
  kind, perModule = 1, totalQuestions, moduleIds, title, description, onComplete,
}: AssessmentRunnerProps) {
  const learnerName = "Learner";
  const learnerKey = "learner-1";
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});
  const [graded, setGraded] = useState<Record<number, { correct: boolean; partial?: number; feedback?: string } | null>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [finished, setFinished] = useState(false);
  const canvasNav = useContext(CanvasNavContext);
  const thisModuleId = moduleIds?.[0] ?? kind;

  useEffect(() => {
    if (!started || finished) {
      canvasNav?.setNavOverride(null);
      return;
    }

    const current = questions[currentIdx];
    const isSubmitted = submitted[currentIdx];

    if (isSubmitted) {
      canvasNav?.setNavOverride({
        disablePrev: true,
        nextLabel: currentIdx < questions.length - 1 ? "Proceed" : "See Results",
        onNext: next,
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
  }, [started, finished, currentIdx, submitted, answers, questions]);

  function start() {
    const config: AssessmentConfig = {
      perModule,
      totalQuestions,
      moduleIds,
      shuffleOptions: true,
    };
    const qs = generateAssessment(config);
    setQuestions(qs);
    setAnswers({});
    setGraded({});
    setSubmitted({});
    setCurrentIdx(0);
    setStartTime(Date.now());
    setStarted(true);
    setFinished(false);
    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/attempted",
      "attempted",
      `https://aifoundations.xapi/assessment/${kind}`,
      `${kind === "baseline" ? "Baseline" : "Final"} Knowledge Assessment`,
      `Learner attempted ${kind} assessment with ${qs.length} questions`,
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
    sendXAPIStatement(
      "http://adlnet.gov/expapi/verbs/completed",
      "completed",
      `https://aifoundations.xapi/assessment/${kind}`,
      `${kind === "baseline" ? "Baseline" : "Final"} Knowledge Assessment`,
      `Learner completed assessment with score ${overall}%`,
      { moduleId: thisModuleId, slideId: "assessment", result: { score: overall, success: overall >= passingScore, completion: true } }
    );
    alert(`${kind === "baseline" ? "Baseline" : "Final"} assessment complete! You scored ${overall}%.`);
  }

  // ---------- INTRO SCREEN ----------
  if (!started) {
    return (
      <Card className="h-full w-full flex flex-col relative overflow-hidden border-0 shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold tabular-nums text-primary">{BANK_STATS.total}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Question bank</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold tabular-nums text-primary">{totalQuestions ?? (perModule * (moduleIds?.length ?? 8))}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Questions this round</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold tabular-nums text-primary">4</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Question types</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <div className="text-2xl font-bold tabular-nums text-primary">8</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Modules covered</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 text-primary" /> Question types in this assessment
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <Badge key={k} variant="outline" className="text-[10px] gap-1">
                  <v.icon className="h-3 w-3" /> {v.label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-cta/5 border border-cta/20 p-3 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-cta inline mr-1.5" />
            Questions are randomized from the living question bank — no two assessments are identical. Your score is recorded via xAPI and shown on the dashboard.
          </div>
          <Button className="btn-cta w-full" onClick={start}>
            <ArrowRight className="h-4 w-4 mr-2" /> Start {kind === "baseline" ? "baseline" : "final"} assessment
          </Button>
        </CardContent>
      </Card>
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
    <Card className="h-full w-full flex flex-col relative overflow-hidden border-0 shadow-none bg-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] gap-1"><TypeIcon className="h-3 w-3" />{typeInfo.label}</Badge>
            <Badge variant="secondary" className="text-[10px]">M{current.question.moduleId}</Badge>
            <Badge variant="outline" className="text-[10px] capitalize">{current.question.difficulty}</Badge>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums" suppressHydrationWarning>
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-1" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-base font-medium leading-relaxed">{current.question.prompt}</p>

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
                        onClick={next}
                        className="p-2 -mr-2 -mt-2 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors active:scale-95"
                      >
                        <X className="h-5 w-5" />
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
      </CardContent>
    </Card>
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
      <div className="space-y-2">
        {options.map((o) => {
          const isSelected = selectedArr.includes(o.id);
          const isCorrect = correctIds.includes(o.id);
          const isWrongPick = isSelected && !isCorrect;
          return (
            <Label
              key={o.id}
              onClick={(e) => {
                e.preventDefault();
                if (!isSubmitted) toggle(o.id);
              }}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-3 cursor-pointer transition-colors text-sm select-none",
                !isSubmitted && "hover:bg-accent",
                isSelected && !isSubmitted && "border-primary bg-primary/5",
                isSubmitted && isCorrect && "border-primary/40 bg-primary/5",
                isSubmitted && isWrongPick && "border-destructive/40 bg-destructive/5",
                isSubmitted && "cursor-default"
              )}
            >
              <Checkbox checked={isSelected} className="mt-0.5 pointer-events-none" />
              <span className="flex-1">{o.text}</span>
              {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-primary" />}
              {isSubmitted && isWrongPick && <XCircle className="h-4 w-4 text-destructive" />}
            </Label>
          );
        })}
      </div>
    );
  }
  return (
    <RadioGroup
      value={typeof selected === "string" ? selected : ""}
      onValueChange={(v) => onSelect(v)}
      className="space-y-2"
    >
      {options.map((o) => {
        const isSelected = selectedArr.includes(o.id);
        const isCorrect = correctIds.includes(o.id);
        const isWrongPick = isSelected && !isCorrect;
        return (
          <Label
            key={o.id}
            className={cn(
              "flex items-start gap-2.5 rounded-lg border p-3 cursor-pointer transition-colors text-sm",
              !isSubmitted && "hover:bg-accent",
              isSelected && !isSubmitted && "border-primary bg-primary/5",
              isSubmitted && isCorrect && "border-primary/40 bg-primary/5",
              isSubmitted && isWrongPick && "border-destructive/40 bg-destructive/5",
              isSubmitted && "cursor-default"
            )}
          >
            <RadioGroupItem value={o.id} className="mt-0.5" disabled={isSubmitted} />
            <span className="flex-1">{o.text}</span>
            {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-primary" />}
            {isSubmitted && isWrongPick && <XCircle className="h-4 w-4 text-destructive" />}
          </Label>
        );
      })}
    </RadioGroup>
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
              {shuffledRight.map((r) => (
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
