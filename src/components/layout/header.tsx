"use client";

import { useUser, getDisplayName } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { completedModules, activeSlideIndex, totalSlidesInModule, activeModuleId } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await createClient().auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error instanceof Error ? error.message : String(error));
    }
    router.push("/login");
    router.refresh();
  };

  // Prevent hydration mismatch for zustand local storage values
  useEffect(() => {
    setMounted(true);
    if (user) {
      createClient()
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null));
    }
  }, [user]);

  const totalModules = 7;

  // Base progress from fully completed modules
  const baseProgress = (completedModules.length / totalModules) * 100;

  // Granular progress from current module's active slide ONLY if it's not already completed
  const isCurrentModuleCompleted = mounted && completedModules.includes(activeModuleId);
  const currentModuleProgress = isCurrentModuleCompleted
    ? 0
    : (activeSlideIndex / Math.max(1, totalSlidesInModule)) * (100 / totalModules);

  const progressPercent = mounted ? Math.round(Math.min(100, baseProgress + currentModuleProgress)) : 0;

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
      {/* Mobile logo */}
      <div className="flex items-center md:hidden">
        <img
          src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png"
          alt="Smartslate"
          className="h-6 w-auto object-contain"
        />
      </div>

      {/* Progress bar */}
      <div className="hidden md:flex items-center space-x-4 flex-1">
        <div className="h-2 w-full max-w-md bg-accent rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {progressPercent}% Complete
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center space-x-3">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-accent animate-pulse" />
        ) : (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground">{getDisplayName(user)}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/30 bg-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                getDisplayName(user).charAt(0)
              )}
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
