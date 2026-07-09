"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* Emil-design-eng: strong ease-out for entrances, under 300ms for UI */
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function LoginPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setAuthError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError("Invalid email or password. Please try again.");
      reset({
        email: data.email,
        password: "",
      });
      return;
    }

    router.push("/");
    router.refresh();
  }

  /* Emil: stagger helper — 60ms between siblings, scale(0.95) + opacity for natural entrance */
  const stagger = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE_OUT, delay } };

  return (
    <main className="relative grid min-h-[100dvh] grid-cols-1 overflow-hidden bg-background lg:grid-cols-[5fr_6fr]">
      {/* ═══ LEFT — branding panel ═══ */}
      <aside
        aria-hidden="true"
        className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-16"
      >
        {/* Background image — subtle, dark, AI/tech themed */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80)",
          }}
        />
        {/* Dark overlay gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020C1B] via-[#020C1B]/95 to-[#0d1b2a]/80" />

        {/* Floating orbs — spring-like ambient motion */}
        <motion.div
          className="absolute -left-20 top-10 size-[28rem] rounded-full bg-primary/8 blur-[100px]"
          animate={reduce ? undefined : { y: [0, -18, 0], x: [0, 12, 0] }}
          transition={reduce ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-8 size-[24rem] rounded-full bg-secondary/8 blur-[100px]"
          animate={reduce ? undefined : { y: [0, 16, 0], x: [0, -14, 0] }}
          transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── Top: SmartSlate logo ── */}
        <div className="relative">
          <img
            src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png"
            alt="SmartSlate"
            className="h-9 w-auto"
          />
        </div>

        {/* ── Middle: headline + feature cards ── */}
        <div className="relative max-w-sm space-y-8">
          <div>
            <h2 className="font-heading text-[2.25rem] font-bold leading-[1.15] tracking-tight text-foreground xl:text-5xl">
              Concept to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Application
              </span>
            </h2>
            <p className="mt-5 max-w-xs text-[0.925rem] leading-relaxed text-muted-foreground">
              Build real fluency in AI, one narrated lesson at a time.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3">
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-white/10">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Mail className="size-[17px]" />
              </div>
              <div>
                <p className="text-[0.825rem] font-medium text-foreground">Narrate, don&apos;t lecture</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Bite-sized interactive slides with voiceover — not hour-long videos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-white/10">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Lock className="size-[17px]" />
              </div>
              <div>
                <p className="text-[0.825rem] font-medium text-foreground">Your progress is saved</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Pick up exactly where you left off, on any device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom: footer ── */}
        <p className="relative text-xs text-muted-foreground/50">
          Trusted by self-directed learners
        </p>
      </aside>

      {/* ═══ RIGHT — form panel ═══ */}
      <section className="relative flex items-center justify-center px-5 py-12 sm:px-8">
        {/* Ambient glow behind card */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[120px]" />

        {/* Mobile header — SmartSlate logo */}
        <div className="absolute left-0 top-0 flex w-full items-center justify-center px-5 py-6 lg:hidden">
          <img
            src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png"
            alt="SmartSlate"
            className="h-7 w-auto"
          />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
          className="relative w-full max-w-[26rem] overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-card/60 p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-10"
        >
          {/* Top-edge gradient highlight — premium edge detail */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Header */}
          <motion.div {...stagger(0.06)} className="mb-7 space-y-1.5">
            <h1 className="font-heading text-[1.75rem] font-bold tracking-tight text-foreground md:text-[2rem]">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue your learning journey
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Auth error */}
            {authError && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }}
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
              >
                {authError}
              </motion.div>
            )}

            {/* Email */}
            <motion.div {...stagger(0.12)} className="space-y-2">
              <Label htmlFor="email" className="text-[0.825rem] font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 text-[0.95rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" aria-live="polite" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div {...stagger(0.18)} className="space-y-2">
              <Label htmlFor="password" className="text-[0.825rem] font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-12 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-[0.95rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-200 hover:text-primary focus-visible:rounded-md focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" role="alert" aria-live="polite" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Submit — emil: scale(0.97) on active, gradient bg, refined shadow */}
            <motion.div {...stagger(0.24)}>
              <Button
                type="submit"
                variant="secondary"
                className="h-12 w-full rounded-xl bg-gradient-to-b from-secondary to-secondary/90 text-[0.95rem] font-semibold tracking-tight shadow-[0_4px_14px_-2px_rgba(79,70,229,0.35)] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_6px_20px_-2px_rgba(79,70,229,0.45)] active:scale-[0.97]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer link */}
          <motion.p
            {...stagger(0.3)}
            className="mt-7 text-center text-sm text-muted-foreground"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
