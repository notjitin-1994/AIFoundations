"use client";

import { useUser, getDisplayName } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/progress";
import { useNotesStore } from "@/store/notes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, User, LogOut } from "lucide-react";
import { COURSE_MODULES } from "@/lib/course-data";
import { computeCourseProgress } from "@/lib/progress-metrics";
import type { CourseTotals } from "@/lib/progress-metrics";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { completedModules, moduleProgressMap, completedSlides } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await Promise.all([
        useProgressStore.getState().flushSyncProgress(),
        useNotesStore.getState().flushSyncNotes()
      ]);
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

  const courseTotals = COURSE_MODULES.reduce<CourseTotals>((acc, mod) => ({ ...acc, [mod.id]: mod.slideCount }), {});
  let progressPercent = 0;
  if (mounted) {
    progressPercent = computeCourseProgress(
      {
        completedModules,
        completedSlides,
        moduleProgressMap,
      },
      courseTotals
    ).percent;
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/30 bg-primary/20">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    getDisplayName(user).charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[140px] truncate">{getDisplayName(user)}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-card/95 backdrop-blur-xl border border-white/10">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{getDisplayName(user)}</span>
                <span className="text-xs font-normal text-muted-foreground truncate">{user?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild>
                <Link href="https://orbit.smartslate.io/" className="flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" /> {isLoggingOut ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
