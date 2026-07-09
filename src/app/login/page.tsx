"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock, BookOpen, BarChart3 } from "lucide-react";
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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const LOGO_URL = "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png";

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
    defaultValues: { email: "", password: "" },
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
      reset({ email: data.email, password: "" });
      return;
    }
    router.push("/");
    router.refresh();
  }

  const stagger = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE_OUT, delay } };

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background lg:grid lg:grid-cols-[60%_40%]">
      {/* ═══ LEFT — marketing panel (60% on desktop, hidden on mobile) ═══ */}
      <aside aria-hidden="true" className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
        {/* Contextually relevant background — AI/neural network themed */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020C1B] via-[#020C1B]/90 to-[#0d1b2a]/70" />

        {/* Ambient orbs */}
        <motion.div
          className="absolute -left-20 top-10 size-[26rem] rounded-full bg-primary/8 blur-[100px]"
          animate={reduce ? undefined : { y: [0, -18, 0], x: [0, 12, 0] }}
          transition={reduce ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 bottom-0 size-[22rem] rounded-full bg-secondary/8 blur-[100px]"
          animate={reduce ? undefined : { y: [0, 16, 0], x: [0, -14, 0] }}
          transition={reduce ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── Top: SmartSlate logo ── */}
        <div className="relative">
          <img src={LOGO_URL} alt="SmartSlate" className="h-9 w-auto" />
        </div>

        {/* ── Middle: enriched headline + features ── */}
        <div className="relative max-w-3xl space-y-7">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">GenAI Foundations</p>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground xl:text-[1.75rem]">
              Concept to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Application</span>
            </h2>
            <p className="mt-4 max-w-lg text-[0.9rem] leading-relaxed text-muted-foreground">
              A structured, hands-on course that transforms AI curiosity into confident, practical fluency. Narrated
              lessons, interactive exercises, and a real project you build as you learn.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <BookOpen className="size-[16px]" />
              </div>
              <div>
                <p className="text-[0.8rem] font-medium text-foreground">Learn by doing</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Interactive slide decks with embedded exercises — not passive video lectures.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <BarChart3 className="size-[16px]" />
              </div>
              <div>
                <p className="text-[0.8rem] font-medium text-foreground">Track every step</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Progress syncs across devices. Resume exactly where you left off.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground/40">Trusted by self-directed learners worldwide</p>
      </aside>

      {/* ═══ RIGHT — form panel (40% on desktop, full screen on mobile) ═══ */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 lg:justify-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />

        {/* Mobile: logo centered at top */}
        <div className="flex shrink-0 justify-center pb-4 pt-6 lg:hidden">
          <img src={LOGO_URL} alt="SmartSlate" className="h-7 w-auto" />
        </div>

        {/* Card — centered & fits viewport with no scroll */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
          className="relative my-auto w-full max-w-[24rem] overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-card/60 p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8 lg:max-w-2xl lg:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <motion.div {...stagger(0.06)} className="mb-6 space-y-1">
            <h1 className="font-heading text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]">
              Welcome back
            </h1>
            <p className="text-[0.825rem] text-muted-foreground">Sign in to continue your learning journey</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 sm:space-y-5">
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

            <motion.div {...stagger(0.12)} className="space-y-1.5">
              <Label htmlFor="email" className="text-[0.8rem] font-medium text-foreground">Email</Label>
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
                  className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 text-[0.9rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-12 sm:text-[0.95rem]"
                  {...register("email")}
                />
              </div>
              {errors.email && <p id="email-error" role="alert" aria-live="polite" className="text-sm text-destructive">{errors.email.message}</p>}
            </motion.div>

            <motion.div {...stagger(0.18)} className="space-y-1.5">
              <Label htmlFor="password" className="text-[0.8rem] font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-[0.9rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-12 sm:text-[0.95rem]"
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
              {errors.password && <p id="password-error" role="alert" aria-live="polite" className="text-sm text-destructive">{errors.password.message}</p>}
            </motion.div>

            <motion.div {...stagger(0.24)}>
              <Button
                type="submit"
                variant="secondary"
                className="h-11 w-full rounded-xl bg-gradient-to-b from-secondary to-secondary/90 text-[0.9rem] font-semibold tracking-tight shadow-[0_4px_14px_-2px_rgba(79,70,229,0.35)] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_6px_20px_-2px_rgba(79,70,229,0.45)] active:scale-[0.97] sm:h-12 sm:text-[0.95rem]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="size-4 animate-spin" aria-hidden="true" /><span>Signing in...</span></>
                ) : (
                  <span>Sign in</span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p {...stagger(0.3)} className="mt-6 text-center text-[0.825rem] text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline">
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
