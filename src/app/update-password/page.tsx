"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, KeyRound, Loader2, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const updateSchema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdateData = z.infer<typeof updateSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (cancelled) return;
        setStatus(data.user ? "ready" : "invalid");
      })
      .catch(() => {
        if (!cancelled) setStatus("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const form = useForm<UpdateData>({
    resolver: zodResolver(updateSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: UpdateData) => {
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password: data.password });
    if (err) {
      setError(err.message);
      return;
    }
    setUpdated(true);
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-card/95 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {updated ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">You can now sign in with your new password.</p>
            <Button variant="secondary" className="mt-6 h-11 w-full rounded-xl" onClick={() => router.push("/login")}>
              Back to sign in <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : status === "invalid" ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Link invalid or expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This password reset link is no longer valid. Request a new one from the sign-in screen.
            </p>
            <Button variant="secondary" className="mt-6 h-11 w-full rounded-xl" onClick={() => router.push("/login")}>
              Go to sign in
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <KeyRound className="h-4 w-4 text-primary" />
              </div>
              <span className="font-heading text-sm font-bold tracking-widest text-primary/70 uppercase">Reset</span>
            </div>
            <h1 className="font-heading text-[1.4rem] font-bold tracking-tight">Choose a new password</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Make it at least 8 characters.</p>

            {error && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="up-password" className="text-sm font-medium text-foreground/80">
                  New password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                  <Input
                    id="up-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...form.register("password")}
                    placeholder="New password"
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
                {form.formState.errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="up-confirm" className="text-sm font-medium text-foreground/80">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
                  <Input
                    id="up-confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...form.register("confirmPassword")}
                    placeholder="Re-enter new password"
                    className="h-11 rounded-xl border-white/[0.08] bg-white/[0.03] pl-11 pr-11 text-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:border-primary/30 focus-visible:bg-white/[0.06] focus-visible:ring-primary/15"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="secondary" className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg">
                Update password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
