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
  Database, Server, Shield, ArrowRight, CheckCircle2, Lock, Play, RotateCcw, Beaker, Wrench, Network, Cpu, X, Download
} from "lucide-react";
import { useUser, getDisplayName } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { COURSE_MODULES } from "@/lib/course-data";

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

  useEffect(() => {
    // Record login for streak tracking
    progress.recordLogin();
    
    // Make sure they are marked as enrolled
    if (!useProgressStore.getState().isEnrolled) {
      progress.setEnrolled(true);
    }

    // Auto-seed for specific testing account
    if (user?.email === "not.jitin@gmail.com") {
      const currentState = useProgressStore.getState();
      const needsFullSeed = currentState.gamification.xp < 500;
      
      const currentSpine = currentState.projectSpine || "research-companion";
      
      let mockAnswers = {
        "1": { rolePrompt: `# System Prompt\n\nYou are an expert AI orchestrator specializing in the ${currentSpine.replace(/_/g, ' ')} domain. Your goal is to analyze data and provide structured insights.\n\n*(Mock artifact auto-populated for testing)*` },
        "2": { contextPrompt: `# Context Engineering\n\nPlease reference the following knowledge base articles to formulate your answer for the ${currentSpine.replace(/_/g, ' ')} project:\n1. Architecture Guidelines\n2. API Spec v2\n\n*(Mock artifact auto-populated for testing)*` },
        "3": { agentsMd: `# Agent Orchestration\n\n\`\`\`yaml\nagents:\n  - name: Primary Agent (${currentSpine.replace(/_/g, ' ')})\n    role: Executes core logic\n  - name: Evaluator\n    role: Validates output\n\`\`\`\n\n*(Mock artifact auto-populated for testing)*` }
      };

      if (needsFullSeed) {
        const seededBadges = ["first-steps", "architect", "prompt-eng", "tool-builder", "agent-master", "certified"];
        const seededTools = ["RAG", "Vector DB", "Agents", "LangChain", "FastAPI", "Deployment"];
        
        currentState.syncFromDB({
          completedModules: ["0", "1", "2", "3", "4", "5", "6"],
          gamification: {
            xp: 2850,
            badges: seededBadges,
            toolsMastered: seededTools,
            totalTimeSpentSeconds: 144000, // 40 hours
            lastLoginDate: new Date().toISOString().split('T')[0],
            currentStreak: 12,
          },
          assessments: {
            "1": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
            "2": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
            "3": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
            "4": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
            "5": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
            "6": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true, 3: true, 4: true } },
          },
          projectSpine: currentSpine as any,
          projectSpineAnswers: {
            ...currentState.projectSpineAnswers,
            "1": currentState.projectSpineAnswers["1"] || currentState.projectSpineAnswers["m1"] || mockAnswers["1"],
            "2": currentState.projectSpineAnswers["2"] || currentState.projectSpineAnswers["m2"] || mockAnswers["2"],
            "3": currentState.projectSpineAnswers["3"] || currentState.projectSpineAnswers["m3"] || mockAnswers["3"]
          },
          activeModuleId: "6",
        });
      } else {
        // Ensure missing artifacts are populated for test account even if xp >= 500
        const currentAnswers = currentState.projectSpineAnswers || {};
        if (!currentAnswers["1"] || !currentAnswers["2"] || !currentAnswers["3"]) {
          currentState.syncFromDB({
            projectSpineAnswers: {
              ...currentAnswers,
              "1": currentAnswers["1"] || currentAnswers["m1"] || mockAnswers["1"],
              "2": currentAnswers["2"] || currentAnswers["m2"] || mockAnswers["2"],
              "3": currentAnswers["3"] || currentAnswers["m3"] || mockAnswers["3"]
            }
          });
        }
      }
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
  const completedCount = progress.completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);
  const hoursInvested = (gamification.totalTimeSpentSeconds / 3600).toFixed(1);

  const handleRestart = () => {
    progress.resetProgress();
    router.push("/modules/0");
  };

  const handleContinue = () => {
    const nextModuleId = progress.activeModuleId || "0";
    router.push(`/modules/${nextModuleId}`);
  };

  const handleSeedTestData = () => {
    // Seed fake data for testing
    const seededBadges = ["first-steps", "architect", "prompt-eng"];
    const seededTools = ["RAG", "Vector DB"];
    progress.markModuleComplete("0");
    progress.markModuleComplete("1");
    progress.markModuleComplete("2");
    progress.setProjectSpine("research-companion");
    progress.syncFromDB({
      gamification: {
        xp: 1250,
        badges: seededBadges,
        toolsMastered: seededTools,
        totalTimeSpentSeconds: 14400, // 4 hours
        lastLoginDate: new Date().toISOString().split('T')[0],
        currentStreak: 5,
      },
      assessments: {
        "1": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true } },
        "2": { passed: true, currentIdx: 0, answers: {}, graded: { 0: true, 1: true, 2: true } }
      },
      activeModuleId: "3",
    });
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-primary/30 overflow-x-hidden" ref={containerRef}>
      <MarketingNavbar />

      <main className="pt-40 pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Main Journey & Content */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Welcome & Stats Hero */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 dashboard-fade">
              <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                {completedCount === 0 && gamification.xp === 0 ? "Welcome" : "Welcome back"},{" "}
                <span className="text-primary">{getDisplayName(user) || "Engineer"}</span>
              </h1>
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
                {completedCount === 0 ? "Start Course" : "Continue Course"}
              </button>
              <button onClick={handleRestart} className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-sm hover:bg-zinc-700 transition-all flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart Course
              </button>
              {completedCount === totalModules && (
                <button onClick={() => router.push('/certificate')} className="px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/30 font-bold text-sm hover:border-primary/60 hover:shadow-[0_0_20px_rgba(167,218,219,0.2)] transition-all flex items-center gap-2">
                  <Trophy className="w-4 h-4 fill-primary/20" />
                  View Certificate
                </button>
              )}
              {progressPercent === 0 && (
                <button onClick={handleSeedTestData} className="px-6 py-3 rounded-full bg-zinc-800/50 text-zinc-400 font-medium text-sm hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2" title="Populate dummy data for testing">
                  <Beaker className="w-4 h-4" />
                  Seed Test Data
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
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">Your Journey</h2>
            <div className="space-y-4">
              {COURSE_MODULES.map((mod, idx) => {
                const isComplete = progress.completedModules.includes(mod.id);
                const isLocked = idx > 0 && !progress.completedModules.includes(COURSE_MODULES[idx - 1].id) && !isComplete;
                const isActive = !isComplete && !isLocked;
                const assessment = progress.assessments[mod.id];

                return (
                  <div 
                    key={mod.id} 
                    className={`module-card relative bg-zinc-900/40 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 ${
                      isActive ? "border-primary/50 shadow-[0_0_30px_rgba(167,218,219,0.1)]" : "border-white/5"
                    } ${isLocked ? "opacity-50 grayscale" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Left: Indicator */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg border ${
                          isComplete ? "bg-primary/20 text-primary border-primary/30" :
                          isActive ? "bg-zinc-800 text-white border-zinc-700" :
                          "bg-zinc-950 text-zinc-600 border-zinc-800"
                        }`}>
                          {isComplete ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : mod.id}
                        </div>
                        {idx !== COURSE_MODULES.length - 1 && (
                          <div className={`w-px h-16 ${isComplete ? "bg-primary/30" : "bg-white/5"}`} />
                        )}
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-mono text-primary mb-1">MODULE {mod.id}</p>
                            <h3 className="text-xl font-bold font-heading mb-2">{mod.title}</h3>
                          </div>
                          {!isLocked && (
                            <Link href={`/modules/${mod.id}`} className="shrink-0">
                              <button className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                isActive ? "bg-primary text-zinc-950 hover:bg-teal-400" : "bg-white/10 text-white hover:bg-white/20"
                              }`}>
                                {isComplete ? "Review" : "Continue"}
                              </button>
                            </Link>
                          )}
                        </div>
                        <p className="text-zinc-400 text-sm mb-4 leading-relaxed max-w-xl">
                          {mod.overview}
                        </p>

                        {/* Module Meta */}
                        <div className="flex flex-wrap gap-3">
                          {assessment && assessment.graded && (
                            <div className="px-3 py-1 rounded-md bg-zinc-950 border border-white/5 text-xs text-zinc-300 flex items-center gap-2">
                              <Star className="w-3 h-3 text-primary" />
                              Assessment Score: {Math.round((Object.keys(assessment.graded).length / (assessment.questions?.length || 1)) * 100)}%
                            </div>
                          )}
                          {mod.id === "0" && progress.projectSpine && (
                            <div className="px-3 py-1 rounded-md bg-zinc-950 border border-white/5 text-xs text-zinc-300 flex items-center gap-2">
                              <Database className="w-3 h-3 text-primary" />
                              Spine: {progress.projectSpine}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              
              {/* Badges Grid */}
              <div>
                <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'first-steps', name: 'First Steps', icon: Star, unlocked: gamification.badges.includes('first-steps') || progress.completedModules.includes('0') },
                    { id: 'architect', name: 'Architect', icon: Brain, unlocked: gamification.badges.includes('architect') || !!progress.projectSpine },
                    { id: 'prompt-eng', name: 'Prompt Eng', icon: Code, unlocked: progress.completedModules.includes('2') },
                    { id: 'tool-builder', name: 'Tool Builder', icon: Target, unlocked: progress.completedModules.includes('3') },
                    { id: 'agent-master', name: 'Agent Master', icon: Server, unlocked: progress.completedModules.includes('4') },
                    { id: 'certified', name: 'Certified', icon: Trophy, unlocked: progress.completedModules.includes('6') },
                  ].map(badge => (
                    <div key={badge.id} className="group relative flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                        badge.unlocked 
                          ? "bg-gradient-to-br from-teal-500/20 to-primary/20 border border-primary/30 text-primary hover:scale-105 hover:-translate-y-1" 
                          : "bg-zinc-950 border border-white/5 text-zinc-700 opacity-50 grayscale"
                      }`}>
                        <badge.icon className="w-8 h-8" />
                      </div>
                      <p className="text-[10px] font-bold mt-2 text-center text-zinc-400 tracking-wider">
                        {badge.name}
                      </p>
                    </div>
                  ))}
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
                    { title: "Prompt Engineering", icon: Code, reqMod: "1", content: progress.projectSpineAnswers["1"]?.rolePrompt || progress.projectSpineAnswers["0"]?.rolePrompt || progress.projectSpineAnswers["m1"]?.rolePrompt || "No prompt engineered yet." },
                    { title: "Context Engineering", icon: Database, reqMod: "2", content: progress.projectSpineAnswers["2"]?.contextPrompt || progress.projectSpineAnswers["1"]?.contextPrompt || progress.projectSpineAnswers["m2"]?.contextPrompt || "No context assembled yet." },
                    { title: "Harness Engineering", icon: Network, reqMod: "4", content: progress.projectSpineAnswers["3"]?.agentsMd || progress.projectSpineAnswers["m3"]?.agentsMd || progress.projectSpineAnswers["2"]?.taskPrompt || "No orchestration built yet." },
                    { title: "Final Project", icon: Star, reqMod: "6", content: "Final Capstone codebase and deliverables." }
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
              <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 text-center relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Trophy className="w-10 h-10 text-primary mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(167,218,219,0.5)]" />
                <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">Verified Certificate</h4>
                <p className="text-sm text-zinc-400 relative z-10 max-w-sm mx-auto">Unlock your cryptographically verified credential upon completing the final capstone assessment.</p>
              </div>

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
