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
  completed?: boolean;
}

export interface AssessmentState {
  questions?: unknown[];
  currentIdx: number;
  answers: Record<number, unknown>;
  graded?: Record<number, unknown>;
  submitted?: Record<number, boolean>;
  passed: boolean;
  incorrectAttempts?: Record<number, number>;
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
  completedSlides: Record<string, string[]>;
  projectSpine: ProjectSpine;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  assessments: Record<string, AssessmentState>;
  activeLessonIndex: number;
  activeSlideIndex: number;
  totalSlidesInModule: number;
  activeModuleId: string;
  moduleProgressMap: Record<string, { activeSlideIndex: number, totalSlidesInModule: number, completed: boolean }>;
  lastUpdatedAt: string; // ISO string representing the last local modification time
  
  // Gamification
  gamification: GamificationState;

  isEnrolled: boolean;
  userId: string | null;

  setProjectSpine: (spine: ProjectSpine) => void;
  saveProjectSpineAnswer: (moduleId: string, answerData: ProjectSpineAnswerData) => void;
  saveAssessmentState: (moduleId: string, state: AssessmentState) => void;
  markModuleComplete: (moduleId: string) => void;
  markLessonComplete: (moduleId: string, lessonIndex: number) => void;
  markSlideComplete: (moduleId: string, slideId: string) => void;
  setActiveLessonIndex: (index: number) => void;
  setActiveSlideProgress: (slideIndex: number, totalSlides: number, moduleId?: string) => void;
  setModuleProgressMap: (map: Record<string, { activeSlideIndex: number, totalSlidesInModule: number, completed: boolean }>) => void;
  
  // Gamification Actions
  addXP: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  awardTool: (toolId: string) => void;
  updateTimeSpent: (seconds: number) => void;
  recordLogin: () => void;

  // Hydrates local state from DB if DB is newer
  syncFromDB: (dbData: Partial<ProgressState>) => void;
  resetProgress: () => void;
  setEnrolled: (status: boolean) => void;
  clearUserStore: (newUserId: string | null) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      userId: null,
      completedModules: [],
      completedLessons: {},
      completedSlides: {},
      projectSpine: null,
      projectSpineAnswers: {},
      assessments: {},
      activeLessonIndex: 0,
      activeSlideIndex: 0,
      totalSlidesInModule: 1,
      activeModuleId: '0',
      moduleProgressMap: {},
      lastUpdatedAt: new Date().toISOString(),
      gamification: {
        xp: 0,
        badges: [],
        toolsMastered: [],
        totalTimeSpentSeconds: 0,
        lastLoginDate: null,
        currentStreak: 0,
      },
      isEnrolled: false,

      setProjectSpine: (spine) => set({ projectSpine: spine, lastUpdatedAt: new Date().toISOString() }),
      
      saveProjectSpineAnswer: (moduleId, answerData) => 
        set((state) => ({
          projectSpineAnswers: {
            ...state.projectSpineAnswers,
            [moduleId]: answerData
          },
          gamification: {
            ...state.gamification,
            xp: state.gamification.xp + 30 // 30 XP for submitting deliverables
          },
          lastUpdatedAt: new Date().toISOString()
        })),
        
