import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { syncModuleProgress } from '@/actions/sync-progress';
import { createUserScopedStorage, markActiveUser } from '@/store/user-storage';

let syncQueue: Promise<void> = Promise.resolve();

const NOTES_STORAGE_NAME = 'aifoundations-notes';

export interface Note {
  id: string;
  moduleId: string;
  lessonIndex: number;
  slideIndex: number;
  content: string;
  updatedAt: string;
}

interface NotesState {
  userId: string | null;
  notes: Note[];
  saveNote: (moduleId: string, lessonIndex: number, slideIndex: number, content: string) => void;
  getNote: (moduleId: string, lessonIndex: number, slideIndex: number) => Note | undefined;
  clearAllNotes: () => void;
  clearUserStore: (newUserId: string | null) => void;
  syncToDB: (moduleId: string) => Promise<void>;
  syncFromDB: (dbNotes: Note[]) => void;
  flushSyncNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      userId: null,
      notes: [],
      saveNote: (moduleId, lessonIndex, slideIndex, content) => {
        set((state) => {
          const existingIndex = state.notes.findIndex(
            n => n.moduleId === moduleId && n.lessonIndex === lessonIndex && n.slideIndex === slideIndex
          );
          if (existingIndex >= 0) {
            const newNotes = [...state.notes];
            newNotes[existingIndex] = { ...newNotes[existingIndex], content, updatedAt: new Date().toISOString() };
            return { notes: newNotes };
          }
          return {
            notes: [...state.notes, { id: Math.random().toString(36).substring(7), moduleId, lessonIndex, slideIndex, content, updatedAt: new Date().toISOString() }]
          };
        });
        useNotesStore.getState().syncToDB(moduleId).catch(console.error);
      },
      getNote: (moduleId, lessonIndex, slideIndex) => {
        return get().notes.find(n => n.moduleId === moduleId && n.lessonIndex === lessonIndex && n.slideIndex === slideIndex);
      },
      clearAllNotes: () => {
        set({ notes: [] });
      },
      clearUserStore: (newUserId) => {
        const current = useNotesStore.getState();
        if (current.userId === newUserId && current.notes.length > 0) {
          // Auth events fire twice on mount (getUser + onAuthStateChange).
          // A re-emitted event for the current user must not wipe notes that
          // were freshly hydrated; they belong to this user's per-user key.
          markActiveUser(NOTES_STORAGE_NAME, newUserId);
          return;
        }
        set({ userId: newUserId, notes: [] });
        markActiveUser(NOTES_STORAGE_NAME, newUserId);
      },
      syncFromDB: (dbNotes) => {
        set((state) => {
          const mergedNotes = [...state.notes];
          dbNotes.forEach((dbNote) => {
            const existingIndex = mergedNotes.findIndex(
              n => n.moduleId === dbNote.moduleId && n.lessonIndex === dbNote.lessonIndex && n.slideIndex === dbNote.slideIndex
            );
            if (existingIndex >= 0) {
              if (new Date(dbNote.updatedAt) > new Date(mergedNotes[existingIndex].updatedAt)) {
                mergedNotes[existingIndex] = dbNote;
              }
            } else {
              mergedNotes.push(dbNote);
            }
          });
          return { notes: mergedNotes };
        });
      },
      syncToDB: async (moduleId: string) => {
        return new Promise<void>((resolve) => {
          syncQueue = syncQueue.then(async () => {
            const state = useNotesStore.getState();
            if (!state.userId) return resolve();
            
            const moduleNotes = state.notes.filter(n => n.moduleId === moduleId);
            if (moduleNotes.length === 0) return resolve();
            
            await syncModuleProgress(moduleId, { notes: moduleNotes });
            resolve();
          }).catch((err) => {
            console.error("Notes sync error:", err);
            resolve();
          });
        });
      },
      flushSyncNotes: async () => {
        const state = useNotesStore.getState();
        if (!state.userId) return;
        
        await syncQueue; // Wait for any pending syncs
        
        const moduleIds = Array.from(new Set(state.notes.map(n => n.moduleId)));
        await Promise.allSettled(
          moduleIds.map(id => state.syncToDB(id))
        );
        await syncQueue;
      }
    }),
    {
      name: NOTES_STORAGE_NAME,
      storage: createJSONStorage(() => createUserScopedStorage()),
      partialize: (state) => ({
        notes: state.notes,
        userId: state.userId,
      }),
    }
  )
);
