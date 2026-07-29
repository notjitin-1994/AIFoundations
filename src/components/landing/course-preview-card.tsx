"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { gsap } from "gsap";

/**
 * CoursePreviewCard — animated skeletal replica of the lesson experience.
 *
 * Layout mirrors the real page from /courses/aifoundations-concept2application/modules/0:
 * sidebar + header + 16:10 canvas (split-layout slide) + nav footer. All
 * content is skeleton bars (gray placeholders) communicating "your content
 * goes here."
 *
 * Animation layers (GSAP + Framer Motion + CSS, per emil-design-eng):
 *
 *   1. GSAP entrance timeline (the signature moment) — staggered build-up
 *      of every skeletal element on mount. Sidebar slides in from left,
 *      canvas heading bars rise, body lines cascade, interactive card
 *      materialises, media area fades in, nav buttons pop with back-out
 *      easing. Scoped via gsap.context + useRef for safe cleanup.
 *
 *   2. CSS shimmer sweep — a slow left-to-right gradient overlay traverses
 *      the canvas every 4s, making the skeleton feel alive without being
 *      a loading state. GPU-composited transform only.
 *
 *   3. Framer Motion play-button breathe — the teal play triangle in the
 *      media area perpetually pulses scale + opacity, drawing the eye to
 *      where "content" would live.
 *
 * Wrapped in a Double-Bezel browser card (soft-skill §4.A). Scroll parallax
 * via Motion useScroll on the hero ref. Every animation collapses to
 * instant under prefers-reduced-motion.
 */
