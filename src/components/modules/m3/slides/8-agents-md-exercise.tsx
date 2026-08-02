import { useEffect, useState, useRef } from "react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Copy, CheckCircle, FileText, TerminalSquare } from "lucide-react";
import { gsap } from "gsap";
import { useProgressStore } from "@/store/progress";

const PROMPT_TEXT = `# ROLE & GOAL
You are a Staff-Level Developer Productivity Engineer. Your goal is to help me set up a world-class AI harness and repository configuration for my specific project. 

# INSTRUCTIONS
1. INITIALIZE: First, check if you have a \`brainstorming\` skill installed. If you do not have it, immediately research and download/create a high-quality brainstorming skill.
2. DISCOVERY: Ask me what my project is about and wait for my reply! Do NOT generate the AGENTS.md yet. Once I tell you my project context, use your brainstorming skill to lead an interactive session with me to figure out the absolute best stack, specialized skills, and MCP (Model Context Protocol) servers required for my exact project.
3. HARNESS SETUP: Walk me step-by-step through installing the recommended MCPs, configuring the required agentic skills, and setting up all necessary API keys and environment variables in my harness.
4. DOCUMENTATION: My project already has a \`docs/\` folder containing PRODUCT.md, DOMAIN.md, ARCHITECTURE.md, DESIGN.md, CONSTRAINTS.md, and DECISIONS.md. Read these files before anything else and always ground your work in them. Then create a detailed technical architecture document and save it in my \`docs/\` directory.
5. AGENTS.MD CREATION: Finally, synthesize our entire setup into a world-class \`AGENTS.md\` document. This file will serve as the master system prompt for all autonomous agents in this repository.

# AGENTS.MD REQUIREMENTS
The final \`AGENTS.md\` output MUST be formatted as a single, copyable Markdown code block and contain:
- **Core Architecture & Stack:** The exact frameworks, languages, and technical constraints.
- **Required MCP Servers:** The 3-5 specific MCPs we selected and why they are necessary.
- **API Keys & Secrets:** The definitive checklist of environment variables needed.
- **Agentic Skills:** The specialized skills (e.g., 'frontend-design-taste', 'database-migration') the agent must invoke.
- **Hard Boundaries & Rules:** Strict development rules (e.g., no placeholder code, strict TypeScript, design constraints).
- **Documentation Governance:** The agent must check the project's documentation folder at the start of every task, must keep that documentation updated and clear by recording every step performed and every change made, and must always stick to the contents of the documentation and respect its boundaries — never improvising past what the documentation defines.
- **Living Documentation:** The agent must treat the documentation folder as the living source of truth — reading it at the start of every task, and updating or editing the existing files to always reflect the current status of the codebase, applied immediately after any change is made, in the same loop as the change itself.

Remember: Start by asking me about my project!`;

export function AgentsMdExerciseSlide({ onComplete }: { onComplete?: () => void }) {
  const [copied, setCopied] = useState(false);
  const { setNavOverride } = useCanvasNav();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Persistence
  const projectSpineAnswers = useProgressStore((state) => state.projectSpineAnswers);
  const saveProjectSpineAnswer = useProgressStore((state) => state.saveProjectSpineAnswer);
  
  const savedAnswer = projectSpineAnswers["m3"]?.agentsMd || "";
  const [content, setContent] = useState(savedAnswer);

  // Validation: Check if the user pasted a reasonable chunk of markdown
  const isValid = content.length > 200 && (content.includes("#") || content.toLowerCase().includes("mcp"));

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    setNavOverride({
      nextLabel: isValid ? "Deliverable Accepted" : "Paste AGENTS.md to Continue",
      nextDisabled: !isValid,
      onNext: (handleNext) => {
        // Save to database/store
        const existingAnswers = useProgressStore.getState().projectSpineAnswers["m3"] || {};
        saveProjectSpineAnswer("m3", { ...existingAnswers, agentsMd: content });
        
        if (onComplete) onComplete();
        handleNext();
      },
    });
    return () => setNavOverride(null);
  }, [isValid, content, onComplete, setNavOverride, saveProjectSpineAnswer]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 md:p-10 max-w-7xl mx-auto relative group">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,218,219,0.05),transparent_70%)] pointer-events-none" />

      <div ref={containerRef} className="flex-1 w-full flex flex-col lg:flex-row gap-8 relative z-10 min-h-0">
        
        {/* Left Column: Instructions and Prompt */}
        <div className="flex-1 flex flex-col justify-center min-h-0 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3 w-fit">
            <TerminalSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Interactive Lab</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight mb-3">
            Draft Your AGENTS.md
          </h2>
          
          <p className="text-white/70 mb-5 leading-relaxed text-sm">
            Your AI harness needs clear rules of engagement. Let's build the foundational <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-xs">AGENTS.md</code> file for your workspace, including research on the exact MCP servers your specific project will require.
          </p>
          
          <div className="flex flex-col gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-primary" />
                Your Task
              </strong>
              <button 
                onClick={handleCopy}
                className="flex items-center justify-center p-2.5 bg-secondary hover:bg-secondary/90 rounded-lg text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] group relative"
                aria-label="Copy Prompt"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-white/10 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                  {copied ? "Copied!" : "Copy Prompt"}
                </span>
              </button>
            </div>
            
            <ol className="list-decimal pl-4 space-y-2 text-xs md:text-sm text-primary/90 leading-relaxed">
              <li>Copy the prompt using the button above.</li>
              <li>Paste into your harness (Antigravity, Cursor, etc).</li>
              <li>Brainstorm stack & MCPs with the AI based on your project.</li>
              <li>Paste the generated markdown on the right.</li>
            </ol>
          </div>
        </div>

        {/* Right Column: Textarea Deliverable */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium text-white/70 font-mono">AGENTS.md</span>
            </div>
            {isValid && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Validated
              </span>
            )}
          </div>
          <div className="flex-1 p-2 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your generated AGENTS.md content here to continue..."
              className="w-full h-full bg-transparent text-white/90 font-mono text-sm p-4 resize-none focus:outline-none placeholder:text-white/20"
              spellCheck="false"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
