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
import { Eye, EyeOff, Loader2, Mail, Lock, User, Sparkles, TrendingUp } from "lucide-react";
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

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const LOGO_URL = "https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png";

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

  if (length === 0) return { level: 0, label: "Weak", color: "bg-red-500" };
  if (length < 8) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (lettersOnly || numbersOnly) return { level: 2, label: "Fair", color: "bg-amber-500" };
  if (hasUpper && hasLower && hasNumber && hasSymbol) return { level: 4, label: "Strong", color: "bg-emerald-500" };
  return { level: 3, label: "Good", color: "bg-yellow-500" };
}

function PasswordStrengthMeter({ password }: { password: string }) {
  const reduce = useReducedMotion();
  const { level, label, color } = evaluatePasswordStrength(password);

  return (
    <div className="space-y-1.5">
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
            <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-muted/40">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={false}
                animate={{ width: active ? "100%" : "0%" }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/80">{label}</span>
        <span className="text-muted-foreground/60">8+ chars · upper · lower · number · symbol</span>
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
      options: { data: { first_name: data.first_name, last_name: data.last_name } },
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
            <Link href="/login" className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline">
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

  const stagger = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE_OUT, delay } };

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-background lg:grid lg:grid-cols-[60%_40%]">
      {/* ═══ LEFT — marketing panel (60%) ═══ */}
      <aside aria-hidden="true" className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#020C1B] via-[#020C1B]/90 to-[#0d1b2a]/70" />

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

        {/* SmartSlate logo */}
        <div className="relative">
          <img src={LOGO_URL} alt="SmartSlate" className="h-9 w-auto" />
        </div>

        {/* Enriched headline + features */}
        <div className="relative max-w-md space-y-7">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">GenAI Foundations</p>
            <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground xl:text-[1.75rem]">
              Concept to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Application</span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-muted-foreground">
              Join learners from non-technical backgrounds who are building real GenAI fluency. No coding experience
              required — just curiosity and a willingness to engage.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Sparkles className="size-[16px]" />
              </div>
              <div>
                <p className="text-[0.8rem] font-medium text-foreground">Zero to confident</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Start from absolute basics. Each module builds on the last — no prior technical knowledge assumed.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 backdrop-blur-sm">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <TrendingUp className="size-[16px]" />
              </div>
              <div>
                <p className="text-[0.8rem] font-medium text-foreground">Build a real project</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Choose a project spine — Research Companion, Content Engine, or Creative Studio — and apply every concept.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-muted-foreground/40">Free to start. No credit card required.</p>
      </aside>

      {/* ═══ RIGHT — form panel (40% on desktop, full screen on mobile) ═══ */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 lg:justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />

        {/* Mobile: logo centered at top */}
        <div className="flex shrink-0 justify-center pb-3 pt-5 lg:hidden">
          <img src={LOGO_URL} alt="SmartSlate" className="h-7 w-auto" />
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
          className="relative my-auto w-full max-w-[24rem] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-white/[0.08] bg-card/60 p-5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7 lg:max-w-xl lg:p-7"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <motion.div {...stagger(0.06)} className="mb-5 space-y-1">
            <h1 className="font-heading text-[1.5rem] font-bold tracking-tight text-foreground sm:text-[1.75rem]">
              Create your account
            </h1>
            <p className="text-[0.825rem] text-muted-foreground">Start learning AI foundations today</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name fields */}
            <motion.div {...stagger(0.12)} className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-[0.8rem] font-medium text-foreground">First name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                  <Input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    autoFocus
                    aria-invalid={!!errors.first_name}
                    aria-describedby={errors.first_name ? "first_name-error" : undefined}
                    className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-[0.875rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-11 sm:text-[0.9rem]"
                    {...register("first_name")}
                  />
                </div>
                {errors.first_name && <p id="first_name-error" className="text-xs text-destructive" aria-live="polite">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-[0.8rem] font-medium text-foreground">Last name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                  <Input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    aria-invalid={!!errors.last_name}
                    aria-describedby={errors.last_name ? "last_name-error" : undefined}
                    className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-[0.875rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-11 sm:text-[0.9rem]"
                    {...register("last_name")}
                  />
                </div>
                {errors.last_name && <p id="last_name-error" className="text-xs text-destructive" aria-live="polite">{errors.last_name.message}</p>}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div {...stagger(0.18)} className="space-y-1.5">
              <Label htmlFor="email" className="text-[0.8rem] font-medium text-foreground">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-[0.875rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-11 sm:text-[0.9rem]"
                  {...register("email")}
                />
              </div>
              {errors.email && <p id="email-error" className="text-xs text-destructive" aria-live="polite">{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div {...stagger(0.24)} className="space-y-1.5">
              <Label htmlFor="password" className="text-[0.8rem] font-medium text-foreground">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground/40" aria-hidden="true" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  className="h-10 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 pr-10 text-[0.875rem] text-foreground transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.05] focus-visible:ring-primary/15 sm:h-11 sm:text-[0.9rem]"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-200 hover:text-primary focus-visible:rounded-md focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                </button>
              </div>
              <div id="password-strength">
                <PasswordStrengthMeter password={passwordValue} />
              </div>
              {errors.password && <p id="password-error" className="text-xs text-destructive" aria-live="polite">{errors.password.message}</p>}
            </motion.div>

            {/* Auth error */}
            {authError && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }}
                className="rounded-xl border border-destructive/20 bg-destructive/8 p-3 text-xs text-destructive"
                aria-live="polite"
                role="alert"
              >
                {authError}
              </motion.div>
            )}

            {/* Submit */}
            <motion.div {...stagger(0.3)}>
              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-to-b from-secondary to-secondary/90 text-[0.9rem] font-semibold tracking-tight text-secondary-foreground shadow-[0_4px_14px_-2px_rgba(79,70,229,0.35)] transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_6px_20px_-2px_rgba(79,70,229,0.45)] active:scale-[0.97]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="size-4 animate-spin" aria-hidden="true" /><span>Creating account...</span></>
                ) : (
                  "Create account"
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p {...stagger(0.36)} className="mt-5 text-center text-[0.825rem] text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 transition-colors duration-200 hover:text-primary/80 hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
