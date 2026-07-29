import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectSpineType = string | null;
type ProjectSpine = ProjectSpineType;

export interface ProjectSpineAnswerData {
  rolePrompt?: string;
  taskPrompt?: string;
  contextPrompt?: string;
  constraintPrompt?: string;
  tempChoice?: string | null;
  hallucinationNote?: string;
  agentsMd?: string;
  mcps?: string;
  tools?: string;
  skills?: string;
}

interface ProgressState {
  completedModules: string[];
  completedLessons: Record<string, number[]>;
  projectSpine: ProjectSpine;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  activeLessonIndex: number;
  activeSlideIndex: number;
  totalSlidesInModule: number;
  activeModuleId: string;
  setProjectSpine: (spine: ProjectSpine) => void;
  saveProjectSpineAnswer: (moduleId: string, answerData: ProjectSpineAnswerData) => void;
  markModuleComplete: (moduleId: string) => void;
  markLessonComplete: (moduleId: string, lessonIndex: number) => void;
  setActiveLessonIndex: (index: number) => void;
  setActiveSlideProgress: (slideIndex: number, totalSlides: number, moduleId?: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedModules: [],
      completedLessons: {},
      projectSpine: null,
      projectSpineAnswers: {},
      activeLessonIndex: 0,
      activeSlideIndex: 0,
      totalSlidesInModule: 1,
      activeModuleId: '0',
      setProjectSpine: (spine) => set({ projectSpine: spine }),
      saveProjectSpineAnswer: (moduleId, answerData) => 
        set((state) => ({
          projectSpineAnswers: {
            ...state.projectSpineAnswers,
            [moduleId]: answerData
          }
        })),
      markModuleComplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),
      markLessonComplete: (moduleId, lessonIndex) =>
        set((state) => {
          const modLessons = state.completedLessons[moduleId] || [];
          if (modLessons.includes(lessonIndex)) return state;
          return {
            completedLessons: {
              ...state.completedLessons,
              [moduleId]: [...modLessons, lessonIndex]
            }
          };
        }),
      setActiveLessonIndex: (index) => set({ activeLessonIndex: index }),
      setActiveSlideProgress: (slideIndex, totalSlides, moduleId) => 
        set(() => ({ 
          activeSlideIndex: slideIndex, 
          totalSlidesInModule: totalSlides,
          ...(moduleId ? { activeModuleId: moduleId } : {})
        })),
      resetProgress: () =>
        set(() => ({
          completedModules: [],
          completedLessons: {},
          projectSpine: null,
          projectSpineAnswers: {},
          activeLessonIndex: 0,
          activeSlideIndex: 0,
          totalSlidesInModule: 1,
          activeModuleId: '0'
        })),
    }),
    {
      name: 'aifoundations-progress', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        completedModules: state.completedModules,
        completedLessons: state.completedLessons,
        projectSpine: state.projectSpine,
        projectSpineAnswers: state.projectSpineAnswers,
      }),
    }
  )
);
