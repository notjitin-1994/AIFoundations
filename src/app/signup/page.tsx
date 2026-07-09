"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a symbol"),
});

type SignupFormData = z.infer<typeof schema>;

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface StrengthResult {
  level: StrengthLevel;
  label: "Weak" | "Fair" | "Good" | "Strong";
  color: string;
}

function evaluatePasswordStrength(password: string): StrengthResult {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const lettersOnly = /^[A-Za-z]+$/.test(password);
  const numbersOnly = /^[0-9]+$/.test(password);

  if (length === 0) {
    return { level: 0, label: "Weak", color: "bg-red-500" };
  }

  if (length < 8) {
    return { level: 1, label: "Weak", color: "bg-red-500" };
  }

  if (lettersOnly || numbersOnly) {
    return { level: 2, label: "Fair", color: "bg-amber-500" };
  }

  if (hasUpper && hasLower && hasNumber && hasSymbol) {
    return { level: 4, label: "Strong", color: "bg-emerald-500" };
  }

  return { level: 3, label: "Good", color: "bg-yellow-500" };
}

function PasswordStrengthMeter({ password }: { password: string }) {
  const reduce = useReducedMotion();
  const { level, label, color } = evaluatePasswordStrength(password);

  return (
    <div className="space-y-2">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        aria-valuetext={label}
      >
        {Array.from({ length: 4 }).map((_, index) => {
          const active = index < level;
          return (
            <div
              key={index}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60"
            >
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={false}
                animate={{ width: active ? "100%" : "0%" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }
                }
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-right">
          Use 8+ characters with uppercase, lowercase, numbers, and symbols
        </span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<React.ReactNode>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setAuthError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("already registered") ||
        message.includes("user already exists") ||
        message.includes("email already in use")
      ) {
        setAuthError(
          <span>
            An account with this email already exists.{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            >
              Would you like to sign in instead?
            </Link>
          </span>
        );
      } else {
        setAuthError(error.message);
      }
      return;
    }

    router.push("/");
    router.refresh();
  };

  const reveal = (delay: number) =>
    reduce
      ? {
          initial: false as const,
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE_OUT, delay },
        };

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
            Start your{" "}
            <span className="text-primary">AI journey</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Join a hands-on, narrated course that takes you from core concepts
            to confident, real-world application.
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
                <p className="text-sm font-medium text-foreground">Hands-on, not passive</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Build a real project spine as you learn — apply each concept immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <User className="size-[18px]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Built for non-technical pros</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  No coding experience needed. Start from zero, build real fluency.
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Free to start. No credit card required.
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
            reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }
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
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Start learning AI foundations today
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name fields */}
            <motion.div
              {...reveal(0.12)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-foreground">
                  First name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/50" aria-hidden="true" />
                  <Input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    autoFocus
                    aria-invalid={!!errors.first_name}
                    aria-describedby={
                      errors.first_name ? "first_name-error" : undefined
                    }
                    className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                    {...register("first_name")}
                  />
                </div>
                {errors.first_name && (
                  <p
                    id="first_name-error"
                    className="text-sm text-destructive"
                    aria-live="polite"
                  >
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-foreground">
                  Last name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/50" aria-hidden="true" />
                  <Input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    aria-invalid={!!errors.last_name}
                    aria-describedby={
                      errors.last_name ? "last_name-error" : undefined
                    }
                    className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                    {...register("last_name")}
                  />
                </div>
                {errors.last_name && (
                  <p
                    id="last_name-error"
                    className="text-sm text-destructive"
                    aria-live="polite"
                  >
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              {...reveal(0.18)}
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
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                >
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              {...reveal(0.24)}
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
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : "password-strength"
                  }
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-11 pr-11 text-base text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-primary/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:rounded-md focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="size-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div id="password-strength">
                <PasswordStrengthMeter password={passwordValue} />
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-destructive"
                  aria-live="polite"
                >
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Auth error */}
            {authError && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE_OUT }}
                className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                aria-live="polite"
                role="alert"
              >
                {authError}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, ease: EASE_OUT, delay: 0.3 }
              }
            >
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-b from-secondary to-secondary/90 text-base font-semibold tracking-tight text-secondary-foreground shadow-lg shadow-secondary/25 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[0.5px] hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] active:translate-y-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create account"
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
                : { duration: 0.5, ease: EASE_OUT, delay: 0.38 }
            }
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
