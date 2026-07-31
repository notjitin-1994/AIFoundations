import { useEffect, useRef } from 'react';
import { useProgressStore } from '@/store/progress';
import { syncModuleProgress, fetchModuleProgress } from '@/actions/sync-progress';

/**
 * useSyncEngine implements a Last-Write-Wins (LWW) local-first persistence strategy.
 * 
 * Flow:
 * 1. On mount: Checks database for newer progress. If DB is newer, it hydrates the local store.
 *    If local is newer, it immediately pushes to the DB.
 * 2. Background heartbeat: Every 60s, it silently pushes the latest local state to the DB.
 * 3. Before Unload: Attempts a final synchronous-like push when the user leaves the tab.
 */
export function useSyncEngine(moduleId: string) {
  const { 
    lastUpdatedAt, 
    activeSlideIndex, 
    activeLessonIndex, 
    completedModules, 
    syncFromDB 
  } = useProgressStore();
  
  const lastUpdatedAtRef = useRef(lastUpdatedAt);
  
  // Keep ref in sync for interval closures
  useEffect(() => {
    lastUpdatedAtRef.current = lastUpdatedAt;
  }, [lastUpdatedAt]);

  useEffect(() => {
    if (!moduleId || moduleId === 'unknown') return;
    
    let cancelled = false;

    const performInitialSync = async () => {
      try {
        const dbProgress = await fetchModuleProgress();
        if (cancelled || !dbProgress) return;

        const modProgress = dbProgress.find((p: any) => p.module_id === moduleId);
        if (!modProgress) return;

        // DB is the absolute source of truth
        const newData: any = {};
        if (modProgress.completed && !completedModules.includes(moduleId)) {
          newData.completedModules = [...completedModules, moduleId];
        }
        newData.activeLessonIndex = modProgress.active_lesson_index ?? 0;
        newData.activeSlideIndex = modProgress.active_slide_index ?? 0;
        if (modProgress.assessments) newData.assessments = { ...useProgressStore.getState().assessments, ...modProgress.assessments };
        if (modProgress.project_spine) newData.projectSpine = modProgress.project_spine;
        if (modProgress.project_spine_answers) newData.projectSpineAnswers = { ...useProgressStore.getState().projectSpineAnswers, ...modProgress.project_spine_answers };
        if (modProgress.gamification) {
          if (modProgress.gamification.xp > useProgressStore.getState().gamification.xp) {
            newData.gamification = modProgress.gamification;
          }
        }
        if (modProgress.completed_lessons) newData.completedLessons = { ...useProgressStore.getState().completedLessons, ...modProgress.completed_lessons };
        if (modProgress.completed_slides) newData.completedSlides = { ...useProgressStore.getState().completedSlides, ...modProgress.completed_slides };
        
        syncFromDB(newData);
      } catch (err) {
        console.error("Initial sync failed", err);
      }
    };
    performInitialSync();

    // Subscribe to all changes in the store to sync them to the DB
    let debounceTimer: NodeJS.Timeout;
    const unsubscribe = useProgressStore.subscribe((state, prevState) => {
      if (state.lastUpdatedAt !== prevState.lastUpdatedAt) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          syncModuleProgress(moduleId, {
            activeSlideIndex: state.activeSlideIndex,
            activeLessonIndex: state.activeLessonIndex,
            completed: state.completedModules.includes(moduleId),
            updated_at: state.lastUpdatedAt,
            assessments: state.assessments,
            projectSpine: state.projectSpine,
            projectSpineAnswers: state.projectSpineAnswers,
            gamification: state.gamification,
            completedLessons: state.completedLessons,
            completedSlides: state.completedSlides
          }).catch(() => {});
        }, 1000); // 1s debounce
      }
    });

    // Setup beforeunload sync
    const handleBeforeUnload = () => {
      syncModuleProgress(moduleId, {
        activeSlideIndex: useProgressStore.getState().activeSlideIndex,
        activeLessonIndex: useProgressStore.getState().activeLessonIndex,
        completed: useProgressStore.getState().completedModules.includes(moduleId),
        updated_at: lastUpdatedAtRef.current,
        assessments: useProgressStore.getState().assessments,
        projectSpine: useProgressStore.getState().projectSpine,
        projectSpineAnswers: useProgressStore.getState().projectSpineAnswers,
        gamification: useProgressStore.getState().gamification,
        completedLessons: useProgressStore.getState().completedLessons,
        completedSlides: useProgressStore.getState().completedSlides
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleBeforeUnload);
    };
  }, [moduleId]); // Only run when moduleId changes (page mount)
}
