import { describe, it, expect } from 'vitest';
import { computeCourseProgress } from '@/lib/progress-metrics';
import type { CourseProgressInput, CourseTotals } from '@/lib/progress-metrics';

const TOTALS: CourseTotals = { '0': 8, '1': 19, '2': 26, '3': 30, '4': 7, '5': 10, '6': 9 };

function state(overrides: Partial<CourseProgressInput> = {}): CourseProgressInput {
  return {
    completedModules: [],
    completedSlides: {},
    moduleProgressMap: {},
    ...overrides,
  };
}

describe('computeCourseProgress', () => {
  it('is 0% for a brand-new learner', () => {
    expect(computeCourseProgress(state(), TOTALS).percent).toBe(0);
  });

  it('counts only completed slides, never the last-visited position', () => {
    const s = state({
      completedSlides: { '0': ['welcome-attention', 'what-is-gen-ai', 'confidence-pulse', 'myth-busting'] },
      moduleProgressMap: { '0': { completed: false } },
    });
    // Position would have been 8/8 under the old Math.max heuristic; the new
    // data-driven calc counts only the 4 completed slide ids.
    const result = computeCourseProgress({ ...s, moduleProgressMap: {} } as CourseProgressInput, TOTALS);
    expect(result.perModule['0']).toEqual({ completed: 4, total: 8 });
    expect(result.completedSlides).toBe(4);
  });

  it('gives full credit when a module is flagged complete even with no slide list', () => {
    const result = computeCourseProgress(
      state({ moduleProgressMap: { '0': { completed: true } } }),
      TOTALS
    );
    expect(result.perModule['0']).toEqual({ completed: 8, total: 8 });
  });

  it('gives full credit for modules in completedModules', () => {
    const result = computeCourseProgress(state({ completedModules: ['6'] }), TOTALS);
    expect(result.perModule['6']).toEqual({ completed: 9, total: 9 });
  });

  it('caps credit at the module total (over-credit prevention)', () => {
    const result = computeCourseProgress(
      state({ completedSlides: { '4': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] } }),
      TOTALS
    );
    expect(result.perModule['4']).toEqual({ completed: 7, total: 7 });
  });

  it('sums across modules and rounds to a whole percent', () => {
    const result = computeCourseProgress(
      state({ completedSlides: { '0': ['a', 'b', 'c', 'd'] } }),
      TOTALS
    );
    // 4 of 109 total slides
    expect(result.completedSlides).toBe(4);
    expect(result.totalSlides).toBe(109);
    expect(result.percent).toBe(Math.round((4 / 109) * 100));
  });

  it('is 100% when every module is complete', () => {
    const s = state({
      completedModules: ['0', '1', '2', '3', '4', '5', '6'],
    });
    expect(computeCourseProgress(s, TOTALS).percent).toBe(100);
  });

  it('reports the fraction used by the dashboard timeline', () => {
    const result = computeCourseProgress(
      state({ completedSlides: { '0': ['a', 'b', 'c', 'd'] } }),
      TOTALS
    );
    expect(result.totalFraction).toBeCloseTo(4 / 8, 5);
  });
});
