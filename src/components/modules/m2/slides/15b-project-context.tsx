import { useEffect, useState } from "react";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { CheckSquare, Copy, Check, Folder, FileText } from "lucide-react";

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

export function ProjectContextSlide({ onComplete }: { onComplete?: () => void }) {
  const { projectSpine, projectSpineAnswers, saveProjectSpineAnswer } = useProgressStore();
  const { track } = useLRS();
  const { setNavOverride } = useCanvasNav();
  
  const savedAnswers = projectSpineAnswers?.["2"] || {};
  const [completed, setCompleted] = useState(savedAnswers.completed === true);
  const [copied, setCopied] = useState(false);

  const spineKey = projectSpine ?? "bi_dashboard";
  const config = PROJECT_CONTEXT_PROMPTS[spineKey] ?? PROJECT_CONTEXT_PROMPTS.bi_dashboard;

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
    navigator.clipboard.writeText(config.prompt);
    setCopied(true);
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

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto min-h-0 relative p-6 md:p-10 max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full pb-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-2.5 bg-teal-500/10 rounded-xl border border-teal-500/20 mb-4 text-teal-400 font-bold uppercase tracking-widest text-xs">
            Module 2 Project Spine
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 tracking-tight">
            Building Your AI Context
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-relaxed font-medium">
            AI coding agents can generate flawless code, but they need strict guidelines to prevent them from making bad architectural choices. You will use an LLM to brainstorm and generate your project's canonical context document.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Instructions Column */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-indigo-400" /> Setup Instructions
            </h3>
            
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white/80">1</span>
                  Create Project Folder
                </h4>
                <p className="text-white/60 text-sm ml-7">Create an empty folder on your computer for your capstone project.</p>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white/80">2</span>
                  Create Docs Folder
                </h4>
                <p className="text-white/60 text-sm ml-7">Inside your new project folder, create a subfolder named <code>docs</code>.</p>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white/80">3</span>
                  Generate Documentation
                </h4>
                <p className="text-white/60 text-sm ml-7">Copy the prompt on the right and paste it into an LLM (ChatGPT, Claude, or Gemini). Discuss your project with the AI until it generates a complete <code>AI_CONTEXT.md</code> file.</p>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                <h4 className="text-white font-bold mb-1 flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white/80">4</span>
                  Save to Docs
                </h4>
                <p className="text-white/60 text-sm ml-7">Save the generated text as <code>AI_CONTEXT.md</code> inside your <code>docs</code> folder.</p>
              </div>
            </div>
          </div>

          {/* Prompt Column */}
          <div className="md:col-span-7 flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" /> Your Custom LLM Prompt
            </h3>
            
            <div className="flex-1 bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-xs text-white/40 font-mono">prompt_generator.sh</div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1 text-white/80 font-mono text-sm leading-relaxed whitespace-pre-wrap select-all">
                {config.prompt}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleComplete}
                disabled={completed}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                  completed 
                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 cursor-default"
                    : "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
                }`}
              >
                {completed ? (
                  <>
                    <CheckSquare className="w-5 h-5" />
                    Documentation Saved
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-5 h-5 opacity-70" />
                    Mark Step Complete
                  </>
                )}
              </button>
              {!completed && (
                <p className="text-center text-white/40 text-xs mt-3">
                  Take your time. Have a real conversation with the LLM to make all technical decisions before continuing.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
