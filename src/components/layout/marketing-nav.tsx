"use client";

import Link from "next/link";
import { useUser, getDisplayName } from "@/hooks/use-user";
import { Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function MarketingNavbar() {
  const { user, isLoading } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      createClient()
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
           setAvatarUrl(data?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await createClient().auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="absolute top-6 left-6 right-6 z-50">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[24px]"
        style={{
          boxShadow:
            "0 0 50px -10px rgba(167, 218, 219, 0.35), 0 4px 16px -4px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="flex items-center gap-2">
          <a href="https://orbit.smartslate.io" className="flex items-center gap-2">
            <img src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png" alt="Smartslate" className="h-6 w-auto object-contain brightness-0 invert opacity-90" />
            <div className="h-4 w-px bg-white/20 mx-2 hidden sm:block"></div>
            <span className="hidden sm:inline font-heading font-bold tracking-widest text-foreground text-xs uppercase pt-0.5">Orbit</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="https://orbit.smartslate.io/courses" className="hover:text-primary transition-colors">Catalog</a>
          <Link href="/enterprise" className="hover:text-primary transition-colors">Enterprise</Link>
          <Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <div className="flex items-center space-x-3 bg-white/5 pr-4 pl-1 py-1 rounded-full border border-white/10">
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/30 bg-primary/20 group-hover:border-primary/50 transition-colors">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    getDisplayName(user).charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mr-2">{getDisplayName(user)}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-bold bg-secondary text-white px-5 py-2.5 rounded-xl hover:bg-secondary/80 transition-all shadow-lg active:scale-[0.97]"
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