export function CoursePreviewCard({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 1.0,
        defaults: { ease: "power3.out" },
      });

      tl.from(".skel-sidebar-item", {
        opacity: 0,
        x: -12,
        stagger: 0.05,
        duration: 0.4,
      })
        .from(
          ".skel-header",
          { opacity: 0, duration: 0.3 },
          "<"
        )
        .from(
          ".skel-heading",
          { opacity: 0, y: 8, stagger: 0.08, duration: 0.4 },
          "-=0.1"
        )
        .from(
          ".skel-body",
          { opacity: 0, y: 6, stagger: 0.04, duration: 0.3 },
          "-=0.1"
        )
        .from(
          ".skel-card",
          { opacity: 0, y: 8, duration: 0.4 },
          "-=0.1"
        )
        .from(
          ".skel-media",
          { opacity: 0, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".skel-nav-btn",
          {
            opacity: 0,
            scale: 0.7,
            stagger: 0.06,
            duration: 0.3,
            ease: "back.out(1.5)",
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <motion.div
      ref={containerRef}
      className="relative mx-auto w-full max-w-4xl"
      style={reduceMotion ? undefined : { y: cardY }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full opacity-50 blur-[100px]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(167, 218, 219, 0.20), transparent 70%)",
          ...(reduceMotion ? {} : { y: glowY }),
        }}
      />

      <div className="rounded-[2rem] bg-white/[0.04] p-2 ring-1 ring-white/10 backdrop-blur-2xl">
        <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] bg-card/60 ring-1 ring-white/5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <div className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-md bg-background/50 px-3 py-1 ring-1 ring-white/5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span className="truncate font-mono text-[10px] text-muted-foreground">
                orbit.smartslate.io/courses/aifoundations-concept2application
              </span>
            </div>
            <div className="w-12" aria-hidden />
          </div>

          {/* LESSON PAGE */}
          <div className="flex h-[280px] sm:h-[340px] md:h-[400px] lg:h-[400px] xl:h-[460px]">
            {/* SIDEBAR */}
            <aside className="hidden sm:flex w-16 md:w-20 flex-col border-r border-white/5 bg-background/40">
              <div className="space-y-2 border-b border-white/5 p-2.5">
                <div className="skel-sidebar-item h-2.5 w-10 rounded-sm bg-white/[0.08]" />
                <div className="skel-sidebar-item h-1 w-12 rounded-full bg-white/[0.04]" />
              </div>
              <div className="flex-1 space-y-2 p-2">
                <div className="space-y-1">
                  <div className="skel-sidebar-item flex items-center gap-1.5 rounded bg-primary/[0.08] px-1 py-1">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <div className="h-1.5 w-8 rounded-full bg-primary/30" />
                  </div>
                  <div className="space-y-1 pl-3">
                    <div className="skel-sidebar-item h-1 w-10 rounded-full bg-white/[0.06]" />
                    <div className="skel-sidebar-item h-1 w-8 rounded-full bg-white/[0.04]" />
                    <div className="skel-sidebar-item h-1 w-9 rounded-full bg-white/[0.04]" />
                    <div className="skel-sidebar-item h-1 w-7 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
                <div className="skel-sidebar-item flex items-center gap-1.5 px-1 py-0.5">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full border border-white/15" />
                  <div className="h-1.5 w-9 rounded-full bg-white/[0.04]" />
                </div>
                <div className="skel-sidebar-item flex items-center gap-1.5 px-1 py-0.5">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full border border-white/15" />
                  <div className="h-1.5 w-8 rounded-full bg-white/[0.04]" />
                </div>
                <div className="skel-sidebar-item flex items-center gap-1.5 px-1 py-0.5 opacity-40">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/10" />
                  <div className="h-1.5 w-7 rounded-full bg-white/[0.03]" />
                </div>
              </div>
            </aside>

            {/* MAIN AREA */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Header */}
              <div className="skel-header flex items-center justify-between border-b border-white/5 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-white/[0.04]" />
                  <div className="h-1.5 w-8 rounded-full bg-primary/[0.12]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-white/[0.06]" />
                  <div className="h-3 w-3 rounded bg-white/[0.06]" />
                </div>
              </div>

              {/* CanvasViewer — 16:10 split-layout slide */}
              <div className="flex flex-1 items-center justify-center p-2 md:p-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/[0.06] bg-background shadow-lg">
                  {/* Shimmer overlay — sweeps left-to-right every 4s */}
                  {!reduceMotion && (
                    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                      <div
                        className="skeleton-shimmer-layer absolute inset-y-0 -left-full w-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                          animation:
                            "skeleton-shimmer 4s ease-in-out 2.5s infinite",
                        }}
                      />
                    </div>
                  )}

                  <div className="flex h-full">
                    {/* Left — text content */}
                    <div className="flex flex-1 flex-col justify-center p-3 md:p-4">
                      <div className="skel-heading h-2.5 w-2/3 rounded-md bg-white/[0.08]" />
                      <div className="skel-heading mt-1.5 h-2.5 w-1/2 rounded-md bg-white/[0.08]" />
                      <div className="mt-3 space-y-1.5">
                        <div className="skel-body h-1.5 w-full rounded-full bg-white/[0.05]" />
                        <div className="skel-body h-1.5 w-5/6 rounded-full bg-white/[0.05]" />
                        <div className="skel-body h-1.5 w-3/5 rounded-full bg-white/[0.05]" />
                      </div>
                      <div className="skel-card mt-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary/15 ring-1 ring-primary/20" />
                          <div className="h-1.5 w-12 rounded-full bg-white/[0.06]" />
                        </div>
                        <div className="mt-1.5 h-1 w-full rounded-full bg-white/[0.04]" />
                        <div className="mt-1 h-1 w-3/4 rounded-full bg-white/[0.04]" />
                      </div>
                    </div>

                    {/* Right — media placeholder with breathing play button */}
                    <div className="skel-media hidden md:block w-2/5 border-l border-white/5 bg-muted/20">
                      <div className="relative h-full bg-gradient-to-br from-primary/[0.03] to-secondary/[0.06]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                            animate={
                              reduceMotion
                                ? undefined
                                : {
                                    scale: [1, 1.1, 1],
                                    opacity: [0.6, 1, 0.6],
                                  }
                            }
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <div
                              className="ml-0.5 h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-white/30"
                              aria-hidden
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav footer — prev / play-teal / next-indigo */}
              <div className="flex items-center justify-end gap-2 border-t border-white/5 px-4 py-2.5">
                <div className="skel-nav-btn mr-auto font-mono text-[9px] text-muted-foreground/50">
                  02 / 09
                </div>
                <div className="skel-nav-btn h-5 w-5 rounded-full bg-white/[0.06]" />
                <div className="skel-nav-btn flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
                  <div
                    className="ml-px h-0 w-0 border-y-[3px] border-l-[4px] border-y-transparent border-l-primary/60"
                    aria-hidden
                  />
                </div>
                <div className="skel-nav-btn h-5 w-5 rounded-full bg-secondary/25 ring-1 ring-secondary/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
