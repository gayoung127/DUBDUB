import { create } from "zustand";
import { PX_PER_SECOND } from "../_types/studio";
import { usePlaySocket } from "../_hooks/usePlaySocket"; // ✅ 소켓 훅 가져오기

interface TimeStore {
  time: number; // 현재 재생 시간 (초)
  isPlaying: boolean;
  setTimeFromPx: (px: number) => void;
  setTime: (newTime: number) => void; // ✅ 직접 시간 설정 (소켓용)
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimeStore = create<TimeStore>((set) => {
  let animationFrameId: number | null = null;
  let lastTimestamp = 0;
  const { sendPlaybackStatus } = usePlaySocket(); // ✅ 소켓 기능 가져오기

  const updateTime = (timestamp: number) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000; // ms → 초 변환
    lastTimestamp = timestamp;

    set((state) => {
      const newTime = state.time + deltaTime;
      sendPlaybackStatus({ timelineMarker: newTime }); // ✅ 소켓에 전송
      return { time: newTime };
    });

    if (animationFrameId !== null) {
      animationFrameId = requestAnimationFrame(updateTime);
    }
  };

  return {
    time: 0,
    isPlaying: false,

    setTimeFromPx: (px) => {
      const newTime = px / PX_PER_SECOND;
      set({ time: newTime });
      sendPlaybackStatus({ timelineMarker: newTime }); // ✅ 소켓 전송
    },

    setTime: (newTime) => {
      set({ time: newTime });
      sendPlaybackStatus({ timelineMarker: newTime }); // ✅ 소켓 전송
    },

    play: () => {
      set({ isPlaying: true });
      sendPlaybackStatus({ playState: "PLAY" }); // ✅ 소켓에 PLAY 상태 전송

      if (animationFrameId === null) {
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(updateTime);
      }
    },

    pause: () => {
      set({ isPlaying: false });
      sendPlaybackStatus({ playState: "PAUSE" }); // ✅ 소켓에 PAUSE 상태 전송

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    reset: () => {
      set({ time: 0, isPlaying: false });
      sendPlaybackStatus({ playState: "STOP", timelineMarker: 0 }); // ✅ 소켓에 STOP 전송

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      lastTimestamp = 0;
    },
  };
});
