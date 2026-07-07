import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProjectSpine = 'research_companion' | 'content_engine' | 'creative_studio' | null;

interface ProgressState {
  completedModules: string[];
  projectSpine: ProjectSpine;
  activeLessonIndex: number;
  activeSlideIndex: number;
  totalSlidesInModule: number;
  activeModuleId: string;
  setProjectSpine: (spine: ProjectSpine) => void;
  markModuleComplete: (moduleId: string) => void;
  setActiveLessonIndex: (index: number) => void;
  setActiveSlideProgress: (slideIndex: number, totalSlides: number, moduleId?: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedModules: [],
      projectSpine: null,
      activeLessonIndex: 0,
      activeSlideIndex: 0,
      totalSlidesInModule: 1,
      activeModuleId: '0',
      setProjectSpine: (spine) => set({ projectSpine: spine }),
      markModuleComplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),
      setActiveLessonIndex: (index) => set({ activeLessonIndex: index }),
      setActiveSlideProgress: (slideIndex, totalSlides, moduleId) => 
        set((state) => ({ 
          activeSlideIndex: slideIndex, 
          totalSlidesInModule: totalSlides,
          ...(moduleId ? { activeModuleId: moduleId } : {})
        })),
    }),
    {
      name: 'aifoundations-progress', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        completedModules: state.completedModules,
        projectSpine: state.projectSpine,
      }),
    }
  )
);
