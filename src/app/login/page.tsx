"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from "lucide-react";
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

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

  return (
    <main className="relative grid min-h-[100dvh] grid-cols-1 overflow-hidden bg-background lg:grid-cols-[5fr_6fr]">
      {/* LEFT — branding panel */}
      <aside
        aria-hidden="true"
        className="relative hidden flex-col justify-between overflow-hidden bg-[#070d1c] p-10 lg:flex xl:p-14"
      >
        {/* Decorative orbs */}
        <motion.div
          className="absolute -left-24 top-16 size-[30rem] rounded-full bg-primary/10 blur-[120px]"
          animate={reduce ? undefined : { y: [0, -22, 0], x: [0, 14, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.div
          className="absolute -right-20 bottom-10 size-[26rem] rounded-full bg-secondary/10 blur-[120px]"
          animate={reduce ? undefined : { y: [0, 20, 0], x: [0, -16, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 14, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {/* Subtle radial glow at top-right */}
        <div className="pointer-events-none absolute right-0 top-0 h-2/3 w-full bg-[radial-gradient(ellipse_at_top_right,rgba(167,218,219,0.08),transparent_60%)]" />
        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(167,218,219,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Wordmark */}
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-heading text-lg font-bold text-primary backdrop-blur-sm">
              A
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
              AI Foundations
            </span>
          </div>
        </div>

        {/* Tagline / statement */}
        <div className="relative max-w-sm">
          <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
            Concept to{" "}
            <span className="text-primary">Application</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Build real fluency in AI, one narrated lesson at a time. Your
            progress picks up right where you left it.
          </p>
        </div>

        {/* Footer mark */}
        <div className="relative space-y-6">
          {/* Feature highlight cards */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="size-[18px]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Narrate, don't lecture</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Bite-sized interactive slides with voiceover — not hour-long videos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Lock className="size-[18px]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Your progress is saved</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Pick up exactly where you left off, on any device.
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Trusted by self-directed learners
          </p>
        </div>
      </aside>

      {/* RIGHT — form panel */}
      <section className="relative flex items-center justify-center px-5 py-12 sm:px-8">
        {/* Faint glow behind the card */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

        {/* Mobile compact header */}
        <div className="absolute left-0 top-0 flex w-full items-center justify-center gap-2 px-5 py-6 lg:hidden">
          <span className="flex size-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-heading text-sm font-bold text-primary backdrop-blur-sm">
            A
          </span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground">
            AI Foundations
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.6, ease: EASE_OUT }
          }
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card/50 p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          {/* Top-edge gradient highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {/* Header */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.5, ease: EASE_OUT, delay: 0.06 }
            }
            className="mb-8 space-y-2"
          >
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Sign in to continue your learning journey
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Auth error */}
            {authError && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }}
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {authError}
              </motion.div>
            )}

            {/* Email */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, ease: EASE_OUT, delay: 0.12 }
              }
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/50" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, ease: EASE_OUT, delay: 0.18 }
              }
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/50" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 pr-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:rounded-md focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="size-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  aria-live="polite"
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, ease: EASE_OUT, delay: 0.24 }
              }
            >
              <Button
                type="submit"
                variant="secondary"
                className="h-12 w-full rounded-xl bg-gradient-to-b from-secondary to-secondary/90 text-base font-semibold tracking-tight shadow-lg shadow-secondary/25 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[0.5px] hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] active:translate-y-0"
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
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.5, ease: EASE_OUT, delay: 0.32 }
            }
            className="mt-8 text-center text-sm text-muted-foreground"
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
