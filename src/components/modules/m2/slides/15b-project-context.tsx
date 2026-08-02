import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import {
  CheckSquare, Copy, Check, Folder, FileText, ArrowRight,
  Sparkles, FolderTree, BookOpen, PencilLine,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export const PROJECT_CONTEXT_PROMPTS: Record<string, { title: string, prompt: string }> = {
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

// Appended to every spine prompt: drive brainstorm + research, then produce the
// multi-file documentation scaffold (one file per requirement) as separate
// code blocks the learner saves verbatim.
export const SCAFFOLD_REQUIREMENTS = `\n\n# SCAFFOLDING REQUIREMENTS — BRAINSTORM, RESEARCH, CREATE
1. BRAINSTORM: lead a short Q&A with me (never skip it) to pin down what the product is, the domain it serves, the stack, the design rules, and the hard constraints.
2. RESEARCH: before writing anything, research the internet extensively for industry-standard practices in this exact domain and stack — architecture patterns, libraries, security, and accessibility.
3. CREATE: produce the documentation scaffold as SEPARATE, labeled Markdown code blocks — one file per block, ready to save verbatim:
   - docs/PRODUCT.md — what we are building and why, who it serves, goals and non-goals.
   - docs/DOMAIN.md — the domain: key concepts, glossary, and the domain rules that shape every decision.
   - docs/ARCHITECTURE.md — how it is built: stack with versions, components, data flow, how the pieces fit.
   - docs/DESIGN.md — the UI/UX design system: tokens, components, accessibility rules.
   - docs/CONSTRAINTS.md — hard boundaries: security, formats, workflows, non-negotiables.
   - docs/DECISIONS.md — a decision log the agent must append to whenever it makes a significant choice (what was decided, why, alternatives considered).
Keep every file concrete enough that a developer who knows nothing about this project could start building from it.`;

// The scaffold the learner produces — one file per requirement (AGENTS.md is
// built in the next module).
export const SCAFFOLD_FILES = [
  { file: "docs/PRODUCT.md", purpose: "what we're building & why" },
  { file: "docs/DOMAIN.md", purpose: "the domain, concepts & rules" },
  { file: "docs/ARCHITECTURE.md", purpose: "stack, components, data flow" },
  { file: "docs/DESIGN.md", purpose: "UI/UX design system" },
  { file: "docs/CONSTRAINTS.md", purpose: "hard boundaries" },
  { file: "docs/DECISIONS.md", purpose: "decision log" },
];

// The full prompt pasted into any LLM: the spine brief + scaffold requirements.
export function getScaffoldPrompt(spineKey: string): string {
  const config = PROJECT_CONTEXT_PROMPTS[spineKey] ?? PROJECT_CONTEXT_PROMPTS.bi_dashboard;
  return config.prompt + SCAFFOLD_REQUIREMENTS;
}

export function ProjectContextSlide({ onComplete }: { onComplete?: () => void }) {
  const { projectSpine } = useProgressStore();
  const { track } = useLRS();
  const { setNavOverride } = useCanvasNav();
  const reduce = useReducedMotion();

  const [copied, setCopied] = useState(false);

  const spineKey = projectSpine ?? "bi_dashboard";
  const config = PROJECT_CONTEXT_PROMPTS[spineKey] ?? PROJECT_CONTEXT_PROMPTS.bi_dashboard;
  const promptForLlm = getScaffoldPrompt(spineKey);

  useEffect(() => {
    if (!reduce) {
      gsap.fromTo(".cc-head", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(".cc-body", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.15 });
    }
  }, [reduce]);

  useEffect(() => {
    setNavOverride({
      nextLabel: "Continue",
      nextDisabled: false,
      onNext: (handleNext) => {
        if (onComplete) onComplete();
        handleNext();
      },
    });
    return () => setNavOverride(null);
  }, [setNavOverride, onComplete]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptForLlm);
    setCopied(true);
    track(
      "http://adlnet.gov/expapi/verbs/interacted",
      "interacted",
      `http://smartslate.com/activities/module-2/project-context/${spineKey}/copy`,
      "Copy scaffold prompt"
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden min-h-0 p-3 md:p-5 max-w-5xl mx-auto relative">
      <div className="absolute top-[12%] right-1/2 translate-x-1/2 w-[340px] h-[340px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="cc-head text-center mb-2 md:mb-3 relative z-10 shrink-0">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl border border-primary/20 mb-2">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
          Building Your AI Context
        </h2>
        <p className="text-xs md:text-base text-muted-foreground max-w-2xl mx-auto">
          Scaffold the documentation your harness needs — then paste each file into the course.
        </p>
      </div>

      <div className="cc-body relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col gap-2.5">
        <p className="text-xs md:text-base text-muted-foreground max-w-3xl">
          <Sparkles className="w-3.5 h-3.5 inline mr-1 text-primary" />
          A harness can only build what it fully understands. It needs <strong className="text-foreground">what</strong> it's building, the <strong className="text-foreground">domain</strong>, and <strong className="text-foreground">how</strong> it's done — each as its own file in <code className="text-primary">docs/</code>.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: BookOpen, label: "What it's building" },
            { icon: FolderTree, label: "The domain" },
            { icon: PencilLine, label: "How it's done" },
          ].map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full bg-card/40 backdrop-blur-xl border border-white/10 px-2.5 py-1 text-[11px] md:text-sm font-semibold text-foreground/80">
              <c.icon className="w-3.5 h-3.5 text-primary" />
              {c.label}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 backdrop-blur-xl px-3 py-2 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
            <Folder className="w-4 h-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/70">Your project</p>
            <p className="text-sm md:text-base font-bold text-foreground truncate">{config.title}</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-xl p-2.5">
          <div className="flex flex-wrap gap-1.5">
            {SCAFFOLD_FILES.map((f) => (
              <span key={f.file} className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5">
                <FileText className="w-3 h-3 text-primary shrink-0" />
                <span className="text-[11px] md:text-sm font-mono text-foreground/80 font-semibold">{f.file}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] md:text-sm text-muted-foreground mt-1.5 leading-snug">
            Six documents, one per requirement — you&apos;ll paste each one into the course on the next six screens.
          </p>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white text-sm md:text-base font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Prompt copied" : "Copy scaffold prompt"}
          </button>
          <p className="text-[11px] md:text-sm text-muted-foreground">
            The prompt makes the LLM brainstorm with you, research your domain, and generate all six files as separate code blocks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end">
          <CheckSquare className="w-4 h-4 text-primary" />
          <span className="text-[11px] md:text-sm text-muted-foreground">Paste each generated file into the matching screen.</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );
}
