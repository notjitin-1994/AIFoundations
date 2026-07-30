import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";
import { useProgressStore } from "@/store/progress";
import { Search, FolderTree, FileEdit, Code2, Image as ImageIcon } from "lucide-react";

export function ProjectIntegrationSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { projectSpine } = useProgressStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);
  const slot3Ref = useRef<HTMLDivElement>(null);

  const spineDetails = useMemo(() => {
    switch (projectSpine) {
      case "research_companion":
        return {
          title: "Research Companion",
          color: "teal",
          icon: <Search className="w-10 h-10 text-primary" />,
          bg: "bg-primary/20",
          border: "border-primary/30",
          tools: [
            { name: "Web Search", desc: "For live facts", icon: <Search className="w-5 h-5 text-primary" /> },
            { name: "File Reader", desc: "To parse local PDFs", icon: <FolderTree className="w-5 h-5 text-primary" /> },
            { name: "Code Exec", desc: "For data analysis", icon: <Code2 className="w-5 h-5 text-primary" /> }
          ]
        };
      case "creative_studio":
        return {
          title: "Creative Studio",
          color: "purple",
          icon: <ImageIcon className="w-10 h-10 text-purple-400" />,
          bg: "bg-purple-500/20",
          border: "border-purple-500/30",
          tools: [
            { name: "Image Gen", desc: "DALL-E integration", icon: <ImageIcon className="w-5 h-5 text-purple-300" /> },
            { name: "File Writer", desc: "Save outputs", icon: <FileEdit className="w-5 h-5 text-purple-300" /> },
            { name: "Web Search", desc: "Style references", icon: <Search className="w-5 h-5 text-purple-300" /> }
          ]
        };
      case "content_engine":
      default:
        return {
          title: "Content Engine",
          color: "indigo",
          icon: <FileEdit className="w-10 h-10 text-indigo-400" />,
          bg: "bg-indigo-500/20",
          border: "border-indigo-500/30",
          tools: [
            { name: "Web Search", desc: "SEO research", icon: <Search className="w-5 h-5 text-indigo-300" /> },
            { name: "File Writer", desc: "Draft saving", icon: <FileEdit className="w-5 h-5 text-indigo-300" /> },
            { name: "File Reader", desc: "Brand guidelines", icon: <FolderTree className="w-5 h-5 text-indigo-300" /> }
          ]
        };
    }
  }, [projectSpine]);

  useEffect(() => {
    // Narration: "Think about your chosen project template. Which tools would elevate it from a simple chatbot to a powerful assistant?"
    const timeline = gsap.timeline({ paused: true });

    if (containerRef.current && centerRef.current && slot1Ref.current && slot2Ref.current && slot3Ref.current) {
      // 1. Center project appears
      timeline.fromTo(centerRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }, 0);
      
      // 2. Tools orbit / slot in
      timeline.fromTo(slot1Ref.current, { opacity: 0, x: -50, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 1.5);
      timeline.fromTo(slot2Ref.current, { opacity: 0, x: 50, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 2.0);
      timeline.fromTo(slot3Ref.current, { opacity: 0, y: 50, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 2.5);
    }

    tl.current = timeline;
    return () => {
      timeline.kill();
    };
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden p-6 md:p-10 max-w-5xl mx-auto relative group">
      
      {/* Background Ambience based on spine */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-20 ${spineDetails.color === 'teal' ? 'bg-primary/90' : spineDetails.color === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'}`} />

      <div className="shrink-0 mb-12 z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-sm tracking-tight">
          Equipping Your Project
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Which tools will elevate your {spineDetails.title}?
        </p>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative flex items-center justify-center z-10 min-h-[400px]">
        
        {/* Center Project */}
        <div ref={centerRef} className={`w-40 h-40 rounded-[2.5rem] ${spineDetails.bg} ${spineDetails.border} border backdrop-blur-xl flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] relative z-20`}>
          {spineDetails.icon}
          <span className="text-sm font-bold text-white mt-3 text-center leading-tight">{spineDetails.title}</span>
        </div>

        {/* Orbiting Slots */}
        <div ref={slot1Ref} className="absolute left-[10%] top-[20%] bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-xl backdrop-blur-md">
          <div className={`w-10 h-10 rounded-lg ${spineDetails.bg} flex items-center justify-center border border-white/10`}>
            {spineDetails.tools[0].icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{spineDetails.tools[0].name}</h4>
            <p className="text-xs text-white/50">{spineDetails.tools[0].desc}</p>
          </div>
        </div>

        <div ref={slot2Ref} className="absolute right-[10%] top-[20%] bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-xl backdrop-blur-md">
          <div className={`w-10 h-10 rounded-lg ${spineDetails.bg} flex items-center justify-center border border-white/10`}>
            {spineDetails.tools[1].icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{spineDetails.tools[1].name}</h4>
            <p className="text-xs text-white/50">{spineDetails.tools[1].desc}</p>
          </div>
        </div>

        <div ref={slot3Ref} className="absolute left-1/2 bottom-[10%] -translate-x-1/2 bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3 shadow-xl backdrop-blur-md">
          <div className={`w-10 h-10 rounded-lg ${spineDetails.bg} flex items-center justify-center border border-white/10`}>
            {spineDetails.tools[2].icon}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{spineDetails.tools[2].name}</h4>
            <p className="text-xs text-white/50">{spineDetails.tools[2].desc}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
