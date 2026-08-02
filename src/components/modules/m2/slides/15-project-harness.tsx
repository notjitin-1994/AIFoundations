import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import {
  CheckCircle2, LayoutTemplate, Terminal, PenLine, ExternalLink, Copy, ArrowRight, ArrowLeft,
  ChevronRight, Sparkles, CircleAlert, PartyPopper, Download,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLRS } from "@/hooks/use-lrs";

interface ToolInfo {
  id: string;
  name: string;
  tagline: string;
  docsUrl: string;
  recommended?: boolean;
  install: { mac: string; windows: string; pkg: string };
  verify: string;
  pathNote?: string;
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const TOOLS: ToolInfo[] = [
  {
    id: "antigravity",
    name: "Antigravity CLI / Desktop",
    tagline: "Google's agentic CLI — eight models in one terminal, built-in MCP registry and skills management. Runs as the `agy` command.",
    docsUrl: "https://antigravity.google/docs/cli-getting-started",
    recommended: true,
    install: {
      mac: "curl -fsSL https://antigravity.google/cli/install.sh | bash",
      windows: "irm https://antigravity.google/cli/install.ps1 | iex",
      pkg: "brew install antigravity-cli",
    },
    verify: "agy --version",
    pathNote: "If `agy` is not found, add the install folder to your PATH: export PATH=\"$HOME/.local/bin:$PATH\"",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    tagline: "Anthropic's agentic CLI that runs Claude directly in your terminal and editor.",
    docsUrl: "https://docs.anthropic.com/en/docs/claude-code",
    install: {
      mac: "npm install -g @anthropic-ai/claude-code",
      windows: "npm install -g @anthropic-ai/claude-code",
      pkg: "brew install --cask claude-code",
    },
    verify: "claude --version",
  },
  {
    id: "codex",
    name: "OpenAI Codex CLI",
    tagline: "OpenAI's coding agent that turns natural language into working code in the terminal.",
    docsUrl: "https://developers.openai.com/codex/",
    install: {
      mac: "npm install -g @openai/codex",
      windows: "npm install -g @openai/codex",
      pkg: "brew install codex",
    },
    verify: "codex --version",
  },
  {
    id: "opencode",
    name: "OpenCode",
    tagline: "An open-source, privacy-first agentic coding CLI for your terminal.",
    docsUrl: "https://opencode.ai/docs",
    install: {
      mac: "npm i -g opencode-ai",
      windows: "npm i -g opencode-ai",
      pkg: "brew install opencode",
    },
    verify: "opencode --version",
  },
  {
    id: "cursor",
    name: "Cursor",
    tagline: "An AI-first code editor with a built-in agent (also ships a CLI).",
    docsUrl: "https://cursor.com",
    install: {
      mac: "Download the installer from cursor.com",
      windows: "Download the installer from cursor.com",
      pkg: "brew install --cask cursor",
    },
    verify: "Open the Cursor app and sign in",
  },
  {
    id: "cline",
    name: "Cline",
    tagline: "An autonomous coding agent that lives inside VS Code as an extension.",
    docsUrl: "https://cline.bot",
    install: {
      mac: "Install the Cline extension from the VS Code marketplace",
      windows: "Install the Cline extension from the VS Code marketplace",
      pkg: "code --install-extension saoudrizwan.claude-dev",
    },
    verify: "Open Cline inside VS Code",
  },
  {
    id: "aider",
    name: "Aider",
    tagline: "An open-source, terminal-based pair programmer for AI-assisted git workflows.",
    docsUrl: "https://aider.chat/docs",
    install: {
      mac: "pip install -U aider-chat",
      windows: "python -m pip install -U aider-chat",
      pkg: "brew install aider",
    },
    verify: "aider --version",
  },
];

type Step = "research" | "install" | "verify";
type Platform = "mac" | "windows" | "pkg";

export function ProjectHarnessSlide({ onComplete }: { onComplete?: () => void }) {
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const reduce = useReducedMotion();

  const [step, setStep] = useState<Step>("research");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("mac");
  const [copied, setCopied] = useState(false);
  const [verified, setVerified] = useState(false);

  const selected = TOOLS.find((t) => t.id === selectedId) ?? null;

  useEffect(() => {
    if (!reduce) {
      gsap.fromTo(".ph-head", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(".ph-step", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 });
    }
  }, [reduce, step]);

  const trackInteraction = (action: string, label: string) => {
    track(
      "http://adlnet.gov/expapi/verbs/interacted",
      "interacted",
      `http://smartslate.com/activities/m2/slides/15/project-harness/${action}`,
      label
    );
  };

  useEffect(() => {
    const complete = verified;
    setNavOverride({
      nextDisabled: !complete,
      nextLabel: complete ? "Continue" : "Install & verify your harness",
      onNext: (handleNext) => {
        if (onComplete) onComplete();
        handleNext();
      },
    });
    return () => setNavOverride(null);
  }, [verified, onComplete, setNavOverride]);

  const copyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      trackInteraction("copy-install", "Copy install command");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the command stays visible to copy manually.
    }
  };

  const selectTool = (tool: ToolInfo) => {
    setSelectedId(tool.id);
    setVerified(false);
    setPlatform("mac");
    trackInteraction("select-tool", `Select ${tool.name}`);
    setStep("install");
  };

  const confirmInstalled = () => {
    setVerified(true);
    trackInteraction("verify-install", "Verified harness installation");
  };

  const STEP_LABELS: { key: Step; label: string }[] = [
    { key: "research", label: "Research" },
    { key: "install", label: "Install" },
    { key: "verify", label: "Verify" },
  ];
  const stepIndex = STEP_LABELS.findIndex((s) => s.key === step);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden min-h-0 p-4 md:p-6 lg:py-7 max-w-5xl mx-auto relative">
      <div className="absolute top-[15%] right-1/2 translate-x-1/2 w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="ph-head text-center mb-4 relative z-10 shrink-0">
        <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 rounded-2xl border border-primary/20 mb-3">
          <LayoutTemplate className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
          Choose Your Harness
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Research the tools, install your harness, and verify it works — right in this step.
        </p>
      </div>

      {/* Step indicator */}
      <div className="ph-step flex items-center justify-center gap-2 md:gap-3 mb-4 shrink-0 relative z-10">
        {STEP_LABELS.map((s, i) => {
          const isDone = i < stepIndex || (s.key === "verify" && verified);
          const isActive = i === stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2 md:gap-3">
              {i > 0 && <div className={`w-6 md:w-10 h-px ${i <= stepIndex ? "bg-primary/50" : "bg-white/10"}`} />}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  isDone || isActive ? "bg-primary/10 border border-primary/20 text-primary" : "bg-white/5 border border-white/10 text-muted-foreground/60"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="font-mono">{i + 1}</span>}
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === "research" && (
            <motion.div
              key="research"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className="space-y-4"
            >
              <p className="text-xs md:text-sm text-muted-foreground max-w-3xl">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-primary" />
                Spend a few minutes researching before you commit — check each tool's official docs. Pick the harness you'll actually run your agent in.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    className="text-left p-4 rounded-2xl border bg-card/40 backdrop-blur-xl border-white/10 hover:border-primary/40 hover:bg-card/60 transition-all duration-200 group relative overflow-hidden"
                  >
                    {tool.recommended && (
                      <span className="absolute top-3 right-3 text-[9px] uppercase font-black tracking-wider bg-primary text-background px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Terminal className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-sm">{tool.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{tool.tagline}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary/70 group-hover:text-primary">
                      Official docs <ExternalLink className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "install" && selected && (
            <motion.div
              key="install"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{selected.name}</h3>
                    <p className="text-xs text-muted-foreground">Run this command in your terminal to install the tool.</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedId(null); setVerified(false); setStep("research"); }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to research
                </button>
              </div>

              {/* Platform selector */}
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] w-max">
                {([
                  { key: "mac", label: "macOS / Linux" },
                  { key: "windows", label: "Windows" },
                  { key: "pkg", label: "Package manager" },
                ] as const).map((p) => (
                  <button
                    key={p.key}
                    onClick={() => { setPlatform(p.key); setCopied(false); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      platform === p.key ? "bg-card text-foreground shadow-sm ring-1 ring-white/10" : "text-muted-foreground hover:text-foreground/80"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Command block */}
              <div className="rounded-2xl border border-white/10 bg-background/80 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Terminal</span>
                  <button
                    onClick={() => copyCommand(selected.install[platform])}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="px-4 py-3.5 text-sm font-mono text-primary whitespace-pre-wrap break-all leading-relaxed">
                  {selected.install[platform]}
                </pre>
              </div>

              {selected.pathNote && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2.5">
                  <CircleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-mono">{selected.pathNote}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Run the command, then open a fresh terminal window before verifying.
                </p>
                <button
                  onClick={() => setStep("verify")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                >
                  I&apos;ve installed it <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === "verify" && selected && (
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
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Verify the install</h3>
                    <p className="text-xs text-muted-foreground">Confirm the tool is really working before moving on.</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep("install")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background/80 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">Verify command</span>
                  <button
                    onClick={() => copyCommand(selected.verify)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="px-4 py-3.5 text-sm font-mono text-primary whitespace-pre-wrap break-all leading-relaxed">
                  {selected.verify}
                </pre>
              </div>

              <p className="text-xs text-muted-foreground">
                Run it in the fresh terminal you opened after installing. You should see a version string — if the command is not found, check your PATH or re-read the install step.
              </p>

              {verified ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
                >
                  <PartyPopper className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Harness installed and verified</p>
                    <p className="text-xs text-muted-foreground">You&apos;re ready to continue — this harness will host your agent through the rest of the course.</p>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={confirmInstalled}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-white text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> I&apos;ve installed and verified it
                </button>
              )}

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <PenLine className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Using a different tool? Open its official docs (<ChevronRight className="w-3 h-3 inline" />{" "}
                  <a href={selected.docsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {selected.name} docs
                  </a>
                  ) for the exact install + verification steps for your platform.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
