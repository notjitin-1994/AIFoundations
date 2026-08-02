"use client";

import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Lock, RotateCcw, Database, Target, Beaker, Wrench, Network, Sparkles,
  Compass, Brain, Fish, Factory, Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { COURSE_MODULES, PROJECT_SPINES } from "@/lib/course-data";
import type { ProjectSpineAnswerData } from "@/store/progress";

// One identity glyph per chapter — gives each journey row its own character
// (game-board direction) while the MODULE n chip keeps the sequence explicit.
const MODULE_ICONS: Record<string, LucideIcon> = {
  "0": Compass,
  "1": Brain,
  "2": Fish,
  "3": Wrench,
  "4": Network,
  "5": Factory,
  "6": Rocket,
};

interface ModuleTrackerProps {
  completedModules: string[];
  activeModuleId: string | null;
  projectSpine: string | null;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  totalFraction: number;
  totalModules: number;
  completedCount: number;
  mounted: boolean;
}

export function ModuleTracker({
  completedModules,
  activeModuleId,
  projectSpine,
  projectSpineAnswers,
  totalFraction,
  totalModules,
  completedCount,
  mounted,
}: ModuleTrackerProps) {
  return (
    <section className="space-y-10 dashboard-fade">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <h2 className="text-3xl font-bold font-heading tracking-tight">Your Journey</h2>
        <p className="text-sm text-muted-foreground">
          {completedCount} of {totalModules} chapters complete
        </p>
      </div>

      <div className="relative pl-2 md:pl-4">
        {/* Continuous vertical timeline track */}
        <div className="absolute left-[35px] md:left-[43px] top-6 bottom-12 w-px bg-white/5" />

        {/* Active timeline progress fill — the glowing teal spine */}
        <div
          className="absolute left-[35px] md:left-[43px] top-6 w-px bg-gradient-to-b from-primary via-primary/80 to-primary/40 shadow-[0_0_15px_rgba(167,218,219,0.5)] transition-all duration-1000 ease-out z-0"
          style={{ height: mounted ? `${Math.min(100, Math.max(0, totalFraction / (totalModules - 1) * 100))}%` : '0%' }}
        />

        <div className="space-y-4 md:space-y-6">
          {COURSE_MODULES.map((mod, idx) => {
            const isComplete = completedModules.includes(mod.id);
            const isLocked = idx > 0 && !completedModules.includes(COURSE_MODULES[idx - 1].id) && !isComplete;
            const isActive = mounted && !isComplete && !isLocked;
            const isCurrent = isActive && (activeModuleId === mod.id || (!activeModuleId && idx === 0));
            const ChapterIcon = MODULE_ICONS[mod.id] ?? Compass;

            const nodeClasses = isComplete
              ? "bg-primary text-background border-primary shadow-[0_0_25px_rgba(167,218,219,0.3)]"
              : isActive
              ? "bg-card/70 border-2 border-primary text-primary shadow-[0_0_20px_rgba(167,218,219,0.25)]"
              : "bg-card/60 border border-white/10 text-muted-foreground/50";

            const cardClasses = isComplete
              ? "bg-card/30 backdrop-blur-xl border-primary/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              : isActive
              ? "bg-card/60 backdrop-blur-xl border-primary/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-card/20 backdrop-blur-md border-white/5";

            return (
              <div
                key={mod.id}
                aria-current={isCurrent ? "step" : undefined}
                className={`module-row relative flex gap-6 md:gap-10 py-5 md:py-6 transition-all duration-500 group ${
                  isActive ? "opacity-100" : isLocked ? "opacity-60 hover:opacity-90" : "opacity-90 hover:opacity-100"
                }`}
              >
                {/* Left: Timeline Node */}
                <div className="relative z-10 shrink-0 mt-1">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-700 ease-out border ${nodeClasses} ${isCurrent ? "scale-110" : ""}`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <ChapterIcon className="w-5 h-5" />
                    )}
                  </div>
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 animate-pulse motion-safe:animate-pulse" />
                  )}
                </div>

                {/* Right: Glass waypoint card */}
                <div className={`flex-1 min-w-0 rounded-2xl border p-5 md:p-6 transition-all duration-300 ease-out relative overflow-hidden ${cardClasses} ${isActive ? "translate-x-1" : "group-hover:translate-x-0.5"}`}>
                  {isComplete && <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />}
                  {isCurrent && <div className="absolute top-0 right-0 w-56 h-56 bg-secondary/10 blur-[80px] rounded-full pointer-events-none" />}

                  <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-mono tracking-[0.18em] uppercase border ${isActive ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                        <ChapterIcon className="w-3 h-3" />
                        Module {mod.id}
                      </span>
                      <h3 className={`text-2xl md:text-3xl font-bold font-heading text-pretty mt-3 transition-colors ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                        {mod.title}
                      </h3>
                    </div>
                    {!isLocked ? (
                      <Link href={`/modules/${mod.id}`} className="shrink-0 mt-2 sm:mt-0">
                        <button
                          className={`group/btn relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 ${
                            isCurrent
                              ? "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                          }`}
                        >
                          {isComplete ? (
                            <>Review <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:-rotate-90" /></>
                          ) : (
                            <>Continue <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                          )}
                        </button>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-muted-foreground/60 border border-dashed border-white/10 mt-2 sm:mt-0 shrink-0">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className={`relative z-10 text-sm md:text-base leading-relaxed max-w-2xl mb-5 transition-colors ${isActive ? "text-foreground/80" : "text-muted-foreground"}`}>
                    {mod.overview}
                  </p>

                  {/* Module Meta Data / Tags */}
                  <div className="relative z-10 flex flex-wrap gap-2.5">
                    {mod.id === "0" && projectSpine && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md">
                        <Database className="w-3.5 h-3.5" />
                        Project Foundation: {PROJECT_SPINES[projectSpine] || projectSpine}
                      </div>
                    )}

                    {/* Module Deliverables */}
                    {mod.id === "1" && projectSpineAnswers?.["1"] && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Target className="w-3.5 h-3.5" />
                        System Prompt Designed
                      </div>
                    )}
                    {mod.id === "2" && projectSpineAnswers?.["2"] && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Beaker className="w-3.5 h-3.5" />
                        RAG Architecture Designed
                      </div>
                    )}
                    {mod.id === "3" && projectSpineAnswers?.["3"] && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Wrench className="w-3.5 h-3.5" />
                        Toolbelt & MCP Registered
                      </div>
                    )}
                    {mod.id === "4" && projectSpineAnswers?.["4"] && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Network className="w-3.5 h-3.5" />
                        Agentic Loop Created
                      </div>
                    )}
                    {mod.id === "5" && projectSpineAnswers?.["5"] && (
                      <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Capstone Submitted
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
