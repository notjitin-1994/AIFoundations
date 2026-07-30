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
  Database, Server, Shield, ArrowRight, CheckCircle2, Lock, Play, RotateCcw, Beaker, Wrench, Network, Cpu, X, Download,
  Sparkles, Activity
} from "lucide-react";
import { useUser, getDisplayName } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { COURSE_MODULES } from "@/lib/course-data";
import { wipeDatabaseProgress } from "@/actions/sync-progress";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CourseDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const progress = useProgressStore();
  const [selectedDeliverable, setSelectedDeliverable] = useState<{ title: string; content: string } | null>(null);

  const gamification = progress.gamification || {
    xp: 0, currentStreak: 0, totalTimeSpentSeconds: 0, badges: [], toolsMastered: []
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Record login for streak tracking
    progress.recordLogin();
    
    // Make sure they are marked as enrolled
    if (!useProgressStore.getState().isEnrolled) {
      progress.setEnrolled(true);
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

  const totalModules = COURSE_MODULES.length;
  const completedCount = mounted ? progress.completedModules.length : 0;
  
  // Base progress from fully completed modules
  const baseProgress = mounted ? (completedCount / totalModules) * 100 : 0;

  // Granular progress from current module's active slide ONLY if it's not already completed
  const isCurrentModuleCompleted = mounted && progress.completedModules.includes(progress.activeModuleId || "0");
  const currentModuleProgress = isCurrentModuleCompleted
    ? 0
    : (mounted ? ((progress.activeSlideIndex || 0) / Math.max(1, progress.totalSlidesInModule || 1)) * (100 / totalModules) : 0);

  const progressPercent = mounted ? Math.round(Math.min(100, baseProgress + currentModuleProgress)) : 0;
  const hoursInvested = mounted ? (gamification.totalTimeSpentSeconds / 3600).toFixed(1) : "0.0";
  
  // Behavioral Badges Logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPerfectionist = Object.values(progress.assessments).some(
    (a: any) => a.graded && Object.keys(a.graded).length > 0 && 
         Object.values(a.graded).every((g: any) => g?.correct) && 
         (!a.incorrectAttempts || Object.values(a.incorrectAttempts).every(v => v === 0))
  );
  const isDeepDiver = gamification.totalTimeSpentSeconds >= 3600; // >= 1 hour
  const isUnbrokenFocus = gamification.currentStreak >= 3;

  // Dynamic Learner Rank
  const badgesCount = gamification.badges.length;
  const xp = gamification.xp;
  let learnerRank = "AI Initiate";
  if (xp >= 2000 && badgesCount >= 5) learnerRank = "Master AI Engineer";
  else if (xp >= 1000 && badgesCount >= 3) learnerRank = "Advanced AI Architect";
  else if (xp >= 500) learnerRank = "AI Builder";

  const handleRestart = async () => {
    setIsRestarting(true);
    await wipeDatabaseProgress();
    progress.resetProgress();
    router.push("/modules/0");
  };

  const handleContinue = () => {
    const nextModuleId = progress.activeModuleId || "0";
    router.push(`/modules/${nextModuleId}`);
  };

  const hasStarted = mounted && (completedCount > 0 || (progress.activeModuleId !== "0" && progress.activeModuleId !== null) || progress.activeSlideIndex > 0);

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-primary/30 overflow-x-hidden" ref={containerRef}>
      <MarketingNavbar />

      <main className="pt-40 pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Main Journey & Content */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Welcome & Stats Hero */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-fade">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-2">
                  {!hasStarted && gamification.xp === 0 ? "Welcome" : "Welcome back"},{" "}
                  <span className="text-primary">{getDisplayName(user) || "Engineer"}</span>
                </h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold tracking-wider uppercase">{learnerRank}</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-fade grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{progressPercent}%</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Completion</p>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{gamification.currentStreak}</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Day Streak</p>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{gamification.xp}</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Total XP</p>
              </div>

              <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold font-heading">{hoursInvested}h</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Time Invested</p>
              </div>
            </div>

            {/* Action Buttons Below Tiles */}
            <div className="dashboard-fade flex flex-wrap items-center gap-4 pt-2">
              <button onClick={handleContinue} className="px-8 py-3 rounded-full bg-primary text-zinc-950 font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(167,218,219,0.3)]">
                <Play className="w-4 h-4 fill-current" />
                {!hasStarted ? "Start Course" : "Continue Course"}
              </button>
              {hasStarted && (
                <button onClick={handleRestart} disabled={isRestarting} className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-sm hover:bg-zinc-700 transition-all flex items-center gap-2">
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
          </section>

          {/* Pre-learning Expectations */}
          <section className="dashboard-fade bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-heading">The Baseline</h2>
              </div>
              <p className="text-zinc-400 max-w-2xl text-pretty mb-8 leading-relaxed">
                You don't need to write production code to start, but you need the mental models. If these concepts are new to you, we recommend spending 30 minutes with an AI assistant asking for "explain like I'm 5" breakdowns before you dive in.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Code className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Frontend Basics</h4>
                    <p className="text-xs text-zinc-500">How browsers render the DOM and basic component mental models.</p>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Server className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Backend & APIs</h4>
                    <p className="text-xs text-zinc-500">Handling stateless requests, JSON payloads, and RESTful routing.</p>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Database className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Data Stores</h4>
                    <p className="text-xs text-zinc-500">Relational SQL vs document-based NoSQL persistence models.</p>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Cpu className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">LLM Fundamentals</h4>
                    <p className="text-xs text-zinc-500">Tokens, context windows, and probabilistic text generation.</p>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Network className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">AI Harnesses</h4>
                    <p className="text-xs text-zinc-500">Orchestrating agents, ReAct loops, and managing RAG pipelines.</p>
                  </div>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                  <Wrench className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Tool Calling & MCP</h4>
                    <p className="text-xs text-zinc-500">Connecting LLMs to real-world actions via the Model Context Protocol.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Module Tracker */}
          <section className="space-y-10 dashboard-fade">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold font-heading tracking-tight">Your Journey</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <div className="relative pl-2 md:pl-4">
              {/* Continuous vertical timeline track */}
              <div className="absolute left-[35px] md:left-[43px] top-6 bottom-12 w-px bg-white/5" />
              
              {/* Active timeline progress fill */}
              <div 
                className="absolute left-[35px] md:left-[43px] top-6 w-px bg-gradient-to-b from-primary to-primary shadow-[0_0_15px_rgba(167,218,219,0.5)] transition-all duration-1000 ease-out z-0"
                style={{ height: mounted ? `${Math.max(0, (progress.activeModuleId ? parseInt(progress.activeModuleId) : 0) / (totalModules - 1) * 100)}%` : '0%' }}
              />

              <div className="space-y-0">
                {COURSE_MODULES.map((mod, idx) => {
                  const isComplete = progress.completedModules.includes(mod.id);
                  const isLocked = idx > 0 && !progress.completedModules.includes(COURSE_MODULES[idx - 1].id) && !isComplete;
                  const isActive = mounted && !isComplete && !isLocked;
                  const assessment = progress.assessments[mod.id];

                  return (
                    <div 
                      key={mod.id} 
                      className={`module-row relative flex gap-6 md:gap-10 py-8 transition-all duration-500 group ${
                        isActive ? "opacity-100" : isLocked ? "opacity-30" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Left: Timeline Node */}
                      <div className="relative z-10 shrink-0 mt-1">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg transition-all duration-700 ease-out border ${
                          isComplete ? "bg-primary text-zinc-950 border-primary shadow-[0_0_25px_rgba(167,218,219,0.3)]" :
                          isActive ? "bg-zinc-950 border-2 border-primary text-primary shadow-[0_0_20px_rgba(167,218,219,0.2)] scale-110" :
                          "bg-zinc-950 border-white/10 text-zinc-600"
                        }`}>
                          {isComplete ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : mod.id}
                        </div>
                        {/* Glow effect for active node */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 animate-pulse" />
                        )}
                      </div>

                      {/* Right: Module Content */}
                      <div className={`flex-1 min-w-0 transition-all duration-500 ease-out ${isActive ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                          <div>
                            <p className={`text-[10px] md:text-xs font-mono mb-2 tracking-[0.2em] uppercase transition-colors ${isActive ? 'text-primary' : 'text-zinc-500'}`}>
                              MODULE {mod.id}
                            </p>
                            <h3 className={`text-2xl md:text-3xl font-bold font-heading text-pretty transition-colors ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                              {mod.title}
                            </h3>
                          </div>
                          {!isLocked && (
                            <Link href={`/modules/${mod.id}`} className="shrink-0 mt-2 sm:mt-0">
                              <button className={`group/btn relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                isActive ? "bg-primary text-zinc-950 hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(167,218,219,0.4)] hover:scale-105" : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                              }`}>
                                {isComplete ? (
                                  <>Review <RotateCcw className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:-rotate-90" /></>
                                ) : (
                                  <>Continue <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                                )}
                              </button>
                            </Link>
                          )}
                        </div>
                        <p className={`text-sm md:text-base leading-relaxed max-w-2xl mb-6 transition-colors ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {mod.overview}
                        </p>

                        {/* Module Meta Data / Tags */}
                        <div className="flex flex-wrap gap-2.5">
                          {assessment && assessment.graded && (
                            <div className="px-3 py-1.5 rounded-md bg-zinc-900/80 border border-white/5 text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                              <Star className={`w-3.5 h-3.5 ${(Object.keys(assessment.graded).length / (assessment.questions?.length || 1)) === 1 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-primary'}`} />
                              Score: {Math.round((Object.keys(assessment.graded).length / (assessment.questions?.length || 1)) * 100)}%
                            </div>
                          )}
                          {mod.id === "0" && progress.projectSpine && (
                            <div className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary flex items-center gap-1.5 backdrop-blur-md">
                              <Database className="w-3.5 h-3.5" />
                              Spine: {progress.projectSpine}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Badges & Gamification */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="dashboard-fade sticky top-32">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" /> Achievements
            </h2>
            
            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-8">
              
              {/* Skill Constellation / Behavioral Badges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Skill Constellation</h3>
                  <span className="text-xs font-mono text-primary/60">{gamification.badges.length + (isPerfectionist?1:0) + (isDeepDiver?1:0) + (isUnbrokenFocus?1:0)} / 9 Unlocked</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    { id: 'first-steps', name: 'First Steps', icon: Star, unlocked: gamification.badges.includes('first-steps') || progress.completedModules.includes('0'), tier: 'bronze' },
                    { id: 'architect', name: 'Architect', icon: Brain, unlocked: gamification.badges.includes('architect') || !!progress.projectSpine, tier: 'silver' },
                    { id: 'prompt-eng', name: 'Prompt Eng', icon: Code, unlocked: progress.completedModules.includes('2'), tier: progress.assessments['2']?.graded ? 'gold' : 'bronze' },
                    { id: 'tool-builder', name: 'Tool Builder', icon: Target, unlocked: progress.completedModules.includes('3'), tier: 'silver' },
                    { id: 'agent-master', name: 'Agent Master', icon: Server, unlocked: progress.completedModules.includes('4'), tier: 'gold' },
                    { id: 'certified', name: 'Certified', icon: Trophy, unlocked: progress.completedModules.includes('6'), tier: 'diamond' },
                    // Behavioral Badges
                    { id: 'perfectionist', name: 'Perfectionist', icon: CheckCircle2, unlocked: isPerfectionist, tier: 'obsidian', tooltip: 'Score 100% on a module assessment on the first attempt' },
                    { id: 'deep-diver', name: 'Deep Diver', icon: Activity, unlocked: isDeepDiver, tier: 'gold', tooltip: 'Invest over 1 hour of active learning time' },
                    { id: 'unbroken-focus', name: 'Unbroken Focus', icon: Flame, unlocked: isUnbrokenFocus, tier: 'diamond', tooltip: 'Maintain a 3+ day active learning streak' },
                  ].map(badge => {
                    const tierColors: Record<string, string> = {
                      bronze: "from-orange-900/30 to-amber-700/10 border-orange-500/30 text-orange-400",
                      silver: "from-zinc-400/20 to-zinc-600/10 border-zinc-400/40 text-zinc-300",
                      gold: "from-yellow-400/20 to-amber-500/10 border-yellow-500/50 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]",
                      diamond: "from-teal-400/20 to-cyan-500/10 border-teal-400/60 text-teal-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]",
                      obsidian: "from-purple-600/30 to-indigo-900/20 border-purple-500/50 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    };

                    return (
                      <div key={badge.id} className="group relative flex flex-col items-center">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl overflow-hidden relative ${
                          badge.unlocked 
                            ? `bg-gradient-to-br border hover:scale-110 hover:-translate-y-2 z-10 ${tierColors[badge.tier || 'bronze']}` 
                            : "bg-zinc-950 border border-white/5 text-zinc-800"
                        }`}>
                          {badge.unlocked && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] translate-y-[150%] group-hover:translate-x-[150%] group-hover:translate-y-[-150%] transition-transform duration-1000 ease-in-out" />
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] transition-opacity duration-300" />
                            </>
                          )}
                          <badge.icon className={`w-8 h-8 md:w-10 md:h-10 relative z-10 ${!badge.unlocked ? 'opacity-20' : ''}`} strokeWidth={badge.unlocked ? 2 : 1.5} />
                        </div>
                        <p className={`text-[10px] md:text-xs font-bold mt-2 text-center tracking-wider transition-colors duration-300 ${badge.unlocked ? 'text-zinc-200' : 'text-zinc-600'}`}>
                          {badge.name}
                        </p>
                        
                        {/* Glassmorphism Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50">
                          <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-2 text-[10px] text-zinc-300 text-center shadow-2xl relative">
                            {badge.unlocked ? (badge.tooltip || `Unlocked ${badge.name}`) : (badge.tooltip || "Complete requirements to unlock")}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/90" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
