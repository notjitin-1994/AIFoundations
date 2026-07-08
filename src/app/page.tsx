"use client";

import { useState, useEffect, useRef } from "react";
import { useProgressStore } from "@/store/progress";
import { sendXAPIStatement } from "@/actions/xapi";
import { imageUrl, videoUrl } from "@/lib/media";
import { CanvasViewer, Slide, useCanvasNav } from "@/components/lesson/canvas-viewer";
import { AssessmentRunner } from "@/components/lesson/assessment-runner";
import { CheckCircle, Bot, PenTool, LayoutDashboard, ArrowRight, Play, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { useNarrationStore } from "@/store/narration";

function ProjectSpineSelector({ onComplete }: { onComplete: () => void }) {
  const { projectSpine, setProjectSpine, markModuleComplete } = useProgressStore();
  const router = useRouter();

  const [selectedSpine, setSelectedSpine] = useState<'research_companion' | 'content_engine' | 'creative_studio' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setNavOverride } = useCanvasNav();

  useEffect(() => {
    setNavOverride({
      nextLabel: isSubmitting ? "Saving..." : "Submit & Continue",
      nextDisabled: !selectedSpine || isSubmitting,
      onNext: async (handleNext) => {
        if (!selectedSpine) return;
        setIsSubmitting(true);
        setProjectSpine(selectedSpine);
        markModuleComplete("0");
        await sendXAPIStatement(
          "http://activitystrea.ms/schema/1.0/choose",
          "selected_template",
          `http://smartslate.com/activities/templates/${selectedSpine}`,
          `Project Template: ${selectedSpine}`,
          `Learner selected the ${selectedSpine} project spine.`
        );
        onComplete();
        setTimeout(() => { router.push('/modules/1'); }, 1500);
      }
    });
    return () => setNavOverride(null);
  }, [selectedSpine, isSubmitting, setNavOverride, setProjectSpine, markModuleComplete, onComplete, router]);

  const spines = [
    {
      id: 'research_companion',
      title: 'Research Companion',
      description: 'An AI assistant that synthesizes information and accelerates deep research.',
      icon: <Bot className="w-5 h-5 text-primary" />,
      image: imageUrl("research_companion.jpg")
    },
    {
      id: 'content_engine',
      title: 'Content Engine',
      description: 'An ideation-to-draft workflow that helps you produce high-quality written content.',
      icon: <PenTool className="w-5 h-5 text-primary" />,
      image: imageUrl("content_engine.jpg")
    },
    {
      id: 'creative_studio',
      title: 'Creative Studio',
      description: 'A visual generation pipeline for creating consistent brand imagery and mockups.',
      icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
      image: imageUrl("creative_studio.jpg")
    }
  ] as const;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="text-center mb-6 max-w-2xl mx-auto shrink-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground">Choose Your Project</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Select a project spine. You will use this same project across every module, layering new AI capabilities onto it.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto flex-1 min-h-0">
        {spines.map((spine) => {
          const isSelected = selectedSpine === spine.id;
          return (
            <button
              key={spine.id}
              onClick={() => setSelectedSpine(spine.id)}
              className={`relative flex flex-col text-left rounded-2xl border overflow-hidden transition-all duration-300 ease-out transform active:scale-95 group ${
                isSelected 
                  ? "border-primary shadow-xl scale-[1.02] ring-2 ring-primary/20" 
                  : "border-border bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              <div className="w-full h-28 md:h-32 relative overflow-hidden bg-muted shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={spine.image} alt={spine.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-lg animate-in zoom-in">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur px-2 py-1.5 rounded-lg shadow-sm border border-border/50">
                  {spine.icon}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col bg-card overflow-hidden">
                <h3 className="font-bold text-lg mb-1 text-foreground group-hover:text-primary transition-colors truncate">{spine.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {spine.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConfidenceCheck({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { setNavOverride } = useCanvasNav();
  const { isPlaying } = useNarrationStore();
  
  const tl = useRef<gsap.core.Timeline | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const intro1Ref = useRef<HTMLParagraphElement>(null);
  const intro2Ref = useRef<HTMLParagraphElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Immediate animations
    if (headingRef.current) gsap.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    if (intro1Ref.current) gsap.fromTo(intro1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });

    // Voiceover-synced timeline
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(intro2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 5);
    
    if (optionsRef.current) {
      timeline.fromTo(
        optionsRef.current.children, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.2 }, 
        9
      );
    }

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
    setNavOverride({
      nextLabel: "Record & Continue",
      nextDisabled: selected === null,
      onNext: (handleNext) => {
        // Mock xAPI statement recording for baseline confidence
        console.log(`[xAPI] Recorded learner baseline confidence: Level ${selected}`);
        onComplete();
        handleNext();
      }
    });
    return () => setNavOverride(null);
  }, [selected, onComplete, setNavOverride]);
  
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Left side: Imagery */}
      <div className="hidden md:block md:w-5/12 lg:w-1/2 relative border-r border-border shrink-0 bg-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src={videoUrl("tech-pulse.mp4")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-background/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm tracking-tight">Self-Assessment</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Establishing a baseline helps us track your progress.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side: Quiz */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-6 overflow-y-auto">
        <h2 ref={headingRef} className="opacity-0 text-2xl md:text-3xl font-bold tracking-tight mb-3">Where are you starting from?</h2>
        
        <p ref={intro1Ref} className="opacity-0 text-sm md:text-base text-muted-foreground mb-4 max-w-xl text-left leading-relaxed">
          To make sure this experience meets you where you are, we'd love to know your starting point.
        </p>
        
        <p ref={intro2Ref} className="opacity-0 text-sm md:text-base text-foreground font-medium mb-6 max-w-xl text-left leading-relaxed">
          How comfortable do you currently feel using Generative AI? There are no wrong answers here.
        </p>
        
        <div ref={optionsRef} className="grid grid-cols-1 gap-3 w-full max-w-xl">
          {[
            { level: 1, title: "Just exploring", desc: "I've heard about it, maybe tried ChatGPT once or twice." },
            { level: 2, title: "Occasional user", desc: "I use it for basic tasks, but don't fully trust the outputs yet." },
            { level: 3, title: "Daily driver", desc: "I use AI regularly and understand prompting basics." }
          ].map((opt) => (
            <button
              key={opt.level}
              onClick={() => setSelected(opt.level)}
              className={`opacity-0 p-4 rounded-xl border text-left transition-all duration-300 ease-out group ${
                selected === opt.level 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.01] shadow-md' 
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className={`font-bold text-sm ${selected === opt.level ? 'text-primary' : 'text-foreground group-hover:text-primary transition-colors'}`}>
                  {opt.title}
                </div>
                {selected === opt.level && <CheckCircle className="w-4 h-4 text-primary animate-in zoom-in" />}
              </div>
              <div className="text-xs text-muted-foreground">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WelcomeAttentionSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" });

    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(p1Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3);
    timeline.fromTo(p2Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 6);
    timeline.fromTo(p3Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 8);

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch mx-auto overflow-hidden">
      {/* Left Column: Text */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-12 py-6 overflow-y-auto text-left">
        <h1 ref={headingRef} className="opacity-0 text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 leading-tight max-w-xl">
          Welcome to<br />
          <span className="text-primary">AI Foundations</span>
        </h1>
        
        <div className="space-y-4 text-base text-foreground leading-relaxed max-w-xl">
          <p ref={p1Ref} className="opacity-0 font-bold text-xl">You belong here.</p>
          <p ref={p2Ref} className="opacity-0 text-muted-foreground text-sm md:text-base">
            Whether you're a seasoned technologist or entirely new to Artificial Intelligence, you stand at a transformational moment in history. AI has moved from research labs into our everyday tools.
          </p>
          <p ref={p3Ref} className="opacity-0 text-muted-foreground text-sm md:text-base">
            It's completely normal to feel overwhelmed by the rapid pace of change. This course provides a safe, structured environment to build your confidence and capability.
          </p>
        </div>
      </div>

      {/* Right Column: Imagery */}
      <div className="hidden lg:block lg:w-5/12 relative border-l border-border shrink-0 bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          ref={imageRef}
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2874&auto=format&fit=crop" 
          alt="Cute robot waving welcome" 
          className="absolute inset-0 w-full h-full object-cover opacity-0"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent mix-blend-overlay" />
      </div>
    </div>
  );
}

function VisionRoadmapSlide() {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(titleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0);
    timeline.fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 3);
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
    if (isFinished) {
      const finishTl = gsap.timeline();
      if (videoRef.current) finishTl.fromTo(videoRef.current, { opacity: 0, x: -20, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power4.out" }, 0);
      if (ctaRef.current) finishTl.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.4);
    }
  }, [isFinished]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mx-auto px-6 md:px-10 lg:px-12 overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Video */}
        <div className="order-2 lg:order-1 flex items-center">
           <div ref={videoRef} className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black relative group cursor-pointer flex items-center justify-center opacity-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2938&auto=format&fit=crop" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent" />
              <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md shadow-xl flex items-center justify-center text-white mb-2 border border-white/20">
                  <Play className="w-5 h-5 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium z-10 border border-white/10 flex items-center">
                <Play className="w-3 h-3 mr-1.5" />
                Welcome_Message.mp4
              </div>
           </div>
        </div>

        {/* Right Column - Text */}
        <div className="flex flex-col justify-center order-1 lg:order-2 text-left py-2">
          <div>
            <h2 ref={titleRef} className="opacity-0 text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground leading-tight">
              Our Vision for You
            </h2>
            <p ref={textRef} className="opacity-0 text-sm md:text-base text-muted-foreground leading-relaxed">
              A quick welcome from our leadership team. We stand at a transformational moment, and this course bridges the gap between awareness and application.
            </p>
          </div>
          
          <div ref={ctaRef} className="bg-primary/5 border border-primary/10 rounded-xl p-4 backdrop-blur-md relative overflow-hidden group opacity-0 mt-4">
            <div className="relative z-10">
              <p className="font-bold text-foreground text-sm mb-0.5">Vision & Roadmap</p>
              <p className="text-xs text-muted-foreground mb-3">Created by <a href="#" className="text-primary hover:underline font-medium">Internal Leadership</a></p>
              <Button className="w-full h-8 text-xs group/btn" variant="default" asChild>
                <a href="#">
                  View Transcript
                  <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatIsGenAISlide({ onComplete }: { onComplete?: () => void }) {
  const { isPlaying, isFinished } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(titleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0);
    timeline.fromTo(textRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 5);
    timeline.fromTo(videoRef.current, { opacity: 0, scale: 0.97, x: -20 }, { opacity: 1, scale: 1, x: 0, duration: 1, ease: "power4.out" }, 8);
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
    if (isFinished && ctaRef.current) {
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }
  }, [isFinished]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mx-auto px-6 md:px-10 lg:px-12 overflow-hidden">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Video */}
        <div className="order-2 lg:order-1">
           <div ref={videoRef} className="opacity-0 w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black relative">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/G2fqAlgmoPo?rel=0" 
                title="Generative AI Explained In 5 Minutes" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              >
              </iframe>
           </div>
        </div>

        {/* Right Column - Text */}
        <div className="flex flex-col justify-center order-1 lg:order-2 text-left py-2">
          <div>
            <h2 ref={titleRef} className="opacity-0 text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground leading-tight">What is Generative AI?</h2>
            <p ref={textRef} className="opacity-0 text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              A concise 5-minute primer before we begin. Understand the mechanics of how these models actually work, breaking down the magic into deterministic principles.
            </p>
          </div>
          
          <div ref={ctaRef} className="opacity-0 bg-muted/40 border border-border/50 rounded-xl p-4 relative overflow-hidden flex flex-col shadow-sm">
            <div className="relative z-10 flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" alt="Bernard Marr" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm leading-tight">Support the Creator</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Created by <strong className="text-foreground">Bernard Marr</strong>. Highly recommend subscribing to his channel.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full mt-1">
              <Button className="flex-1 h-8 text-xs bg-[#FF0000] hover:bg-[#CC0000] text-white border-none transition-colors group/btn shadow-md" asChild>
                <a href="https://www.youtube.com/channel/UCWstLaT61QUc-TvfxOjNpFw" target="_blank" rel="noopener noreferrer">
                  Subscribe
                  <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </Button>
              {onComplete && (
                <Button className="flex-1 h-8 text-xs group/btn bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30" variant="outline" onClick={() => onComplete()}>
                  Mark Watched
                  <CheckCircle className="w-3 h-3 ml-1 group-hover/btn:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MythBustingSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const myth1Ref = useRef<HTMLDivElement>(null);
  const myth2Ref = useRef<HTMLDivElement>(null);
  const myth3Ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Initial animations
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.95 }, { opacity: 0.9, scale: 1, duration: 1.5, ease: "power3.out" });
    if (headingRef.current) gsap.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
    if (introRef.current) gsap.fromTo(introRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.4 });

    const timeline = gsap.timeline({ paused: true });
    
    timeline.fromTo(myth1Ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 9);
    timeline.fromTo(myth2Ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 16);
    timeline.fromTo(myth3Ref.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 23);

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch mx-auto overflow-hidden">
      {/* Left side: Imagery */}
      <div className="hidden lg:block lg:w-5/12 relative border-r border-border shrink-0 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          ref={imageRef}
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2940&auto=format&fit=crop" 
          alt="Abstract geometry" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Right side: Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-12 py-2 overflow-y-auto">
        <h2 ref={headingRef} className="opacity-0 text-xl md:text-2xl font-bold tracking-tight mb-1">Breaking Down The Myths</h2>
        <p ref={introRef} className="opacity-0 text-xs md:text-sm text-muted-foreground mb-4">Before we build, we must unlearn. Three major misconceptions hold us back:</p>
        
        <div className="w-full space-y-2 md:space-y-3 max-w-xl">
          <div ref={myth1Ref} className="opacity-0 relative p-3 md:p-4 rounded-xl border border-white/5 bg-background/40 backdrop-blur-md shadow-sm group hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <span className="font-bold text-foreground text-xs md:text-sm tracking-tight">Myth 1: AI is Sentient</span>
            </div>
            <div className="pl-8 relative">
              <div className="absolute left-3 top-0.5 bottom-0.5 w-px bg-primary/20"></div>
              <span className="font-semibold text-primary text-[9px] uppercase tracking-wider mb-0.5 block">The Reality</span>
              <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">It's a sophisticated statistical engine. It performs next-token prediction based on patterns, not consciousness.</p>
            </div>
          </div>
          
          <div ref={myth2Ref} className="opacity-0 relative p-3 md:p-4 rounded-xl border border-white/5 bg-background/40 backdrop-blur-md shadow-sm group hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <span className="font-bold text-foreground text-xs md:text-sm tracking-tight">Myth 2: AI is Magic</span>
            </div>
            <div className="pl-8 relative">
              <div className="absolute left-3 top-0.5 bottom-0.5 w-px bg-primary/20"></div>
              <span className="font-semibold text-primary text-[9px] uppercase tracking-wider mb-0.5 block">The Reality</span>
              <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">It operates on deterministic principles requiring precise instructions, and it has a limited short-term memory.</p>
            </div>
          </div>
          
          <div ref={myth3Ref} className="opacity-0 relative p-3 md:p-4 rounded-xl border border-white/5 bg-background/40 backdrop-blur-md shadow-sm group hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <span className="font-bold text-foreground text-xs md:text-sm tracking-tight">Myth 3: AI Replaces Human Judgment</span>
            </div>
            <div className="pl-8 relative">
              <div className="absolute left-3 top-0.5 bottom-0.5 w-px bg-primary/20"></div>
              <span className="font-semibold text-primary text-[9px] uppercase tracking-wider mb-0.5 block">The Reality</span>
              <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">It is an accelerator. Systems lack ground truth and are prone to hallucinations. You evaluate and decide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticAttentionSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Initial entrance animations
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.95 }, { opacity: 0.9, scale: 1, duration: 1.5, ease: "power3.out" });
    if (headingRef.current) gsap.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

    // Voiceover-synced timeline
    const timeline = gsap.timeline({ paused: true });
    
    // "Next up is a short diagnostic."
    timeline.fromTo(p1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
    
    // "Think of this as taking your baseline temperature..."
    timeline.fromTo(p2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.5);
    
    // "Don't stress if the questions feel unfamiliar."
    timeline.fromTo(p3Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 9);

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch mx-auto overflow-hidden">
      <div className="hidden lg:block lg:w-5/12 relative border-r border-border shrink-0 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imageRef} src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Analytics abstract" className="absolute inset-0 w-full h-full object-cover opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-12 py-6 overflow-hidden text-left">
        <h2 ref={headingRef} className="opacity-0 text-2xl md:text-3xl font-bold tracking-tight mb-6">The Baseline Diagnostic</h2>
        <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
          <p ref={p1Ref} className="opacity-0">To measure how far you've come by the end of this program, we need to know exactly where you are starting today.</p>
          <p ref={p2Ref} className="opacity-0">On the next slide, you will take a short diagnostic assessment. <strong className="text-foreground">This is not graded for performance—it is purely for benchmarking.</strong> Don't worry if you encounter terms you haven't seen before; that's exactly what this course is designed to teach you.</p>
          <p ref={p3Ref} className="opacity-0 font-bold text-foreground">Deep breath. You've got this.</p>
        </div>
      </div>
    </div>
  );
}

