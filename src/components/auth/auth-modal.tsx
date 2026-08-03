"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  AlertCircle,
  LogIn,
  UserPlus,
  KeyRound,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COURSE_BASE } from "@/lib/course-slug";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ─── Schemas ──────────────────────────────────────────────────────
const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

// ─── Tab Bar ──────────────────────────────────────────────────────
function TabBar({
  active,
  onChange,
}: {
  active: "signin" | "signup";
  onChange: (t: "signin" | "signup") => void;
}) {
  return (
    <div className="relative mb-6 flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.06]">
      <motion.div
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-card shadow-sm ring-1 ring-white/10"
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ x: active === "signup" ? "100%" : "0%" }}
      />
      {(
        [
          { key: "signin", label: "Sign In" },
          { key: "signup", label: "Sign Up" },
        ] as const
      ).map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative z-10 flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors duration-150 ${
            active === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground/70"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── AuthModal ────────────────────────────────────────────────────
interface AuthModalProps {
  /** Gate-style trigger: open while the learner is logged out. */
  isOpen: boolean;
  /** Allow dismissal (X / overlay / Escape). When false the page stays behind
   *  the modal until the learner authenticates. */
  dismissible?: boolean;
}

export function AuthModal({ isOpen, dismissible = true }: AuthModalProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // The gate prop stays true across renders, so dismissal is tracked locally
  // and only reset when the gate re-arms (logged out again on a fresh visit).
  const [dismissed, setDismissed] = useState(false);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpen.current) setDismissed(false);
    prevOpen.current = isOpen;
  }, [isOpen]);

  const open = isOpen && !dismissed;
  const close = () => setDismissed(true);

  useEffect(() => {
    if (open) {
      setTab("signin");
      setShowPassword(false);
      setError(null);
      setShowForgot(false);
      setForgotEmail("");
      setForgotSent(false);
    }
  }, [open]);

  // ── Sign In ──
  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSignIn = async (data: SignInData) => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (err) {
      setError("Invalid email or password.");
      signInForm.reset({ email: data.email, password: "" });
      return;
    }
    close();
    router.refresh();
  };

  // ── Sign Up ──
  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: { first_name: "", last_name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSignUp = async (data: SignUpData) => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { first_name: data.first_name, last_name: data.last_name } },
    });
    setLoading(false);
    if (err) {
      const msg = err.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError(
          <span>
            An account already exists.{" "}
            <button type="button" onClick={() => setTab("signin")} className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in instead?
            </button>
          </span>
        );
      } else {
        setError(err.message);
      }
      return;
    }
    close();
    router.refresh();
  };

  // ── Forgot Password ──
  const sendReset = async () => {
    if (!forgotEmail) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}${COURSE_BASE}/auth/callback?next=${encodeURIComponent(`${COURSE_BASE}/update-password`)}`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setForgotSent(true);
  };

  // ── Keyboard + scroll lock ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!dismissible) return;
      if (e.key === "Escape") close();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, dismissible]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-sm"
          onClick={(e) => {
            if (!dismissible && e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
            className="relative w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-card/95 p-0 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:rounded-[20px]"
            style={{ maxHeight: "calc(100dvh - 5rem)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Close button */}
            {dismissible && (
              <button
                type="button"
                onClick={close}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-muted-foreground/50 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.08] hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* ── Header ── */}
            <div className="px-6 pb-0 pt-8 sm:px-8 sm:pt-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  {showForgot ? (
                    <KeyRound className="h-4 w-4 text-primary" />
                  ) : tab === "signin" ? (
                    <LogIn className="h-4 w-4 text-primary" />
                  ) : (
                    <UserPlus className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="font-heading text-sm font-bold tracking-widest text-primary/70 uppercase">
                  {showForgot ? "Reset" : tab === "signin" ? "Welcome" : "Join"}
                </span>
              </div>
              <h2 className="font-heading text-[1.4rem] font-bold tracking-tight text-foreground sm:text-[1.6rem]">
                {showForgot
                  ? "Reset your password"
                  : tab === "signin"
                    ? "Welcome back"
                    : "Create your account"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {showForgot
                  ? "Enter your email and we'll send a reset link."
                  : tab === "signin"
                    ? "Sign in to continue your learning journey."
                    : "Start learning AI foundations today. No credit card required."}
              </p>
            </div>

            {/* ── Body ── */}
            <div className="px-6 py-6 sm:px-8">
              {!showForgot && <TabBar active={tab} onChange={setTab} />}

              {/* Error */}
              {error && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {showForgot ? (
                /* ── Forgot Password ── */
                <div className="space-y-4">
                  {forgotSent ? (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-primary/20 bg-primary/8 px-5 py-4 text-sm text-primary"
                    >
                      <p className="font-semibold">Reset link sent!</p>
                      <p className="mt-1 text-primary/70">Check your email inbox for the reset link.</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="modal-reset-email" className="text-sm font-medium text-foreground/80">
                          Email address
                        </Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                          <Input
                            id="modal-reset-email"
                            type="email"
                            autoFocus
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={loading || !forgotEmail}
                        onClick={sendReset}
                        className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg"
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
                      </Button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setError(null);
                      setForgotSent(false);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground/60 transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to sign in
                  </button>
                </div>
              ) : tab === "signin" ? (
                /* ── Sign In Form ── */
                <form onSubmit={signInForm.handleSubmit(onSignIn)} noValidate className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email" className="text-sm font-medium text-foreground/80">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                      <Input
                        id="si-email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                        {...signInForm.register("email")}
                        placeholder="you@example.com"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                      />
                    </div>
                    {signInForm.formState.errors.email && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="si-password" className="text-sm font-medium text-foreground/80">
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          setError(null);
                        }}
                        className="text-xs font-medium text-primary/60 underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                      <Input
                        id="si-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={loading}
                        {...signInForm.register("password")}
                        placeholder="Enter your password"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={loading}
                    className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              ) : (
                /* ── Sign Up Form ── */
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} noValidate className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="su-fname" className="text-sm font-medium text-foreground/80">
                        First name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-foreground/40" />
                        <Input
                          id="su-fname"
                          type="text"
                          autoComplete="given-name"
                          autoFocus
                          {...signUpForm.register("first_name")}
                          placeholder="Jane"
                          className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                        />
                      </div>
                      {signUpForm.formState.errors.first_name && (
                        <p className="flex items-center gap-1.5 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {signUpForm.formState.errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="su-lname" className="text-sm font-medium text-foreground/80">
                        Last name
                      </Label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-foreground/40" />
                        <Input
                          id="su-lname"
                          type="text"
                          autoComplete="family-name"
                          {...signUpForm.register("last_name")}
                          placeholder="Doe"
                          className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-10 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                        />
                      </div>
                      {signUpForm.formState.errors.last_name && (
                        <p className="flex items-center gap-1.5 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {signUpForm.formState.errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="su-email" className="text-sm font-medium text-foreground/80">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                      <Input
                        id="su-email"
                        type="email"
                        autoComplete="email"
                        {...signUpForm.register("email")}
                        placeholder="jane@example.com"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                      />
                    </div>
                    {signUpForm.formState.errors.email && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="su-password" className="text-sm font-medium text-foreground/80">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                      <Input
                        id="su-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...signUpForm.register("password")}
                        placeholder="Create a password"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                      </button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="su-confirm" className="text-sm font-medium text-foreground/80">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                      <Input
                        id="su-confirm"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...signUpForm.register("confirmPassword")}
                        placeholder="Re-enter your password"
                        className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                      />
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={loading}
                    className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
                  </Button>
                </form>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-white/[0.04] px-6 py-4 sm:px-8">
              {!showForgot && (
                <p className="text-center text-xs text-muted-foreground/50">
                  {tab === "signin" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("signup")}
                        className="font-medium text-primary/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        Sign up free
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("signin")}
                        className="font-medium text-primary/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
