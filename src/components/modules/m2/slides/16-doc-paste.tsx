import { useEffect, useRef, useState } from "react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { Copy, CheckCircle, FileText } from "lucide-react";
import { gsap } from "gsap";
import { useProgressStore } from "@/store/progress";
import { getScaffoldPrompt } from "./15b-project-context";

interface DocPasteSlideProps {
  /** Store key under projectSpineAnswers["2"], e.g. "productMd". */
  docKey: string;
  /** Display file name, e.g. "docs/PRODUCT.md". */
  fileName: string;
  /** Slide title, e.g. "Paste your PRODUCT.md". */
  title: string;
  /** One-line reminder of what this document covers. */
  description: string;
  onComplete?: () => void;
}

/**
 * Replicates the m3 AGENTS.md data-collection implementation: the learner copies
 * the scaffold prompt, pastes the generated document (one slide per file) into
 * the editor, and it is validated and persisted to the database via
 * saveProjectSpineAnswer("2", { [docKey]: content }) before navigation unlocks.
 */
export function DocPasteSlide({ docKey, fileName, title, description, onComplete }: DocPasteSlideProps) {
  const [copied, setCopied] = useState(false);
  const { setNavOverride } = useCanvasNav();
  const containerRef = useRef<HTMLDivElement>(null);

  const projectSpine = useProgressStore((s) => s.projectSpine);
  const projectSpineAnswers = useProgressStore((s) => s.projectSpineAnswers);
  const saveProjectSpineAnswer = useProgressStore((s) => s.saveProjectSpineAnswer);

  const answers2 = (projectSpineAnswers["2"] ?? {}) as Record<string, unknown>;
  const savedContent = typeof answers2[docKey] === "string" ? (answers2[docKey] as string) : "";
  const [content, setContent] = useState(savedContent);

  const promptForLlm = getScaffoldPrompt(projectSpine ?? "bi_dashboard");
  const isValid = content.length > 150 && content.includes("#");

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    setNavOverride({
      nextLabel: isValid ? "Document Saved" : "Paste the document to continue",
      nextDisabled: !isValid,
      onNext: (handleNext) => {
        const existing = useProgressStore.getState().projectSpineAnswers["2"] || {};
        saveProjectSpineAnswer("2", { ...existing, [docKey]: content });
        if (onComplete) onComplete();
        handleNext();
      },
    });
    return () => setNavOverride(null);
  }, [isValid, content, docKey, onComplete, setNavOverride, saveProjectSpineAnswer]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptForLlm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 max-w-6xl mx-auto relative">
      <div className="absolute top-0 right-0 w-[380px] h-[380px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div ref={containerRef} className="flex-1 w-full flex flex-col lg:flex-row gap-4 relative z-10 min-h-0">
        {/* Left Column: Instructions + Copy */}
        <div className="flex-1 flex flex-col justify-center min-h-0 gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-primary">Document {fileName}</span>
          </div>

          <h2 className="text-xl md:text-3xl font-heading font-bold text-foreground tracking-tight">
            {title}
          </h2>

          <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col gap-2 p-3 md:p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xs md:text-sm text-foreground">Your task</strong>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-white text-xs md:text-sm font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy scaffold prompt"}
              </button>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] md:text-sm text-primary/90 leading-relaxed">
              <li>Copy the prompt with the button above.</li>
              <li>Paste it into your harness (Antigravity, Cursor, etc).</li>
              <li>Answer its questions and let it generate all six documents.</li>
              <li>Paste the generated <code className="bg-primary/10 px-1 rounded">{fileName}</code> into the editor on the right.</li>
            </ol>
          </div>
        </div>

        {/* Right Column: Paste Editor */}
        <div className="flex-1 flex flex-col min-h-0 bg-background/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs md:text-sm font-medium text-foreground/80 font-mono truncate">{fileName}</span>
            </div>
            {isValid && (
              <span className="text-[10px] md:text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1.5 shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
                Validated
              </span>
            )}
          </div>
          <div className="flex-1 p-1.5 min-h-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Paste your generated ${fileName} content here to continue...`}
              className="w-full h-full bg-transparent text-foreground/90 font-mono text-xs md:text-sm p-3 resize-none focus:outline-none placeholder:text-muted-foreground/30"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
