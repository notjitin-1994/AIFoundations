"use client";

import { useUser } from "@/hooks/use-user";
import { useProgressStore } from "@/store/progress";
import { useEffect, useState } from "react";
import { Library, HelpCircle } from "lucide-react";
import { AssetsModal } from "./assets-modal";
import { HelpTour } from "./help-tour";

export function Header() {
  const { user, isLoading } = useUser();
  const { completedModules, activeSlideIndex, totalSlidesInModule } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Prevent hydration mismatch for zustand local storage values
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalModules = 8;
  
  // Base progress from fully completed modules
  const baseProgress = (completedModules.length / totalModules) * 100;
  
  // Granular progress from current module's active slide
  const currentModuleProgress = ((activeSlideIndex + 1) / Math.max(1, totalSlidesInModule)) * (100 / totalModules);
  
  const progressPercent = mounted ? Math.round(Math.min(100, baseProgress + currentModuleProgress)) : 0;

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
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/30">
              {user?.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      <AssetsModal isOpen={isAssetsOpen} onClose={() => setIsAssetsOpen(false)} />
      <HelpTour isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </header>
  );
}
