"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProgressStore } from "@/store/progress";
import { MarketingNavbar } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { 
  Trophy, Flame, Clock, Target, Star, Brain, Code, 
  Database, Server, Shield, ArrowRight, Lock, Play, RotateCcw, Wrench, Network, Cpu, X, Download,
  Sparkles
} from "lucide-react";
import { useUser, getDisplayName } from "@/hooks/use-user";
import { fetchModuleProgress, wipeDatabaseProgress } from "@/actions/sync-progress";
import { mergeRemoteProgress, hasStartedCourse } from "@/lib/progress-merge";
import { computeCourseProgress } from "@/lib/progress-metrics";
import type { CourseTotals } from "@/lib/progress-metrics";
import { BADGE_CATALOG, getUnlockedBadges, countUnlockedBadges, type BadgeEligibilityState } from "@/lib/gamification";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { useEnrollmentGate } from "@/hooks/use-enrollment";
import { EnrollmentCheckScreen } from "@/components/auth/enrollment-check";
import { useNotesStore } from "@/store/notes";
import { COURSE_MODULES } from "@/lib/course-data";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { BadgeGrid } from "@/components/dashboard/badge-grid";
import { BaselineCards } from "@/components/dashboard/baseline-cards";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CourseDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useUser();
  const progress = useProgressStore();
  const [selectedDeliverable, setSelectedDeliverable] = useState<{ title: string; content: string } | null>(null);
  const [badgePage, setBadgePage] = useState(0);

  const gamification = progress.gamification || {
    xp: 0, currentStreak: 0, totalTimeSpentSeconds: 0, badges: [], toolsMastered: []
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Record login for streak tracking
    progress.recordLogin();

    if (user) {
      fetchModuleProgress().then((dbProgress) => {
        if (!dbProgress) return;
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
          state.activeModuleId
        );
        state.syncFromDB(merged);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        ".dashboard-fade",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );

      // Card Stagger on load (removed ScrollTrigger due to custom scroll container in AppShell)
      const cards = gsap.utils.toArray(".module-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const { isEnrolled: accessGranted, isLoading: enrollmentLoading } = useEnrollmentGate();
  if (enrollmentLoading || !accessGranted) {
    return <EnrollmentCheckScreen />;
  }

  const totalModules = COURSE_MODULES.length;
  const completedCount = mounted ? progress.completedModules.length : 0;
  
  const courseTotals = COURSE_MODULES.reduce<CourseTotals>((acc, mod) => ({ ...acc, [mod.id]: mod.slideCount }), {});
  const progressMetrics = mounted
    ? computeCourseProgress(
        {
          completedModules: progress.completedModules,
          completedSlides: progress.completedSlides,
          moduleProgressMap: progress.moduleProgressMap,
        },
        courseTotals
      )
    : { percent: 0, completedSlides: 0, totalSlides: 0, totalFraction: 0, perModule: {} };
  const progressPercent = progressMetrics.percent;
  const totalFraction = progressMetrics.totalFraction;

  const hoursInvested = mounted ? (gamification.totalTimeSpentSeconds / 3600).toFixed(1) : "0.0";
  
  // Skill Constellation — single source of truth in src/lib/gamification.ts
  const eligibility: BadgeEligibilityState = {
    completedModules: progress.completedModules,
    projectSpine: progress.projectSpine,
    projectSpineAnswers: progress.projectSpineAnswers,
    assessments: progress.assessments,
    gamification,
  };
  const unlockedBadgeCount = countUnlockedBadges(eligibility);
  const unlockedBadgeIds = new Set(getUnlockedBadges(eligibility).map((b) => b.id));

  const handleRestart = async () => {
    setIsRestarting(true);
    setRestartError(null);
    const result = await wipeDatabaseProgress();
    if (!result?.success) {
      setIsRestarting(false);
      setRestartError(result?.reason ?? "Could not wipe progress on the server. Your progress was kept.");
      return;
    }
    useNotesStore.getState().clearAllNotes();
    progress.resetProgress();
    router.push("/modules/0");
  };

  const handleContinue = () => {
    let nextModuleId = progress.activeModuleId || "0";
    
    // If the active module is already completed, find the next uncompleted module in the sequence
    if (progress.completedModules.includes(nextModuleId)) {
      const uncompletedModule = COURSE_MODULES.find(m => !progress.completedModules.includes(m.id));
      if (uncompletedModule) {
        nextModuleId = uncompletedModule.id;
      }
    }
    
    const targetSlide = progress.moduleProgressMap[nextModuleId]?.activeSlideIndex || 0;
    router.push(`/modules/${nextModuleId}${targetSlide > 0 ? `?slide=${targetSlide}` : ''}`);
  };

  const hasStarted = mounted && hasStartedCourse({
    completedModules: progress.completedModules,
    completedLessons: progress.completedLessons,
    completedSlides: progress.completedSlides,
    moduleProgressMap: progress.moduleProgressMap,
    projectSpine: progress.projectSpine,
    gamificationXp: progress.gamification?.xp ?? 0,
    activeSlideIndex: progress.activeSlideIndex,
    activeModuleId: progress.activeModuleId,
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden" ref={containerRef}>
      <AuthModal isOpen={!authLoading && !user} />
      <MarketingNavbar />

      <main className="pt-40 pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Main Journey & Content */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Welcome & Stats Hero */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-fade">
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-2">
                {!hasStarted && gamification.xp === 0 ? "Welcome" : "Welcome back"},{" "}
                <span className="text-primary">{getDisplayName(user) || "Engineer"}</span>
              </h1>
            </div>
            
            <div className="dashboard-fade grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{progressPercent}%</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completion</p>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{gamification.currentStreak}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Day Streak</p>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{gamification.xp}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total XP</p>
              </div>

              <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{hoursInvested}h</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Time Invested</p>
              </div>
            </div>

            {/* Action Buttons Below Tiles */}
            <div className="dashboard-fade flex flex-wrap items-center gap-4 pt-2">
              <button onClick={handleContinue} className="px-8 py-3 rounded-full bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-xl shadow-secondary/20 active:scale-95">
                <Play className="w-4 h-4 fill-current" />
                {!hasStarted ? "Start Course" : "Continue Course"}
              </button>
              {hasStarted && (
                <button onClick={handleRestart} disabled={isRestarting} className="px-6 py-3 rounded-full bg-card/60 border border-white/10 text-foreground font-medium text-sm hover:bg-card/80 transition-all flex items-center gap-2">
                  <RotateCcw className={`w-4 h-4 ${isRestarting ? 'animate-spin' : ''}`} />
                  {isRestarting ? "Restarting..." : "Restart Course"}
                </button>
              )}
              {(completedCount === totalModules || gamification.badges.includes('certified')) && (
                <button onClick={() => router.push('/certificate')} className="px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/30 font-bold text-sm hover:border-primary/60 hover:shadow-[0_0_20px_rgba(167,218,219,0.2)] transition-all flex items-center gap-2">
                  <Trophy className="w-4 h-4 fill-primary/20" />
                  View Certificate
                </button>
              )}
            </div>
            {restartError && (
              <p className="mt-3 text-sm text-destructive">{restartError}</p>
            )}
          </section>

          {/* Pre-learning Expectations */}
          <section className="dashboard-fade bg-gradient-to-br from-card to-card/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-heading">The Baseline</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl text-pretty mb-8 leading-relaxed">
                You don't need to write production code to start, but you need the mental models. If these concepts are new to you, we recommend spending 30 minutes with an AI assistant asking for "explain like I'm 5" breakdowns before you dive in.
              </p>
              
              <BaselineCards />
            </div>
          </section>

          <DashboardTabs
            completedModules={progress.completedModules}
            activeModuleId={progress.activeModuleId}
            projectSpine={progress.projectSpine}
            projectSpineAnswers={progress.projectSpineAnswers}
            totalFraction={totalFraction}
            totalModules={totalModules}
            completedCount={completedCount}
            mounted={mounted}
          />

        </div>

        {/* RIGHT COLUMN: Badges & Gamification */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="dashboard-fade sticky top-32">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" /> Achievements
            </h2>
            
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-8">
              
              {/* Skill Constellation / Behavioral Badges */}
              <div>
                <BadgeGrid unlockedBadgeIds={unlockedBadgeIds} badgePage={badgePage} onPageChange={setBadgePage} />
              </div>

              <div className="w-full h-px bg-white/5" />

{/* Project Deliverables (Impeccable Overhaul) */}
              <div className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Wrench className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Tools Available</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { 
                      title: "Prompt Engineering", 
                      icon: Code, 
                      reqMod: "1", 
                      content: (() => {
                        const ans = progress.projectSpineAnswers["1"] || progress.projectSpineAnswers["m1"];
                        if (ans?.rolePrompt) {
                          return `### Role\n${ans.rolePrompt}\n\n### Task\n${ans.taskPrompt || ""}\n\n### Context\n${ans.contextPrompt || ""}\n\n### Constraints\n${ans.constraintPrompt || ""}`;
                        }
                        return "No prompt engineered yet.";
                      })()
                    },
                    { 
                      title: "Toolbelt Blueprint", 
                      icon: Wrench, 
                      reqMod: "3", 
                      content: (() => {
                        const ans = progress.projectSpineAnswers["3"] || progress.projectSpineAnswers["m3"];
                        if (ans?.tools || ans?.mcps || ans?.skills) {
                          return `### MCP Servers\n${ans.mcps || "None"}\n\n### Tools\n${ans.tools || "None"}\n\n### Skills\n${ans.skills || "None"}`;
                        }
                        return "No tools mapped yet.";
                      })()
                    },
                    { 
                      title: "Harness Engineering", 
                      icon: Network, 
                      reqMod: "4", 
                      content: (() => {
                        const ans = progress.projectSpineAnswers["3"] || progress.projectSpineAnswers["m3"] || progress.projectSpineAnswers["4"] || progress.projectSpineAnswers["m4"];
                        if (ans?.agentsMd) {
                          return ans.agentsMd;
                        }
                        return "No orchestration built yet.";
                      })()
                    },
                    { 
                      title: "Final Project", 
                      icon: Star, 
                      reqMod: "6", 
                      content: "Final Capstone codebase and deliverables." 
                    }
                  ].map((deliv, i) => {
                    const unlocked = progress.completedModules.includes(deliv.reqMod);
                    const hasContent = unlocked && deliv.content && !deliv.content.includes("yet.");
                    return (
                      <button 
                        key={deliv.title}
                        onClick={() => unlocked && setSelectedDeliverable({ title: deliv.title, content: deliv.content })}
                        className={`group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 w-full text-left ${
                          unlocked 
                            ? "bg-zinc-900/40 border-white/5 hover:bg-zinc-900/80 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(167,218,219,0.05)] cursor-pointer" 
                            : "bg-zinc-950/50 border-transparent opacity-40 cursor-not-allowed grayscale"
                        }`}
                      >
                        {/* Hover Gradient Background */}
                        {unlocked && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        )}
                        
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${unlocked ? 'bg-zinc-950 border-white/10 group-hover:border-primary/30 text-primary' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                            <deliv.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-bold ${unlocked ? 'text-zinc-100' : 'text-zinc-500'}`}>{deliv.title}</h4>
                              {unlocked && (
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hasContent ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${hasContent ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 font-mono">MODULE {deliv.reqMod}</p>
                          </div>
                        </div>

                        <div className="relative z-10 shrink-0">
                          {unlocked ? (
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary text-zinc-400 transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          ) : (
                            <Lock className="w-4 h-4 text-zinc-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Certificate Teaser */}
              {gamification.badges.includes('certified') ? (
                <div 
                  onClick={() => router.push('/certificate')}
                  className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 text-center relative overflow-hidden group hover:border-primary/50 cursor-pointer transition-all duration-500 shadow-[0_0_30px_rgba(167,218,219,0.1)]"
                >
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Trophy className="w-10 h-10 text-primary mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
                  <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">View Certificate</h4>
                  <p className="text-sm text-zinc-400 relative z-10 max-w-sm mx-auto">Your verified credential is ready and permanently unlocked.</p>
                </div>
              ) : (
                <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 text-center relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Trophy className="w-10 h-10 text-primary mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
                  <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">Verified Certificate</h4>
                  <p className="text-sm text-zinc-400 relative z-10 max-w-sm mx-auto">Unlock your cryptographically verified credential upon completing the final capstone assessment.</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </main>

      <MarketingFooter />

      {/* Premium Artifact Modal */}
      {selectedDeliverable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedDeliverable(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" />
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(167,218,219,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" 
            onClick={e => e.stopPropagation()}
          >
            {/* Mac-style Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/20" />
                </div>
                <h3 className="font-mono text-xs text-zinc-400">{selectedDeliverable.title.toLowerCase().replace(/\s+/g, '-')}.md</h3>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-white group" title="Download Artifact">
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-white group" onClick={() => setSelectedDeliverable(null)} title="Close">
                  <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Editor Body */}
            <div className="p-0 overflow-y-auto max-h-[65vh] bg-[#0d1117]">
              <div className="p-6 md:p-8">
                <pre className="font-mono text-[13px] leading-relaxed text-zinc-300 whitespace-pre-wrap selection:bg-primary/30">
                  {selectedDeliverable.content}
                </pre>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-white/5 bg-zinc-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Sync Active
              </div>
              <div className="flex gap-3">
                <button 
                  className="px-5 py-2 rounded-full border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors" 
                  onClick={() => setSelectedDeliverable(null)}
                >
                  Close
                </button>
                <button 
                  className="px-5 py-2 rounded-full bg-primary text-zinc-950 text-xs font-bold hover:bg-teal-400 transition-colors shadow-[0_0_20px_rgba(167,218,219,0.2)]"
                >
                  Edit in IDE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
