"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";

/**
 * MagneticButton — wraps any clickable element and pulls it toward the cursor
 * when the pointer is within the element's bounding box.
 *
 * Uses GSAP `quickTo` so the tween is created once and re-targeted on every
 * `mousemove` — far cheaper than spawning a tween per event. Release returns
 * to origin with a softer elastic so the button feels like it snaps to rest.
 *
 * Reduced-motion path: magnetic effect is fully disabled; the button behaves
 * as a standard hover-only element. Per emil-design-eng: never animate
 * keyboard-initiated actions, so we attach only to `mousemove` (pointer-only).
 *
 * The wrapped element keeps its OWN visual hover/active states — magnetic
 * translation is purely additive. Pair with `scale(0.97)` on `:active` per
 * the button-press contract (emil-design-eng §"Buttons must feel responsive").
 */
type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function MagneticButton({
  children,
  strength = 0.35,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.9,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.9,
      ease: "elastic.out(1, 0.3)",
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion, strength]);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