      saveAssessmentState: (moduleId, stateData) =>
        set((state) => {
          // If the assessment is newly passed, give XP
          let xpEarned = 0;
          const newBadges = [...state.gamification.badges];
          
          const oldState = state.assessments[moduleId];
          if (!oldState?.passed && stateData.passed) {
            xpEarned = 50; // 50 XP for passing an assessment
            
            // Check if perfect score
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isPerfect = Object.values(stateData.graded || {}).every((v: any) => v?.correct === true);
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
          const newTools = [...state.gamification.toolsMastered];
          const newBadges = [...state.gamification.badges];
          let xpEarned = 100; // 100 XP for completing a module
          
          if (moduleId === "0" && !newBadges.includes("first-steps")) {
            newBadges.push("first-steps");
            xpEarned += 50;
          }
          if (moduleId === "2" && !newBadges.includes("prompt-eng")) {
            newBadges.push("prompt-eng");
            xpEarned += 50;
          }
          if (moduleId === "3" && !newBadges.includes("tool-builder")) {
            newBadges.push("tool-builder");
            xpEarned += 50;
            if (!newTools.includes("RAG")) { newTools.push("RAG"); xpEarned += 20; }
            if (!newTools.includes("Vector DB")) { newTools.push("Vector DB"); xpEarned += 20; }
          }
          if (moduleId === "4" && !newBadges.includes("agent-master")) {
            newBadges.push("agent-master");
            xpEarned += 50;
            if (!newTools.includes("Agents")) { newTools.push("Agents"); xpEarned += 20; }
            if (!newTools.includes("LangChain")) { newTools.push("LangChain"); xpEarned += 20; }
          }
          if (moduleId === "5") {
            if (!newTools.includes("FastAPI")) { newTools.push("FastAPI"); xpEarned += 20; }
            if (!newTools.includes("Deployment")) { newTools.push("Deployment"); xpEarned += 20; }
          }
          if (moduleId === "6" && !newBadges.includes("certified")) {
            newBadges.push("certified");
            xpEarned += 200; // Massive XP for certification
          }

          return {
            completedModules: [...state.completedModules, moduleId],
            moduleProgressMap: {
              ...state.moduleProgressMap,
              [moduleId]: {
                ...state.moduleProgressMap[moduleId],
                completed: true
              }
            },
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
            gamification: {
              ...state.gamification,
              xp: state.gamification.xp + 20 // 20 XP for completing a lesson
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      markSlideComplete: (moduleId, slideId) =>
        set((state) => {
          const modSlides = state.completedSlides[moduleId] || [];
          if (modSlides.includes(slideId)) return state;
          return {
            completedSlides: {
              ...state.completedSlides,
              [moduleId]: [...modSlides, slideId]
            },
            gamification: {
              ...state.gamification,
              xp: state.gamification.xp + 5 // 5 XP for completing a slide
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      setActiveLessonIndex: (index) => set({ activeLessonIndex: index, lastUpdatedAt: new Date().toISOString() }),

      setActiveSlideProgress: (slideIndex, totalSlides, moduleId) => 
        set((state) => ({ 
          activeSlideIndex: slideIndex, 
          totalSlidesInModule: totalSlides,
          ...(moduleId ? { activeModuleId: moduleId } : {}),
          ...(moduleId ? {
            moduleProgressMap: {
              ...state.moduleProgressMap,
              [moduleId]: {
                activeSlideIndex: slideIndex,
                totalSlidesInModule: totalSlides,
                completed: state.completedModules.includes(moduleId)
              }
            }
          } : {}),
          lastUpdatedAt: new Date().toISOString()
        })),

      setModuleProgressMap: (map) => set({ moduleProgressMap: map, lastUpdatedAt: new Date().toISOString() }),

      addXP: (amount) => 
        set((state) => ({
          gamification: { ...state.gamification, xp: state.gamification.xp + amount },
          lastUpdatedAt: new Date().toISOString()
        })),

      awardBadge: (badgeId) => 
        set((state) => {
          if (state.gamification.badges.includes(badgeId)) return state;
          return {
            gamification: { 
              ...state.gamification, 
              badges: [...state.gamification.badges, badgeId],
              xp: state.gamification.xp + 50 // 50 XP for earning a badge
            },
            lastUpdatedAt: new Date().toISOString()
          };
        }),

      awardTool: (toolId) => 
        set((state) => {
          if (state.gamification.toolsMastered.includes(toolId)) return state;
          return {
            gamification: { 
              ...state.gamification, 
              toolsMastered: [...state.gamification.toolsMastered, toolId],
              xp: state.gamification.xp + 20 // 20 XP for mastering a tool
            },
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

      resetProgress: () => set((state) => ({ 
        completedModules: [], 
        completedLessons: {},
        completedSlides: {},
        projectSpine: null,
        projectSpineAnswers: {},
        assessments: {},
        activeLessonIndex: 0,
        activeSlideIndex: 0,
        totalSlidesInModule: 1,
        activeModuleId: '0',
        moduleProgressMap: {},
        gamification: {
          xp: 0,
          badges: [],
          toolsMastered: [],
          totalTimeSpentSeconds: 0,
          lastLoginDate: null,
          currentStreak: 0,
        },
        lastUpdatedAt: new Date().toISOString(),
        isEnrolled: state.isEnrolled
      })),
      setEnrolled: (status) =>
        set(() => ({
          isEnrolled: status,
          lastUpdatedAt: new Date().toISOString()
        })),
      clearUserStore: (newUserId) =>
        set(() => ({
          userId: newUserId,
          completedModules: [],
          completedLessons: {},
          projectSpine: null,
          projectSpineAnswers: {},
          assessments: {},
          activeLessonIndex: 0,
          activeSlideIndex: 0,
          totalSlidesInModule: 1,
          activeModuleId: '0',
          moduleProgressMap: {},
          gamification: {
            xp: 0,
            badges: [],
            toolsMastered: [],
            totalTimeSpentSeconds: 0,
            lastLoginDate: null,
            currentStreak: 0,
          },
          lastUpdatedAt: new Date().toISOString(),
          isEnrolled: false
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
        isEnrolled: state.isEnrolled,
        userId: state.userId,
      }),
    }
  )
);
