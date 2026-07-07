"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function HelpTour({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<Record<string, {top?: string; bottom?: string; left?: string; right?: string}>>({
    sidebar: { top: '20%', left: '300px' },
    assets: { top: '80px', right: '40px' },
    play: { bottom: '120px', left: '320px' },
    nav: { bottom: '120px', right: '40px' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // A simple function to calculate fixed coordinates based on actual DOM elements
    const updateCoords = () => {
      const newCoords = { ...coords };
      
      const sidebarEl = document.getElementById('tour-sidebar');
      if (sidebarEl) {
        const rect = sidebarEl.getBoundingClientRect();
        newCoords.sidebar = { top: `${rect.top + 150}px`, left: `${rect.right + 40}px` };
      }

      const assetsEl = document.getElementById('tour-assets');
      if (assetsEl) {
        const rect = assetsEl.getBoundingClientRect();
        newCoords.assets = { top: `${rect.bottom + 30}px`, right: `${window.innerWidth - rect.right - 20}px` };
      }

      const playEl = document.getElementById('tour-play');
      if (playEl) {
        const rect = playEl.getBoundingClientRect();
        // Position to the left of the play button to avoid overlapping with nav
        newCoords.play = { bottom: `${window.innerHeight - rect.top + 20}px`, right: `${window.innerWidth - rect.left + 20}px`, left: 'auto' };
      }

      const navEl = document.getElementById('tour-nav');
      if (navEl) {
        const rect = navEl.getBoundingClientRect();
        // Align right edge with nav button
        newCoords.nav = { bottom: `${window.innerHeight - rect.top + 20}px`, right: `${window.innerWidth - rect.right - 10}px`, left: 'auto' };
      }

      setCoords(newCoords);
    };

    updateCoords();
    
    // Also update on resize
    window.addEventListener('resize', updateCoords);
    return () => window.removeEventListener('resize', updateCoords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/70 pointer-events-auto"
            onClick={onClose}
          />
          
          <div className="absolute top-6 right-6 pointer-events-auto">
             <button onClick={onClose} className="p-3 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-2xl">
               <X className="w-6 h-6 text-foreground" />
             </button>
          </div>

          {/* Sidebar Tour Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="absolute w-64 pointer-events-auto"
            style={{ top: coords.sidebar.top, left: coords.sidebar.left }}
          >
            {/* Arrow pointing Left */}
            <svg className="absolute -left-[50px] top-4 w-[50px] h-[30px] overflow-visible text-primary" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M 0 0 Q 25 0 50 15" strokeDasharray="4 4" />
               <polygon points="0,0 8,5 8,-5" fill="currentColor" stroke="none" />
            </svg>
            <div className="bg-card border-l-2 border-l-primary border-t border-r border-b border-border shadow-2xl p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider">Course Navigation</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                The sidebar contains your syllabus. You can see all modules and your overall completion progress here.
              </p>
            </div>
          </motion.div>

          {/* Assets Button Tour Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="absolute w-64 pointer-events-auto"
            style={{ top: coords.assets.top, right: coords.assets.right }}
          >
            {/* Arrow pointing Up towards right */}
            <svg className="absolute -top-[40px] right-[20px] w-[30px] h-[40px] overflow-visible text-primary" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M 30 0 Q 15 20 0 40" strokeDasharray="4 4" />
               <polygon points="30,0 20,4 25,-4" fill="currentColor" stroke="none" />
            </svg>
            <div className="bg-card border-t-2 border-t-primary border-r border-l border-b border-border shadow-2xl p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider">Learning Assets</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Access your global Glossary and context-aware Notebook here at any time to review concepts and jot down ideas.
              </p>
            </div>
          </motion.div>

          {/* Play Button Tour Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            className="absolute w-64 pointer-events-auto"
            style={{ bottom: coords.play.bottom, right: coords.play.right }}
          >
            {/* Arrow pointing Down-Right */}
            <svg className="absolute -bottom-[40px] right-[20px] w-[50px] h-[40px] overflow-visible text-primary" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M 0 0 Q 25 0 50 40" strokeDasharray="4 4" />
               <polygon points="50,40 42,32 50,28" fill="currentColor" stroke="none" />
            </svg>
            <div className="bg-card border-b-2 border-b-primary border-t border-r border-l border-border shadow-2xl p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider">Audio Narration</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Click here to play or pause the expert voiceover. Many slides feature synchronized animations that follow the audio!
              </p>
            </div>
          </motion.div>

          {/* Nav Buttons Tour Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            className="absolute w-64 pointer-events-auto"
            style={{ bottom: coords.nav.bottom, right: coords.nav.right }}
          >
            {/* Arrow pointing Down towards right */}
            <svg className="absolute -bottom-[40px] right-[20px] w-[30px] h-[40px] overflow-visible text-primary" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M 30 40 Q 15 20 0 0" strokeDasharray="4 4" />
               <polygon points="30,40 26,30 34,35" fill="currentColor" stroke="none" />
            </svg>
            <div className="bg-card border-b-2 border-b-primary border-t border-r border-l border-border shadow-2xl p-4 rounded-xl">
              <h3 className="font-bold text-foreground mb-1 text-sm uppercase tracking-wider">Slide Controls</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Use these to move forward or backward through the module. Some buttons unlock only after you interact with the content.
              </p>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
