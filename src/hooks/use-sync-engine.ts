import { useEffect, useRef, useState } from 'react';
import { useProgressStore } from '@/store/progress';
import { useNotesStore } from '@/store/notes';
import { fetchModuleProgress } from '@/actions/sync-progress';

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
  const [isSynced, setIsSynced] = useState(false);
  const { 
    lastUpdatedAt, 
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

        // DB is the absolute source of truth. We merge ALL rows to fully hydrate the store.
        const currentState = useProgressStore.getState();
        const newData: Record<string, unknown> = {};
        
        const newCompleted = [...currentState.completedModules];
        const newMap = { ...currentState.moduleProgressMap };
        let mergedAssessments = { ...currentState.assessments };
        let mergedSpine = currentState.projectSpine;
        let mergedSpineAnswers = { ...currentState.projectSpineAnswers };
        let mergedGamification = { ...currentState.gamification };
        let mergedCompletedLessons = { ...currentState.completedLessons };
        const mergedCompletedSlides = { ...currentState.completedSlides };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbProgress.forEach((p: any) => {
          if (p.completed && !newCompleted.includes(p.module_id)) {
            newCompleted.push(p.module_id);
          }
          
          const existingMapEntry = newMap[p.module_id];
          newMap[p.module_id] = {
            activeSlideIndex: Math.max(p.active_slide_index || 0, existingMapEntry?.activeSlideIndex || 0),
            activeLessonIndex: Math.max(p.active_lesson_index || 0, existingMapEntry?.activeLessonIndex || 0),
            totalSlidesInModule: existingMapEntry?.totalSlidesInModule || 1, // Will be updated by CanvasViewer
            completed: !!p.completed || !!existingMapEntry?.completed
          };
          
          if (p.assessments) {
            mergedAssessments = { ...mergedAssessments, ...p.assessments };
          }
          if (p.project_spine) {
            mergedSpine = p.project_spine;
          }
          if (p.project_spine_answers) {
            mergedSpineAnswers = { ...mergedSpineAnswers, ...p.project_spine_answers };
          }
          if (p.gamification) {
            if (p.gamification.xp > mergedGamification.xp) {
              mergedGamification = p.gamification;
            }
          }
          if (p.completed_lessons) {
            mergedCompletedLessons = { ...mergedCompletedLessons, ...p.completed_lessons };
          }
          if (p.completed_slides) {
            Object.keys(p.completed_slides).forEach(modId => {
              const local = mergedCompletedSlides[modId] || [];
              const remote = p.completed_slides[modId] || [];
              mergedCompletedSlides[modId] = Array.from(new Set([...local, ...remote]));
            });
          }
          
          if (p.notes && Array.isArray(p.notes)) {
             useNotesStore.getState().syncFromDB(p.notes);
          }
        });
        
        newData.completedModules = newCompleted;
        newData.moduleProgressMap = newMap;
        newData.assessments = mergedAssessments;
        newData.projectSpine = mergedSpine;
        newData.projectSpineAnswers = mergedSpineAnswers;
        newData.gamification = mergedGamification;
        newData.completedLessons = mergedCompletedLessons;
        newData.completedSlides = mergedCompletedSlides;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentMod = dbProgress.find((p: any) => p.module_id === moduleId);
        if (currentMod) {
          newData.activeLessonIndex = Math.max(currentMod.active_lesson_index ?? 0, currentState.activeLessonIndex);
          newData.activeSlideIndex = Math.max(currentMod.active_slide_index ?? 0, currentState.activeSlideIndex);
        }
        syncFromDB(newData);
        setIsSynced(true);
      } catch (err) {
        console.error("Initial sync failed", err);
        setIsSynced(true);
      }
    };
    performInitialSync();

    return () => {
      cancelled = true;
    };
  }, [moduleId, syncFromDB]); // Only run when moduleId changes (page mount)

  // Background heartbeat & beforeunload sync
  useEffect(() => {
    if (!moduleId || moduleId === 'unknown') return;

    // Heartbeat every 30s to sync active module
    const intervalId = setInterval(() => {
      useProgressStore.getState().syncToDB(moduleId).catch(console.error);
    }, 30000);

    const handleBeforeUnload = () => {
      // Synchronous-like fire-and-forget push
      useProgressStore.getState().syncToDB(moduleId).catch(console.error);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [moduleId]);

  return { isSynced };
}
