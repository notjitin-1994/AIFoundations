"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Circle, CheckCircle2, Lock, ChevronDown, ChevronRight } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { motion, AnimatePresence } from "motion/react";

const MODULES = [
  { 
    id: "0", title: "0. Orientation", path: "/",
    lessons: [
      "0.1 Welcome and Roadmap",
      "0.2 Myth-Busting",
      "0.3 Self-Assessment Diagnostic",
      "0.4 Project Template Selection"
    ]
  },
  { 
    id: "1", title: "1. The Intelligence Illusion", path: "/modules/1",
    lessons: [
      "1.1 What AI Actually Is",
      "1.2 Machine Learning in Plain Language",
      "1.3 LLMs and SLMs",
      "1.4 Anatomy of a Prompt",
      "1.5 Hallucinations and Bias"
    ]
  },
  { 
    id: "2", title: "2. The Goldfish Problem", path: "/modules/2",
    lessons: [
      "2.1 The Goldfish Metaphor",
      "2.2 Tokens: The Currency of AI",
      "2.3 Context Windows Explained",
      "2.4 RAG: Giving AI a Long-Term Memory",
      "2.5 Practical Implications"
    ]
  },
  { 
    id: "3", title: "3. The Toolbelt", path: "/modules/3",
    lessons: [
      "3.1 From Chat to Action",
      "3.2 Function Calling Demystified",
      "3.3 MCP: The Universal Translator",
      "3.4 Skills and Capabilities",
      "3.5 Hands-On: Triggering a Tool Call"
    ]
  },
  { 
    id: "4", title: "4. The Engine Room", path: "/modules/4",
    lessons: [
      "4.1 Harness vs. Model",
      "4.2 Autonomy, Tools, Memory",
      "4.3 The Agent Spectrum",
      "4.4 When Agents Break",
      "4.5 Guardrails and Safety"
    ]
  },
  { 
    id: "5", title: "5. The Assembly Line", path: "/modules/5",
    lessons: [
      "5.1 Content Sub-Lab",
      "5.2 Coding Sub-Lab",
      "5.3 Media Sub-Lab"
    ]
  },
  { 
    id: "6", title: "6. The Local Sandbox", path: "/modules/6",
    lessons: [
      "6.1 Why Run AI Locally?",
      "6.2 SLMs on Your Device",
      "6.3 Tools for Running Local AI",
      "6.4 When Cloud Beats Local"
    ]
  },
  { 
    id: "7", title: "7. The Horizon", path: "/modules/7",
    lessons: [
      "7.1 The Living Tool Landscape",
      "7.2 Building Your AI Learning Habit",
      "7.3 Capstone Presentations",
      "7.4 Course Retrospect"
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { completedModules, activeLessonIndex } = useProgressStore();
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Auto-expand the current module when navigating
  useEffect(() => {
    const activeMod = MODULES.find(m => pathname === m.path);
    if (activeMod) {
      setExpandedModules(prev => ({ ...prev, [activeMod.id]: true }));
    }
  }, [pathname]);

  const toggleModule = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedModules.includes(MODULES[index - 1].id);
  };

  return (
    <aside id="tour-sidebar" className="w-64 md:w-72 border-r border-border bg-sidebar text-sidebar-foreground h-screen flex flex-col hidden md:flex shrink-0">
      <div className="p-6 border-b border-border shrink-0">
        <img src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png" alt="Smartslate" className="h-8 w-auto object-contain mb-1" />
        <p className="text-[11px] font-medium text-sidebar-foreground/60 tracking-wide uppercase mt-1">AI Foundations: Concept2Application</p>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4 pb-12">
          {MODULES.map((mod, index) => {
            const isCompleted = completedModules.includes(mod.id);
            const isUnlocked = isModuleUnlocked(index);
            const isActive = pathname === mod.path;
            const isExpanded = expandedModules[mod.id] || false;
            
            return (
              <div key={mod.id} className="flex flex-col">
                {isUnlocked ? (
                  <div className={`group flex items-center justify-between rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                  }`}>
                    <Link 
                      href={mod.path} 
                      className="flex-1 flex items-center space-x-3 px-3 py-2.5 text-sm font-medium truncate"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className={`shrink-0 h-4 w-4 ${isActive ? "text-sidebar-primary" : "text-sidebar-primary/80"}`} />
                      ) : mod.id === "0" ? (
                        <BookOpen className={`shrink-0 h-4 w-4 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground"}`} />
                      ) : (
                        <Circle className={`shrink-0 h-4 w-4 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground"}`} />
                      )}
                      <span className="truncate">{mod.title}</span>
                    </Link>
                    <button 
                      onClick={(e) => toggleModule(e, mod.id)}
                      className="shrink-0 p-2 mr-1 rounded-md transition-colors hover:bg-sidebar-primary/20 opacity-70 hover:opacity-100 focus:outline-none"
                      aria-label="Toggle Lessons"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/40 cursor-not-allowed">
                    <div className="flex items-center space-x-3 truncate">
                      <Lock className="shrink-0 h-4 w-4" />
                      <span className="truncate">{mod.title}</span>
                    </div>
                  </div>
                )}
                
                {/* Lessons Accordion */}
                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 pb-2 pl-10 pr-2 space-y-1">
                        {mod.lessons.map((lesson, i) => {
                          const isCurrentLesson = isActive && activeLessonIndex === i;
                          return (
                            <div 
                              key={i} 
                              className={`text-xs px-2 py-1.5 rounded-md transition-colors truncate cursor-pointer ${
                                isCurrentLesson 
                                  ? "text-sidebar-primary bg-sidebar-accent font-semibold" 
                                  : "text-sidebar-foreground/60 hover:text-sidebar-primary hover:bg-sidebar-accent"
                              }`}
                            >
                              {lesson}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
