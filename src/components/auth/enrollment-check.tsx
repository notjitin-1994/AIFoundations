"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LOGO_URL =
  "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png";

/**
 * Full-screen brand loading state for the enrollment gate. No spinner, no
 * rotation: the full-size Smartslate logo sits on the navy stage and its
 * silhouette FILLS with the brand colors — a masked gradient band (indigo →
 * teal, with a bright leading edge) sweeps across the logo, then breathes back
 * to the white silhouette and repeats. A soft glow breathes behind it.
 * Reduced-motion users get a static, fully colored logo.
 */
export function EnrollmentCheckScreen({ label = "Preparing your course" }: { label?: string }) {
  const [reduce, setReduce] = useState(false);
  const [motionKnown, setMotionKnown] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Read prefers-reduced-motion directly (deterministic across browsers and
  // emulators); motionKnown gates the animation until the preference is known.
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
      // Entrance: the full-size logo settles in from a gentle scale.
      gsap.fromTo(
        ".ec-stage",
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );

      // Color fill: the brand gradient band sweeps left-to-right across the
      // logo silhouette, filling it with color, then fades back to white.
      const fill = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 0.55 });
      fill
        .fromTo(".ec-band", { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.35, ease: "power2.inOut" })
        .to(".ec-band", { opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.55")
        .set(".ec-band", { xPercent: -100 });

      // Ambient glow breathes behind the logo.
      gsap.fromTo(".ec-glow", { opacity: 0.35 }, { opacity: 0.75, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.4 });
    }, rootRef);
    return () => ctx.revert();
  }, [reduce, motionKnown]);

  // The fill layer is masked to the logo's silhouette so the color band only
  // ever paints inside the logo shape.
  const maskStyle: React.CSSProperties = {
    maskImage: `url(${LOGO_URL})`,
    WebkitMaskImage: `url(${LOGO_URL})`,
    maskSize: "contain",
    maskPosition: "center",
    maskRepeat: "no-repeat",
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center gap-8 relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="ec-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="ec-stage relative w-56 h-56 md:w-64 md:h-64">
        {/* White silhouette base */}
        <img
          src={LOGO_URL}
          alt="Smartslate"
          className="ec-base absolute inset-0 w-full h-full object-contain brightness-0 invert opacity-90"
        />

        {/* Color fill layer, masked to the logo silhouette */}
        <div className="absolute inset-0" style={maskStyle}>
          <div
            className={`ec-band absolute inset-y-0 left-0 w-[150%] ${reduce ? "opacity-100" : "opacity-0"}`}
            style={{
              background: reduce
                ? "linear-gradient(90deg, #a7dadb, #a7dadb)"
                : "linear-gradient(90deg, transparent 0%, #4F46E5 30%, #a7dadb 68%, rgba(255,255,255,0.9) 78%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <p className="relative text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
