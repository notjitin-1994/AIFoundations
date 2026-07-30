import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { Copy, Check, Search } from "lucide-react";

const PROJECTS: Record<string, { title: string, description: string }> = {
  bi_dashboard: { title: 'Dynamic BI Dashboard', description: 'Generative UI dashboard for querying live data visually.' },
  dynamic_onboarding: { title: 'Conversational Onboarding', description: 'Dynamic form generation based on conversational input.' },
  hitl_control_center: { title: 'Human-in-the-Loop Control Center', description: 'A web interface to monitor agentic loop engineering, allowing humans to review, steer, and approve automated tasks.' },
  os_assistant: { title: 'OS-Level Workflow Assistant', description: 'Desktop agent that integrates with the OS to summarize documents and draft messages natively.' },
  edge_health_coach: { title: 'Edge-AI Health Coach', description: 'Smartphone app running local small models to securely interpret raw wearable data without cloud processing.' },
  internal_rag_agent: { title: 'Enterprise Knowledge Navigator', description: 'An internal RAG application that securely grounds AI answers in private company documentation and wikis.' },
  synthetic_podcast_generator: { title: 'Synthetic Podcast Generator', description: 'Pipeline that ingests dense documents and orchestrates a multi-speaker synthetic audio podcast summarizing key points.' },
  viral_clip_engine: { title: 'Longform-to-Viral Clip Engine', description: 'Autonomous pipeline that extracts podcast highlights, generates synthetic B-roll, and adds kinetic typography.' },
  global_localization: { title: 'Zero-Touch Localization Engine', description: 'Pipeline that translates master videos, generates localized audio, and perfectly lip-syncs the original speaker.' },
  multichannel_repurposing: { title: 'Omnichannel Content Repurposer', description: 'A single-input engine that transforms messy voice memos or transcripts into polished blogs, newsletters, and social carousels.' },
  academic_literature_reviewer: { title: 'Academic Research Synthesizer', description: 'Ingest folders of PDFs and extract core methodologies to autonomously draft structured literature reviews with citations.' },
  fiction_world_copilot: { title: 'Creative World-Building Co-Pilot', description: 'A drafting assistant that references a persistent lore bible to ensure character voices and story logic remain perfectly consistent.' }
};

export function ProjectToolbeltResearchSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { track } = useLRS();
  const { projectSpine } = useProgressStore();
  const [copied, setCopied] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const spineKey = projectSpine ?? "bi_dashboard";
  const projectData = PROJECTS[spineKey] || PROJECTS["bi_dashboard"];

  const promptText = `Act as a Senior AI Architect. I am building a ${projectData.title} that is a ${projectData.description.toLowerCase()} What are the top 3 MCP servers, top 3 CLI/System tools, and top 3 specific SKILL.md rulesets I need to configure in my AI harness to make this work? Provide a structured list.`;

  useEffect(() => {
    // Narration: "It is time to architect the toolbelt for your specific capstone project. An agent is only as good as the tools it can reach. I want you to open Gemini or ChatGPT in another tab, and paste in this exact prompt. We're going to ask the AI to design the required MCP servers, CLI tools, and skills needed for your chosen project spine. Click the copy button, run the search, and when you have your answers, move to the next screen to document them."
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

  useEffect(() => {
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    track("http://adlnet.gov/expapi/verbs/interacted", "interacted", "http://smartslate.com/activities/m3/slides/21/copy_prompt", "Copy Toolbelt Prompt");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4 md:p-6 max-w-4xl mx-auto items-center justify-center relative">
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-4 relative z-10 w-full shrink-0">
        <div className="inline-flex items-center justify-center p-2.5 bg-primary/10 rounded-2xl border border-primary/20 mb-2 shadow-[0_0_30px_rgba(167,218,219,0.2)]">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-2 tracking-tight">
          Research Your Toolbelt
        </h2>
        <p className="text-primary/70 text-sm md:text-base font-medium max-w-2xl mx-auto">
          Let's figure out exactly which MCPs and tools you need to build your <strong className="text-white">{projectData.title}</strong>.
        </p>
      </div>

      <div className="w-full bg-[#0a0a0a] backdrop-blur-3xl border border-white/10 rounded-3xl p-5 md:p-6 relative flex flex-col items-start shadow-xl z-10 shrink-0 min-h-0">
        <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-primary/20">
          Interactive Lab
        </div>
        
        <h3 className="text-lg md:text-xl font-bold text-white mb-3">Setup Instructions</h3>
        
        <div className="w-full flex flex-col items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl overflow-y-auto">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
              <Search className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm text-primary/90 leading-relaxed">
              <strong className="text-white block mb-2 text-sm">Your Task:</strong>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click <strong>Copy Prompt</strong> below to grab your personalized architectural instructions.</li>
                <li>Open your CLI or desktop AI harness (like <strong>Antigravity</strong> or Cursor).</li>
                <li>Paste the prompt. The AI will immediately act as a Senior AI Architect and design the optimal MCP servers, CLI tools, and agentic skills for your project.</li>
                <li>Review its recommendations. <strong>Keep the AI's answer handy</strong>—you will need to input these components on the next screen to assemble your toolbelt!</li>
              </ol>
            </div>
          </div>
          
          <button 
            onClick={handleCopy}
            className="mt-2 flex items-center justify-center w-full py-3 bg-primary text-black hover:bg-primary/90 rounded-xl text-sm md:text-base font-bold transition-all shadow-[0_0_20px_rgba(167,218,219,0.3)] hover:shadow-[0_0_30px_rgba(167,218,219,0.5)] active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
            {copied ? "Prompt Copied to Clipboard!" : "Copy Research Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
