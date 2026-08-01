import type { AssessmentState, GamificationState, ProjectSpineAnswerData } from '@/store/progress';

export interface ModuleProgressRow {
  module_id: string;
  active_slide_index?: number | null;
  active_lesson_index?: number | null;
  completed?: boolean;
  updated_at?: string | null;
  assessments?: Record<string, AssessmentState>;
  project_spine?: string | null;
  project_spine_answers?: Record<string, ProjectSpineAnswerData>;
  gamification?: GamificationState;
  completed_lessons?: Record<string, number[]>;
  completed_slides?: Record<string, string[]>;
  notes?: unknown;
}

export interface ModuleMapEntry {
  activeSlideIndex: number;
  activeLessonIndex: number;
  totalSlidesInModule: number;
  completed: boolean;
}

export interface LocalProgressSnapshot {
  completedModules: string[];
  completedLessons: Record<string, number[]>;
  completedSlides: Record<string, string[]>;
  moduleProgressMap: Record<string, ModuleMapEntry>;
  assessments: Record<string, AssessmentState>;
  projectSpine: string | null;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  gamification: GamificationState;
  activeLessonIndex: number;
  activeSlideIndex: number;
  lastUpdatedAt: string;
}

export type MergedProgress = LocalProgressSnapshot;

function unionLessons(local: number[] | undefined, remote: number[] | undefined): number[] {
  const combined = [...(local ?? []), ...(remote ?? [])];
  return Array.from(new Set(combined)).sort((a, b) => a - b);
}

function unionSlides(local: string[] | undefined, remote: string[] | undefined): string[] {
  return Array.from(new Set([...(local ?? []), ...(remote ?? [])]));
}

export function lwwResolve<T>(
  local: T | undefined,
  remote: T | undefined,
  localUpdatedAt: string,
  remoteUpdatedAt: string | null | undefined
): T | undefined {
  if (local === undefined) return remote;
  if (remote === undefined) return local;
  const remoteTs = remoteUpdatedAt ?? '';
  if (remoteTs > localUpdatedAt) return remote;
  if (localUpdatedAt > remoteTs) return local;
  return remote;
}

export function mergeRemoteProgress(
  local: LocalProgressSnapshot,
  rows: ModuleProgressRow[],
  activeModuleId: string
): MergedProgress {
  const merged: MergedProgress = {
    completedModules: [...local.completedModules],
    completedLessons: { ...local.completedLessons },
    completedSlides: { ...local.completedSlides },
    moduleProgressMap: { ...local.moduleProgressMap },
    assessments: { ...local.assessments },
    projectSpine: local.projectSpine,
    projectSpineAnswers: { ...local.projectSpineAnswers },
    gamification: { ...local.gamification },
    activeLessonIndex: local.activeLessonIndex,
    activeSlideIndex: local.activeSlideIndex,
    lastUpdatedAt: local.lastUpdatedAt,
  };

  let latestUpdatedAt = local.lastUpdatedAt;

  rows.forEach((row) => {
    if (row.updated_at && row.updated_at > latestUpdatedAt) {
      latestUpdatedAt = row.updated_at;
    }

    if (row.completed && !merged.completedModules.includes(row.module_id)) {
      merged.completedModules.push(row.module_id);
    }

    if (row.completed_lessons) {
      Object.keys(row.completed_lessons).forEach((modId) => {
        merged.completedLessons[modId] = unionLessons(
          merged.completedLessons[modId],
          row.completed_lessons?.[modId]
        );
      });
    }

    if (row.completed_slides) {
      Object.keys(row.completed_slides).forEach((modId) => {
        merged.completedSlides[modId] = unionSlides(
          merged.completedSlides[modId],
          row.completed_slides?.[modId]
        );
      });
    }

    if (row.assessments) {
      merged.assessments = { ...merged.assessments, ...row.assessments };
    }
    if (row.project_spine != null) {
      merged.projectSpine = row.project_spine;
    }
    if (row.project_spine_answers) {
      merged.projectSpineAnswers = { ...merged.projectSpineAnswers, ...row.project_spine_answers };
    }
    if (row.gamification && row.gamification.xp > merged.gamification.xp) {
      merged.gamification = { ...row.gamification };
    }

    const existing = local.moduleProgressMap[row.module_id];
    merged.moduleProgressMap[row.module_id] = {
      activeSlideIndex:
        lwwResolve(existing?.activeSlideIndex, row.active_slide_index ?? undefined, local.lastUpdatedAt, row.updated_at) ?? 0,
      activeLessonIndex:
        lwwResolve(existing?.activeLessonIndex, row.active_lesson_index ?? undefined, local.lastUpdatedAt, row.updated_at) ?? 0,
      totalSlidesInModule: existing?.totalSlidesInModule || 1,
      completed: !!row.completed || !!existing?.completed,
    };
  });

  const currentRow = rows.find((row) => row.module_id === activeModuleId);
  if (currentRow) {
    merged.activeSlideIndex =
      lwwResolve(local.activeSlideIndex, currentRow.active_slide_index ?? undefined, local.lastUpdatedAt, currentRow.updated_at) ??
      local.activeSlideIndex;
    merged.activeLessonIndex =
      lwwResolve(local.activeLessonIndex, currentRow.active_lesson_index ?? undefined, local.lastUpdatedAt, currentRow.updated_at) ??
      local.activeLessonIndex;
  }

  merged.lastUpdatedAt = latestUpdatedAt;
  return merged;
}
