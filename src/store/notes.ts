import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      },
      getNote: (moduleId, lessonIndex, slideIndex) => {
        return get().notes.find(n => n.moduleId === moduleId && n.lessonIndex === lessonIndex && n.slideIndex === slideIndex);
      },
      clearAllNotes: () => {
        set({ notes: [] });
      },
      clearUserStore: (newUserId) => {
        set({ userId: newUserId, notes: [] });
      }
    }),
    {
      name: 'aifoundations-notes',
      partialize: (state) => ({
        notes: state.notes,
        userId: state.userId,
      }),
    }
  )
);
