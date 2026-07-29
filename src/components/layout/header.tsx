"use client";

import { useUser, getDisplayName } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useProgressStore } from "@/store/progress";
import { useEffect, useState } from "react";
import { Library, HelpCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { AssetsModal } from "./assets-modal";
import { HelpTour } from "./help-tour";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Header() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { completedModules, activeSlideIndex, totalSlidesInModule, activeModuleId, resetProgress } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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

  const handleRestart = () => {
    resetProgress();
    router.push("/courses/aifoundations-concept2application/modules/0");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex items-center md:hidden">
        <img src="https://hxxvxsmengeoazuywpjm.supabase.co/storage/v1/object/public/brand-assets/logo.png" alt="Smartslate" className="h-6 w-auto object-contain" />
      </div>
      <div className="hidden md:flex items-center space-x-4 flex-1">
        <div className="h-2 w-full max-w-md bg-accent rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {progressPercent}% Complete
        </span>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Restart Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-background/50 hover:bg-destructive/10 border border-border/50 hover:border-destructive/40 text-muted-foreground hover:text-destructive transition-all duration-300 ease-out shadow-sm hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95 backdrop-blur-md"
              title="Restart Course"
            >
              <RotateCcw className="w-[18px] h-[18px] group-hover:-rotate-90 transition-transform duration-300 ease-out" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-white/10 text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading">Restart Course?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This will permanently erase all your progress, project spine choices, and quiz results. You will be redirected to the Orientation module to start from scratch. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 hover:text-foreground">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestart} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Restart Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Help Button */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="group flex items-center justify-center w-9 h-9 rounded-full bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all duration-300 ease-out shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] active:scale-95 backdrop-blur-md"
          title="Guided Tour"
        >
          <HelpCircle className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300 ease-out" />
        </button>

        {/* Assets Button */}
        <button
          id="tour-assets"
          onClick={() => setIsAssetsOpen(true)}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/40 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 ease-out shadow-sm hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] active:scale-95 backdrop-blur-md"
        >
          <Library className="w-4 h-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ease-out" />
          <span className="hidden sm:inline tracking-wide font-semibold">Assets</span>
        </button>

        <div className="h-4 w-px bg-border hidden sm:block" />

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

      <AssetsModal isOpen={isAssetsOpen} onClose={() => setIsAssetsOpen(false)} />
      <HelpTour isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
}