function WelcomeTieSlide() {
  const { isPlaying } = useNarrationStore();
  const tl = useRef<gsap.core.Timeline | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Initial entrance animations
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: 0, scale: 0.95 }, { opacity: 0.9, scale: 1, duration: 1.5, ease: "power3.out" });
    if (headingRef.current) gsap.fromTo(headingRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

    // Voiceover-synced timeline
    const timeline = gsap.timeline({ paused: true });
    
    // "We believe that theory only sticks..."
    timeline.fromTo(p1Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5);
    
    // "So, instead of abstract exercises..."
    timeline.fromTo(p2Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3);
    
    // "...building a real project throughout this course."
    timeline.fromTo(p3Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 5.5);

    tl.current = timeline;
    return () => { timeline.kill(); };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isPlaying) tl.current.play();
      else tl.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch mx-auto overflow-hidden">
      <div className="hidden lg:block lg:w-5/12 relative border-r border-border shrink-0 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imageRef} src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop" alt="Collaborative building" className="absolute inset-0 w-full h-full object-cover opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-12 py-6 overflow-hidden text-left">
        <h2 ref={headingRef} className="opacity-0 text-2xl md:text-3xl font-bold tracking-tight mb-6">Learning by Doing:<br />The Project Spine</h2>
        <div className="space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
          <p ref={p1Ref} className="opacity-0">Adults learn best when information is immediately applicable to their real-world context. Abstract theory evaporates quickly.</p>
          <p ref={p2Ref} className="opacity-0">Instead of generic exercises, you will learn by building. On the next screen, you will select a <strong className="text-foreground">Project Template</strong>.</p>
          <p ref={p3Ref} className="opacity-0">As you progress through the modules, you will continually return to this exact same project, layering new AI capabilities onto it (prompting, RAG, agentic workflows) until you have a fully functional prototype.</p>
        </div>
      </div>
    </div>
  );
}

