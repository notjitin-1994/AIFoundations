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

        const dbTimestamp = modProgress.updated_at ? new Date(modProgress.updated_at).getTime() : 0;
        const localTimestamp = new Date(lastUpdatedAtRef.current).getTime();

        // Conflict Resolution: Last-Write-Wins
        if (dbTimestamp > localTimestamp) {
          // DB is newer (user made progress on another device)
          // We hydrate the local store to match DB
          const newData: any = {};
          if (modProgress.completed && !completedModules.includes(moduleId)) {
            newData.completedModules = [...completedModules, moduleId];
          }
          newData.activeLessonIndex = modProgress.active_lesson_index ?? 0;
          newData.activeSlideIndex = modProgress.active_slide_index ?? 0;
          newData.lastUpdatedAt = modProgress.updated_at;
          
          syncFromDB(newData);
        } else if (localTimestamp > dbTimestamp) {
          // Local is newer. Force an immediate DB update.
          await syncModuleProgress(moduleId, {
            activeSlideIndex,
            activeLessonIndex,
            completed: completedModules.includes(moduleId),
            updated_at: lastUpdatedAtRef.current
          });
        }
      } catch (err) {
        console.error("Initial sync failed", err);
      }
    };

    performInitialSync();

    // Setup 60s heartbeat sync
    const interval = setInterval(() => {
      syncModuleProgress(moduleId, {
        activeSlideIndex: useProgressStore.getState().activeSlideIndex,
        activeLessonIndex: useProgressStore.getState().activeLessonIndex,
        completed: useProgressStore.getState().completedModules.includes(moduleId),
        updated_at: lastUpdatedAtRef.current
      }).catch(() => {});
    }, 60000);

    // Setup beforeunload sync
    const handleBeforeUnload = () => {
      // Use beacon API if possible, otherwise normal fetch
      // syncModuleProgress uses server actions which are just fetch calls under the hood.
      // We'll call it and not wait for the result.
      syncModuleProgress(moduleId, {
        activeSlideIndex: useProgressStore.getState().activeSlideIndex,
        activeLessonIndex: useProgressStore.getState().activeLessonIndex,
        completed: useProgressStore.getState().completedModules.includes(moduleId),
        updated_at: lastUpdatedAtRef.current
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
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleBeforeUnload);
    };
  }, [moduleId]); // Only run when moduleId changes (page mount)
}
