import { create } from "zustand";
import { PX_PER_SECOND } from "../_types/studio";

interface TimeStore {
  time: number; // 현재 재생 시간 (초)
  isPlaying: boolean;
  setTimeFromPx: (px: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimeStore = create<TimeStore>((set) => {
  let animationFrameId: number | null = null;
  let lastTimestamp = 0;

  const updateTime = (timestamp: number) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000; // ms → 초 변환
    lastTimestamp = timestamp;

    set((state) => ({ time: state.time + deltaTime }));

    if (animationFrameId !== null) {
      animationFrameId = requestAnimationFrame(updateTime);
    }
  };

  return {
    time: 0,
    isPlaying: false,

    setTimeFromPx: (px) => set({ time: px / PX_PER_SECOND }),

    play: () => {
      set({ isPlaying: true });
      if (animationFrameId === null) {
        lastTimestamp = performance.now(); // ✅ 현재 시간을 저장하여 정확한 시간 유지
        animationFrameId = requestAnimationFrame(updateTime);
      }
    },

    pause: () => {
      set({ isPlaying: false });
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    reset: () => {
      set({ time: 0, isPlaying: false });
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      lastTimestamp = 0;
    },
  };
});
