import { describe, it, expect } from 'vitest';
import { lwwResolve, mergeRemoteProgress, hasStartedCourse } from '@/lib/progress-merge';
import type { LocalProgressSnapshot, ModuleProgressRow, CourseStartSnapshot } from '@/lib/progress-merge';

function localSnapshot(overrides: Partial<LocalProgressSnapshot> = {}): LocalProgressSnapshot {
  return {
    completedModules: [],
    completedLessons: {},
    completedSlides: {},
    moduleProgressMap: {},
    assessments: {},
    projectSpine: null,
    projectSpineAnswers: {},
    gamification: {
      xp: 0,
      badges: [],
      toolsMastered: [],
      totalTimeSpentSeconds: 0,
      lastLoginDate: null,
      currentStreak: 0,
    },
    activeLessonIndex: 0,
    activeSlideIndex: 0,
    lastUpdatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function row(moduleId: string, overrides: Partial<ModuleProgressRow> = {}): ModuleProgressRow {
  return {
    module_id: moduleId,
    active_slide_index: 0,
    active_lesson_index: 0,
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('lwwResolve', () => {
  it('returns the local value when local is newer', () => {
    expect(lwwResolve(3, 9, '2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(3);
  });

  it('returns the remote value when remote is newer', () => {
    expect(lwwResolve(3, 9, '2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z')).toBe(9);
  });

  it('returns remote on a timestamp tie (DB wins)', () => {
    expect(lwwResolve(3, 9, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(9);
  });

  it('returns remote when local is undefined', () => {
    expect(lwwResolve(undefined, 9, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(9);
  });

  it('returns local when remote is undefined', () => {
    expect(lwwResolve(3, undefined, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(3);
  });

  it('returns local when remote has no timestamp', () => {
    expect(lwwResolve(3, 9, '2026-01-01T00:00:00.000Z', null)).toBe(3);
  });
});

describe('mergeRemoteProgress', () => {
  it('is an identity when there are no DB rows', () => {
    const local = localSnapshot({ completedModules: ['1'], activeSlideIndex: 4 });
    const merged = mergeRemoteProgress(local, [], '1');

    expect(merged).toEqual(local);
  });

  it('takes remote indices when the DB row is newer', () => {
    const local = localSnapshot({
      moduleProgressMap: { '1': { activeSlideIndex: 3, activeLessonIndex: 1, totalSlidesInModule: 10, completed: false } },
    });
    const merged = mergeRemoteProgress(local, [
      row('1', { active_slide_index: 7, active_lesson_index: 2, updated_at: '2026-01-02T00:00:00.000Z' }),
    ], '1');

    expect(merged.moduleProgressMap['1'].activeSlideIndex).toBe(7);
    expect(merged.moduleProgressMap['1'].activeLessonIndex).toBe(2);
  });

  it('keeps local indices when the local state is newer', () => {
    const local = localSnapshot({
      lastUpdatedAt: '2026-01-02T00:00:00.000Z',
      moduleProgressMap: { '1': { activeSlideIndex: 7, activeLessonIndex: 2, totalSlidesInModule: 10, completed: false } },
    });
    const merged = mergeRemoteProgress(local, [
      row('1', { active_slide_index: 3, active_lesson_index: 1, updated_at: '2026-01-01T00:00:00.000Z' }),
    ], '1');

    expect(merged.moduleProgressMap['1'].activeSlideIndex).toBe(7);
    expect(merged.moduleProgressMap['1'].activeLessonIndex).toBe(2);
  });

  it('takes remote indices on a timestamp tie', () => {
    const local = localSnapshot({
      moduleProgressMap: { '1': { activeSlideIndex: 3, activeLessonIndex: 1, totalSlidesInModule: 10, completed: false } },
    });
    const merged = mergeRemoteProgress(local, [
      row('1', { active_slide_index: 7, active_lesson_index: 2, updated_at: '2026-01-01T00:00:00.000Z' }),
    ], '1');

    expect(merged.moduleProgressMap['1'].activeSlideIndex).toBe(7);
    expect(merged.moduleProgressMap['1'].activeLessonIndex).toBe(2);
  });

  it('creates a map entry from the row when no local entry exists', () => {
    const merged = mergeRemoteProgress(localSnapshot(), [
      row('1', { active_slide_index: 5, active_lesson_index: 2, completed: true }),
    ], '1');

    expect(merged.moduleProgressMap['1']).toEqual({
      activeSlideIndex: 5,
      activeLessonIndex: 2,
      totalSlidesInModule: 1,
      completed: true,
    });
    expect(merged.completedModules).toContain('1');
  });

  it('resolves each module independently (per-field independence)', () => {
    const local = localSnapshot({
      moduleProgressMap: {
        '1': { activeSlideIndex: 3, activeLessonIndex: 1, totalSlidesInModule: 10, completed: false },
        '2': { activeSlideIndex: 4, activeLessonIndex: 2, totalSlidesInModule: 8, completed: false },
      },
    });
    const merged = mergeRemoteProgress(local, [
      row('1', { active_slide_index: 9, active_lesson_index: 5, updated_at: '2026-01-03T00:00:00.000Z' }),
      row('2', { active_slide_index: 2, active_lesson_index: 1, updated_at: '2025-12-31T00:00:00.000Z' }),
    ], '1');

    expect(merged.moduleProgressMap['1'].activeSlideIndex).toBe(9);
    expect(merged.moduleProgressMap['2'].activeSlideIndex).toBe(4);
    expect(merged.moduleProgressMap['2'].activeLessonIndex).toBe(2);
  });

  it('unions completed slides and lessons instead of dropping local data', () => {
    const local = localSnapshot({
      completedSlides: { '1': ['m1-1', 'm1-2'] },
      completedLessons: { '1': [0, 1] },
    });
    const merged = mergeRemoteProgress(local, [
      row('1', {
        completed_slides: { '1': ['m1-2', 'm1-3'] },
        completed_lessons: { '1': [1, 2] },
      }),
    ], '1');

    expect(merged.completedSlides['1']).toEqual(expect.arrayContaining(['m1-1', 'm1-2', 'm1-3']));
    expect(merged.completedLessons['1']).toEqual([0, 1, 2]);
  });

  it('adopts the newest updated_at across local and DB', () => {
    const local = localSnapshot({ lastUpdatedAt: '2026-01-02T00:00:00.000Z' });
    const merged = mergeRemoteProgress(local, [
      row('1', { updated_at: '2026-01-05T00:00:00.000Z' }),
    ], '1');

    expect(merged.lastUpdatedAt).toBe('2026-01-05T00:00:00.000Z');
  });

  it('applies the same LWW to the active module indices', () => {
    const local = localSnapshot({ activeSlideIndex: 2, activeLessonIndex: 1 });
    const merged = mergeRemoteProgress(local, [
      row('1', { active_slide_index: 8, active_lesson_index: 3, updated_at: '2026-01-03T00:00:00.000Z' }),
    ], '1');

    expect(merged.activeSlideIndex).toBe(8);
    expect(merged.activeLessonIndex).toBe(3);
  });
});

function startSnapshot(overrides: Partial<CourseStartSnapshot> = {}): CourseStartSnapshot {
  return {
    completedModules: [],
    completedLessons: {},
    completedSlides: {},
    moduleProgressMap: {},
    projectSpine: null,
    gamificationXp: 0,
    activeSlideIndex: 0,
    activeModuleId: '0',
    ...overrides,
  };
}

describe('hasStartedCourse', () => {
  it('is false for a brand-new learner', () => {
    expect(hasStartedCourse(startSnapshot())).toBe(false);
  });

  it('is true when any module has a progress map entry', () => {
    expect(hasStartedCourse(startSnapshot({ moduleProgressMap: { '0': { activeSlideIndex: 3, activeLessonIndex: 0, totalSlidesInModule: 9, completed: false } } }))).toBe(true);
  });

  it('is true when a project spine was selected', () => {
    expect(hasStartedCourse(startSnapshot({ projectSpine: 'research-companion' }))).toBe(true);
  });

  it('is true when any XP was earned', () => {
    expect(hasStartedCourse(startSnapshot({ gamificationXp: 5 }))).toBe(true);
  });

  it('is true when slides were completed', () => {
    expect(hasStartedCourse(startSnapshot({ completedSlides: { '0': ['m0-1'] } }))).toBe(true);
  });

  it('is true when lessons were completed', () => {
    expect(hasStartedCourse(startSnapshot({ completedLessons: { '1': [0] } }))).toBe(true);
  });

  it('is true when a module was completed', () => {
    expect(hasStartedCourse(startSnapshot({ completedModules: ['1'] }))).toBe(true);
  });

  it('is true when the learner moved past the first slide', () => {
    expect(hasStartedCourse(startSnapshot({ activeSlideIndex: 1 }))).toBe(true);
  });

  it('is true when the active module is not the default', () => {
    expect(hasStartedCourse(startSnapshot({ activeModuleId: '1' }))).toBe(true);
  });
});
