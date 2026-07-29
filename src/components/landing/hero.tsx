"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { gsap } from "gsap";
import { motion, useReducedMotion } from "motion/react";
import { AuroraBackground } from "./aurora-background";
import { MagneticButton } from "./magnetic-button";
import { CoursePreviewCard } from "./course-preview-card";
import { TrustMarquee } from "./trust-marquee";

/**
 * Hero — premium landing-page hero composition.
 *
 * Layout: 2-column grid on desktop (text left / graphic right). Below lg the
 * graphic is hidden entirely; text stack centers and fills the column.
 *
 * Motion budget (capped at 4 signature moments):
 *   1. Headline word-stagger (GSAP, manual split — no SplitText plugin)
 *   2. Magnetic primary CTA (GSAP quickTo elastic)
 *   3. Aurora drift (CSS keyframes, 28s loop)
 *   4. Scroll parallax on preview card + chips (Motion useScroll/useTransform)
 *
 * Reduced-motion: every animation collapses to instant opacity per the
 * globals.css `prefers-reduced-motion` block + Motion's useReducedMotion.
 */

const HEADLINE_LINE_1 = ["Where", "learning"];
const HEADLINE_LINE_2 = ["adapts", "to", "you."];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!headlineRef.current || reduceMotion) return;
    const words =
      headlineRef.current.querySelectorAll<HTMLElement>(".word-inner");
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    }, headlineRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.35 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  };

  return (
    <main
      ref={heroRef}
      className="relative min-h-[100dvh] overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28"
    >
      <AuroraBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 2-COLUMN GRID — text left / graphic right on desktop.
            7:5 ratio gives the text column more room for the long headline.
            Graphic wrapper is hidden below lg per design. */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — hero text stack */}
          <motion.div
            variants={containerVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            className="text-center lg:col-span-5 lg:text-left"
          >
          {/* Headline — manual word-mask split for slide-up reveal.
                Size scale pulled back from the centered-hero version because
                the text column is now ~half-width on desktop. */}
            <h1
              ref={headlineRef}
              className="font-heading text-balance text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-4xl xl:text-5xl"
            >
              <span className="block">
                {HEADLINE_LINE_1.map((word, i) => (
                  <span key={i} className="word-mask">
                    <span className="word-inner">
                      {word}
                      {i < HEADLINE_LINE_1.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-1 block text-primary">
                {HEADLINE_LINE_2.map((word, i) => (
                  <span key={i} className="word-mask">
                    <span className="word-inner">
                      {word}
                      {i < HEADLINE_LINE_2.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Subhead — Maven template #5 ("Go from X to Y in # ...") */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-pretty font-sans text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0"
            >
              Smartslate Orbit delivers adaptive learning journeys that
              personalize to every learner in real-time — replacing rigid LMS
              systems with intelligent delivery and measurable outcomes.
            </motion.p>

            {/* CTAs — primary indigo (magnetic) + secondary glass ghost.
                One indigo per surface per STYLE.md §2 two-accent rule. */}
            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              <MagneticButton>
                <Link
                  href="/courses/aifoundations-concept2application"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-2xl shadow-secondary/25 transition-transform duration-200 active:scale-[0.97]"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  Start Learning
                  {/* Button-in-Button trailing icon (soft-skill §4.B) */}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  </span>
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2}>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors duration-200 hover:border-primary/30 active:scale-[0.97]"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  See How It Works
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* RIGHT — course preview card. Hidden below lg per design. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE_OUT }}
            className="relative hidden lg:col-span-7 lg:block"
          >
            <CoursePreviewCard heroRef={heroRef} />
          </motion.div>
        </div>

        {/* TRUST MARQUEE — what learners build (project-spine templates) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 md:mt-28"
        >
          <div className="mb-5 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Part of Smartslate Solara
            </span>
          </div>
          <TrustMarquee />
        </motion.div>
      </div>
    </main>
  );
}
