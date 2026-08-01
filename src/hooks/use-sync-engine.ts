import { useEffect, useRef, useState } from 'react';
import { useProgressStore } from '@/store/progress';
import { useNotesStore } from '@/store/notes';
import { fetchModuleProgress } from '@/actions/sync-progress';
import { mergeRemoteProgress } from '@/lib/progress-merge';
import type { ModuleProgressRow } from '@/lib/progress-merge';

/**
 * useSyncEngine implements a Last-Write-Wins (LWW) local-first persistence strategy.
 *
 * Flow:
 * 1. On mount and on auth change: Checks database for newer progress. If DB is newer, it hydrates the local store.
 *    If local is newer, it immediately pushes to the DB.
 * 2. Background heartbeat: Every 30s, it silently pushes the latest local state to the DB.
 * 3. Before Unload: Attempts a final synchronous-like push when the user leaves the tab.
 */
export function useSyncEngine(moduleId: string) {
  const [isSynced, setIsSynced] = useState(false);
  const {
    lastUpdatedAt,
    syncFromDB,
    userId,
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
        if (cancelled) return;
        if (!dbProgress) {
          setIsSynced(true);
          return;
        }

        const state = useProgressStore.getState();
        const merged = mergeRemoteProgress(
          {
            completedModules: state.completedModules,
            completedLessons: state.completedLessons,
            completedSlides: state.completedSlides,
            moduleProgressMap: state.moduleProgressMap,
            assessments: state.assessments,
            projectSpine: state.projectSpine,
            projectSpineAnswers: state.projectSpineAnswers,
            gamification: state.gamification,
            activeLessonIndex: state.activeLessonIndex,
            activeSlideIndex: state.activeSlideIndex,
            lastUpdatedAt: state.lastUpdatedAt,
          },
          dbProgress,
          moduleId
        );

        const dbRows = dbProgress as ModuleProgressRow[];
        dbRows.forEach((row) => {
          if (row.notes && Array.isArray(row.notes)) {
            useNotesStore.getState().syncFromDB(row.notes);
          }
        });

        syncFromDB(merged);
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
  }, [moduleId, syncFromDB, userId]); // Re-run on auth change so login hydrates without a reload

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