const MODULE_0_SLIDES: Slide[] = [
  {
    id: "welcome-attention",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    narrationText: "Hello, and welcome. You are exactly where you need to be. We are living through a massive technological shift, and it's completely normal to feel a bit overwhelmed or unsure of where to start. That's exactly why we built AI Foundations. Our goal is to take you from just hearing about AI, to actually using it confidently in your daily work, in a space where it's safe to experiment.",
    component: <WelcomeAttentionSlide />
  },
  {
    id: "welcome-vision-video",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    narrationText: "Before we dive into the details, we want to share the big picture. Our leadership team has put together a short message outlining their vision for you, and where this journey will lead. Please take a moment to watch this introduction.",
    component: <VisionRoadmapSlide />
  },
  {
    id: "what-is-gen-ai",
    type: "interactive",
    lessonIndex: 0,
    fullWidth: true,
    requireCompletion: true,
    narrationText: "So, what exactly is Generative AI? Rather than treating it like magic, let's look under the hood. Take five minutes to watch this primer—it will break down the core mechanics into clear, understandable principles.",
    component: (markCompleted) => <WhatIsGenAISlide onComplete={markCompleted} />
  },
  {
    id: "confidence-pulse",
    type: "interactive",
    lessonIndex: 0,
    requireCompletion: true,
    fullWidth: true,
    narrationText: "To make sure this experience meets you where you are, we'd love to know your starting point. How comfortable do you currently feel using Generative AI? There are no wrong answers here.",
    component: (markCompleted) => <ConfidenceCheck onComplete={markCompleted} />
  },
  {
    id: "myth-busting",
    type: "interactive",
    lessonIndex: 1,
    fullWidth: true,
    narrationText: "Before we start building new skills, there's some unlearning to do. Let's clear up three major misconceptions. Myth one: AI is sentient. The reality is, it's a sophisticated statistical engine. Myth two: AI is magic. In reality, it operates on deterministic principles requiring precise instructions. Myth three: AI replaces human judgment. The truth is, AI is just an accelerator. You are the one who evaluates and decides.",
    component: <MythBustingSlide />
  },
  {
    id: "diagnostic-attention",
    type: "interactive",
    lessonIndex: 2,
    fullWidth: true,
    narrationText: "Next up is a short diagnostic. Think of this as taking your baseline temperature—it's purely to help you see how much you'll grow by the end of the course. Don't stress if the questions feel unfamiliar.",
    component: <DiagnosticAttentionSlide />
  },
  {
    id: "diagnostic-assessment",
    type: "interactive",
    lessonIndex: 2,
    requireCompletion: true,
    fullWidth: true,
    narrationText: "Whenever you're ready, go ahead and start the baseline diagnostic.",
    component: (markCompleted) => (
      <AssessmentRunner 
        kind="baseline" 
        totalQuestions={10}
        title="Baseline Diagnostic" 
        description="Let's establish a baseline of your current AI literacy." 
        onComplete={(result) => {
          console.log('Assessment complete:', result);
          markCompleted();
        }} 
      />
    )
  },
  {
    id: "welcome-tie",
    type: "interactive",
    lessonIndex: 3,
    fullWidth: true,
    narrationText: "We believe that theory only sticks when you can immediately apply it. So, instead of abstract exercises, you'll be building a real project throughout this course.",
    component: <WelcomeTieSlide />
  },
  {
    id: "project-selector",
    type: "interactive",
    lessonIndex: 3,
    requireCompletion: true,
    fullWidth: true,
    narrationText: "Take a look at these templates and choose the project spine that resonates most with your daily work. This will be your playground for the rest of the modules.",
    component: (markCompleted) => <ProjectSpineSelector onComplete={markCompleted} />
  }
];

export default function OrientationModule() {
  const handleModuleComplete = () => {
    // ProjectSpineSelector handles the redirect
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-background p-4 md:p-8 overflow-hidden">
      <CanvasViewer 
        slides={MODULE_0_SLIDES} 
        onComplete={handleModuleComplete}
        moduleId="0"
      />
    </div>
  );
}
