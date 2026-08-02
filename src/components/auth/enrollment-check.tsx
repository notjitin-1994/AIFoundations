"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Loader2 } from "lucide-react";

const LOGO_URL =
  "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png";

/**
 * Full-screen premium loading state for the enrollment gate.
 * Inspired by design engineering principles (weightless, physics-based 
 * GSAP motion) and the project's core glassmorphism ideology.
 * 
 * Impeccable & Taste UI Features:
 * - A centered teal ambient orb that gently breathes (scale/opacity).
 * - A frosted glass ring that scales in with a firm expo ease, replacing the raw mask.
 * - The Smartslate logo floats inside the glass, with a continuous 3D-like parallax hover.
 * - A sleek shimmer sweeps across the glass ring periodically to simulate light reflection.
 * - Standard UI typography with a primary-tinted spinner for immediate context.
 * - Reduced-motion users receive a static, graceful fallback.
 */
export function EnrollmentCheckScreen({ label = "Preparing your course" }: { label?: string }) {
  const [reduce, setReduce] = useState(false);
  const [motionKnown, setMotionKnown] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    setMotionKnown(true);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!motionKnown || reduce || !rootRef.current) return;
    
    const ctx = gsap.context(() => {
      // 1. Staggered, weighty entrance (Premium Ease)
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".ec-orb",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
        0
      )
      .fromTo(
        ".ec-glass",
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out" },
        0.1
      )
      .fromTo(
        ".ec-logo",
        { opacity: 0, scale: 0.85, filter: "blur(8px)" },
        { opacity: 0.9, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        0.3
      )
      .fromTo(
        ".ec-text",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        0.4
      );

      // 2. Weightless continuous floating (Antigravity aesthetic with Parallax)
      gsap.to(".ec-glass", {
        y: -8,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
      });
      
      gsap.to(".ec-logo", {
        y: 4, // Counter-float inside the glass for subtle parallax depth
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
      });

      // 3. Periodic cinematic glass shimmer sweep
      gsap.fromTo(
        ".ec-shimmer",
        { x: "-150%", skewX: -20 },
        { 
          x: "200%", 
          skewX: -20, 
          duration: 1.8, 
          ease: "power2.inOut", 
          repeat: -1, 
          repeatDelay: 3.5,
          delay: 1.8
        }
      );

      // 4. Ambient orb breathing in the background stage
      gsap.to(".ec-orb", {
        scale: 1.05,
        opacity: 0.65,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

    }, rootRef);
    
    return () => ctx.revert();
  }, [reduce, motionKnown]);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center gap-10 relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Deep Navy Stage Lighting - The acting Teal spotlight */}
      <div className="ec-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[480px] md:h-[480px] bg-primary/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* Premium Glass Ring holding the brand logo */}
      <div className="ec-glass relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-card/40 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(167,218,219,0.15)] rounded-full overflow-hidden">
        
        {/* Shimmer sweep effect simulating physical glass reflection */}
        <div className="ec-shimmer absolute inset-y-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-0 md:opacity-100" />
        
        {/* Inner shadow for 3D frosted glass edge */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.08)] pointer-events-none" />

        {/* The actor - Smartslate Logo */}
        <img
          src={LOGO_URL}
          alt="Smartslate"
          className="ec-logo w-12 h-12 md:w-16 md:h-16 object-contain brightness-0 invert opacity-90"
        />
      </div>

      {/* Typography & Direct Feedback Indicator */}
      <div className="ec-text flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Loader2 className={`w-4 h-4 text-primary ${reduce || !motionKnown ? "" : "animate-spin"}`} />
          <p className="text-sm font-medium text-muted-foreground tracking-wide">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
