import { create } from 'zustand';

interface NarrationState {
  isPlaying: boolean;
  currentTrackId: string | null;
  durationMs: number;
  progress: number;
  isFinished: boolean;
  play: (trackId: string, durationMs: number) => void;
  pause: () => void;
  resume: () => void;
  setProgress: (progress: number) => void;
  finish: () => void;
  reset: () => void;
  seekTime: number | null;
  seek: (time: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const useNarrationStore = create<NarrationState>((set) => ({
  isPlaying: false,
  currentTrackId: null,
  durationMs: 0,
  progress: 0,
  isFinished: false,
  play: (trackId, durationMs) => set({ 
    isPlaying: true, 
    currentTrackId: trackId, 
    durationMs, 
    progress: 0,
    isFinished: false 
  }),
  pause: () => set({ isPlaying: false }),
  resume: () => set((state) => {
    if (state.currentTrackId && !state.isFinished) {
      return { isPlaying: true };
    }
    return state;
  }),
  setProgress: (progress) => set({ progress }),
  finish: () => set({ isPlaying: false, progress: 100, isFinished: true }),
  reset: () => set({ isPlaying: false, currentTrackId: null, durationMs: 0, progress: 0, isFinished: false, seekTime: null }),
  seekTime: null,
  seek: (time) => set({ seekTime: time }),
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
