import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useProgressStore } from "@/store/progress";
import { useCanvasNav } from "@/components/lesson/canvas-viewer";
import { useLRS } from "@/hooks/use-lrs";
import { PenTool, Server, Wrench, FileCode2 } from "lucide-react";

export function ProjectToolbeltBlueprintSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const { setNavOverride } = useCanvasNav();
  const { track } = useLRS();
  const { projectSpineAnswers, saveProjectSpineAnswer } = useProgressStore();
  
  const savedAnswers = projectSpineAnswers?.["3"] || {};
  
  const [mcps, setMcps] = useState(savedAnswers.mcps || "");
  const [tools, setTools] = useState(savedAnswers.tools || "");
  const [skills, setSkills] = useState(savedAnswers.skills || "");

  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Narration: "Now that you have your research, it is time to build your blueprint. Document the top MCP servers, CLI tools, and SKILL rulesets you identified. This blueprint will serve as your technical roadmap when we begin assembling the engine room in the next module."
    const timeline = gsap.timeline({ paused: true });
    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  // Hook into canvas nav
  useEffect(() => {
    const isValid = mcps.trim().length > 0 && tools.trim().length > 0 && skills.trim().length > 0;
    
    setNavOverride({
      nextDisabled: !isValid,
      nextLabel: isValid ? "Save Blueprint" : "Complete Blueprint",
      onNext: (handleNext) => {
        saveProjectSpineAnswer("3", { mcps, tools, skills });
        if (onComplete) onComplete();
        handleNext();
      }
    });
    return () => setNavOverride(null);
  }, [mcps, tools, skills, onComplete, setNavOverride, saveProjectSpineAnswer]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 md:py-8 max-w-5xl mx-auto items-center justify-center relative">
      <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-6 relative z-10 w-full shrink-0">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 mb-3 shadow-[0_0_30px_rgba(167,218,219,0.2)]">
          <PenTool className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-4xl font-heading font-black text-white mb-2 tracking-tight">
          Toolbelt Blueprint
        </h2>
        <p className="text-primary/70 text-base md:text-lg font-medium max-w-3xl mx-auto">
          Document the ecosystem you need to build your project.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 flex-1 min-h-0">
        
        {/* MCPs Box */}
        <div className="bg-black/40 border border-white/10 hover:border-primary/30 transition-colors rounded-3xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-white">Required MCPs</h3>
          </div>
          <p className="text-xs text-white/50 mb-3">Which Context Protocols will you connect? (e.g. Postgres, GitHub)</p>
          <textarea
            value={mcps}
            onChange={(e) => {
              setMcps(e.target.value);
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/22/mcps_input", "MCPs Input");
            }}
            className="flex-1 w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-teal-400 resize-none transition-all"
            placeholder="- GitHub MCP\n- Postgres MCP\n..."
          />
        </div>

        {/* Tools Box */}
        <div className="bg-black/40 border border-white/10 hover:border-primary/30 transition-colors rounded-3xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-white">CLI / Base Tools</h3>
          </div>
          <p className="text-xs text-white/50 mb-3">Which system tools will your agent use? (e.g. ffmpeg, python)</p>
          <textarea
            value={tools}
            onChange={(e) => {
              setTools(e.target.value);
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/22/tools_input", "Tools Input");
            }}
            className="flex-1 w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-teal-400 resize-none transition-all"
            placeholder="- Node.js\n- npm\n- git..."
          />
        </div>

        {/* Skills Box */}
        <div className="bg-black/40 border border-white/10 hover:border-primary/30 transition-colors rounded-3xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileCode2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-white">SKILL.md Rules</h3>
          </div>
          <p className="text-xs text-white/50 mb-3">Which specific instructional skills are needed? (e.g. UX Copy)</p>
          <textarea
            value={skills}
            onChange={(e) => {
              setSkills(e.target.value);
              track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/22/skills_input", "Skills Input");
            }}
            className="flex-1 w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-teal-400 resize-none transition-all"
            placeholder="- @frontend-design\n- @tone-of-voice..."
          />
        </div>

      </div>
    </div>
  );
}
