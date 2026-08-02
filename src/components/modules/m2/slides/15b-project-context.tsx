import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { PROJECT_SPINES } from "@/lib/course-data";
import {
  CheckSquare, Copy, Check, Folder, FileText, ArrowRight, ArrowLeft, ChevronRight,
  Sparkles, PartyPopper, CircleAlert, FolderTree, BookOpen, PencilLine,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const PROJECT_CONTEXT_PROMPTS: Record<string, { title: string, prompt: string }> = {
  bi_dashboard: {
    title: "Dynamic BI Dashboard",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Dynamic BI Dashboard (a generative UI dashboard for querying live data visually). I need to create a comprehensive `AI_CONTEXT.md` file to feed into AI coding assistants so they follow my strict architecture and design rules.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Charting libraries (e.g., Recharts vs. D3).\n2. State management for applied data filters (e.g., URL search params vs. Zustand).\n3. Security rules for executing AI-generated SQL queries.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System (including accessible color-blind palettes), and Domain-Specific constraints."
  },
  dynamic_onboarding: {
    title: "Conversational Onboarding",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Conversational Onboarding Web App (dynamic form generation based on conversational input). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Real-time streaming architecture (WebSockets vs. Server-Sent Events).\n2. Complex nested form state management (e.g., React Hook Form).\n3. Micro-interactions and motion (e.g., Framer Motion for chat bubble entrances).\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints for managing conversational state."
  },
  hitl_control_center: {
    title: "Human-in-the-Loop Control Center",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Human-in-the-Loop Control Center (to monitor, review, and approve automated AI agent tasks). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Optimistic UI update patterns for human approvals.\n2. High-density data-grid libraries (e.g., AG Grid vs. TanStack Table).\n3. Strict status color tokens and Role-Based Access Control (RBAC).\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  os_assistant: {
    title: "OS-Level Workflow Assistant",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building an OS-Level Workflow Assistant (a desktop agent that integrates with the OS). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Desktop framework (e.g., Tauri vs. Electron) and IPC (Inter-Process Communication).\n2. Frameless window styling and system-tray UX.\n3. Security boundaries for accessing the local file system or clipboard.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System (including OS-native font stacks), and Domain-Specific constraints."
  },
  edge_health_coach: {
    title: "Edge-AI Health Coach",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building an Edge-AI Health Coach (running local small models on wearable data). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Web Worker architecture to run ONNX models without blocking the UI thread.\n2. Local data persistence (e.g., SQLite via WASM or IndexedDB).\n3. Mobile-first touch targets, gestures, and biometric data visualizations.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  internal_rag_agent: {
    title: "Enterprise Knowledge Navigator",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building an Enterprise Knowledge Navigator (an internal RAG application grounded in private company docs). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Strict authentication boundaries (e.g., JWT validation on all retrieval routes).\n2. Command+K search palettes and markdown rendering with citations.\n3. Chat session persistence and memory management.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  synthetic_podcast_generator: {
    title: "Synthetic Podcast Generator",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Synthetic Podcast Generator (orchestrating multi-speaker synthetic audio). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Background asynchronous job queues (e.g., Redis/BullMQ) for audio processing.\n2. Handling and streaming large blob storage (e.g., AWS S3).\n3. Sticky global playback controls and audio waveform visualizations.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  viral_clip_engine: {
    title: "Longform-to-Viral Clip Engine",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Longform-to-Viral Clip Engine (extracting highlights and generating kinetic typography). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. FFMPEG processing architecture (e.g., generating low-res web proxies).\n2. Timeline and scrubber UI components for managing video trim state.\n3. HTML5 Canvas or WebGL architecture for rendering typography previews.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  global_localization: {
    title: "Zero-Touch Localization Engine",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Zero-Touch Localization Engine (translating and lip-syncing global videos). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. i18n routing and managing translation mapping dictionaries.\n2. Mandatory RTL (Right-to-Left) layout support and multi-language font stacks.\n3. Managing webhooks and callbacks from asynchronous lip-sync video generation jobs.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  multichannel_repurposing: {
    title: "Omnichannel Content Repurposer",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building an Omnichannel Content Repurposer (transforming voice memos into platform-specific social content). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Rich-text state management (e.g., TipTap vs. Slate.js).\n2. Complex OAuth flows for posting directly to social media APIs.\n3. Simulating pixel-perfect social media preview cards (Twitter/LinkedIn CSS) and Kanban boards.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  academic_literature_reviewer: {
    title: "Academic Research Synthesizer",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building an Academic Research Synthesizer (ingesting PDFs and drafting literature reviews). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Client-side PDF text extraction (using WebAssembly or Web Workers).\n2. Relational database schema for linking specific papers to exact claims and citations.\n3. Split-pane layout UX (PDF viewer on the left, markdown notes on the right).\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  },
  fiction_world_copilot: {
    title: "Creative World-Building Co-Pilot",
    prompt: "Act as a Staff-Level Software Architect and Lead UI/UX Designer. I am building a Creative World-Building Co-Pilot (a drafting assistant with a persistent lore bible). I need to create a comprehensive `AI_CONTEXT.md` file for my AI coding assistant.\n\nBefore writing the document, ask me 3-5 clarifying questions about my preferences for:\n1. Graph database querying for managing highly interconnected lore without circular dependencies.\n2. Autosave, conflict resolution, and revision history architecture.\n3. Notion-style block editor UX and interactive knowledge graph visualizations.\n\nOnce I answer, generate a complete `AI_CONTEXT.md` containing my Tech Stack, UI/UX Design System, and Domain-Specific constraints."
  }
};

type Step = "learn" | "build" | "verify";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Appended to every spine prompt so the generated initiation document
// explicitly covers the three awareness layers the harness needs.
const CONTEXT_DOC_OUTPUT = `\n\n# OUTPUT REQUIREMENTS\nThe document you generate is the project's canonical context and initiation file. Save it as AI_CONTEXT.md inside the project's docs/ folder. Structure it with these labeled sections: PROJECT BRIEF (what we are building and why, in 2-3 sentences), DOMAIN CONTEXT (who it serves and the domain rules that shape every decision), TECH STACK, UI/UX DESIGN SYSTEM, DOMAIN-SPECIFIC CONSTRAINTS. Keep each section concrete enough that a developer who knows nothing about this project could start building from it.`;

export function ProjectContextSlide({ onComplete }: { onComplete?: () => void }) {
  const { projectSpine, projectSpineAnswers, saveProjectSpineAnswer } = useProgressStore();
  const { track } = useLRS();
  const { setNavOverride } = useCanvasNav();
  const reduce = useReducedMotion();

  const savedAnswers = projectSpineAnswers?.["2"] || {};
  const [completed, setCompleted] = useState(savedAnswers.completed === true);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<Step>(completed ? "verify" : "learn");

  const spineKey = projectSpine ?? "bi_dashboard";
  const config = PROJECT_CONTEXT_PROMPTS[spineKey] ?? PROJECT_CONTEXT_PROMPTS.bi_dashboard;
  const promptForLlm = config.prompt + CONTEXT_DOC_OUTPUT;

  useEffect(() => {
    if (!reduce) {
      gsap.fromTo(".cc-head", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(".cc-step", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 });
    }
  }, [reduce, step]);

  useEffect(() => {
    setNavOverride({
      nextLabel: "Continue",
      nextDisabled: !completed,
      onNext: (handleNext) => {
        if (onComplete) onComplete();
        handleNext();
      },
    });
    return () => setNavOverride(null);
  }, [completed, setNavOverride, onComplete]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptForLlm);
    setCopied(true);
    track(
      "http://adlnet.gov/expapi/verbs/interacted",
      "interacted",
      `http://smartslate.com/activities/module-2/project-context/${spineKey}/copy`,
      "Copy AI Context prompt"
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    setCompleted(true);
    saveProjectSpineAnswer("2", { completed: true });
    track(
      "http://adlnet.gov/expapi/verbs/completed",
      "completed",
      `http://smartslate.com/activities/module-2/project-context/${spineKey}`,
      `Project Context Documentation: ${config.title}`,
      "Learner created their project context documentation.",
      { moduleId: "2", slideId: "m2-project-context" }
    );
  };

  const STEP_LABELS: { key: Step; label: string }[] = [
    { key: "learn", label: "Learn" },
    { key: "build", label: "Build" },
    { key: "verify", label: "Verify" },
  ];
  const stepIndex = STEP_LABELS.findIndex((s) => s.key === step);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden min-h-0 p-4 md:p-6 lg:py-7 max-w-5xl mx-auto relative">
      <div className="absolute top-[15%] right-1/2 translate-x-1/2 w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="cc-head text-center mb-4 relative z-10 shrink-0">
        <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 rounded-2xl border border-primary/20 mb-3">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
          Building Your AI Context
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          AI agents generate better code when they know your architecture. Create your project&apos;s canonical <code className="text-primary">AI_CONTEXT.md</code> — right in this step.
        </p>
      </div>

      {/* Step indicator */}
      <div className="cc-step flex items-center justify-center gap-2 md:gap-3 mb-4 shrink-0 relative z-10">
        {STEP_LABELS.map((s, i) => {
          const isDone = i < stepIndex || (s.key === "verify" && completed);
          const isActive = i === stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2 md:gap-3">
              {i > 0 && <div className={`w-6 md:w-10 h-px ${i <= stepIndex ? "bg-primary/50" : "bg-white/10"}`} />}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  isDone || isActive ? "bg-primary/10 border border-primary/20 text-primary" : "bg-white/5 border border-white/10 text-muted-foreground/60"
                }`}
              >
                {isDone ? <CheckSquare className="w-3.5 h-3.5" /> : <span className="font-mono">{i + 1}</span>}
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === "learn" && (
            <motion.div
              key="learn"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className="space-y-4"
            >
              <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-primary" />
                Your harness can only build what it fully understands. Before a single line of code it needs three layers of awareness — and they all live in your project&apos;s <code className="text-primary">docs/</code> folder.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: BookOpen, title: "What it's building", desc: "The product brief: what the project is, who it serves, and why it exists." },
                  { icon: FolderTree, title: "The domain", desc: "The domain it operates in — the concepts and rules that shape every decision." },
                  { icon: PencilLine, title: "How it's done", desc: "The tech knowledge: stack, design system, and the hard boundaries it must stay inside." },
                ].map((c) => (
                  <div key={c.title} className="p-4 rounded-2xl border bg-card/40 backdrop-blur-xl border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2.5">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>

              {/* The 12 project templates */}
              <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">The 12 project templates</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(PROJECT_SPINES).map(([key, name]) => (
                    <span
                      key={key}
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        key === spineKey ? "bg-primary/15 border border-primary/30 text-primary" : "bg-white/5 border border-white/10 text-muted-foreground"
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep("build")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                >
                  Start building <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "build" && (
            <motion.div
              key="build"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Set up the folder, then generate the document</h3>
                    <p className="text-xs text-muted-foreground">Create the structure and have a real conversation with an LLM.</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep("learn")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border bg-card/40 backdrop-blur-xl border-white/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono">1</span>
                    <h4 className="font-bold text-foreground text-sm">Create the project folder</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">An empty folder on your computer for your capstone project.</p>
                </div>
                <div className="p-4 rounded-2xl border bg-card/40 backdrop-blur-xl border-white/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono">2</span>
                    <h4 className="font-bold text-foreground text-sm">Create a docs subfolder</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Inside the project folder, create a subfolder named <code className="text-primary">docs</code>.</p>
                </div>
              </div>

              {/* LLM prompt panel */}
              <div className="rounded-2xl border border-white/10 bg-background/80 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider truncate">prompt · {config.title}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy prompt"}
                  </button>
                </div>
                <div className="p-4 max-h-48 overflow-y-auto text-[13px] font-mono text-foreground/80 leading-relaxed whitespace-pre-wrap select-all">
                  {promptForLlm}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Paste the prompt into any LLM (ChatGPT, Claude, or Gemini). Answer its clarifying questions, then keep it going until it produces your <code className="text-primary">AI_CONTEXT.md</code>.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Save the generated file as <code className="text-primary">AI_CONTEXT.md</code> in your <code className="text-primary">docs</code> folder when you&apos;re done.</p>
                <button
                  onClick={() => setStep("verify")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                >
                  I&apos;ve generated it <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="verify"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Verify your context document</h3>
                    <p className="text-xs text-muted-foreground">Confirm the file is in place before moving on.</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep("build")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-2">
                {[
                  "Your project folder exists, with a docs/ subfolder inside it",
                  "AI_CONTEXT.md is saved in docs/ and covers WHAT you're building (project brief), the DOMAIN it serves, and HOW it's done (tech stack, design system, constraints)",
                  "Read it back once — would a developer who knows nothing about your project understand all three layers?",
                ].map((check, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl px-4 py-3">
                    <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/90 leading-relaxed">{check}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2.5">
                <CircleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Your agent will read <code className="text-primary">AI_CONTEXT.md</code> on every task from here on. If a decision is still fuzzy, go back and refine it before continuing.</span>
              </div>

              {completed ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
                >
                  <PartyPopper className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">AI context documented</p>
                    <p className="text-xs text-muted-foreground">Your agent now knows your architecture — continue when ready.</p>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={handleComplete}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                >
                  <CheckSquare className="w-4 h-4" /> Mark step complete
                </button>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Not sure what to include? Ask the LLM to explain each section it generates — you are the architect, it is the typist.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
