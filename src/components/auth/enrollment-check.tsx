"use client";

import { Loader2 } from "lucide-react";

/**
 * Full-screen brand loading state for the enrollment gate. Rendered instead of a
 * blank page (or instead of flashing marketing content) while the access decision
 * is pending. DESIGN.md §1.1.
 */
export function EnrollmentCheckScreen({ label = "Preparing your course" }: { label?: string }) {
  return (
    <div
      className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center justify-center gap-6 relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-20 h-20 rounded-full bg-card/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
        <Loader2 className="w-8 h-8 text-primary animate-spin motion-safe:animate-spin" />
      </div>

      <p className="relative text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
