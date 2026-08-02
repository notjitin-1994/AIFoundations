"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { BADGE_CATALOG } from "@/lib/gamification";

interface BadgeGridProps {
  unlockedBadgeIds: Set<string>;
  badgePage: number;
  onPageChange: (page: number) => void;
}

const TIER_COLORS: Record<string, string> = {
  bronze: "from-orange-900/30 to-amber-700/10 border-orange-500/30 text-orange-400",
  silver: "from-zinc-400/20 to-zinc-600/10 border-zinc-400/40 text-zinc-300",
  gold: "from-yellow-400/20 to-amber-500/10 border-yellow-500/50 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]",
  diamond: "from-teal-400/20 to-cyan-500/10 border-teal-400/60 text-teal-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]",
  obsidian: "from-purple-600/30 to-indigo-900/20 border-purple-500/50 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]",
};

export function BadgeGrid({ unlockedBadgeIds, badgePage, onPageChange }: BadgeGridProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Skill Constellation</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-primary/60">
            {unlockedBadgeIds.size} / 20 Unlocked
          </span>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 bg-zinc-950/50 rounded-full border border-white/5 p-0.5">
            <button
              onClick={() => onPageChange(0)}
              disabled={badgePage === 0}
              className={`p-1 rounded-full transition-colors ${badgePage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white text-zinc-400'}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex gap-1 px-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${badgePage === 0 ? 'bg-primary' : 'bg-white/20'}`} />
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${badgePage === 1 ? 'bg-primary' : 'bg-white/20'}`} />
            </div>
            <button
              onClick={() => onPageChange(1)}
              disabled={badgePage === 1}
              className={`p-1 rounded-full transition-colors ${badgePage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white text-zinc-400'}`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {BADGE_CATALOG.slice(badgePage * 10, (badgePage * 10) + 10).map(badge => {
          const unlocked = unlockedBadgeIds.has(badge.id);
          return (
            <div key={badge.id} className="group relative flex flex-col items-center">
              <div className={`w-[48px] h-[48px] md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl overflow-hidden relative ${
                unlocked
                  ? `bg-gradient-to-br border hover:scale-110 hover:-translate-y-2 z-10 ${TIER_COLORS[badge.tier || 'bronze']}`
                  : "bg-zinc-950/80 border border-white/5 text-zinc-800 grayscale"
              }`}>
                {unlocked && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-150%] translate-y-[150%] group-hover:translate-x-[150%] group-hover:translate-y-[-150%] transition-transform duration-1000 ease-in-out" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] transition-opacity duration-300" />
                  </>
                )}
                <badge.icon className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-opacity duration-500 ${!unlocked ? 'opacity-10 group-hover:opacity-30' : ''}`} strokeWidth={unlocked ? 2 : 1.5} />
              </div>
              <p className={`text-[9px] md:text-[10px] font-bold mt-2 text-center tracking-wider transition-colors duration-300 w-full truncate px-0.5 ${unlocked ? 'text-zinc-200' : 'text-zinc-700 select-none'}`}>
                {unlocked ? badge.name : "Locked"}
              </p>

              {/* Glassmorphism Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50">
                <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-2.5 text-[10px] text-zinc-300 text-center shadow-2xl relative">
                  <span className="block font-bold text-zinc-100 mb-0.5">{badge.name}</span>
                  {unlocked ? (
                    <span className="text-zinc-400">{badge.tooltip || `Unlocked ${badge.name}`}</span>
                  ) : (
                    <span className="text-zinc-400">Locked — {badge.tooltip || "complete the requirements"}</span>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
