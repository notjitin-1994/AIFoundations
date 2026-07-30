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

export interface AssessmentState {
  questions?: any[];
  currentIdx: number;
  answers: Record<number, unknown>;
  graded?: Record<number, any>;
  submitted?: Record<number, boolean>;
  passed: boolean;
}

export interface GamificationState {
  xp: number;
  badges: string[];
  toolsMastered: string[];
  totalTimeSpentSeconds: number;
  lastLoginDate: string | null;
  currentStreak: number;
}

interface ProgressState {
  completedModules: string[];
  completedLessons: Record<string, number[]>;
  projectSpine: ProjectSpine;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  assessments: Record<string, AssessmentState>;
  activeLessonIndex: number;
  activeSlideIndex: number;
  totalSlidesInModule: number;
  activeModuleId: string;
  lastUpdatedAt: string; // ISO string representing the last local modification time
  
  // Gamification
  gamification: GamificationState;

  setProjectSpine: (spine: ProjectSpine) => void;
  saveProjectSpineAnswer: (moduleId: string, answerData: ProjectSpineAnswerData) => void;
  saveAssessmentState: (moduleId: string, state: AssessmentState) => void;
  markModuleComplete: (moduleId: string) => void;
  markLessonComplete: (moduleId: string, lessonIndex: number) => void;
  setActiveLessonIndex: (index: number) => void;
  setActiveSlideProgress: (slideIndex: number, totalSlides: number, moduleId?: string) => void;
  
  // Gamification Actions
  addXP: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  awardTool: (toolId: string) => void;
  updateTimeSpent: (seconds: number) => void;
  recordLogin: () => void;

  // Hydrates local state from DB if DB is newer
  syncFromDB: (dbData: Partial<ProgressState>) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedModules: [],
      completedLessons: {},
      projectSpine: null,
      projectSpineAnswers: {},
      assessments: {},
      activeLessonIndex: 0,
      activeSlideIndex: 0,
      totalSlidesInModule: 1,
      activeModuleId: '0',
      lastUpdatedAt: new Date().toISOString(),
      gamification: {
        xp: 0,
        badges: [],
        toolsMastered: [],
        totalTimeSpentSeconds: 0,
        lastLoginDate: null,
        currentStreak: 0,
      },

      setProjectSpine: (spine) => set({ projectSpine: spine, lastUpdatedAt: new Date().toISOString() }),
      
      saveProjectSpineAnswer: (moduleId, answerData) => 
        set((state) => ({
          projectSpineAnswers: {
            ...state.projectSpineAnswers,
            [moduleId]: answerData
          },
          lastUpdatedAt: new Date().toISOString()
        })),
        
