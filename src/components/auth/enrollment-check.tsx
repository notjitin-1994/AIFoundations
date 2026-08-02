"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";

const LOGO_URL =
  "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png";

/**
 * Full-screen brand loading state for the enrollment gate — the Smartslate logo
 * from the floating header, animated as the loading spec (rotating arc ring +
 * shimmer sweep, GPU-composited transform/opacity only). Reduced-motion users
 * get the static logo + ring; the label still communicates loading.
 */
export function EnrollmentCheckScreen({ label = "Preparing your course" }: { label?: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ec-disc",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".ec-logo",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(".ec-ring-svg", { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.2 });
      // Arc circumference at r=44 is ~276.5; 60° arc ≈ 46 units.
      gsap.to(".ec-ring-svg", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 1.6,
        ease: "none",
        repeat: -1,
        delay: 0.45,
      });
      gsap.fromTo(
        ".ec-shimmer",
        { xPercent: -200, opacity: 0 },
        { xPercent: 300, opacity: 1, duration: 1.5, ease: "sine.inOut", repeat: -1, repeatRefresh: true, delay: 0.6 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center gap-6 relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Rotating arc ring */}
        <svg className="ec-ring-svg absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] opacity-0" viewBox="0 0 96 96" fill="none" aria-hidden="true">
          <circle cx="48" cy="48" r="44" stroke="rgba(167,218,219,0.12)" strokeWidth="2" />
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="#a7dadb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="46 230.5"
            transform="rotate(-90 48 48)"
          />
        </svg>

        {/* Glass disc + logo */}
        <div className="ec-disc relative w-20 h-20 rounded-full bg-card/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
          <img
            src={LOGO_URL}
            alt="Smartslate"
            className="ec-logo h-9 w-auto object-contain brightness-0 invert opacity-90 relative z-10"
          />
          <div className="ec-shimmer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none" />
        </div>
      </div>

      <p className="relative text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
