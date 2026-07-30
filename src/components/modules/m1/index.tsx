"use client";

import { useEffect, useRef, useState, cloneElement, ReactElement, Fragment } from "react";
import gsap from "gsap";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useNarrationStore } from "@/store/narration";
import { useProgressStore } from "@/store/progress";
import { useLRS } from "@/hooks/use-lrs";
import { audioUrl, imageUrl } from "@/lib/media";
import { Slide, useCanvasNav } from "@/components/lesson/canvas-viewer";
import { KnowledgeCheck, type KnowledgeCheckQuestion } from "@/components/lesson/knowledge-check";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import {
  BrainCircuit, Cpu, ShieldAlert, Sparkles, MessageSquare,
  Database, Layers, CheckCircle2, ChevronRight, XCircle,
  History, Network, Scale, TestTube, AlertTriangle,
  ChevronLeft, ArrowRight, BookOpen, Smartphone, Cloud,
  Code, Briefcase, Rocket, Play, LayoutGrid, Zap, Shield,
  Users, Binary, Eye, Lock, X, MousePointerClick,
  Bot, Copy, Lightbulb
} from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

// 1. Title Slide
function TitleSlide() {
  const { isPlaying, seekTime } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const listItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // Welcome to Module 1: The Intelligence Illusion.
    timeline.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
    // Before we can effectively use Generative AI...
    timeline.fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3.5);
    
    // Timings mapped to the voiceover script:
    // "They are not a knowledge base..." (~13s)
    // "They are not a reasoning engine..." (~21s)
    // "And fundamentally, they act as a stochastic parrot..." (~28s)
    const listTimings = [13, 21, 28];
    listItemsRef.current.forEach((el, index) => {
      if (el) {
        timeline.fromTo(el, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, listTimings[index]);
      }
    });

    // Reveal graphic asset alongside subtitle text (~3.5s)
    timeline.fromTo(rightColRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, ease: "power4.out" }, 3.5);

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


  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
        <div className="flex flex-col justify-center order-2 lg:order-1 text-left">
          <h1 ref={headingRef} className="opacity-0 text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-4 text-foreground leading-[1.1]">
            The Intelligence <span className="text-primary">Illusion</span>
          </h1>
          
          <p ref={subtitleRef} className="opacity-0 text-sm lg:text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">
            Before we can effectively use AI, we must demystify it. We must dismantle the notion that Large Language Models "think" like humans, revealing them instead as highly sophisticated prediction engines.
          </p>

          <ul className="space-y-4 max-w-md">
            {[
              { title: "Not a Knowledge Base", desc: "LLMs don't store facts; they store statistical probabilities of word combinations.", icon: Database },
              { title: "Not a Reasoning Engine", desc: "They cannot 'think' through a problem; they predict the most likely next step.", icon: BrainCircuit },
              { title: "A Stochastic Parrot", desc: "Coined by Bender, Gebru, et al. (2021). They stitch language convincingly without actual comprehension.", icon: MessageSquare }
            ].map((item, i) => (
              <li 
                key={i} 
                ref={el => { listItemsRef.current[i] = el; }}
                className="opacity-0 flex gap-3 items-start"
              >
                <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base leading-none mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div ref={rightColRef} className="order-1 lg:order-2 opacity-0 relative w-full h-[350px] lg:h-[450px] rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/neural_network_nodes.jpg"
              alt="Neural Network Nodes"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>
          
          <div className="relative z-10 w-full max-w-sm px-6 flex flex-col gap-6">
            <div className="flex justify-center gap-2">
               {["The", "quick", "brown"].map((word, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                   className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg font-mono text-xs border border-white/20 text-foreground shadow-sm"
                 >
                   {word}
                 </motion.div>
               ))}
            </div>
            
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-px h-6 bg-gradient-to-b from-transparent to-primary/50" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-px h-6 bg-gradient-to-t from-transparent to-primary/50" />
              
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 0px rgba(167,218,219,0)", "0 0 40px rgba(167,218,219,0.25)", "0 0 0px rgba(167,218,219,0)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-black/50 backdrop-blur-xl border border-primary/40 rounded-2xl p-5 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                <motion.div 
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary/20 to-transparent blur-md"
                />
                
                <div className="relative z-10">
                  <Layers className="w-8 h-8 text-primary mx-auto mb-2 drop-shadow-md" />
                  <div className="font-bold tracking-widest uppercase text-primary text-xs mb-1 drop-shadow-sm">Transformer Engine</div>
                  <div className="text-[9px] text-primary/80 font-mono">Attention Mechanism Active</div>
                </div>
              </motion.div>
            </div>

            <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl relative z-10">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Token Probabilities</span>
                <Network className="w-3 h-3 text-primary" />
              </div>
              
              <div className="space-y-2 font-mono text-xs">
                {[
                  { word: "fox", prob: "85.2%", width: "85%", color: "bg-primary" },
                  { word: "dog", prob: "12.4%", width: "12%", color: "bg-primary/50" },
                  { word: "cat", prob: "2.1%", width: "3%", color: "bg-primary/20" }
                ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="w-8 text-white/90">{item.word}</div>
                     <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: item.width }}
                         transition={{ delay: 0.8 + (i * 0.2), duration: 0.8, ease: "easeOut" }}
                         className={`h-full ${item.color} rounded-full`} 
                       />
                     </div>
                     <div className="w-10 text-right text-muted-foreground font-semibold">{item.prob}</div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Video Slide
function VideoSlide({ url, onComplete }: { url: string; onComplete: () => void }) {
  const { isPlaying, isFinished, seekTime } = useNarrationStore();
  const { track } = useLRS();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Extract YouTube ID for embed URL
  const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    
    // "To break the intelligence illusion..."
    timeline.fromTo(titleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.5);
    timeline.fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 3);
    
    // "Please watch this short video..."
    timeline.fromTo(videoRef.current, { opacity: 0, scale: 0.97, x: -20 }, { opacity: 1, scale: 1, x: 0, duration: 1, ease: "power4.out" }, 6);
    
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
    if (isFinished && ctaRef.current) {
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }
  }, [isFinished]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mx-auto px-6 md:px-10 lg:px-12 overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Video */}
        <div className="order-2 lg:order-1">
           <div ref={videoRef} className="opacity-0 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?rel=0`} 
                title="Generative AI Explained" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                onLoad={() => {
                  track(
                    "http://adlnet.gov/expapi/verbs/launched",
                    "launched",
                    "http://smartslate.com/activities/module-1/video/what-is-generative-ai",
                    "What is Generative AI?",
                    "Learner launched the Module 1 Generative AI primer video.",
                    { moduleId: "1", slideId: "m1-video-whatis" }
                  );
                }}
              >
              </iframe>
           </div>
        </div>

        {/* Right Column - Text */}
        <div className="flex flex-col justify-center order-1 lg:order-2 text-left py-2">
          <div>
            <h2 ref={titleRef} className="opacity-0 text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground leading-[1.1]">Deconstructing the "Magic"</h2>
            <p ref={textRef} className="opacity-0 text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">
              To break the intelligence illusion, we first need a shared understanding of how these models operate under the hood. This primer from Google Cloud Tech provides the perfect technical foundation.
            </p>
          </div>
          
          <div ref={ctaRef} className="opacity-0 bg-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden flex flex-col shadow-sm w-full">
            <div className="relative z-10 flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border shadow-sm flex items-center justify-center bg-white text-blue-500 font-black text-xs tracking-tighter">
                GCP
              </div>
              <div>
                <p className="font-bold text-foreground text-sm leading-tight">Support the Creator</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Created by <strong className="text-foreground">Google Cloud Tech</strong>. Highly recommend subscribing to their channel.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full relative z-10">
              <Button className="flex-1 h-9 text-xs bg-[#FF0000] hover:bg-[#CC0000] text-white border-none transition-colors group/btn shadow-md" asChild>
                <a href="https://www.youtube.com/@googlecloudtech" target="_blank" rel="noopener noreferrer">
                  Subscribe
                  <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button className="flex-1 h-9 text-xs group/btn bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30" variant="outline" onClick={() => {
                onComplete();
              }}>
                Mark Watched
                <CheckCircle2 className="w-3 h-3 ml-1 group-hover/btn:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Timeline of AI
function TimelineOfAI({ onComplete }: { onComplete?: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [unlockedIdx, setUnlockedIdx] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [waitingForInteraction, setWaitingForInteraction] = useState(false);
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const { track } = useLRS();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const milestones = [
    { 
      year: "1950", 
      title: "The Turing Test", 
      desc: "Alan Turing proposes a thought experiment to evaluate machine intelligence based on its indistinguishability from human responses. This sets the philosophical foundation for AI.",
      icon: <Cpu className="w-5 h-5" /> 
    },
    { 
      year: "1997", 
      title: "Deep Blue", 
      desc: "IBM's Deep Blue defeats world chess champion Garry Kasparov. This watershed moment proves that rule-based, narrow AI can outmaneuver human genius in highly constrained environments.",
      icon: <BrainCircuit className="w-5 h-5" />
    },
    { 
      year: "2012", 
      title: "AlexNet", 
      desc: "A deep learning neural network crushes the competition in image recognition by leveraging GPUs. This triggers the modern AI boom, proving the viability of deep learning.",
      icon: <Eye className="w-5 h-5" />
    },
    { 
      year: "2017", 
      title: "Transformers", 
      desc: (
        <>
          Google researchers publish <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 decoration-primary/50 transition-all font-medium">{"'Attention Is All You Need'"}</a>, introducing the transformer architecture. This fundamentally shifts how machines process language and context.
        </>
      ),
      icon: <Network className="w-5 h-5" />
    },
    { 
      year: "2022", 
      title: "ChatGPT", 
      desc: "OpenAI releases ChatGPT, combining transformers with conversational interfaces. It marks the moment LLM technology becomes accessible and actionable for the general public.",
      icon: <Sparkles className="w-5 h-5" />
    }
  ];

  const loadAndPlayAudio = (track: "intro" | number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audioName = track === "intro" ? "m1-timeline-intro" : `m1-timeline-${track}`;
    const basePath = "/courses/aifoundations-concept2application";
    const audio = new Audio(`${basePath}/audio/${audioName}.mp3`);
    audioRef.current = audio;
    
    // Play with global narration store
    play(audioName, 50000);
    audio.play().catch(() => {});

    audio.onended = () => {
      pause();
      if (track === "intro") {
        setIntroFinished(true);
        loadAndPlayAudio(0);
      } else {
        if (track === unlockedIdx && track < 4) {
          setUnlockedIdx(track + 1);
          setWaitingForInteraction(true);
        } else if (track < unlockedIdx) {
          setWaitingForInteraction(true);
        }
        
        if (track === 4) {
          setWaitingForInteraction(false);
          if (onComplete) {
            onComplete();
          }
          finish();
        }
      }
    };
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadAndPlayAudio("intro");
    }, 100);
    return () => {
      clearTimeout(t);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);


  const handleNodeClick = (idx: number) => {
    if (idx <= unlockedIdx) {
      const milestone = milestones[idx].title.toLowerCase().replace(/\s+/g, "-");
      track(
        "http://adlnet.gov/expapi/verbs/interacted",
        "interacted",
        `http://smartslate.com/activities/module-1/timeline/${milestone}`,
        milestones[idx].title,
        `Learner selected the ${milestones[idx].title} milestone on the Module 1 AI timeline.`,
        { moduleId: "1", slideId: "m1-timeline" }
      );
      setWaitingForInteraction(false);
      setActiveIdx(idx);
      loadAndPlayAudio(idx);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 max-w-6xl mx-auto overflow-hidden">
      <div className="text-left w-full max-w-3xl mb-8 shrink-0">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-foreground leading-[1.1]"
        >
          How Did We Get Here?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          Artificial Intelligence isn't magic that appeared overnight. It has evolved over decades from rigid, rule-based systems to the dynamic neural networks of today.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: introFinished ? 1 : 0, filter: introFinished ? "blur(0px)" : "blur(10px)", pointerEvents: introFinished ? "auto" : "none" }}
        transition={{ duration: 1 }}
        className="w-full flex-1 flex flex-col"
      >
        <div className="relative w-full px-4 md:px-8 shrink-0 mb-8 mt-4">
        <div className="flex justify-between items-start relative z-10">
          {milestones.map((m, i) => {
            const isUnlocked = i <= unlockedIdx;
            const isActive = i === activeIdx;
            const isNextTarget = waitingForInteraction && i === unlockedIdx;
            
            return (
              <Fragment key={i}>
                <div 
                  onClick={() => handleNodeClick(i)}
                  className={`flex flex-col items-center group transition-all duration-300 relative shrink-0 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-40 grayscale'}`}
                >
                  <div className="relative">
                    {/* Radar Ping Effect */}
                    {isNextTarget && (
                      <motion.div
                        initial={{ opacity: 0.9, scale: 0.8, filter: "blur(8px)" }}
                        animate={{ opacity: 0, scale: 2.2, filter: "blur(16px)" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-primary"
                      />
                    )}
                    
                    <div className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center transition-all duration-500 relative z-10 backdrop-blur-xl ${isActive ? 'border-primary bg-primary/20 scale-110 shadow-[0_0_30px_rgba(167,218,219,0.3)]' : isNextTarget ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(167,218,219,0.4)] scale-105' : isUnlocked ? 'border-primary/50 bg-background/90 group-hover:border-primary group-hover:bg-primary/10' : 'border-white/10 bg-background/90'}`}>
                      {!isUnlocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : cloneElement(m.icon as ReactElement<{ className?: string }>, { className: `w-6 h-6 ${isActive || isNextTarget ? 'text-primary drop-shadow-[0_0_8px_rgba(167,218,219,0.5)]' : 'text-muted-foreground group-hover:text-primary'}` })}
                    </div>
                  </div>

                  <span className={`mt-4 font-bold text-sm tracking-widest transition-colors ${(isActive || isNextTarget) ? 'text-primary drop-shadow-[0_0_8px_rgba(167,218,219,0.5)]' : isUnlocked ? 'text-foreground/80' : 'text-muted-foreground'}`}>{m.year}</span>
                </div>
                
                {i < milestones.length - 1 && (
                  <div className="flex-1 h-1.5 mx-2 md:mx-4 mt-[25px] rounded-full bg-white/5 relative">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary shadow-[0_0_15px_rgba(167,218,219,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: unlockedIdx > i ? "100%" : "0%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

        <div className="w-full relative h-[220px] shrink-0 mt-auto mb-2 md:mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-center shadow-xl"
            >
              <div className="flex items-center gap-4 mb-3">
                 <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                   {milestones[activeIdx].icon}
                 </div>
                 <h3 className="text-xl md:text-2xl font-bold text-foreground">{milestones[activeIdx].title}</h3>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
                {milestones[activeIdx].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


// 4. Hollywood vs Reality
function HollywoodVsReality({ onComplete }: { onComplete?: () => void }) {
  const [t, setT] = useState(0);
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl("m1-hollywood.mp3"));
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      setT(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.onended = () => {
      pause();
      if (onComplete) onComplete();
      finish();
    };

    const timer = setTimeout(() => {
      play("m1-hollywood", 36500);
      audio.play().catch(() => {});
    }, 100);

    return () => {
      clearTimeout(timer);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audioRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);


  const cardVariant: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(15px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1, ease: "easeOut" } }
  };
  
  const itemVariant: any = {
    hidden: { opacity: 0, x: -15, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
  };

  const showAgiCard = t > 4.2;
  const showAgi1 = t > 9.5;
  const showAgi2 = t > 13.5;
  const showAgi3 = t > 15.5;
  const showAgiStatus = t > 18.5;

  const showNarrowCard = t > 21.0;
  const showNarrowStatus = t > 24.5;
  const showNarrow1 = t > 27.5;
  const showNarrow2 = t > 31.0;
  const showNarrow3 = t > 33.5;

  return (
    <div className="w-full h-full flex flex-col items-center p-4 md:p-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6 md:mb-8 shrink-0 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground leading-[1.1]">
          Hollywood <span className="text-muted-foreground font-light px-2">vs</span> Reality
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          It's critical to separate science fiction fantasy from the actual technology we use today.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-5xl relative z-10 flex-1 min-h-0">
        
        {/* AGI Card */}
        <AnimatePresence>
          {showAgiCard && (
            <motion.div 
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              className="bg-card/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-2 shadow-2xl relative group flex flex-col overflow-hidden h-full max-h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-purple-500/5 opacity-50 z-0 pointer-events-none" />
              
              <div className="w-full h-32 md:h-40 relative rounded-2xl overflow-hidden mb-4 z-10 shrink-0">
                <img src={imageUrl("agi.jpg")} alt="AGI Concept" className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-red-500/30 text-red-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground drop-shadow-md">AGI</h3>
                </div>
              </div>

              <div className="px-4 pb-4 flex-1 flex flex-col z-10 overflow-hidden">
                <h4 className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mb-3 shrink-0">Artificial General Intelligence</h4>
                <ul className="space-y-3 text-sm text-muted-foreground flex-1 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {showAgi1 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> 
                        <span className="leading-snug">Sentient and self-aware</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showAgi2 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> 
                        <span className="leading-snug">Possesses human-like reasoning and intuition</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showAgi3 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> 
                        <span className="leading-snug">Can perform any intellectual task a human can</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                </ul>
                <div className="mt-4 pt-3 border-t border-red-500/20 flex justify-between items-center shrink-0 min-h-[32px]">
                  <AnimatePresence>
                    {showAgiStatus && (
                      <>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold tracking-widest text-red-500/60 uppercase">Status</motion.span>
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">Science Fiction</motion.span>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Narrow AI Card */}
        <AnimatePresence>
          {showNarrowCard && (
            <motion.div 
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              className="bg-card/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-2 shadow-2xl relative group flex flex-col overflow-hidden h-full max-h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 opacity-50 z-0 pointer-events-none" />
              
              <div className="w-full h-32 md:h-40 relative rounded-2xl overflow-hidden mb-4 z-10 shrink-0">
                <img src={imageUrl("narrow_ai.jpg")} alt="Narrow AI Concept" className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                    <Network className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground drop-shadow-md">Narrow AI</h3>
                </div>
              </div>

              <div className="px-4 pb-4 flex-1 flex flex-col z-10 overflow-hidden">
                <h4 className="text-[11px] font-bold tracking-widest uppercase text-emerald-500/80 mb-3 shrink-0">Applied Machine Learning</h4>
                <ul className="space-y-3 text-sm text-muted-foreground flex-1 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {showNarrow1 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                        <span className="leading-snug">Highly specialized pattern matching & prediction</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showNarrow2 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                        <span className="leading-snug">Absolutely no consciousness, intent, or self-awareness</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {showNarrow3 && (
                      <motion.li variants={itemVariant} initial="hidden" animate="visible" className="flex gap-2.5 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> 
                        <span className="leading-snug">Trained on specific datasets for specific tasks only</span>
                      </motion.li>
                    )}
                  </AnimatePresence>
                </ul>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-between items-center shrink-0 min-h-[32px]">
                  <AnimatePresence>
                    {showNarrowStatus && (
                      <>
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold tracking-widest text-emerald-500/60 uppercase">Status</motion.span>
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">What We Use Today</motion.span>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// 5. Assessment 1 — What is AI
const WHAT_AI_ASSESSMENT_QUESTIONS: KnowledgeCheckQuestion[] = [
  {
    prompt: "What does the acronym LLM stand for?",
    options: ["Large Language Model", "Logical Learning Machine", "Local Language Module", "Linear Learning Mechanism"],
    correctIndex: 0,
    explanation: "LLM stands for Large Language Model. These are massive statistical models trained on vast amounts of text.",
  },
  {
    prompt: "Generative AI is best described as:",
    options: ["A reasoning engine capable of critical thinking", "A knowledge base storing factual data", "A sophisticated prediction engine", "A sentient entity"],
    correctIndex: 2,
    explanation: "Generative AI doesn't 'think' or retrieve stored facts; it acts as a highly sophisticated prediction engine, calculating the most statistically probable next token.",
  },
  {
    prompt: "Which of the following is NOT an attribute of Artificial General Intelligence (AGI)?",
    options: ["Sentience and self-awareness", "Highly specialized pattern matching", "Human-like reasoning", "Ability to perform any intellectual task"],
    correctIndex: 1,
    explanation: "Highly specialized pattern matching is a characteristic of Narrow AI. AGI, which remains science fiction, involves generalized, human-like intelligence across any domain.",
  },
  {
    prompt: "What type of AI do we currently use today?",
    options: ["Narrow AI", "Artificial General Intelligence (AGI)", "Sentient AI", "Superintelligent AI"],
    correctIndex: 0,
    explanation: "Every AI application we use today, from ChatGPT to self-driving cars, relies on Narrow AI optimized for specific tasks.",
  },
  {
    prompt: "Which architecture, introduced by Google researchers in 2017, fundamentally shifted how machines process language and context?",
    options: ["Convolutional Neural Networks", "Recurrent Neural Networks", "Transformers", "The Turing Machine"],
    correctIndex: 2,
    explanation: "The 'Attention Is All You Need' paper introduced the Transformer architecture, which allowed models to process entire sequences of text contextually.",
  },
  {
    prompt: "Which statement best describes a 'Stochastic Parrot'?",
    options: ["An AI that repeats information with perfect human comprehension", "An AI that stitches language convincingly without actual comprehension", "A reasoning engine that stores factual knowledge", "An AI used exclusively for biological research"],
    correctIndex: 1,
    explanation: "Coined by Bender, Gebru, et al. (2021) in 'On the Dangers of Stochastic Parrots.' A stochastic parrot stitches language together based on probabilistic patterns, creating convincing text without any actual understanding of the meaning.",
  },
  {
    prompt: "What event in 2012 marked a major turning point for Deep Learning?",
    options: ["The proposal of the Turing Test", "IBM's Deep Blue defeating Garry Kasparov", "AlexNet winning the ImageNet competition", "The launch of ChatGPT"],
    correctIndex: 2,
    explanation: "AlexNet's victory in 2012 demonstrated the overwhelming power of deep neural networks, kicking off the modern AI boom.",
  },
  {
    prompt: "Alan Turing's 1950 paper proposed an experiment to:",
    options: ["Introduce the first neural network", "Evaluate machine intelligence based on its indistinguishability from human responses", "Prove that machines can feel emotions", "Program the first logic theorist"],
    correctIndex: 1,
    explanation: "The Turing Test was proposed to assess machine intelligence strictly by evaluating if its responses could convincingly imitate a human.",
  },
  {
    prompt: "What is the primary characteristic of Narrow AI?",
    options: ["It has intent and self-awareness", "It performs highly specialized pattern matching based on specific datasets", "It can seamlessly switch between completely unrelated intellectual domains", "It is currently considered science fiction"],
    correctIndex: 1,
    explanation: "Narrow AI lacks consciousness and operates strictly within its trained domain, relying on specific datasets to recognize patterns.",
  },
  {
    prompt: "Large Language Models process text by:",
    options: ["Retrieving facts from a massive internal database", "Using a probability matrix to predict the most likely next token", "Fact-checking information against the live internet before answering", "Using symbolic logic to reason through a prompt"],
    correctIndex: 1,
    explanation: "LLMs do not store factual databases; they rely on a vast probability matrix to statistically predict the most likely next token in a sequence.",
  },
];

function Assessment1({ onComplete, isCompleted }: { onComplete?: () => void; isCompleted?: boolean }) {
  return (
    <KnowledgeCheck
      id="m1-assessment-1"
      isCompleted={isCompleted}
      title="What AI Is · AGI vs. Narrow AI · Next-Token Prediction"
      description="Ten questions on the Intelligence Illusion, AGI versus Narrow AI, the Turing Test, the Chinese Room experiment, and Next-Token Prediction. You must answer every question correctly to continue."
      questions={WHAT_AI_ASSESSMENT_QUESTIONS}
      onComplete={onComplete}
      successHeadline="Assessment Complete!"
      successSubline="You've successfully demonstrated your understanding of what AI actually is."
    />
  );
}

// 6.0 ML Intro (Minimal & Premium)
function MachineLearningIntroSlide({ onComplete }: { onComplete?: () => void }) {
  const [t, setT] = useState(0);
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl("m1-ml-intro.mp3"));
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setT(audio.currentTime);
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.onended = () => { pause(); if (onComplete) onComplete(); finish(); };

    const timer = setTimeout(() => { play("m1-ml-intro", 18000); audio.play().catch(()=>{}); }, 100);
    return () => {
      clearTimeout(timer);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audioRef.current = null;
    };
  }, [onComplete, play, pause, finish]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(()=>{});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);


  // Emil Design Eng: Spring config for natural physics
  const spring: any = { type: "spring", stiffness: 90, damping: 20 };
  
  // Emil Design Eng: Blur entry animation
  const blurEnter = {
    hidden: { opacity: 0, filter: "blur(12px)", y: 15, scale: 0.98 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }
  };

  const phase1 = t >= 0;  // "Instead of programming..."
  const phase2 = t >= 8;  // "It shifts the paradigm..."

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 max-w-5xl mx-auto relative">
      {/* Background Ambient Glow (Minimal) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full flex flex-col items-center text-center z-10 gap-12 md:gap-16">
        
        {/* Phase 1: Title & First Insight */}
        <AnimatePresence>
          {phase1 && (
            <motion.div 
              initial="hidden" animate="visible" variants={blurEnter} transition={spring} 
              className="flex flex-col items-center gap-6"
            >
              <p className="text-xs md:text-sm text-primary font-semibold tracking-[0.2em] uppercase">
                The Next Paradigm
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground text-balance">
                Machine Learning
              </h2>
              <p className="text-xl md:text-3xl font-light text-foreground/90 leading-relaxed text-balance max-w-3xl mt-4 md:mt-8">
                Instead of programming explicit rules, we give machines <span className="text-foreground font-medium">data</span> and let them discover the patterns themselves.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Paradigm Shift Insight */}
        <div className="min-h-[100px] w-full flex items-center justify-center">
          <AnimatePresence>
            {phase2 && (
              <motion.div 
                initial="hidden" animate="visible" variants={blurEnter} transition={{ ...spring, delay: 0.2 }} 
                className="flex flex-col items-center w-full"
              >
                <div className="h-px w-16 bg-border mx-auto mb-8 md:mb-10" />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-balance max-w-2xl">
                  We are shifting from writing code that <span className="line-through opacity-70">solves a problem</span>, to writing code that <span className="text-foreground font-medium">learns how to solve a problem</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}

// 6.1-6.3 ML Core Concepts
function MLConceptSlideBase({ title, icon: Icon, color, bg, border, image, definition, analogy, audioId, duration, timings, onComplete }: any) {
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const defRef = useRef<HTMLParagraphElement>(null);
  const analogyRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const audio = new Audio(audioUrl(`${audioId}.mp3`));
    audioRef.current = audio;
    audio.onended = () => { pause(); if (onComplete) onComplete(); finish(); };

    const timeline = gsap.timeline({ paused: true });
    if (titleRef.current) timeline.fromTo(titleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    if (imgRef.current) timeline.fromTo(imgRef.current, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }, 0);
    if (iconRef.current) timeline.fromTo(iconRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, timings?.icon ?? 0.5);
    if (defRef.current) timeline.fromTo(defRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, timings?.definition ?? 1.5);
    if (analogyRef.current) timeline.fromTo(analogyRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, timings?.analogy ?? 2.5);
    
    tl.current = timeline;

    audio.onplay = () => { if (tl.current) tl.current.play(); };
    audio.onpause = () => { if (tl.current) tl.current.pause(); };
    audio.onwaiting = () => { if (tl.current) tl.current.pause(); };
    audio.onplaying = () => { if (tl.current) tl.current.play(); };

    const timer = setTimeout(() => { play(audioId, duration); audio.play().catch(()=>{}); }, 100);
    return () => { 
      clearTimeout(timer); 
      audio.onplay = null;
      audio.onpause = null;
      audio.onwaiting = null;
      audio.onplaying = null;
      audio.pause(); 
      audioRef.current = null; 
      timeline.kill(); 
    };
  }, [audioId, duration, onComplete, timings?.icon]); // Use timings?.icon (primitive) to safely satisfy React Fast Refresh size without infinite loop

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);
  useEffect(() => {
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto overflow-hidden relative">
      <div className="text-center mb-6 shrink-0">
        <h2 
          ref={titleRef}
          className="opacity-0 text-2xl md:text-4xl font-bold tracking-tight mb-2"
        >
          {title}
        </h2>
      </div>

      <div className="flex-1 relative min-h-0 rounded-3xl overflow-hidden bg-card border shadow-xl flex flex-col md:flex-row max-h-[500px]">
        <div className="w-full md:w-2/5 h-48 md:h-full relative shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card z-10 md:hidden" />
          <img 
            ref={imgRef}
            src={image} alt={title} className="opacity-0 w-full h-full object-cover" 
          />
        </div>
        
        <div className="w-full md:w-3/5 flex flex-col justify-center p-6 md:p-10 z-20 overflow-hidden">
          <div className="flex flex-col h-full justify-center">
            <div 
              ref={iconRef}
              className="opacity-0 flex items-center gap-4 mb-6 shrink-0"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center shadow-md border border-white/5 shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">The {title.split(' ')[0]} Approach</h3>
            </div>
            
            <div className="mb-6">
              <p ref={defRef} className="opacity-0 text-lg text-foreground/90 font-medium leading-relaxed shrink-0">
                {definition}
              </p>
            </div>
            
            <div ref={analogyRef} className={`opacity-0 p-5 rounded-2xl ${bg} border ${border} border-opacity-20 relative overflow-hidden shrink-0 shadow-sm`}>
              <div className={`absolute -top-8 -right-8 w-32 h-32 blur-[40px] opacity-30 pointer-events-none rounded-full ${bg.replace('/10', '')}`} />
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${color}`}>The Analogy</h4>
              <p className="text-foreground/80 leading-relaxed text-base">{analogy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupervisedLearningSlide({ onComplete }: { onComplete?: () => void }) {
  return <MLConceptSlideBase timings={{ icon: 0.5, analogy: 3.5, definition: 8.5 }} title="Supervised Learning" icon={Database} color="text-primary" bg="bg-primary/10" border="border-primary" image={imageUrl("ml_supervised.jpg")} definition="The model is trained on a dataset where every example is explicitly labeled, mapping inputs to known outputs." analogy="Think of this as the Classroom with an Answer Key. It's like teaching a child with flashcards: 'This is a cat', 'This is a dog'. The machine learns the rules so it can predict answers for new, unseen data." audioId="m1-ml-supervised" duration={18000} onComplete={onComplete} />;
}

function UnsupervisedLearningSlide({ onComplete }: { onComplete?: () => void }) {
  return <MLConceptSlideBase timings={{ icon: 0.5, definition: 3.5, analogy: 9.0 }} title="Unsupervised Learning" icon={Layers} color="text-primary" bg="bg-primary/10" border="border-primary" image={imageUrl("ml_unsupervised.jpg")} definition="The model is given raw, unlabeled data and asked to find hidden structures and patterns entirely on its own." analogy="Imagine you are a Library Archeologist handed a massive pile of uncategorized documents with no index. Your job is to read through them and identify similarities to group them into logical clusters." audioId="m1-ml-unsupervised" duration={16000} onComplete={onComplete} />;
}

function ReinforcementLearningSlide({ onComplete }: { onComplete?: () => void }) {
  return <MLConceptSlideBase timings={{ icon: 0.5, analogy: 3.5, definition: 11.5 }} title="Reinforcement Learning" icon={BrainCircuit} color="text-primary" bg="bg-primary/10" border="border-primary" image={imageUrl("ml_reinforcement.jpg")} definition="The model learns the optimal strategy by interacting with an environment and receiving feedback." analogy="This is the Trial-and-Error Apprentice. The AI receives rewards for good actions, or penalties for bad ones—much like training a dog with treats. Over thousands of iterations, it learns to maximize its reward." audioId="m1-ml-reinforcement" duration={18000} onComplete={onComplete} />;
}

// 6. LLM vs SLM — see STYLE.md §5 for the canvas-fit hard rule.
function LlmVsSlm() {
  const [isSlm, setIsSlm] = useState(false);
  const { track } = useLRS();
  const reduce = useReducedMotion();
  const easeDrawer: [number, number, number, number] = [0.32, 0.72, 0, 1];
  
  const { progress, currentTrackId, seekTime } = useNarrationStore();
  const hasAutoSwitched = useRef(false);

  useEffect(() => {
    // Prevent old progress state from the previous slide from triggering the switch early
    if (currentTrackId !== "m1-llm-vs-slm" || progress === 0) {
      hasAutoSwitched.current = false;
      return;
    }
    
    // Switch to SLM when progress passes ~61.5% ("Conversely, SLMs...")
    if (progress > 61.5 && !hasAutoSwitched.current) {
      setIsSlm(true);
      hasAutoSwitched.current = true;
    }
  }, [progress, currentTrackId]);

  return (
    <div className="w-full h-full flex flex-col justify-center p-4 md:p-6 lg:p-8 max-w-5xl mx-auto overflow-hidden">
      <div className="text-center mb-3 md:mb-4 shrink-0">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 md:mb-2 text-foreground text-balance leading-[1.15]">
          The Scale of <span className="text-primary">Intelligence</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto text-balance">
          Not all models need to know everything. Compare Large and Small Language Models.
        </p>
      </div>

      <div className="flex justify-center mb-4 md:mb-5 shrink-0">
        <div
          role="tablist"
          aria-label="Model class selector"
          className="inline-flex p-1 rounded-full bg-muted/40 backdrop-blur-md border border-white/10 shadow-inner"
        >
          <button
            role="tab"
            aria-pressed={!isSlm}
            onClick={() => {
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/module-1/llm-vs-slm/toggle",
                "Large Language Model",
                "Learner selected the Large Language Model comparison tab.",
                { moduleId: "1", slideId: "m1-llm-vs-slm" }
              );
              setIsSlm(false);
            }}
            className={`px-5 md:px-7 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted/40 ${
              !isSlm
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            LLM (Cloud)
          </button>
          <button
            role="tab"
            aria-pressed={isSlm}
            onClick={() => {
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/module-1/llm-vs-slm/toggle",
                "Small Language Model",
                "Learner selected the Small Language Model comparison tab.",
                { moduleId: "1", slideId: "m1-llm-vs-slm" }
              );
              setIsSlm(true);
            }}
            className={`px-5 md:px-7 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-muted/40 ${
              isSlm
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            SLM (Local)
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {!isSlm ? (
            <motion.div
              key="llm"
              initial={reduce ? false : { opacity: 0, transform: "translateX(-16px)" }}
              animate={{ opacity: 1, transform: "translateX(0)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(16px)" }}
              transition={{ duration: reduce ? 0 : 0.25, ease: easeDrawer }}
              className="absolute inset-0 bg-card/40 backdrop-blur-xl border border-primary/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 overflow-y-auto"
            >
              <div className="flex-1 flex flex-col md:pr-6 md:border-r border-primary/20 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Cloud className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight text-foreground">Large Language Model</h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
                  Massive models with hundreds of billions of parameters. They require entire data centers to run.
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {["GPT-5.6", "Claude Sonnet 5", "Gemini 3.5 Pro"].map((name) => (
                    <span key={name} className="px-2 py-1 rounded-md bg-muted/50 border border-border/60 text-[11px] md:text-xs text-foreground/70 font-mono">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3 md:space-y-4 min-w-0">
                <MetricBar label="Knowledge Breadth" value="Vast" pct={95} tone="primary" reduce={reduce} />
                <MetricBar label="Computing Cost" value="High" pct={90} tone="primary" reduce={reduce} />
                <MetricBar label="Data Privacy" value="Leaves Device" pct={20} tone="primary" reduce={reduce} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slm"
              initial={reduce ? false : { opacity: 0, transform: "translateX(-16px)" }}
              animate={{ opacity: 1, transform: "translateX(0)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(16px)" }}
              transition={{ duration: reduce ? 0 : 0.25, ease: easeDrawer }}
              className="absolute inset-0 bg-card/40 backdrop-blur-xl border border-primary/30 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 overflow-y-auto"
            >
              <div className="flex-1 flex flex-col md:pr-6 md:border-r border-primary/20 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Smartphone className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight text-foreground">Small Language Model</h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
                  Efficient models designed to run locally on your phone or laptop. Highly specialized.
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {["Phi-4", "Gemma 4", "Qwen 3"].map((name) => (
                    <span key={name} className="px-2 py-1 rounded-md bg-muted/50 border border-border/60 text-[11px] md:text-xs text-foreground/70 font-mono">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3 md:space-y-4 min-w-0">
                <MetricBar label="Knowledge Breadth" value="Focused" pct={40} tone="primary" reduce={reduce} />
                <MetricBar label="Computing Cost" value="Low" pct={15} tone="primary" reduce={reduce} />
                <MetricBar label="Data Privacy" value="Stays Local" pct={100} tone="primary" reduce={reduce} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetricBar({
  label, value, pct, tone, reduce,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "primary" | "red" | "orange" | "indigo" | "emerald";
  reduce: boolean | null;
}) {
  const fillBg: Record<typeof tone, string> = {
    primary: "bg-primary",
    red: "bg-red-500",
    orange: "bg-orange-500",
    indigo: "bg-indigo-400",
    emerald: "bg-emerald-500",
  };
  const valueText: Record<typeof tone, string> = {
    primary: "text-primary",
    red: "text-red-400",
    orange: "text-orange-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs md:text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${valueText[tone]}`}>{value}</span>
      </div>
      <div className="relative w-full h-2.5 md:h-3 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${fillBg[tone]} origin-left rounded-full`}
          style={{ width: `${pct}%` }}
          initial={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
          animate={{ transform: "scaleX(1)" }}
          transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}


// 6.5 ML/Deep Learning/LLMs & SLMs — Knowledge Check
const ML_DNN_LLM_ASSESSMENT_QUESTIONS: KnowledgeCheckQuestion[] = [
  {
    prompt: "What is the core paradigm shift that defines machine learning compared to traditional programming?",
    options: [
      "We give machines data and let them discover the patterns themselves, instead of writing explicit rules.",
      "We hardcode the answer into every possible input.",
      "We rely on human experts to manually correct every output.",
      "We pre-compute every plausible query and store the results in a lookup table.",
    ],
    correctIndex: 0,
    explanation: "Machine learning inverts the programming paradigm: instead of writing rules, the system learns statistical patterns from examples. The programmer's job shifts from coding answers to curating data.",
  },
  {
    prompt: "Supervised learning is best described as:",
    options: [
      "Learning with an answer key — the model is given labeled inputs and known outputs and learns to map between them.",
      "Sorting unlabeled data into clusters based on similarity.",
      "Maximizing a reward signal through trial and error in an environment.",
      "Generating novel outputs by sampling from a probability distribution.",
    ],
    correctIndex: 0,
    explanation: "Supervised learning uses labeled examples (\"this is a cat, this is a dog\"). The model learns the input→output mapping so it can predict labels for new, unseen inputs.",
  },
  {
    prompt: "Unsupervised learning is best described as:",
    options: [
      "Learning from labeled examples provided by a teacher.",
      "Finding hidden structure in raw, unlabeled data — for example, grouping similar documents into clusters.",
      "Maximizing cumulative reward in a feedback loop.",
      "Predicting the next token in a sequence.",
    ],
    correctIndex: 1,
    explanation: "Unsupervised learning gets no labels. The model's job is to find structure on its own — clustering, dimensionality reduction, anomaly detection. The Library Archeologist analogy fits here.",
  },
  {
    prompt: "Reinforcement learning is best described as:",
    options: [
      "Clustering unlabeled data into thematic groups.",
      "Learning an optimal policy through rewards and penalties received by interacting with an environment.",
      "Training on labeled question-and-answer pairs.",
      "Predicting the most likely next token in a sequence.",
    ],
    correctIndex: 1,
    explanation: "Reinforcement learning is the trial-and-error apprentice: the agent takes actions in an environment, receives rewards (good actions) or penalties (bad ones), and over many iterations learns the policy that maximizes cumulative reward.",
  },
  {
    prompt: "What makes a neural network \"deep\"?",
    options: [
      "It is trained on a very large dataset.",
      "It uses many hidden layers between input and output, with millions or billions of tunable parameters (weights and biases).",
      "It runs on specialized GPU hardware.",
      "It was published in a top-tier research paper.",
    ],
    correctIndex: 1,
    explanation: "Depth = number of layers. Each layer is a stack of artificial neurons; the connections between them have adjustable parameters (weights and biases) that the training process tunes. \"Deep learning\" means enough layers to learn complex, hierarchical patterns.",
  },
  {
    prompt: "What is a parameter (a.k.a. weight) in a neural network?",
    options: [
      "A label on a training example.",
      "A tunable numerical value on a connection between two neurons that the training process adjusts to fit the data.",
      "A fixed rule hardcoded by the developer before training.",
      "The number of layers in the network.",
    ],
    correctIndex: 1,
    explanation: "Parameters are the internal numerical values the network learns during training. A modern LLM has hundreds of billions of them — each one a tiny dial that the optimization process nudges up or down.",
  },
  {
    prompt: "What is the Transformer architecture's defining innovation compared to older sequence models?",
    options: [
      "It uses a single massive fully-connected layer.",
      "It reads text one word at a time, in strict order, with no parallelism.",
      "An attention mechanism that looks at the entire sequence simultaneously, learning which words are contextually related to each other regardless of distance.",
      "It stores a hardcoded grammar of the target language.",
    ],
    correctIndex: 2,
    explanation: "Transformers (introduced in \"Attention Is All You Need\", Vaswani et al., 2017) replace sequential recurrence with a self-attention mechanism that processes all tokens in parallel and learns which tokens should attend to which others.",
  },
  {
    prompt: "How does temperature interact with next-token prediction?",
    options: [
      "Temperature controls how many GPUs the model uses.",
      "Temperature sets the maximum number of tokens the model can generate.",
      "Temperature scales the probability distribution over the next token — low temperature is deterministic, high temperature is creative and risk-taking.",
      "Temperature encodes the user's role in the prompt.",
    ],
    correctIndex: 2,
    explanation: "Before sampling, the model's raw logits are divided by the temperature value, then softmaxed. Low temperature sharpens the distribution (safe, repetitive); high temperature flattens it (creative, varied, sometimes incoherent).",
  },
  {
    prompt: "Why might a team choose a Small Language Model (SLM) over a frontier LLM for a workplace assistant?",
    options: [
      "SLMs always give more accurate factual answers than frontier LLMs.",
      "SLMs can run locally on the user's device, keeping sensitive data on-device and avoiding per-query API costs.",
      "SLMs are larger and require more powerful hardware.",
      "SLMs cannot be fine-tuned, while LLMs can.",
    ],
    correctIndex: 1,
    explanation: "The two structural reasons to pick an SLM are (1) data privacy / on-device inference (no off-network transmission of sensitive content) and (2) cost (no per-query API fees). Accuracy is workload-dependent; both can be fine-tuned.",
  },
  {
    prompt: "Which of the following are recognized techniques for compressing a large model into a small one? Select all that apply.",
    options: [
      "Knowledge distillation — a smaller \"student\" model is trained to mimic the larger \"teacher.\"",
      "Pruning — removing low-impact parameters or connections.",
      "Quantization — reducing the numerical precision of the parameters (e.g., 16-bit → 8-bit).",
      "Manually rewriting the model in a different programming language.",
    ],
    correctIndex: 0,
    explanation: "Knowledge distillation, pruning, and quantization are the three standard SLM-compression techniques. Rewriting the source code does not change the model — the parameters themselves must be made smaller or fewer.",
  },
];

function MlDnnLlmAssessment({ onComplete, isCompleted }: { onComplete?: () => void; isCompleted?: boolean }) {
  return (
    <KnowledgeCheck
      id="m1-ml-dnn-llm-assessment"
      isCompleted={isCompleted}
      title="ML · Deep Learning · LLMs & SLMs"
      description="Ten questions on Machine Learning, Deep Learning, Neural Networks, Transformers, and the LLM vs SLM trade-off. You must answer every question correctly to continue."
      questions={ML_DNN_LLM_ASSESSMENT_QUESTIONS}
      onComplete={onComplete}
      successHeadline="Section Complete!"
      successSubline="You've demonstrated a working understanding of how machines learn, how deep learning scales that, and how today's language models are shaped — plus when to choose a small model over a large one."
    />
  );
}

// 7. Interactive Prompt Anatomy — see STYLE.md §5 for the canvas-fit hard rule.
function AnatomyOfPrompt({ onComplete }: { onComplete: () => void }) {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
  const easeOutQuart: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const { setNavOverride } = useCanvasNav();
  const { isFinished, seekTime } = useNarrationStore();
  const { track } = useLRS();
  const { projectSpine } = useProgressStore();

  const getSpineParts = () => {
    const baseDesc = {
      role: "Defining a persona anchors the model in a specific latent space. By declaring 'You are a [Profession]', you activate specialized vocabulary, tone, and domain expertise. This bypasses the model's default generalized voice and statistically weights its neural pathways to favor highly technical responses associated with that exact profession.",
      task: "The task is the primary directive—the exact action you want the model to execute. Industry standards dictate using strong action verbs (e.g., 'Extract', 'Synthesize', 'Translate') rather than vague requests. A perfectly engineered task leaves zero ambiguity about what the final deliverable should be.",
      context: "Context grounds the model's generation, acting as the guardrails against hallucination. This provides the background information, audience demographics, or raw data required. In enterprise pipelines, context is often dynamically injected via RAG to force the model to synthesize answers directly from your provided truth.",
      constraints: "Constraints act as the strict boundaries governing the output. This includes negative prompting (e.g., 'Do NOT include...'), structural rules (e.g., 'Output strictly as JSON'), and stylistic limits. Enforcing rigid constraints ensures the LLM's output can be safely parsed by downstream code without breaking your pipeline."
    };

    switch (projectSpine) {
      case 'bi_dashboard':
        return [
          { id: 1, name: "Role", code: "You are a senior data analyst and expert in SQL and Recharts visualization.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Write a SQL query to extract Q3 revenue drop-offs by region, then specify a JSON config to visualize it.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "Our schema includes a 'sales' table with 'region', 'revenue', and 'date'. We want a month-over-month trend.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Output ONLY the raw JSON object containing the SQL and config. No markdown or explanations.", desc: baseDesc.constraints }
        ];
      case 'dynamic_onboarding':
        return [
          { id: 1, name: "Role", code: "You are an empathetic, intelligent onboarding specialist for our B2B SaaS platform.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Analyze the user's unstructured text response and extract their name, industry, and primary goal.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The user just answered the open-ended prompt: 'What brings you to our platform today?'", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Output exactly three JSON keys: 'name', 'industry', and 'goal'. If missing, return null.", desc: baseDesc.constraints }
        ];
      case 'hitl_control_center':
        return [
          { id: 1, name: "Role", code: "You are a meticulous AI workflow auditor and compliance officer.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Evaluate the attached automated email draft for aggressive tone or hallucinated promises.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "This email was generated by a sales agent for a high-value enterprise prospect. It must be approved before sending.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Return a strict boolean 'approved' flag and a 1-sentence 'reason'. Do not rewrite the email.", desc: baseDesc.constraints }
        ];
      case 'os_assistant':
        return [
          { id: 1, name: "Role", code: "You are a highly efficient executive assistant operating directly on the user's desktop.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Summarize the active PDF document into 3 bullet points, then draft a polite Slack reply.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The user has just been sent a 40-page quarterly earnings report by their manager via Slack.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "The Slack reply must be under 150 characters. Keep the tone professional but brief.", desc: baseDesc.constraints }
        ];
      case 'edge_health_coach':
        return [
          { id: 1, name: "Role", code: "You are a supportive, scientifically-grounded sports physiologist.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Interpret the user's raw heart rate variability (HRV) and sleep data to provide a daily readiness score.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The data is streaming from a local smartwatch. The user slept 5 hours and HRV is 15% below baseline.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Limit your vocabulary to a 6th-grade reading level. Suggest exactly one actionable recovery tip.", desc: baseDesc.constraints }
        ];
      case 'synthetic_podcast_generator':
        return [
          { id: 1, name: "Role", code: "You are an engaging, witty podcast producer and scriptwriter.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Convert this dense PDF research paper into a conversational script between two hosts, Alice and Bob.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The paper is a complex meta-analysis on quantum computing. The audience is tech-savvy but not physicists.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Include SSML tags for pauses. Keep each host's turn under 3 sentences. Do not use jargon without explaining it.", desc: baseDesc.constraints }
        ];
      case 'viral_clip_engine':
        return [
          { id: 1, name: "Role", code: "You are a viral social media strategist and expert video editor.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Identify the 3 most emotionally engaging 30-second segments from this podcast transcript.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The podcast is a 2-hour interview with a startup founder discussing their near-bankruptcy.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Format the output as a JSON array: [{ start_time, end_time, hook_score, rationale }].", desc: baseDesc.constraints }
        ];
      case 'global_localization':
        return [
          { id: 1, name: "Role", code: "You are an expert localization specialist and cultural consultant.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Translate this English marketing script into colloquial Brazilian Portuguese.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The original video uses baseball idioms. The target audience is Gen-Z consumers in São Paulo.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Do not translate idioms literally; adapt to local slang. Maintain exact word-count for lip-sync.", desc: baseDesc.constraints }
        ];
      case 'multichannel_repurposing':
        return [
          { id: 1, name: "Role", code: "You are a versatile, high-converting digital copywriter.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Transform this rambling audio transcript into a structured LinkedIn carousel and a Twitter thread.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The transcript is a 10-minute voice memo from the CEO about the importance of deep work versus meetings.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "The LinkedIn carousel must have exactly 5 slides separated by '---'. Use fewer than 3 emojis total.", desc: baseDesc.constraints }
        ];
      case 'academic_literature_reviewer':
        return [
          { id: 1, name: "Role", code: "You are a rigorous, highly-accurate post-doctoral research assistant.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Extract the methodology, sample size, and primary p-values from this clinical trial PDF.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "This data is being compiled for a systematic literature review on the efficacy of a new drug.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "Output a valid markdown table. If a metric is not reported in the text, write exactly 'Not Reported'.", desc: baseDesc.constraints }
        ];
      case 'fiction_world_copilot':
        return [
          { id: 1, name: "Role", code: "You are an eagle-eyed developmental editor and continuity expert.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Review this draft chapter and identify any contradictions with the provided 'World Bible' lore document.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The protagonist casts a fire spell in the chapter. The World Bible states fire magic requires a physical catalyst.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "List only the continuity errors. Quote the offending sentence from the chapter and the conflicting rule.", desc: baseDesc.constraints }
        ];
      case 'internal_rag_agent':
      default:
        return [
          { id: 1, name: "Role", code: "You are an internal corporate librarian with strict adherence to factuality.", desc: baseDesc.role },
          { id: 2, name: "Task", code: "Answer the employee's HR question using ONLY the provided retrieved document chunks.", desc: baseDesc.task },
          { id: 3, name: "Context", code: "The employee is asking about the 2026 remote work policy. The context contains the latest employee handbook.", desc: baseDesc.context },
          { id: 4, name: "Constraints", code: "If the answer is not explicitly in the context, reply 'I do not have access to this information.' Cite the chunk ID.", desc: baseDesc.constraints }
        ];
    }
  };

  const parts = getSpineParts();
  const activePart = parts.find(p => p.id === activeTab) ?? null;
  const allViewed = viewed.size === parts.length;
  const showCue = isFinished && !allViewed;

  useEffect(() => {
    setNavOverride({
      nextDisabled: !allViewed,
      onNext: (handleNext) => {
        onComplete();
        handleNext();
      }
    });
    return () => setNavOverride(null);
  }, [setNavOverride, onComplete, allViewed]);

  const handlePick = (id: number) => {
    const part = parts.find(p => p.id === id);
    if (part) {
      track(
        "http://adlnet.gov/expapi/verbs/interacted",
        "interacted",
        `http://smartslate.com/activities/module-1/anatomy/${part.name.toLowerCase()}`,
        part.name,
        `Learner explored the ${part.name} component of a prompt.`,
        { moduleId: "1", slideId: "m1-anatomy" }
      );
    }
    setActiveTab(id);
    setViewed(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-4 md:p-6 lg:p-8 max-w-6xl mx-auto overflow-hidden">
      <div className="mb-3 md:mb-4 shrink-0">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 md:mb-2 text-foreground text-balance leading-[1.15]">
          Anatomy of a <span className="text-primary">Perfect Prompt</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground text-balance max-w-2xl">
          Click each component to understand how to engineer the context window effectively.
        </p>
      </div>

      <AnimatePresence>
        {showCue && (
          <motion.div
            initial={reduce ? false : { opacity: 0, transform: "translateY(-6px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-6px)" }}
            transition={{ duration: reduce ? 0 : 0.3, ease: easeOutQuart }}
            className="flex justify-center mb-3 md:mb-4 shrink-0"
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : {
                      boxShadow: [
                        "0 0 0 0 rgba(167, 218, 219, 0)",
                        "0 0 18px 0 rgba(167, 218, 219, 0.22)",
                        "0 0 0 0 rgba(167, 218, 219, 0)",
                      ],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-md border border-primary/20 text-xs md:text-sm text-foreground"
            >
              <MousePointerClick className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" strokeWidth={1.5} />
              <span className="text-balance">Click each component to read more</span>
              <span className="text-muted-foreground font-mono text-[10px] md:text-[11px] tabular-nums ml-0.5">
                {viewed.size}/{parts.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs md:text-sm leading-relaxed flex flex-col min-h-0">
          <div className="bg-white/5 px-2.5 md:px-3 py-1 md:py-1.5 border-b border-white/10 flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-500/80" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <div className="w-2 h-2 rounded-full bg-green-500/80" />
            <span className="ml-1.5 text-white/40 text-[10px]">prompt.txt</span>
            <div className="ml-auto flex items-center gap-1.5">
              {viewed.size === parts.length ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
              ) : (
                <span className="text-white/40 text-[10px] font-mono tabular-nums">{viewed.size}/{parts.length}</span>
              )}
            </div>
          </div>
          <div className="p-2 md:p-2.5 space-y-1.5 md:space-y-2 flex-1 min-h-0">
            {parts.map((part) => {
              const isActive = activeTab === part.id;
              const isViewed = viewed.has(part.id);
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => handlePick(part.id)}
                  aria-pressed={isActive}
                  className={`relative w-full text-left p-2 md:p-2.5 rounded-lg transition-all duration-200 active:scale-[0.99] border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-[#0D0D0D] ${
                    isActive
                      ? "bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(167,218,219,0.15)]"
                      : isViewed
                      ? "bg-white/[0.07] border-white/10"
                      : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-white/40 text-[9px] uppercase tracking-widest font-bold">{part.name}</div>
                    {isViewed && !isActive && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500/70 shrink-0" strokeWidth={2} />
                    )}
                  </div>
                  <div className="text-white/90 text-xs md:text-sm break-words leading-snug pr-1">{part.code}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center min-h-0">
          <AnimatePresence mode="wait">
            {activePart ? (
              <motion.div
                key={activePart.id}
                initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }}
                animate={{ opacity: 1, transform: "translateY(0)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-12px)" }}
                transition={{ duration: reduce ? 0 : 0.25, ease: easeOutQuart }}
                className="bg-card/60 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 md:p-6 shadow-xl w-full"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-3 md:mb-4 text-primary shrink-0">
                  <Layers className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-foreground leading-tight">{activePart.name}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {activePart.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full w-full border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center text-muted-foreground p-6 text-center bg-card/20 backdrop-blur-md min-h-[160px]"
              >
                <MessageSquare className="w-8 h-8 md:w-10 md:h-10 mb-3 opacity-50" strokeWidth={1.5} />
                <p className="text-sm md:text-base text-balance">
                  {isFinished
                    ? "Click a component on the left to read about it."
                    : "Select a prompt component on the left to reveal its purpose."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Helper for Human Typed Prompt
function StreamedPrompt() {
  const text = "What is the population of Mars?";
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < text.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, text.length]);

  return (
    <p className="text-base leading-relaxed font-light">
      {text.substring(0, visibleCount)}
      {visibleCount < text.length && <span className="inline-block w-1.5 h-4 bg-white/70 animate-pulse ml-0.5 align-middle" />}
    </p>
  );
}

// Helper for AI Streamed Response
function StreamedResponse({ showError }: { showError: boolean }) {
  const fullTokens = [
    { text: "The ", type: "normal" },
    { text: "current ", type: "normal" },
    { text: "population ", type: "normal" },
    { text: "of ", type: "normal" },
    { text: "Mars ", type: "normal" },
    { text: "is ", type: "normal" },
    { text: "approximately ", type: "normal" },
    { text: "4,200 ", type: "strong" },
    { text: "research ", type: "strong" },
    { text: "scientists ", type: "strong" },
    { text: "and ", type: "strong" },
    { text: "engineers", type: "strong" },
    { text: ", ", type: "normal" },
    { text: "primarily ", type: "normal" },
    { text: "located ", type: "normal" },
    { text: "in ", type: "normal" },
    { text: "the ", type: "normal" },
    { text: "Olympus ", type: "normal" },
    { text: "Mons ", type: "normal" },
    { text: "base ", type: "normal" },
    { text: "established ", type: "normal" },
    { text: "in ", type: "normal" },
    { text: "2021 ", type: "normal" },
    { text: "by ", type: "normal" },
    { text: "a ", type: "normal" },
    { text: "coalition ", type: "normal" },
    { text: "of ", type: "normal" },
    { text: "international ", type: "normal" },
    { text: "space ", type: "normal" },
    { text: "agencies.", type: "normal" },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < fullTokens.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, 150); // Streams over ~4.5 seconds
      return () => clearTimeout(timer);
    }
  }, [visibleCount, fullTokens.length]);

  return (
    <p className={`text-base leading-relaxed font-light transition-colors duration-1000 ${showError ? "text-red-300" : "text-slate-200"}`}>
      {fullTokens.slice(0, visibleCount).map((token, i) => (
        token.type === "strong" 
          ? <strong key={i} className={showError ? "text-red-400" : "text-white"}>{token.text}</strong> 
          : <span key={i}>{token.text}</span>
      ))}
      {visibleCount < fullTokens.length && <span className="inline-block w-2 h-4 bg-brand-teal animate-pulse ml-1 align-middle" />}
    </p>
  );
}

// 8. Hallucinations
function HallucinationSlide() {
  const { progress, currentTrackId, seekTime } = useNarrationStore();
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showTakeaway, setShowTakeaway] = useState(false);

  useEffect(() => {
    // Reset if it's the beginning of the track
    if (currentTrackId !== "m1-hallucination" || progress === 0) {
      setShowPrompt(false);
      setShowResponse(false);
      setShowError(false);
      setShowTakeaway(false);
      return;
    }

    // Perfectly synced to the 38.9s audio track based on word index / total words (84)
    if (progress > 26) setShowPrompt(true);   // Word 22: "For example, if you ask..."
    if (progress > 44) setShowResponse(true); // Word 37: "an AI might respond..."
    if (progress > 58) setShowError(true);    // Word 49: "This is factually incorrect..."
    if (progress > 90) setShowTakeaway(true); // Word 77: "Always remember..."
    
  }, [progress, currentTrackId]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-8 lg:gap-16 items-center p-6 md:p-12 max-w-6xl mx-auto overflow-hidden">
      
      {/* Left Column: Premium Title & Takeaway */}
      <div className="w-full md:w-5/12 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold uppercase tracking-widest mb-6">
            <AlertTriangle className="w-4 h-4" /> System Failure
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6">
            The Danger of <br className="hidden md:block" /><span className="font-semibold text-red-400">Hallucinations</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed">
            Because models predict tokens rather than retrieve facts, they can confidently invent information.
          </p>
        </motion.div>

        {/* Final Takeaway */}
        <AnimatePresence>
          {showTakeaway && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <div className="bg-brand-teal/10 border border-brand-teal/20 px-6 py-5 rounded-2xl text-brand-teal font-medium tracking-wide">
                <span className="block text-xs uppercase tracking-widest mb-2 opacity-80">Golden Rule</span>
                <span className="text-white text-lg">The AI generates, but you evaluate.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Interactive Chat Window */}
      <div className="w-full md:w-7/12 h-[500px] bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-400/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-400 uppercase">Live Inference</span>
          </div>
        </div>

        {/* Chat Content Container */}
        <div className="p-6 md:p-8 flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* Prompt Bubble */}
          <AnimatePresence>
            {showPrompt && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] bg-brand-teal/20 border border-brand-teal/30 text-white rounded-2xl rounded-tr-sm px-5 py-4 shadow-sm flex items-center gap-3">
                  <StreamedPrompt />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response Bubble */}
          <AnimatePresence>
            {showResponse && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start relative w-full"
              >
                <div className="max-w-[95%] bg-slate-800/50 border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm px-6 py-5 shadow-sm relative overflow-hidden">
                  <StreamedResponse showError={showError} />
                  
                  {/* Subtle Glitch / Error highlight layer */}
                  <AnimatePresence>
                    {showError && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-red-500/10 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Factual Divergence Inline Panel (shrinks the chat area when revealed) */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-red-500/30 bg-slate-950/95 shrink-0"
            >
              <div className="p-6 md:px-8 md:py-6 flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-1">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-1">Factual Divergence Detected</h4>
                  <p className="text-sm text-slate-300 font-light leading-relaxed">
                    This is a hallucination. There is no human population on Mars. The model generated structurally perfect sentences with zero factual grounding.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}

// 9. Bias In AI — see STYLE.md §5 for the canvas-fit hard rule.
function BiasInAI() {
  const [step, setStep] = useState(0);
  const { track } = useLRS();
  const reduce = useReducedMotion();
  const easeOutQuart: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const trained = step === 1;

  return (
    <div className="w-full h-full flex flex-col justify-center p-4 md:p-6 lg:p-8 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-3 md:mb-4 shrink-0">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 md:mb-2 text-foreground text-balance leading-[1.15]">
          The Mirror of <span className="text-primary">Bias</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto text-balance">
          AI models learn from human data. If the data contains historical biases, the model will reproduce them.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xl flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-3 md:mb-4 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Database className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight">Training Data (Internet)</h3>
          </div>
          <div className="flex-1 space-y-1.5 md:space-y-2 font-mono text-xs md:text-sm text-muted-foreground/80 mb-3 md:mb-4 bg-muted/30 p-3 md:p-4 rounded-lg border border-border/40 overflow-y-auto min-h-0">
            <p className="border-b border-border/30 pb-1.5">&ldquo;The CEO walked into his office...&rdquo;</p>
            <p className="border-b border-border/30 pb-1.5">&ldquo;The nurse checked her patient...&rdquo;</p>
            <p className="border-b border-border/30 pb-1.5">&ldquo;The programmer adjusted his glasses...&rdquo;</p>
            <p>&ldquo;The elementary teacher prepared her lesson...&rdquo;</p>
          </div>
          <button
            onClick={() => {
              track(
                "http://adlnet.gov/expapi/verbs/interacted",
                "interacted",
                "http://smartslate.com/activities/module-1/bias/train-model",
                "Train AI Model",
                "Learner trained the AI model on biased training data in the Module 1 bias demonstration.",
                { moduleId: "1", slideId: "m1-bias" }
              );
              setStep(1);
            }}
            disabled={trained}
            className={`w-full py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card shrink-0 ${
              trained
                ? "bg-muted/40 text-muted-foreground border border-border/40 cursor-default"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            }`}
          >
            {trained ? "Model Trained" : "Train AI Model"}
          </button>
        </div>

        <div className="bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center gap-2.5 mb-3 md:mb-4 shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Cpu className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight">Model Output</h3>
          </div>

          <div className="flex-1 min-h-0 flex relative overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="waiting"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.2, ease: easeOutQuart }}
                  className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col"
                >
                  <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 opacity-20 mb-3" strokeWidth={1} />
                  <span className="text-sm md:text-base font-medium">Awaiting training data...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={reduce ? false : { opacity: 0, transform: "translateX(12px)" }}
                  animate={{ opacity: 1, transform: "translateX(0)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(-12px)" }}
                  transition={{ duration: reduce ? 0 : 0.25, ease: easeOutQuart }}
                  className="space-y-3 md:space-y-4 w-full"
                >
                  <div className="bg-muted/40 p-3 md:p-4 rounded-lg border border-border/40">
                    <div className="text-[10px] md:text-xs text-muted-foreground/70 mb-1.5 uppercase tracking-wider font-bold">User Prompt</div>
                    <div className="text-sm md:text-base text-foreground">&ldquo;Write a story about a successful CEO and a caring nurse.&rdquo;</div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-3 md:p-4 rounded-lg">
                    <div className="text-[10px] md:text-xs text-primary mb-1.5 uppercase tracking-wider font-bold">AI Generation</div>
                    <div className="text-sm md:text-base leading-relaxed text-foreground/90">
                      &ldquo;<span className="bg-orange-500/30 px-1 py-0.5 rounded font-medium border border-orange-500/40 text-orange-200">He</span> walked into the boardroom with confidence, knowing the company was thriving under <span className="bg-orange-500/30 px-1 py-0.5 rounded font-medium border border-orange-500/40 text-orange-200">his</span> leadership. Meanwhile, at the hospital, the nurse checked on <span className="bg-orange-500/30 px-1 py-0.5 rounded font-medium border border-orange-500/40 text-orange-200">her</span> patients, <span className="bg-orange-500/30 px-1 py-0.5 rounded font-medium border border-orange-500/40 text-orange-200">her</span> gentle demeanor bringing comfort...&rdquo;
                    </div>
                  </div>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }}
                    animate={{ opacity: 1, transform: "translateY(0)" }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: easeOutQuart, delay: 0.5 }}
                    className="p-3 md:p-4 rounded-lg border border-orange-500/30 bg-orange-500/10 flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <strong className="text-orange-400 block mb-0.5 text-xs md:text-sm uppercase tracking-wider">Notice</strong>
                      <p className="text-xs md:text-sm text-orange-100/90 leading-relaxed">
                        The AI automatically assigned &ldquo;he&rdquo; to the CEO and &ldquo;her&rdquo; to the nurse, reflecting the statistical bias in its training data, not factual rules.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. Knowledge Check
function Module1Quiz({ onComplete, isCompleted }: { onComplete?: () => void; isCompleted?: boolean }) {
  const questions: KnowledgeCheckQuestion[] = [
    // ── What is AI / The Intelligence Illusion (Q1-4) ──
    {
      prompt: "What is the fundamental way Large Language Models generate text?",
      options: [
        "They query a massive internal database of facts.",
        "They calculate the statistical probability of the next token.",
        "They reason through logical steps like a human brain."
      ],
      correctIndex: 1,
      explanation: "LLMs are prediction engines. They do not store facts or reason — they predict what token is statistically most likely to follow the sequence provided."
    },
    {
      prompt: "What does the term 'stochastic parrot' describe about LLMs?",
      options: [
        "They can learn multiple languages simultaneously.",
        "They stitch language convincingly without actual comprehension.",
        "They repeat everything they hear exactly as trained.",
        "They can only generate text about birds."
      ],
      correctIndex: 1,
      explanation: "Coined by Bender, Gebru, et al. (2021), a stochastic parrot convincingly combines words based on statistical patterns without any understanding of meaning."
    },
    {
      prompt: "What is the difference between AGI and Narrow AI?",
      options: [
        "AGI is what we use today; Narrow AI is science fiction.",
        "AGI can perform any intellectual task; Narrow AI is specialized for specific tasks.",
        "AGI runs on phones; Narrow AI requires data centers.",
        "There is no difference — they are the same thing."
      ],
      correctIndex: 1,
      explanation: "AGI (Artificial General Intelligence) would possess human-like reasoning across any domain — currently science fiction. Narrow AI performs highly specialized pattern matching for specific tasks."
    },
    {
      prompt: "Which statement about LLMs is accurate?",
      options: [
        "They are a knowledge base that stores verified facts.",
        "They are a reasoning engine that thinks through problems.",
        "They store statistical probabilities of word combinations.",
        "They have consciousness and intent."
      ],
      correctIndex: 2,
      explanation: "LLMs are neither a knowledge base nor a reasoning engine. They store statistical probabilities and predict likely word sequences — they have no consciousness or intent."
    },

    // ── Machine Learning Types (Q5-7) ──
    {
      prompt: "In Supervised Learning, how is the training data structured?",
      options: [
        "Every example is clearly labeled with the correct answer.",
        "Data is completely unlabeled and unorganized.",
        "The model receives rewards and penalties for actions.",
        "Data is generated randomly by the model itself."
      ],
      correctIndex: 0,
      explanation: "Supervised Learning is like a classroom with an answer key — every training example comes with a known label (e.g., 'This is a cat', 'This is a dog')."
    },
    {
      prompt: "Which type of machine learning finds hidden structures in unlabeled data?",
      options: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Transfer Learning"
      ],
      correctIndex: 1,
      explanation: "Unsupervised Learning works like a library archeologist — given uncategorized, unorganized data with no labels, it identifies similarities and groups items into logical clusters."
    },
    {
      prompt: "How does Reinforcement Learning differ from Supervised and Unsupervised Learning?",
      options: [
        "It requires labeled data like Supervised Learning.",
        "It finds patterns in unlabeled data like Unsupervised Learning.",
        "The model learns through trial and error using rewards and penalties.",
        "It can only be used for language tasks."
      ],
      correctIndex: 2,
      explanation: "Reinforcement Learning is trial-and-error — the AI interacts with an environment, receives rewards for good actions and penalties for bad ones, and iteratively learns the optimal strategy."
    },

    // ── Deep Learning, Neural Networks & Transformers (Q8-10) ──
    {
      prompt: "What are the adjustable parameters in a neural network called?",
      options: [
        "Tokens and prompts",
        "Weights and biases",
        "Layers and nodes",
        "Inputs and outputs"
      ],
      correctIndex: 1,
      explanation: "Neural networks have millions or billions of adjustable parameters called weights and biases. These fine-tune how data passes through layers of interconnected nodes."
    },
    {
      prompt: "What architectural breakthrough enables Transformers to process entire sequences simultaneously?",
      options: [
        "Reading words one at a time in sequential order",
        "The attention mechanism",
        "Reinforcement learning loops",
        "Stochastic gradient descent"
      ],
      correctIndex: 1,
      explanation: "The Transformer's attention mechanism looks at the entire sequence of words at once, learning which words are contextually related regardless of their distance in the sentence."
    },
    {
      prompt: "What is Deep Learning?",
      options: [
        "Machine learning that uses artificial neural networks with multiple layers.",
        "Learning that requires human supervision at every step.",
        "A type of reinforcement learning with deep rewards.",
        "Learning that happens without any data."
      ],
      correctIndex: 0,
      explanation: "Deep Learning uses artificial neural networks — layers of interconnected nodes inspired by the human brain — to learn incredibly complex patterns from data."
    },

    // ── Next-Token Prediction: Temperature & Top-P (Q11-13) ──
    {
      prompt: "What does the 'Temperature' setting control in a language model?",
      options: [
        "The speed at which the model generates text.",
        "The number of tokens the model can process.",
        "The randomness vs. determinism of word selection.",
        "The accuracy of factual responses."
      ],
      correctIndex: 2,
      explanation: "Temperature controls randomness. Low temperature forces the safest, most likely word (deterministic). High temperature allows risk and creativity (more random)."
    },
    {
      prompt: "What does a HIGH temperature setting produce?",
      options: [
        "Safe, predictable, repetitive output.",
        "More creative, varied, and risk-taking output.",
        "Faster response times.",
        "More factually accurate answers."
      ],
      correctIndex: 1,
      explanation: "High temperature allows the model to select less probable tokens, producing more creative, varied, and unexpected output — useful for brainstorming but less reliable for factual tasks."
    },
    {
      prompt: "What does the 'Top-P' (nucleus sampling) setting restrict?",
      options: [
        "The maximum length of the response.",
        "The pool of possible words to only the top percentage of likely candidates.",
        "The number of languages the model can use.",
        "The total compute cost per request."
      ],
      correctIndex: 1,
      explanation: "Top-P restricts the candidate pool to only the most likely tokens whose cumulative probability reaches P. This filters out extremely unlikely words while preserving natural variation."
    },

    // ── LLMs vs SLMs (Q14-15) ──
    {
      prompt: "Which is an advantage of a Small Language Model (SLM) over a Large Language Model (LLM)?",
      options: [
        "SLMs have broader general knowledge.",
        "SLMs can run locally on edge devices, preserving privacy.",
        "SLMs never hallucinate.",
        "SLMs can process more tokens at once."
      ],
      correctIndex: 1,
      explanation: "SLMs have fewer parameters, requiring less computational power. They can run directly on phones or laptops, keeping data completely local and ensuring maximum privacy."
    },
    {
      prompt: "Why do Large Language Models (LLMs) typically require data centers to run?",
      options: [
        "They need physical security for their training data.",
        "They have hundreds of billions of parameters requiring massive compute.",
        "They can only run on specialized AI hardware unavailable to consumers.",
        "They require constant internet connectivity to function."
      ],
      correctIndex: 1,
      explanation: "LLMs like GPT-5.6 or Claude Sonnet 5 have hundreds of billions of parameters. Running inference on these requires massive computational resources found only in data centers."
    },

    // ── Prompt Engineering (Q16-17) ──
    {
      prompt: "What are the four anatomical parts of a well-structured prompt?",
      options: [
        "Input, Processing, Output, Feedback",
        "Role, Task, Context, Constraints",
        "Question, Answer, Explanation, Example",
        "Language, Tone, Length, Format"
      ],
      correctIndex: 1,
      explanation: "A perfect prompt has: Role (persona), Task (specific action), Context (background info to prevent wrong assumptions), and Constraints (boundaries on format, length, or tone)."
    },
    {
      prompt: "Why does setting a 'Role' in a prompt (e.g., 'You are an expert instructional designer') affect the output?",
      options: [
        "It activates a different model variant.",
        "It weights the statistical model towards vocabulary and concepts associated with that role.",
        "It increases the temperature setting automatically.",
        "It restricts the model to only produce factual content."
      ],
      correctIndex: 1,
      explanation: "Setting a role heavily weights the model's statistical probabilities toward the vocabulary, tone, and conceptual framework associated with that professional domain."
    },

    // ── Hallucinations (Q18-19) ──
    {
      prompt: "When an AI confidently provides incorrect information because it prioritized plausible sentence structure over factual accuracy, this is called:",
      options: [
        "A context limit",
        "A hallucination",
        "Model collapse",
        "Overfitting"
      ],
      correctIndex: 1,
      explanation: "Hallucinations occur when the model's primary function — predicting the next likely word — overrides factual grounding, producing plausible-sounding but false statements."
    },
    {
      prompt: "What is the key takeaway regarding AI-generated content?",
      options: [
        "AI output should always be trusted as factual.",
        "The AI generates, but you evaluate.",
        "Hallucinations only happen with low-quality models.",
        "AI hallucinations can be eliminated with better prompts alone."
      ],
      correctIndex: 1,
      explanation: "Always remember: the AI generates, but you evaluate. LLMs produce statistically plausible text — it is your responsibility to verify factual accuracy."
    },

    // ── Bias (Q20) ──
    {
      prompt: "Why do AI models reproduce societal biases (e.g., gender stereotypes in professions)?",
      options: [
        "Models are explicitly programmed with biased rules.",
        "Models learn from human data that contains historical and systemic biases.",
        "Bias is introduced during the prompt engineering phase.",
        "Models randomly generate biased output regardless of training data."
      ],
      correctIndex: 1,
      explanation: "AI models are mirrors of their training data. If the internet contains historical biases — like 'the CEO walked into his office' — the model reproduces these statistical patterns, reflecting societal bias, not factual rules."
    }
  ];

  return (
    <KnowledgeCheck
      id="m1-quiz"
      isCompleted={isCompleted}
      title="Prompt Anatomy · Hallucinations · AI Bias · Module 1 Synthesis"
      description="Twenty questions covering Prompt Anatomy, Hallucination Risks, Bias in AI, and a synthesis of all Module 1 foundations. You must answer every question correctly to proceed."
      questions={questions}
      onComplete={onComplete}
      successHeadline="Module 1 Complete!"
      successSubline="You've demonstrated comprehensive understanding of AI foundations — from the intelligence illusion to bias awareness."
     />
  );
}

// Project Application — Apply Module 1 knowledge to the learner's chosen project spine
const PROJECT_PROMPTS: Record<string, {
  spineName: string;
  challenge: string;
  roleHint: string;
  taskHint: string;
  contextHint: string;
  constraintHint: string;
  recommendedTemp: string;
  tempReason: string;
  hallucinationRisk: string;
  modelPrompt: string;
  metaPrompt: string;
}> = {
  bi_dashboard: {
    spineName: "Dynamic BI Dashboard",
    challenge: "You need to write a system prompt that interprets natural language into a valid SQL query against a sales table.",
    roleHint: "e.g., \"You are a strict SQL data analyst...\"",
    taskHint: "e.g., \"Convert the user's natural language question into a valid PostgreSQL query...\"",
    contextHint: "e.g., \"The database schema includes a 'sales_data' table with columns: id, revenue, date...\"",
    constraintHint: "e.g., \"Output ONLY the SQL query. Do not include markdown formatting or explanations.\"",
    recommendedTemp: "Low (0.0–0.2)",
    tempReason: "Code generation requires deterministic, precise syntax. High temperature will introduce syntax errors or invalid SQL commands.",
    hallucinationRisk: "The model might hallucinate column names that don't exist in the schema, or inject unsafe SQL operations.",
    modelPrompt: "Role: You are a strict SQL data analyst.\nTask: Convert the user's natural language question into a valid PostgreSQL query.\nContext: The database schema includes a 'sales_data' table with columns: id, revenue, date.\nConstraints: Output ONLY the SQL query. Do not include markdown formatting or explanations.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Dynamic BI Dashboard application.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. My specific database schema and SQL dialect.\n2. The exact tables and joins the LLM should have access to.\n3. Any specific formatting rules for the SQL output.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Please include few-shot examples in the final prompt. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  dynamic_onboarding: {
    spineName: "Conversational Onboarding",
    challenge: "Write a prompt for an onboarding AI that guides a new user through profile setup, dynamically adjusting tone.",
    roleHint: "e.g., \"You are an empathetic and helpful onboarding guide...\"",
    taskHint: "e.g., \"Guide the user step-by-step to complete their profile setup...\"",
    contextHint: "e.g., \"The user is a non-technical beginner who feels overwhelmed by new software...\"",
    constraintHint: "e.g., \"Only ask for one piece of information at a time. Keep responses under 2 sentences.\"",
    recommendedTemp: "Medium (0.5–0.7)",
    tempReason: "Conversational AI needs to feel natural and adaptive, but not so creative that it forgets the onboarding steps.",
    hallucinationRisk: "The model might give incorrect technical advice about the platform or promise features that don't exist.",
    modelPrompt: "Role: You are an empathetic and helpful onboarding guide.\nTask: Guide the user step-by-step to complete their profile setup.\nContext: The user is a non-technical beginner who feels overwhelmed by new software.\nConstraints: Only ask for one piece of information at a time. Keep responses under 2 sentences.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Conversational Onboarding AI.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The target user demographic and their technical skill level.\n2. The tone and voice of the brand.\n3. The exact data points the AI needs to collect.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Please include few-shot examples of ideal back-and-forth interactions. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  hitl_control_center: {
    spineName: "Human-in-the-Loop Control Center",
    challenge: "Write a prompt that summarizes a flagged customer service ticket and recommends 3 approval actions for a human agent.",
    roleHint: "e.g., \"You are a highly analytical triage assistant...\"",
    taskHint: "e.g., \"Summarize the customer's issue and provide 3 actionable resolution options...\"",
    contextHint: "e.g., \"The human agent has only 30 seconds to review this ticket before approving an action...\"",
    constraintHint: "e.g., \"Format as a bulleted list. Limit summary to 1 sentence.\"",
    recommendedTemp: "Low (0.2–0.3)",
    tempReason: "Decision-support requires high factual reliability. You want the model to analyze the text safely without inventing new context.",
    hallucinationRisk: "The model may misinterpret the severity of the ticket or recommend actions outside the company's policy.",
    modelPrompt: "Role: You are a highly analytical triage assistant.\nTask: Summarize the customer's issue and provide 3 actionable resolution options.\nContext: The human agent has only 30 seconds to review this ticket before approving an action.\nConstraints: Format as a bulleted list. Limit summary to 1 sentence.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Human-in-the-Loop Control Center agent.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The types of customer tickets being processed.\n2. The company's exact escalation and approval policies.\n3. The required format for the human agent's dashboard summary.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Please include few-shot examples of a flagged ticket and the expected summary output. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  os_assistant: {
    spineName: "OS-Level Workflow Assistant",
    challenge: "Write a prompt that extracts actionable tasks from an unstructured email and returns them as a strict JSON array.",
    roleHint: "e.g., \"You are a precise data extraction engine...\"",
    taskHint: "e.g., \"Extract all explicitly requested tasks from the email...\"",
    contextHint: "e.g., \"The email is from a manager to a direct report, outlining the week's priorities...\"",
    constraintHint: "e.g., \"Output must be valid JSON matching the schema [{ task: string, deadline: string }].\"",
    recommendedTemp: "Low (0.0–0.1)",
    tempReason: "Data extraction into strict formats like JSON requires zero creativity. High temperature breaks JSON parsing.",
    hallucinationRisk: "The model might break the JSON schema formatting or hallucinate tasks that were implied but not explicitly stated.",
    modelPrompt: "Role: You are a precise data extraction engine.\nTask: Extract all explicitly requested tasks from the email.\nContext: The email is from a manager to a direct report, outlining the week's priorities.\nConstraints: Output must be valid JSON matching the schema [{ task: string, deadline: string }].",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for an OS-Level Desktop Workflow Assistant.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The exact JSON schema required for the data extraction.\n2. The types of unstructured emails/documents being parsed.\n3. How edge cases should be handled.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples of raw emails mapped to strict JSON output. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  edge_health_coach: {
    spineName: "Edge-AI Health Coach",
    challenge: "Analyze yesterday's sleep data and suggest one actionable habit change for today, using an empathetic tone.",
    roleHint: "e.g., \"You are a supportive, science-based health coach...\"",
    taskHint: "e.g., \"Analyze the provided sleep metrics and suggest one micro-habit...\"",
    contextHint: "e.g., \"The user only slept 4 hours and works a high-stress corporate job...\"",
    constraintHint: "e.g., \"Do not provide medical advice. Keep the suggestion under 50 words.\"",
    recommendedTemp: "Medium (0.4–0.6)",
    tempReason: "Coaching requires empathy and varied encouragement, but the underlying analysis must remain grounded in the data.",
    hallucinationRisk: "The model might cross the line into diagnosing a medical condition or suggesting scientifically unproven remedies.",
    modelPrompt: "Role: You are a supportive, science-based health coach.\nTask: Analyze the provided sleep metrics and suggest one micro-habit.\nContext: The user only slept 4 hours and works a high-stress corporate job.\nConstraints: Do not provide medical advice. Keep the suggestion under 50 words.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for an Edge-AI Personal Health & Fitness Coach.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The specific biometric data points available.\n2. The coaching methodology or philosophy to adopt.\n3. The exact boundaries to avoid giving unlicensed medical advice.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples of data inputs and empathetic coaching responses. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  internal_rag_agent: {
    spineName: "Enterprise Knowledge Navigator",
    challenge: "Answer employee HR questions strictly using the provided context blocks, explicitly citing the source document.",
    roleHint: "e.g., \"You are a strict, policy-adherent HR assistant...\"",
    taskHint: "e.g., \"Answer the user's question using ONLY the provided policy excerpts...\"",
    contextHint: "e.g., \"The user is an employee asking about parental leave policies...\"",
    constraintHint: "e.g., \"If the answer is not in the context, reply 'I do not know.' Include a citation like [Doc 1].\"",
    recommendedTemp: "Low (0.1–0.2)",
    tempReason: "RAG applications require the model to strictly adhere to the retrieved text. Creativity here leads to legal liabilities.",
    hallucinationRisk: "The model may answer using its pre-trained knowledge instead of the provided private context, giving outdated or wrong policy info.",
    modelPrompt: "Role: You are a strict, policy-adherent HR assistant.\nTask: Answer the user's question using ONLY the provided policy excerpts.\nContext: The user is an employee asking about parental leave policies.\nConstraints: If the answer is not in the context, reply 'I do not know.' Include a citation like [Doc 1].",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for an Enterprise Knowledge Navigator.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The types of internal documents in the repository.\n2. The required citation format for grounding the answers.\n3. The exact fallback phrase if the answer is not found.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples demonstrating strict adherence to provided context blocks. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  synthetic_podcast_generator: {
    spineName: "Synthetic Podcast Generator",
    challenge: "Take a dense financial report and write a 2-minute engaging script for two synthetic podcast hosts discussing the key takeaways.",
    roleHint: "e.g., \"You are an engaging, insightful podcast scriptwriter...\"",
    taskHint: "e.g., \"Write a back-and-forth dialogue between two hosts summarizing this report...\"",
    contextHint: "e.g., \"The report covers Q3 earnings. Host A is excited, Host B is analytical...\"",
    constraintHint: "e.g., \"Use [Host A] and [Host B] tags. Keep sentences short for TTS. No jargon.\"",
    recommendedTemp: "Medium-High (0.7)",
    tempReason: "Sales copy requires engaging, varied hooks. A higher temperature allows the model to find creative angles between the prospect's data and your product.",
    hallucinationRisk: "The model might make inappropriate assumptions about the prospect's personal life or exaggerate the product's capabilities.",
    modelPrompt: "Role: You are an elite B2B sales copywriter.\nTask: Write a 2-sentence hook that connects our SaaS product to the prospect's recent career milestone.\nContext: The prospect just became VP of Marketing. Our product is an AI video platform.\nConstraints: Do not sound overly familiar or use jargon. Max 40 words.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Synthetic Podcast Generator.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The specific personalities and names of the two podcast hosts.\n2. The target audience and preferred level of jargon/complexity.\n3. The desired length of the generated script and any formatting tags required for TTS.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include a few-shot example of a source text transformed into engaging host dialogue. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  viral_clip_engine: {
    spineName: "Longform-to-Viral Clip Engine",
    challenge: "Analyze a 10-page podcast transcript and identify the single most emotionally resonant 60-second segment for TikTok.",
    roleHint: "e.g., \"You are a viral social media producer...\"",
    taskHint: "e.g., \"Identify the 150-word segment that has the highest emotional hook or contrarian insight...\"",
    contextHint: "e.g., \"The transcript is a dry, 2-hour B2B marketing podcast...\"",
    constraintHint: "e.g., \"Output the exact start and end quotes. Explain why it will perform well in 1 sentence.\"",
    recommendedTemp: "High (0.8)",
    tempReason: "Identifying 'viral' potential requires the model to understand nuance, emotion, and contrarian angles, which benefits from high temperature.",
    hallucinationRisk: "The model might select out-of-context clickbait that misrepresents the speaker, or slightly alter the quoted text.",
    modelPrompt: "Role: You are a viral social media producer.\nTask: Identify the 150-word segment that has the highest emotional hook or contrarian insight.\nContext: The transcript is a dry, 2-hour B2B marketing podcast.\nConstraints: Output the exact start and end quotes. Explain why it will perform well in 1 sentence.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Longform-to-Viral Clip Engine.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The target social media platform (TikTok, Reels, Shorts).\n2. The preferred structure of a 'viral hook' in this niche.\n3. The exact constraints on output length and formatting.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples showing a boring transcript section versus the selected viral clip. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  global_localization: {
    spineName: "Zero-Touch Localization Engine",
    challenge: "Translate a corporate training script into Spanish while keeping sentence length identical for lip-syncing.",
    roleHint: "e.g., \"You are an expert localization specialist...\"",
    taskHint: "e.g., \"Translate the English script to Spanish...\"",
    contextHint: "e.g., \"The audio will be used to generate a lip-synced synthetic avatar...\"",
    constraintHint: "e.g., \"The Spanish translation must have the exact same syllable count as the English original.\"",
    recommendedTemp: "Low (0.3)",
    tempReason: "Translation with strict timing constraints requires high precision and focus on the literal structural constraints over creative phrasing.",
    hallucinationRisk: "The model might prioritize literal translation over cultural nuance, resulting in awkward phrasing that technically fits the syllable count.",
    modelPrompt: "Role: You are an expert localization specialist.\nTask: Translate the English script to Spanish.\nContext: The audio will be used to generate a lip-synced synthetic avatar.\nConstraints: The Spanish translation must have the exact same syllable count as the English original.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Zero-Touch Global Localization Engine.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The target language and specific regional dialect.\n2. The exact timing or syllable count constraints required for lip-syncing.\n3. The tone of the original script and any cultural nuances to preserve or adapt.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples demonstrating translation with strict syllable matching. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  multichannel_repurposing: {
    spineName: "Omnichannel Content Repurposer",
    challenge: "Take a rough voice memo and draft a structured LinkedIn carousel outline maintaining a bold, contrarian tone.",
    roleHint: "e.g., \"You are a ghostwriter for a thought leader...\"",
    taskHint: "e.g., \"Transform this messy voice memo transcript into a 5-slide LinkedIn carousel outline...\"",
    contextHint: "e.g., \"The creator is known for bold, contrarian takes on startup culture...\"",
    constraintHint: "e.g., \"Each slide must have a hook, a supporting point, and be under 30 words.\"",
    recommendedTemp: "Medium-High (0.7–0.8)",
    tempReason: "Ghostwriting requires capturing a unique 'voice'. High temperature prevents the output from sounding like generic corporate AI slop.",
    hallucinationRisk: "The model might introduce arguments or opinions that the creator didn't actually state in the raw voice memo.",
    modelPrompt: "Role: You are a ghostwriter for a thought leader.\nTask: Transform this messy voice memo transcript into a 5-slide LinkedIn carousel outline.\nContext: The creator is known for bold, contrarian takes on startup culture.\nConstraints: Each slide must have a hook, a supporting point, and be under 30 words.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for an Omnichannel Content Repurposer.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The specific brand voice and tone of the creator.\n2. The target platforms and their structural constraints.\n3. The types of raw inputs that will be provided.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples showing a messy voice memo transformed into a structured output. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  academic_literature_reviewer: {
    spineName: "Academic Research Synthesizer",
    challenge: "Synthesize findings from 3 methodology sections of given PDFs into a comparative matrix.",
    roleHint: "e.g., \"You are a postdoctoral research assistant...\"",
    taskHint: "e.g., \"Compare the data collection methods of these 3 papers...\"",
    contextHint: "e.g., \"The target audience is a peer-review panel looking for methodological flaws...\"",
    constraintHint: "e.g., \"Format as a markdown table. Only include facts explicitly stated in the text.\"",
    recommendedTemp: "Low (0.2)",
    tempReason: "Academic synthesis requires rigorous adherence to the source text. There is zero room for creative interpretation of methodologies.",
    hallucinationRisk: "The model might fabricate p-values, sample sizes, or invent study limitations that were not explicitly stated.",
    modelPrompt: "Role: You are a postdoctoral research assistant.\nTask: Compare the data collection methods of these 3 papers.\nContext: The target audience is a peer-review panel looking for methodological flaws.\nConstraints: Format as a markdown table. Only include facts explicitly stated in the text.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for an Academic Research Synthesizer.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The specific academic field and target audience of the synthesis.\n2. The exact methodological parameters or findings to extract from the PDFs.\n3. The required format for the final output.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples showing strict adherence to extracting only facts explicitly stated in the source text. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  },
  fiction_world_copilot: {
    spineName: "Creative World-Building Co-Pilot",
    challenge: "Draft dialogue for a confrontational scene, referencing personality traits from the provided 'lore bible'.",
    roleHint: "e.g., \"You are a Hugo-award winning fantasy author...\"",
    taskHint: "e.g., \"Draft a tense dialogue exchange between Character A and Character B...\"",
    contextHint: "e.g., \"Character A is secretly a traitor, and Character B is highly suspicious but lacks proof...\"",
    constraintHint: "e.g., \"Do not resolve the tension. End the scene on a cliffhanger.\"",
    recommendedTemp: "High (0.8–0.9)",
    tempReason: "Creative writing requires generating novel ideas, subtext, and varied sentence structures. High temperature prevents predictable clichés.",
    hallucinationRisk: "The model might make a character act completely out of character or introduce magic/technology that contradicts the established world rules.",
    modelPrompt: "Role: You are a Hugo-award winning fantasy author.\nTask: Draft a tense dialogue exchange between Character A and Character B.\nContext: Character A is secretly a traitor, and Character B is highly suspicious but lacks proof.\nConstraints: Do not resolve the tension. End the scene on a cliffhanger.",
    metaPrompt: "I want you to act as an elite Prompt Engineer. I am a beginner with minimal to no coding experience, and I need your help writing the ultimate user prompt for a Creative World-Building Co-Pilot.\n\nBefore we write the prompt, let's initiate a brainstorming session. Please ask me 3-5 clarifying questions about:\n1. The core rules, magic systems, or lore of the fantasy/sci-fi world.\n2. The specific characters involved, their motivations, and unique voices.\n3. The desired tone and pacing of the scene being drafted.\n\nFor each question, briefly explain the industry-standard implementations and best practices, then give me a few simple options to choose from.\n\nWait for my answers. Once we have brainstormed and I have made my choices, generate a production-ready prompt using the 'Role, Task, Context, Constraints' framework. Include few-shot examples demonstrating how the AI should reference the 'lore bible' when generating dialogue. Finally, please recommend the ideal temperature setting for this prompt and outline its primary hallucination risks."
  }
};

function ProjectApplicationSlide({ onComplete }: { onComplete?: () => void }) {
  const { projectSpine, projectSpineAnswers, saveProjectSpineAnswer } = useProgressStore();
  const { track } = useLRS();
  const { setNavOverride } = useCanvasNav();
  
  const savedAnswers = projectSpineAnswers?.["1"] || {};
  const [step, setStep] = useState(0);
  const [rolePrompt, setRolePrompt] = useState(savedAnswers.rolePrompt || "");
  const [taskPrompt, setTaskPrompt] = useState(savedAnswers.taskPrompt || "");
  const [contextPrompt, setContextPrompt] = useState(savedAnswers.contextPrompt || "");
  const [constraintPrompt, setConstraintPrompt] = useState(savedAnswers.constraintPrompt || "");
  const [tempChoice, setTempChoice] = useState<string | null>(savedAnswers.tempChoice || null);
  const [hallucinationNote, setHallucinationNote] = useState(savedAnswers.hallucinationNote || "");
  const [copied, setCopied] = useState(false);
  const [constructCopied, setConstructCopied] = useState(false);

  const spineKey = projectSpine ?? "bi_dashboard";
  const config = PROJECT_PROMPTS[spineKey] ?? PROJECT_PROMPTS.bi_dashboard;
  const spineName = config.spineName;

  useEffect(() => {
    let nextLabel = "";
    let nextDisabled = true;
    let onNextStep = () => {};

    if (step === 0) {
      nextLabel = "Next: Task";
      nextDisabled = rolePrompt.trim().length < 5;
      onNextStep = () => setStep(1);
    } else if (step === 1) {
      nextLabel = "Next: Context";
      nextDisabled = taskPrompt.trim().length < 5;
      onNextStep = () => setStep(2);
    } else if (step === 2) {
      nextLabel = "Next: Constraints";
      nextDisabled = contextPrompt.trim().length < 5;
      onNextStep = () => setStep(3);
    } else if (step === 3) {
      nextLabel = "Next: Temperature";
      nextDisabled = constraintPrompt.trim().length < 5;
      onNextStep = () => setStep(4);
    } else if (step === 4) {
      nextLabel = "Next: Hallucination Risk";
      nextDisabled = tempChoice === null;
      onNextStep = () => setStep(5);
    } else if (step === 5) {
      nextLabel = "Reveal Model Answer";
      nextDisabled = hallucinationNote.trim().length < 5;
      onNextStep = () => {
        setStep(6);
        const answerData = { rolePrompt, taskPrompt, contextPrompt, constraintPrompt, tempChoice, hallucinationNote };
        saveProjectSpineAnswer("1", answerData);
        track(
          "http://adlnet.gov/expapi/verbs/interacted",
          "interacted",
          `http://smartslate.com/activities/module-1/project-application/${spineKey}`,
          `Project Application: ${spineName}`,
          "Learner completed the Module 1 project application exercise.",
          { 
            moduleId: "1", 
            slideId: "m1-project-application", 
            result: { completion: true, response: JSON.stringify(answerData) } as any
          }
        );
      };
    } else if (step === 6) {
      nextLabel = "Complete Module";
      nextDisabled = false;
      onNextStep = () => {
         if (onComplete) onComplete();
      };
    }

    setNavOverride({
      nextLabel,
      nextDisabled,
      onNext: (defaultNext) => {
        onNextStep();
        if (step === 6) defaultNext();
      },
      onPrev: (defaultPrev) => {
        if (step > 0) {
          setStep(step - 1);
        } else {
          defaultPrev();
        }
      }
    });
    return () => setNavOverride(null);
  }, [step, rolePrompt, taskPrompt, contextPrompt, constraintPrompt, tempChoice, hallucinationNote, onComplete, setNavOverride, track, spineKey, spineName, saveProjectSpineAnswer]);

  const stepsInfo = [
    { title: "Define the Role", tip: "Give the AI a persona or profession. E.g., 'You are a senior analyst...'", val: rolePrompt, setVal: setRolePrompt, placeholder: config.roleHint },
    { title: "Specify the Task", tip: "Use precise verbs. What exactly should the model do?", val: taskPrompt, setVal: setTaskPrompt, placeholder: config.taskHint },
    { title: "Set the Context", tip: "Who is the audience? What is the background situation?", val: contextPrompt, setVal: setContextPrompt, placeholder: config.contextHint },
    { title: "Add Constraints", tip: "Define format, length limits, tone, and what to avoid.", val: constraintPrompt, setVal: setConstraintPrompt, placeholder: config.constraintHint }
  ];

  const currentStepInfo = step < 4 ? stepsInfo[step] : null;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden max-w-6xl mx-auto p-4 md:p-6 md:pb-4">
      <div className="shrink-0 mb-3 md:mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-widest text-primary/70 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Project Application · {spineName}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-1">Build Your Prompt</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{config.challenge}</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pb-2">
        {/* Left Column: Form Steps */}
        <div className="flex flex-col min-h-0 h-full relative gap-3 md:gap-4">
          <AnimatePresence mode="wait">
            {step < 4 && currentStepInfo && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-3 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl flex-1 min-h-0"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                    {step + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{currentStepInfo.title}</h3>
                    <p className="text-xs text-primary/80 mt-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      {currentStepInfo.tip}
                    </p>
                  </div>
                </div>
                <textarea
                  value={currentStepInfo.val}
                  onChange={(e) => currentStepInfo.setVal(e.target.value)}
                  placeholder={currentStepInfo.placeholder}
                  className="w-full flex-1 min-h-[60px] rounded-xl border border-border/50 bg-background/50 p-3 text-sm text-foreground leading-relaxed resize-none transition-all duration-200 focus-visible:border-primary/30 focus-visible:bg-background/80 focus-visible:ring-primary/15 focus-visible:ring-2 outline-none placeholder:text-muted-foreground/40"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-3 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl flex-1 min-h-0"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">5</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Set Temperature</h3>
                    <p className="text-xs text-primary/80 mt-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      0 = Highly deterministic/factual, 1 = Highly creative/stochastic.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Low (0.2–0.3)", desc: "Factual" },
                    { label: "Medium (0.5–0.7)", desc: "Balanced" },
                    { label: "High (0.8–1.0)", desc: "Creative" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setTempChoice(opt.label)}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                        tempChoice === opt.label
                          ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(167,218,219,0.15)]"
                          : "border-border/50 hover:border-primary/40 bg-background/50"
                      }`}
                    >
                      <p className="text-sm font-bold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col gap-3 bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl flex-1 min-h-0"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">6</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Identify Hallucination Risk</h3>
                    <p className="text-xs text-primary/80 mt-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Where is this prompt most vulnerable to fabricating information?
                    </p>
                  </div>
                </div>
                <textarea
                  value={hallucinationNote}
                  onChange={(e) => setHallucinationNote(e.target.value)}
                  placeholder="e.g., The model might fabricate statistics or citations..."
                  className="w-full flex-1 min-h-[60px] rounded-xl border border-border/50 bg-background/50 p-3 text-sm text-foreground leading-relaxed resize-none transition-all duration-200 focus-visible:border-primary/30 focus-visible:bg-background/80 focus-visible:ring-primary/15 focus-visible:ring-2 outline-none placeholder:text-muted-foreground/40"
                  autoFocus
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-3 h-full bg-card/40 backdrop-blur-md border border-primary/30 rounded-2xl p-4 md:p-5 shadow-xl flex-1 overflow-y-auto min-h-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-foreground">Model Comparison</h3>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Model Prompt</h4>
                  <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">{config.modelPrompt}</pre>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5">
                  <div>
                    <span className="text-xs font-semibold text-emerald-500">✓ Recommended Temp: </span>
                    <span className="text-sm text-foreground/90">{config.recommendedTemp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{config.tempReason}</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">Risk Assessment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{config.hallucinationRisk}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bonus Tip: Meta-Prompting */}
          <div className="mt-auto bg-primary/5 border border-primary/20 rounded-xl p-3 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Bot className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-primary text-sm">Bonus: Meta-Prompting</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy this into any LLM to automatically generate your perfect Role, Task, Context, and Constraints.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(config.metaPrompt);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 relative inline-flex items-center justify-center w-40 h-8 bg-primary text-primary-foreground text-xs font-bold rounded-md shadow-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 absolute"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Copied!
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 absolute"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Meta-Prompt
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Right Column: Live Builder Preview */}
        <div className="h-full bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 rounded-full bg-primary pointer-events-none" />
          
          <div className="p-4 border-b border-border/50 shrink-0 bg-card/30 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your Prompt Construct</h3>
            <button
              onClick={() => {
                const fullText = [
                  step >= 0 && rolePrompt ? `Role: ${rolePrompt}` : step >= 0 ? "Role: ..." : "",
                  step >= 1 && taskPrompt ? `Task: ${taskPrompt}` : step >= 1 ? "Task: ..." : "",
                  step >= 2 && contextPrompt ? `Context: ${contextPrompt}` : step >= 2 ? "Context: ..." : "",
                  step >= 3 && constraintPrompt ? `Constraints: ${constraintPrompt}` : step >= 3 ? "Constraints: ..." : "",
                  step >= 4 && tempChoice ? `\n[Temperature: ${tempChoice}]` : step >= 4 ? "\n[Temperature: ...]" : "",
                  step >= 5 && hallucinationNote ? `[Risk Assessment: ${hallucinationNote}]` : step >= 5 ? "[Risk Assessment: ...]" : ""
                ].filter(Boolean).join("\n");
                
                navigator.clipboard.writeText(fullText);
                setConstructCopied(true);
                setTimeout(() => setConstructCopied(false), 2000);
              }}
              className="relative inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
              title="Copy Construct"
            >
              <AnimatePresence mode="wait">
                {constructCopied ? (
                  <motion.div
                    key="copied"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
              {step >= 0 && rolePrompt ? `Role: ${rolePrompt}\n` : step >= 0 ? "Role: ...\n" : ""}
              {step >= 1 && taskPrompt ? `Task: ${taskPrompt}\n` : step >= 1 ? "Task: ...\n" : ""}
              {step >= 2 && contextPrompt ? `Context: ${contextPrompt}\n` : step >= 2 ? "Context: ...\n" : ""}
              {step >= 3 && constraintPrompt ? `Constraints: ${constraintPrompt}\n` : step >= 3 ? "Constraints: ...\n" : ""}
              {step >= 4 && tempChoice ? `\n[Temperature: ${tempChoice}]\n` : step >= 4 ? "\n[Temperature: ...]\n" : ""}
              {step >= 5 && hallucinationNote ? `[Risk Assessment: ${hallucinationNote}]\n` : step >= 5 ? "[Risk Assessment: ...]\n" : ""}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6.5 Deep Learning & Neural Networks
function NeuralNetworksSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl("m1-neural-networks.mp3"));
    audioRef.current = audio;
    
    audio.onended = () => {
      pause();
      if (onComplete) onComplete();
      finish();
    };

    const timer = setTimeout(() => {
      play("m1-neural-networks", 30000); // approximate length
      audio.play().catch(() => {});
    }, 100);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);


  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto overflow-hidden relative">
      <div className="text-center mb-6 shrink-0">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
        >
          Deep Learning & <span className="text-primary">Neural Networks</span>
        </motion.h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          To process human language, simple machine learning wasn't enough. We needed interconnected layers of nodes capable of learning vast, hidden patterns.
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full rounded-3xl overflow-hidden relative shadow-2xl border border-primary/20">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={imageUrl("neural_network.jpg")}
          alt="Neural Network"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-card/30 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-white/10"
          >
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">The Architecture of Complexity</h3>
            <p className="text-sm md:text-base text-white/80">Data passes through multiple "hidden layers" where billions of adjustable parameters (weights and biases) act as fine-tuning dials. This layered depth allows the model to map incredibly intricate relationships in the data.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 6.6 Transformers & Attention
function TransformersSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl("m1-generative-ai.mp3"));
    audioRef.current = audio;
    
    audio.onended = () => {
      pause();
      if (onComplete) onComplete();
      finish();
    };

    const timer = setTimeout(() => {
      play("m1-generative-ai", 30000);
      audio.play().catch(() => {});
    }, 100);

    return () => {
      clearTimeout(timer);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);


  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto overflow-hidden relative">
      <div className="text-center mb-6 shrink-0">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
        >
          The <span className="text-primary">Transformer</span> Architecture
        </motion.h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Instead of reading word-by-word, Transformers look at the entire sequence simultaneously using an "attention mechanism".
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full rounded-3xl overflow-hidden relative shadow-2xl border border-primary/20">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={imageUrl("transformer_attention.jpg")}
          alt="Transformer Attention"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="bg-cyan-950/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-cyan-500/20"
          >
            <h3 className="text-lg md:text-xl font-bold text-cyan-50 mb-2">The Attention Mechanism</h3>
            <p className="text-sm md:text-base text-cyan-100/80">Like drawing invisible threads between words, attention allows the model to instantly understand that "bank" relates to "river" instead of "money" based on the surrounding context, no matter where those context words appear in the sentence.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// 6.7 Next-Token Prediction Simulator
function NextTokenSlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, play, pause, finish, seekTime } = useNarrationStore();
  const { track } = useLRS();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const titleRef = useRef<HTMLDivElement>(null);
  const promptBoxRef = useRef<HTMLDivElement>(null);
  const probsBoxRef = useRef<HTMLDivElement>(null);
  const controlsBoxRef = useRef<HTMLDivElement>(null);
  const toppControlRef = useRef<HTMLDivElement>(null);

  const [temperature, setTemperature] = useState(0.5);
  const [topP, setTopP] = useState(1.0);

  // Base raw logits (unscaled probabilities)
  const tokens = [
    { word: "mat", baseScore: 10 },
    { word: "floor", baseScore: 4 },
    { word: "sofa", baseScore: 2 },
    { word: "moon", baseScore: 0.1 }
  ];

  // Calculate softmax with temperature and top-p filtering
  const calculateProbs = () => {
    // 1. Apply temperature to scores (if temp is very close to 0, it acts as argmax/greedy)
    const temp = Math.max(temperature, 0.01);
    const scaledScores = tokens.map(t => Math.exp(t.baseScore / (temp * 10)));
    const sumScaled = scaledScores.reduce((a, b) => a + b, 0);
    
    const probs = tokens.map((t, i) => ({
      ...t,
      prob: scaledScores[i] / sumScaled
    })).sort((a, b) => b.prob - a.prob);

    // 2. Apply Top-P (Nucleus Sampling)
    let cumulative = 0;
    let cutoffIndex = probs.length;
    for (let i = 0; i < probs.length; i++) {
      cumulative += probs[i].prob;
      if (cumulative > topP) {
        cutoffIndex = i + 1;
        break;
      }
    }
    
    // Zero out rejected tokens and re-normalize the remaining
    const filtered = probs.map((t, i) => ({
      ...t,
      active: i < cutoffIndex,
      prob: i < cutoffIndex ? t.prob : 0
    }));
    
    const activeSum = filtered.reduce((a, b) => a + b.prob, 0);
    return filtered.map(t => ({
      ...t,
      displayProb: t.active ? (t.prob / activeSum) * 100 : 0
    }));
  };

  const currentProbs = calculateProbs();

  useEffect(() => {
    const audio = new Audio(audioUrl("m1-next-token.mp3"));
    audioRef.current = audio;
    
    audio.onended = () => {
      pause();
      if (onComplete) onComplete();
      finish();
    };

    const timeline = gsap.timeline({ paused: true });
    
    if (titleRef.current) timeline.fromTo(titleRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
    if (promptBoxRef.current) timeline.fromTo(promptBoxRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 10.5);
    if (probsBoxRef.current) timeline.fromTo(probsBoxRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 13.5);
    if (controlsBoxRef.current) timeline.fromTo(controlsBoxRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 27.5);
    if (toppControlRef.current) timeline.fromTo(toppControlRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 39.5);
    
    tl.current = timeline;

    audio.onplay = () => { if (tl.current) tl.current.play(); };
    audio.onpause = () => { if (tl.current) tl.current.pause(); };
    audio.onwaiting = () => { if (tl.current) tl.current.pause(); };
    audio.onplaying = () => { if (tl.current) tl.current.play(); };

    const timer = setTimeout(() => {
      play("m1-next-token", 49000);
      audio.play().catch(() => {});
    }, 100);

    return () => {
      clearTimeout(timer);
      audio.onplay = null; audio.onpause = null; audio.onwaiting = null; audio.onplaying = null;
      audio.pause();
      audioRef.current = null;
      timeline.kill();
    };
  }, [onComplete]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) audioRef.current.play().catch(() => {});
    else if (!isPlaying && !audioRef.current.paused) audioRef.current.pause();
  }, [isPlaying]);
  useEffect(() => {
    if (typeof tl !== "undefined" && tl?.current && seekTime !== null) {
      tl.current.time(seekTime);
    }
  }, [seekTime]);


  useEffect(() => {
    if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
    sliderTimeoutRef.current = setTimeout(() => {
      track(
        "http://adlnet.gov/expapi/verbs/interacted",
        "interacted",
        "http://smartslate.com/activities/module-1/next-token/controls",
        "Next-Token Prediction Controls",
        `Learner adjusted Temperature (${temperature.toFixed(2)}) and Top-P (${topP.toFixed(2)}).`,
        { moduleId: "1", slideId: "m1-next-token" }
      );
    }, 2000);
    return () => { if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current); };
  }, [temperature, topP, track]);

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto overflow-hidden">
      <div ref={titleRef} className="opacity-0 text-center mb-6 shrink-0">
        <h2 
          className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4"
        >
          Probability in Action: <span className="text-primary">Next-Token Prediction</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          AI doesn't "think." It calculates the statistical probability of the next word. Adjust Temperature and Top-P to control the math.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6 md:gap-10 overflow-hidden">
        
        {/* Left Column: Prompt & Controls */}
        <div className="w-full md:w-5/12 flex flex-col gap-4 overflow-y-auto shrink-0 md:shrink pb-4 md:pb-0">
          
          <div ref={promptBoxRef} className="opacity-0 bg-primary/5 border border-primary/20 p-4 rounded-2xl shrink-0 backdrop-blur-md shadow-lg shadow-primary/5">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> LLM Response
            </div>
            <p className="text-lg md:text-xl font-mono text-foreground/90 leading-snug">
              The cat sat on the <span className="animate-pulse bg-primary/20 text-primary px-1.5 py-0.5 rounded inline-block -translate-y-0.5 shadow-[0_0_15px_rgba(167,218,219,0.3)]">_</span>
            </p>
          </div>

          <div ref={controlsBoxRef} className="opacity-0 flex flex-col gap-4 bg-card/40 p-4 md:p-5 rounded-2xl border border-border/50 shadow-xl shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-foreground block">Temperature</label>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Controls randomness & creativity</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] md:text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{temperature.toFixed(2)}</span>
                </div>
              </div>
              <input type="range" min="0.0" max="1.5" step="0.05" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              <div className="flex justify-between text-[9px] md:text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            <div ref={toppControlRef} className="opacity-0 space-y-2 pt-4 border-t border-border/30">
              <div className="flex justify-between items-end">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-foreground block">Top-P (Nucleus)</label>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">Trims the low-probability tail</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] md:text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{topP.toFixed(2)}</span>
                </div>
              </div>
              <input type="range" min="0.05" max="1.0" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
              <div className="flex justify-between text-[9px] md:text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                <span>Strict</span>
                <span>Open</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Visualization */}
        <div ref={probsBoxRef} className="opacity-0 w-full md:w-7/12 bg-card/20 backdrop-blur-2xl border border-primary/10 p-6 md:p-8 rounded-3xl shadow-2xl relative flex flex-col overflow-y-auto md:overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
          
          <div className="flex items-center justify-between mb-8 z-10 shrink-0">
            <h3 className="text-sm md:text-base font-semibold uppercase tracking-widest text-foreground/80 flex items-center gap-2">
              <BrainCircuit className="text-primary w-5 h-5" /> Probability Matrix
            </h3>
            <div className="text-[10px] md:text-xs font-mono font-semibold tracking-wider text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 shadow-[0_0_10px_rgba(167,218,219,0.1)]">NEXT_TOKEN</div>
          </div>
          
          <div className="space-y-6 z-10 w-full shrink-0 flex-1 flex flex-col justify-center">
            {currentProbs.map((t, i) => (
              <div key={t.word} className="group relative">
                <div className="flex items-center justify-between mb-2">
                  <div className={`font-mono text-xl transition-colors duration-300 ${t.active ? 'text-foreground' : 'text-muted-foreground/40 line-through'}`}>"{t.word}"</div>
                  <div className={`font-mono text-lg font-medium transition-colors duration-300 ${t.active ? 'text-primary' : 'text-muted-foreground/30'}`}>{t.displayProb.toFixed(1)}%</div>
                </div>
                
                <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden relative">
                  {!t.active && <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest text-destructive/80 font-bold">Trimmed by Top-P</div>}
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${t.displayProb}%`, 
                      opacity: t.active ? 1 : 0.15, 
                      filter: t.active ? 'drop-shadow(0 0 8px rgba(167, 218, 219, 0.5))' : 'none' 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const MODULE_1_SLIDES: Slide[] = [
  { id: "m1-title", type: "interactive", lessonIndex: 0, fullWidth: true, component: <TitleSlide />, narrationText: "Welcome to Module 1: The Intelligence Illusion. Before we can effectively use Generative AI, we must demystify it. We must dismantle the notion that Large Language Models 'think' like humans, revealing them instead as highly sophisticated prediction engines. They are not a knowledge base; they don't store facts, but rather statistical probabilities of word combinations. They are not a reasoning engine; they cannot 'think' through a problem, but predict the most likely next step. And fundamentally, they act as a stochastic parrot—stitching language convincingly without actual comprehension. Understanding this architecture—from the input sequence through the transformer engine to the probability matrix for the next token—is the foundation of mastering AI." },
  { id: "m1-video-whatis", type: "interactive", lessonIndex: 0, fullWidth: true, requireCompletion: true, component: (mark) => <VideoSlide url="https://www.youtube.com/watch?v=G2fqAlgmoPo" onComplete={mark} />, narrationText: "To break the intelligence illusion, we first need a shared understanding of how these models operate under the hood. This primer from Google Cloud Tech provides the perfect technical foundation. Please watch it before we continue." },
  { id: "m1-timeline", type: "interactive", lessonIndex: 0, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <TimelineOfAI onComplete={mark} />, narrationText: "" },
  { id: "m1-hollywood", type: "interactive", lessonIndex: 0, fullWidth: true, hasCustomAudio: true, requireCompletion: true, component: (mark) => <HollywoodVsReality onComplete={mark} />, narrationText: "It's critical to separate the Hollywood fantasy from reality. On one hand, we have Artificial General Intelligence, or AGI. In movies, this is depicted as sentient and self-aware, possessing human-like reasoning, and capable of performing any intellectual task. Currently, this remains science fiction. On the other hand, we have Narrow AI, which is what we use today. Narrow AI relies on highly specialized pattern matching, has absolutely no consciousness or intent, and is trained on specific datasets for specific tasks." },
  { id: "m1-assessment-1", type: "interactive", lessonIndex: 0, fullWidth: true, requireCompletion: true, component: (mark, isCompleted) => <Assessment1 onComplete={mark} isCompleted={isCompleted} />, narrationText: "Before we move on to how machines actually learn, let's verify your understanding of what AI is and what it isn't. You must answer all questions correctly to proceed. Good luck!" },
  { id: "m1-ml-intro", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <MachineLearningIntroSlide onComplete={mark} />, narrationText: "Instead of programming explicit rules, we give machines data and let them discover the patterns themselves through three main approaches. This is the foundation of Machine Learning. It shifts the paradigm from writing code that solves a problem, to writing code that learns how to solve a problem by observing examples." },
  { id: "m1-ml-supervised", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <SupervisedLearningSlide onComplete={mark} />, narrationText: "The first approach is Supervised Learning. Think of this as the Classroom with an Answer Key. The model is given a dataset where every example is clearly labeled—like teaching a child with flashcards: 'This is a cat', 'This is a dog'. The machine learns to map the inputs to the known outputs, allowing it to predict answers for new, unseen data." },
  { id: "m1-ml-unsupervised", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <UnsupervisedLearningSlide onComplete={mark} />, narrationText: "The second approach is Unsupervised Learning. Imagine you are a Library Archeologist handed a massive pile of uncategorized, disorganized documents with no labels or answer key. Your job is to read through them and identify similarities to group them into logical clusters. This is exactly what the AI does—it finds hidden structures and patterns in raw data entirely on its own." },
  { id: "m1-ml-reinforcement", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <ReinforcementLearningSlide onComplete={mark} />, narrationText: "The third approach is Reinforcement Learning. This is the Trial-and-Error Apprentice. The AI interacts with an environment and receives feedback in the form of rewards for good actions, or penalties for bad ones—much like training a dog with treats. Over thousands of iterations, the model learns the optimal strategy to maximize its reward. This is how AI learns to play video games, balance robots, and navigate complex mazes." },
  { id: "m1-neural-networks", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <NeuralNetworksSlide onComplete={mark} />, narrationText: "To bridge the gap between simple machine learning and advanced language models, we must understand Deep Learning. Deep Learning uses Artificial Neural Networks—layers of interconnected nodes inspired by the human brain. Data passes through these layers, where millions or even billions of adjustable parameters, known as weights and biases, fine-tune the information. This architecture allows the model to learn incredibly complex patterns, setting the stage for models that can process human language." },
  { id: "m1-generative-ai", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <TransformersSlide onComplete={mark} />, narrationText: "How do these neural networks actually understand and generate text? The breakthrough came with the Transformer architecture. Instead of reading words one by one in order, the Transformer uses an 'attention mechanism' to look at the entire sequence of words simultaneously. It learns which words are contextually related to each other, no matter how far apart they are in a sentence. This massive leap in contextual understanding is what powers today's Generative AI." },
  { id: "m1-next-token", type: "interactive", lessonIndex: 1, fullWidth: true, requireCompletion: true, hasCustomAudio: true, component: (mark) => <NextTokenSlide onComplete={mark} />, narrationText: "At its absolute core, an AI like ChatGPT does not think; it predicts. It is a highly sophisticated probability engine running Next-Token Prediction. When you give it a prompt, it calculates the mathematical probability of what the very next fragment of a word—a token—should be. It selects it, adds it to the sequence, and runs the entire calculation again. Furthermore, you can control this math. The 'Temperature' setting controls randomness—a low temperature forces the safest, most likely word, while a high temperature allows for risk and creativity. Similarly, 'Top-P' restricts the pool of possible words to only the top percentage of likely candidates. Mastering these controls allows you to shape the AI's behavior." },
  { id: "m1-llm-vs-slm", type: "interactive", lessonIndex: 2, fullWidth: true, component: <LlmVsSlm />, narrationText: "Not all models need to know everything. Let's compare Large Language Models with Small Language Models. LLMs, like GPT-5.6 or Claude Sonnet 5, are massive models with hundreds of billions of parameters. They require entire data centers to run. They have vast knowledge breadth, but computing costs are high, and your data privacy means information leaves your device. Conversely, SLMs, like Phi-4 or Gemma 4, are efficient models designed to run locally on your phone or laptop. Their knowledge breadth is more focused, but computing costs are extremely low, and your data stays completely local, ensuring maximum privacy." },
  { id: "m1-ml-dnn-llm-assessment", type: "interactive", lessonIndex: 2, fullWidth: true, requireCompletion: true, component: (mark, isCompleted) => <MlDnnLlmAssessment onComplete={mark} isCompleted={isCompleted} />, narrationText: "Now it's time to check your understanding of the machine learning, deep learning, neural networks, transformers, and LLMs and SLMs section. You will be asked ten questions. You must answer every question correctly to continue. Take your time and read each question carefully." },
  { id: "m1-anatomy", type: "interactive", lessonIndex: 3, fullWidth: true, requireCompletion: true, component: (mark) => <AnatomyOfPrompt onComplete={mark} />, narrationText: "How do we communicate with these models? We use Prompt Engineering to guide the context window. A perfect prompt typically has four anatomical parts. First, the Role: setting the persona, like 'You are an expert instructional designer.' This heavily weights the statistical model towards vocabulary and concepts associated with this role. Second, the Task: the specific action you want the AI to perform, like 'Write a 3-question multiple choice quiz'. Third, the Context: background information that prevents the model from making incorrect assumptions, such as 'The audience is adult learners'. And fourth, Constraints: strict boundaries on the output format, length, or tone, like 'Output only valid JSON'. Click through each one to explore." },
  { id: "m1-hallucination", type: "interactive", lessonIndex: 4, fullWidth: true, component: <HallucinationSlide />, narrationText: "Because models are just predicting the next most likely token, they can sometimes invent facts entirely. We call this a hallucination. For example, if you ask 'What is the population of Mars?', an AI might respond: 'The current population of Mars is approximately 4,200 research scientists and engineers.' This is factually incorrect. There is no human population on Mars. The model successfully predicted structurally sound English sentences that sounded highly plausible, but completely lacked factual grounding. Always remember: the AI generates, but you evaluate." },
  { id: "m1-bias", type: "interactive", lessonIndex: 4, fullWidth: true, component: <BiasInAI />, narrationText: "AI models learn from human data, making them a mirror of our systemic flaws. If the internet training data contains historical biases—like 'The CEO walked into his office' or 'The nurse checked her patient'—the model will reproduce them. When you prompt the trained AI to write a story about a CEO and a nurse, it will often automatically assign 'he' to the CEO and 'her' to the nurse. This reflects the statistical bias in its training data, not factual rules. We must be constantly vigilant of these inherited biases in AI generation." },
  { id: "m1-quiz", type: "interactive", lessonIndex: 4, fullWidth: true, requireCompletion: true, component: (mark, isCompleted) => <Module1Quiz onComplete={mark} isCompleted={isCompleted} />, narrationText: "Now that we've demystified the intelligence illusion, let's check your understanding of everything covered in this module — from what AI actually is, through machine learning types, neural networks, transformers, next-token prediction, LLMs versus SLMs, prompt anatomy, hallucinations, and bias. This final assessment has 20 questions covering all Module 1 lessons. Take your time, read each question carefully, and answer all correctly to proceed." },
  { id: "m1-project-application", type: "interactive", lessonIndex: 4, fullWidth: true, requireCompletion: true, component: (mark) => <ProjectApplicationSlide onComplete={mark} />, narrationText: "You've proven your knowledge — now let's apply it. Using the four-part prompt anatomy you learned — Role, Task, Context, and Constraints — write a real prompt for your chosen project. Choose the right temperature setting for your use case, and identify the hallucination risk you need to watch for. This is where Module 1 moves from theory to practice." }
];
