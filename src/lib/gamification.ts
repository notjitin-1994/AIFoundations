"use client";

import {
  Star, Brain, Database, Wrench, Network, Cpu, Trophy, Target, Code, Beaker, Server,
  Sparkles, CheckCircle2, Activity, Flame, Zap, GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GamificationState, AssessmentState, ProjectSpineAnswerData } from "@/store/progress";

// Single source of truth for the Skill Constellation badge grid. Every badge has
// exactly one deterministic unlock predicate, so the displayed count always equals
// the badges actually earned — no double counting, no invisible grants.

export type BadgeTier = "bronze" | "silver" | "gold" | "diamond" | "obsidian";

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  tier: BadgeTier;
  tooltip: string;
  isUnlocked: (state: BadgeEligibilityState) => boolean;
}

export interface BadgeEligibilityState {
  completedModules: string[];
  projectSpine: string | null;
  projectSpineAnswers: Record<string, ProjectSpineAnswerData>;
  assessments: Record<string, AssessmentState>;
  gamification: GamificationState;
}

function hasAnswer(
  answers: Record<string, ProjectSpineAnswerData>,
  ...keys: string[]
): boolean {
  return keys.some((k) => !!answers[k]);
}

function isPerfectionist(assessments: Record<string, AssessmentState>): boolean {
  return Object.values(assessments).some((a) => {
    if (!a.graded || Object.keys(a.graded).length === 0) return false;
    return (
      Object.values(a.graded).every((g) => {
        const graded = g as { correct?: boolean } | undefined;
        return graded?.correct;
      }) &&
      (!a.incorrectAttempts || Object.values(a.incorrectAttempts).every((v) => v === 0))
    );
  });
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  { id: "first-steps", name: "First Steps", icon: Star, tier: "bronze", tooltip: "Complete Module 0: Orientation", isUnlocked: (s) => s.completedModules.includes("0") },
  { id: "illusionist", name: "Illusionist", icon: Brain, tier: "bronze", tooltip: "Complete Module 1: The Intelligence Illusion", isUnlocked: (s) => s.completedModules.includes("1") },
  { id: "memory-architect", name: "Memory", icon: Database, tier: "bronze", tooltip: "Complete Module 2: The Goldfish Problem", isUnlocked: (s) => s.completedModules.includes("2") },
  { id: "toolbelt", name: "Toolbelt", icon: Wrench, tier: "silver", tooltip: "Complete Module 3: The Toolbelt", isUnlocked: (s) => s.completedModules.includes("3") },
  { id: "loop-engineer", name: "Loop Eng", icon: Network, tier: "gold", tooltip: "Complete Module 4: The Engine Room", isUnlocked: (s) => s.completedModules.includes("4") },
  { id: "master-assembly", name: "Assembly", icon: Cpu, tier: "diamond", tooltip: "Complete Module 5: The Assembly Line", isUnlocked: (s) => s.completedModules.includes("5") },
  { id: "certified", name: "Certified", icon: Trophy, tier: "obsidian", tooltip: "Pass the Final Assessment in Module 6", isUnlocked: (s) => s.gamification.badges.includes("certified") || s.completedModules.includes("6") },
  { id: "strategist", name: "Strategist", icon: Target, tier: "bronze", tooltip: "Select a Project Spine", isUnlocked: (s) => !!s.projectSpine },
  { id: "sys-designer", name: "Designer", icon: Code, tier: "bronze", tooltip: "Draft the System Prompt in Module 1", isUnlocked: (s) => hasAnswer(s.projectSpineAnswers, "1", "m1") },
  { id: "knowledge-weaver", name: "Weaver", icon: Beaker, tier: "silver", tooltip: "Design the RAG Architecture in Module 2", isUnlocked: (s) => hasAnswer(s.projectSpineAnswers, "2", "m2") },
  { id: "protocol-pioneer", name: "Protocol", icon: Server, tier: "silver", tooltip: "Register Tools & MCPs in Module 3", isUnlocked: (s) => hasAnswer(s.projectSpineAnswers, "3", "m3") },
  { id: "auto-architect", name: "Automation", icon: Network, tier: "gold", tooltip: "Orchestrate the Agentic Loop in Module 4", isUnlocked: (s) => hasAnswer(s.projectSpineAnswers, "4", "m4") },
  { id: "capstone", name: "Capstone", icon: Sparkles, tier: "diamond", tooltip: "Submit the Final Capstone in Module 5", isUnlocked: (s) => hasAnswer(s.projectSpineAnswers, "5", "m5") },
  { id: "perfectionist", name: "Flawless", icon: CheckCircle2, tier: "obsidian", tooltip: "Score 100% on a module assessment on the first attempt", isUnlocked: (s) => isPerfectionist(s.assessments) },
  { id: "deep-diver", name: "Deep Diver", icon: Activity, tier: "gold", tooltip: "Invest over 1 hour of active learning time", isUnlocked: (s) => s.gamification.totalTimeSpentSeconds >= 3600 },
  { id: "unbroken-focus", name: "Focus", icon: Flame, tier: "diamond", tooltip: "Maintain a 3+ day active learning streak", isUnlocked: (s) => (s.gamification.currentStreak || 0) >= 3 },
  { id: "relentless", name: "Relentless", icon: Flame, tier: "obsidian", tooltip: "Maintain a 7+ day active learning streak", isUnlocked: (s) => (s.gamification.currentStreak || 0) >= 7 },
  { id: "xp-hunter", name: "XP Hunter", icon: Zap, tier: "silver", tooltip: "Accumulate 1,000 Total XP", isUnlocked: (s) => (s.gamification.xp || 0) >= 1000 },
  { id: "polymath", name: "Polymath", icon: GraduationCap, tier: "diamond", tooltip: "Accumulate 5,000 Total XP", isUnlocked: (s) => (s.gamification.xp || 0) >= 5000 },
  { id: "tool-collector", name: "Collector", icon: Wrench, tier: "gold", tooltip: "Master 5+ distinct AI frameworks/tools", isUnlocked: (s) => (s.gamification.toolsMastered?.length || 0) >= 5 },
];

export function getUnlockedBadges(state: BadgeEligibilityState): BadgeDefinition[] {
  return BADGE_CATALOG.filter((badge) => badge.isUnlocked(state));
}

export function countUnlockedBadges(state: BadgeEligibilityState): number {
  return getUnlockedBadges(state).length;
}
