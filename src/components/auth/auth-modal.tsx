"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock, LogIn, UserPlus, Loader2, Mail, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AuthModal({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    
    setIsLoading(false);
    
    if (error) {
      setAuthError("Invalid email or password. Please try again.");
      return;
    }
    
    router.refresh();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !signupEmail || !signupPassword) {
      setAuthError("Please fill out all fields.");
      return;
    }
    if (signupPassword.length < 8) {
      setAuthError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setAuthError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { first_name: firstName, last_name: lastName } },
    });

    setIsLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-sm bg-background/80" />
        <DialogContent className="sm:max-w-md [&>button]:hidden border-border/50 bg-card shadow-2xl overflow-hidden p-0">
          <div className="p-6 pb-2">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl font-bold tracking-tight">Access Restricted</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground pt-2">
                Please sign in or create an account to access the course.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 pt-2">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {authError && (
                <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/8 p-3 text-xs text-destructive text-center">
                  {authError}
                </div>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login_email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="login_email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pl-9 h-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login_password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="login_password" type={showPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-9 pr-9 h-10" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground mt-2">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="first_name">First name</Label>
                      <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last_name">Last name</Label>
                      <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup_email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signup_email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="pl-9 h-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup_password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                      <Input id="signup_password" type={showPassword ? "text" : "password"} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="pl-9 pr-9 h-10" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground mt-2">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
