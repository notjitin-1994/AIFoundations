import { useEffect, useState } from "react";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { TemplateData } from "@/lib/m5-template-data";
import { GitBranch, Globe, Database, ArrowRight } from "lucide-react";
import { useNarrationStore } from "@/store/narration";
import { useLRS } from "@/hooks/use-lrs";
import { useProgressStore } from "@/store/progress";

export function FinalDeliverablesSlide({ data, onComplete }: { data: TemplateData, onComplete?: () => void }) {
  const { isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const { saveProjectSpineAnswer } = useProgressStore();

  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [dbUrl, setDbUrl] = useState("");

  const isValid = githubUrl.trim().length > 5 && liveUrl.trim().length > 5;

  useEffect(() => {
    setNavOverride({
      nextLabel: "Submit Capstone",
      nextDisabled: !isFinished || !isValid,
      onNext: (handleNext) => {
        saveProjectSpineAnswer("5", { tempChoice: liveUrl });
        console.log("Submitting deliverables:", { githubUrl, liveUrl, dbUrl });
        handleNext();
        if (onComplete) onComplete();
      }
    });
    return () => setNavOverride(null);
  }, [isFinished, isValid, githubUrl, liveUrl, dbUrl, setNavOverride, onComplete, saveProjectSpineAnswer]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-10 max-w-4xl mx-auto overflow-hidden">
      
      <div className="text-center mb-2 md:mb-4 w-full shrink-0">
        <h2 className="text-xl md:text-3xl font-extrabold text-white mb-0.5 md:mb-1 tracking-tight">Capstone Submission</h2>
        <p className="text-white/60 text-xs md:text-sm font-light">Provide the links to your completed <span className="font-semibold text-primary">{data.title}</span> project.</p>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-2 md:gap-4 relative bg-black/40 border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl shrink-0">
        
        <div className="space-y-1 md:space-y-1.5 shrink-0">
          <label className="text-[10px] md:text-xs font-medium text-white/80 flex items-center gap-1.5 md:gap-2">
            <GitBranch className="w-3 h-3 md:w-3.5 md:h-3.5" /> Public GitHub Repository <span className="text-red-400">*</span>
          </label>
          <input 
            type="url"
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/m5/slides/9/github-url",
                "GitHub URL Input"
              );
            }}
            placeholder="https://github.com/username/project"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="space-y-1 md:space-y-1.5 shrink-0">
          <label className="text-[10px] md:text-xs font-medium text-white/80 flex items-center gap-1.5 md:gap-2">
            <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" /> Live Hosting URL (Vercel, Netlify) <span className="text-red-400">*</span>
          </label>
          <input 
            type="url"
            value={liveUrl}
            onChange={(e) => {
              setLiveUrl(e.target.value);
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/m5/slides/9/live-url",
                "Live URL Input"
              );
            }}
            placeholder="https://my-project.vercel.app"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="space-y-1 md:space-y-1.5 shrink-0">
          <label className="text-[10px] md:text-xs font-medium text-white/80 flex items-center gap-1.5 md:gap-2">
            <Database className="w-3 h-3 md:w-3.5 md:h-3.5" /> Database / Backend URL (Optional)
          </label>
          <input 
            type="url"
            value={dbUrl}
            onChange={(e) => {
              setDbUrl(e.target.value);
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/m5/slides/9/db-url",
                "Database URL Input"
              );
            }}
            placeholder="https://supabase.com/dashboard/project/..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="mt-1 md:mt-2 p-2 md:p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-2 shrink-0">
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] md:text-xs text-primary/90 leading-snug md:leading-relaxed">
            By submitting, you confirm that your agent loop operates autonomously, utilizes proper context injection, and adheres to the best practices discussed in this module.
          </p>
        </div>

      </div>
    </div>
  );
}
