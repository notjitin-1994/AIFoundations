export interface CourseTotals {
  [moduleId: string]: number;
}

export interface CourseProgressInput {
  completedModules: string[];
  completedSlides: Record<string, string[]>;
  moduleProgressMap: Record<string, { completed?: boolean }>;
}

export interface CourseProgressResult {
  percent: number;
  completedSlides: number;
  totalSlides: number;
  totalFraction: number;
  perModule: Record<string, { completed: number; total: number }>;
}

/**
 * Data-driven course completion. The percentage is derived ONLY from completed
 * slides/modules against a single verified source of per-module totals — the
 * learner's last-visited position is deliberately never counted as completion.
 */
export function computeCourseProgress(
  state: CourseProgressInput,
  totals: CourseTotals
): CourseProgressResult {
  let completedTotal = 0;
  let grandTotal = 0;
  let fractionSum = 0;
  const perModule: Record<string, { completed: number; total: number }> = {};

  Object.keys(totals).forEach((moduleId) => {
    const total = totals[moduleId] > 0 ? totals[moduleId] : 1;
    const isModuleCompleted =
      state.completedModules.includes(moduleId) || state.moduleProgressMap?.[moduleId]?.completed === true;
    const completed = isModuleCompleted
      ? total
      : Math.min(state.completedSlides?.[moduleId]?.length ?? 0, total);
    completedTotal += completed;
    grandTotal += total;
    fractionSum += completed / total;
    perModule[moduleId] = { completed, total };
  });

  const percent = grandTotal > 0 ? Math.round((completedTotal / grandTotal) * 100) : 0;
  return { percent, completedSlides: completedTotal, totalSlides: grandTotal, totalFraction: fractionSum, perModule };
}
