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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
    return { level: 0, label: "Weak", color: "bg-destructive" };
  }

  if (length < 8) {
    return { level: 1, label: "Weak", color: "bg-destructive" };
  }

  if (lettersOnly || numbersOnly) {
    return { level: 2, label: "Fair", color: "bg-amber-500" };
  }

  if (hasUpper && hasLower && hasNumber && hasSymbol) {
    return { level: 4, label: "Strong", color: "bg-emerald-500" };
  }

  return { level: 3, label: "Good", color: "bg-yellow-400" };
}

function PasswordStrengthMeter({ password }: { password: string }) {
  const { level, label, color } = evaluatePasswordStrength(password);

  return (
    <div className="space-y-2">
      <div
        className="flex gap-1"
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        aria-valuetext={label}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              index < level ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span>
        <span>Use 8+ characters with uppercase, lowercase, numbers, and symbols</span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
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
              className="text-primary underline underline-offset-4 hover:text-primary/80"
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[420px] bg-card/60 backdrop-blur-xl border-white/10 rounded-2xl shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-heading text-primary">
            Create your account
          </CardTitle>
          <CardDescription>Start learning AI foundations today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  type="text"
                  autoComplete="given-name"
                  autoFocus
                  aria-invalid={!!errors.first_name}
                  aria-describedby={errors.first_name ? "first_name-error" : undefined}
                  {...register("first_name")}
                />
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
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  type="text"
                  autoComplete="family-name"
                  aria-invalid={!!errors.last_name}
                  aria-describedby={errors.last_name ? "last_name-error" : undefined}
                  {...register("last_name")}
                />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" aria-live="polite">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  className="pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              <div id="password-strength">
                <PasswordStrengthMeter password={passwordValue} />
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" aria-live="polite">
                  {errors.password.message}
                </p>
              )}
            </div>

            {authError && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
                aria-live="polite"
                role="alert"
              >
                {authError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