      saveAssessmentState: (moduleId, stateData) =>
        set((state) => {
          // If the assessment is newly passed, give XP
          let xpEarned = 0;
          let newBadges = [...state.gamification.badges];
          
          const oldState = state.assessments[moduleId];
          if (!oldState?.passed && stateData.passed) {
            xpEarned = 50; // 50 XP for passing an assessment
            
            // Check if perfect score
            const isPerfect = Object.values(stateData.graded || {}).every((v) => v === true);
            if (isPerfect && !newBadges.includes("perfect-score")) {
              newBadges.push("perfect-score");
              xpEarned += 50; // Bonus for perfect score
            }
          }
          
          return {
            assessments: {
              ...state.assessments,
              [moduleId]: stateData
            },
            gamification: {
              ...state.gamification,
              xp: state.gamification.xp + xpEarned,
              badges: newBadges
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      markModuleComplete: (moduleId) =>
        set((state) => {
          if (state.completedModules.includes(moduleId)) return state;
          
          // Auto-award badges and tools based on module completion
          let newTools = [...state.gamification.toolsMastered];
          let newBadges = [...state.gamification.badges];
          let xpEarned = 100; // 100 XP for completing a module
          
          if (moduleId === "0" && !newBadges.includes("first-steps")) newBadges.push("first-steps");
          if (moduleId === "2" && !newBadges.includes("prompt-eng")) newBadges.push("prompt-eng");
          if (moduleId === "3" && !newBadges.includes("tool-builder")) {
            newBadges.push("tool-builder");
            if (!newTools.includes("RAG")) newTools.push("RAG");
            if (!newTools.includes("Vector DB")) newTools.push("Vector DB");
          }
          if (moduleId === "4" && !newBadges.includes("agent-master")) {
            newBadges.push("agent-master");
            if (!newTools.includes("Agents")) newTools.push("Agents");
            if (!newTools.includes("LangChain")) newTools.push("LangChain");
          }
          if (moduleId === "5") {
            if (!newTools.includes("FastAPI")) newTools.push("FastAPI");
            if (!newTools.includes("Deployment")) newTools.push("Deployment");
          }
          if (moduleId === "6" && !newBadges.includes("certified")) newBadges.push("certified");

          return {
            completedModules: [...state.completedModules, moduleId],
            gamification: {
              ...state.gamification,
              badges: newBadges,
              toolsMastered: newTools,
              xp: state.gamification.xp + xpEarned
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      markLessonComplete: (moduleId, lessonIndex) =>
        set((state) => {
          const modLessons = state.completedLessons[moduleId] || [];
          if (modLessons.includes(lessonIndex)) return state;
          return {
            completedLessons: {
              ...state.completedLessons,
              [moduleId]: [...modLessons, lessonIndex]
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      setActiveLessonIndex: (index) => set({ activeLessonIndex: index, lastUpdatedAt: new Date().toISOString() }),

      setActiveSlideProgress: (slideIndex, totalSlides, moduleId) => 
        set(() => ({ 
          activeSlideIndex: slideIndex, 
          totalSlidesInModule: totalSlides,
          ...(moduleId ? { activeModuleId: moduleId } : {}),
          lastUpdatedAt: new Date().toISOString()
        })),

      addXP: (amount) => 
        set((state) => ({
          gamification: { ...state.gamification, xp: state.gamification.xp + amount },
          lastUpdatedAt: new Date().toISOString()
        })),

      awardBadge: (badgeId) => 
        set((state) => {
          if (state.gamification.badges.includes(badgeId)) return state;
          return {
            gamification: { ...state.gamification, badges: [...state.gamification.badges, badgeId] },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      awardTool: (toolId) => 
        set((state) => {
          if (state.gamification.toolsMastered.includes(toolId)) return state;
          return {
            gamification: { ...state.gamification, toolsMastered: [...state.gamification.toolsMastered, toolId] },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      updateTimeSpent: (seconds) => 
        set((state) => ({
          gamification: { ...state.gamification, totalTimeSpentSeconds: state.gamification.totalTimeSpentSeconds + seconds },
          lastUpdatedAt: new Date().toISOString()
        })),

      recordLogin: () => 
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastDate = state.gamification.lastLoginDate;
          
          if (lastDate === today) return state; // Already logged in today
          
          let newStreak = state.gamification.currentStreak;
          if (lastDate) {
            const last = new Date(lastDate);
            const current = new Date(today);
            const diffTime = Math.abs(current.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1; // reset streak
            }
          } else {
            newStreak = 1;
          }
          
          return {
            gamification: { ...state.gamification, lastLoginDate: today, currentStreak: newStreak },
            lastUpdatedAt: new Date().toISOString()
          };
        }),
        
      syncFromDB: (dbData) => 
        set((state) => ({
          ...state,
          ...dbData,
        })),

      resetProgress: () =>
        set(() => ({
          completedModules: [],
          completedLessons: {},
          projectSpine: null,
          projectSpineAnswers: {},
          assessments: {},
          activeLessonIndex: 0,
          activeSlideIndex: 0,
          totalSlidesInModule: 1,
          activeModuleId: '0',
          lastUpdatedAt: new Date().toISOString()
        })),
    }),
    {
      name: 'aifoundations-progress', // name of the item in the storage (must be unique)
      partialize: (state) => ({
        completedModules: state.completedModules,
        completedLessons: state.completedLessons,
        projectSpine: state.projectSpine,
        projectSpineAnswers: state.projectSpineAnswers,
        assessments: state.assessments,
        lastUpdatedAt: state.lastUpdatedAt,
        gamification: state.gamification,
      }),
    }
  )
);
