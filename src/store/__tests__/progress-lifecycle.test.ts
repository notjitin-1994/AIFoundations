import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/actions/sync-progress', () => ({
  syncModuleProgress: vi.fn(async () => ({ success: true })),
  logProgressEvent: vi.fn(async () => ({ success: true })),
}));

import { useProgressStore } from '@/store/progress';

describe('progress store lifecycle', () => {
  beforeEach(() => {
    useProgressStore.setState({
      userId: null,
      completedModules: [],
      completedLessons: {},
      completedSlides: {},
      projectSpine: null,
      projectSpineAnswers: {},
      assessments: {},
      activeLessonIndex: 0,
      activeSlideIndex: 0,
      totalSlidesInModule: 1,
      activeModuleId: '0',
      moduleProgressMap: {},
      gamification: {
        xp: 0,
        badges: [],
        toolsMastered: [],
        totalTimeSpentSeconds: 0,
        lastLoginDate: null,
        currentStreak: 0,
      },
      isEnrolled: false,
    });
  });

  it('syncFromDB keeps lastUpdatedAt when dbData omits it', () => {
    const before = useProgressStore.getState().lastUpdatedAt;

    useProgressStore.getState().syncFromDB({ completedModules: ['1'] });

    expect(useProgressStore.getState().completedModules).toEqual(['1']);
    expect(useProgressStore.getState().lastUpdatedAt).toBe(before);
  });

  it('syncFromDB adopts the DB-provided lastUpdatedAt', () => {
    useProgressStore.getState().syncFromDB({ lastUpdatedAt: '2026-01-01T00:00:00.000Z' });

    expect(useProgressStore.getState().lastUpdatedAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('clearUserStore keeps state for a re-emitted same-user auth event', () => {
    useProgressStore.getState().clearUserStore('u1');
    useProgressStore.getState().markModuleComplete('0');

    expect(useProgressStore.getState().completedModules).toContain('0');
    expect(useProgressStore.getState().gamification.xp).toBeGreaterThan(0);

    useProgressStore.getState().clearUserStore('u1');

    expect(useProgressStore.getState().userId).toBe('u1');
    expect(useProgressStore.getState().completedModules).toContain('0');
    expect(useProgressStore.getState().gamification.xp).toBeGreaterThan(0);
  });

  it('clearUserStore switches users to a fresh canvas without in-memory bleed', () => {
    useProgressStore.getState().clearUserStore('u1');
    useProgressStore.getState().markModuleComplete('0');

    useProgressStore.getState().clearUserStore('u2');

    expect(useProgressStore.getState().userId).toBe('u2');
    expect(useProgressStore.getState().completedModules).toEqual([]);
    expect(useProgressStore.getState().gamification.xp).toBe(0);
    expect(useProgressStore.getState().isEnrolled).toBe(false);
  });

  it('clearUserStore(null) resets to a guest canvas and drops enrollment', () => {
    useProgressStore.getState().clearUserStore('u1');
    useProgressStore.getState().setEnrolled(true);

    useProgressStore.getState().clearUserStore(null);

    expect(useProgressStore.getState().userId).toBeNull();
    expect(useProgressStore.getState().isEnrolled).toBe(false);
  });
});
