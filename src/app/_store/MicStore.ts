import { create } from "zustand";

interface MicStore {
  micStatus: Record<number, boolean>;
  toggleMic: (userId: number) => void;
  setMicStatus: (userId: number, isMicOn: boolean) => void;
}

export const useMicStore = create<MicStore>((set) => ({
  micStatus: {},
  toggleMic: (userId) =>
    set((state) => ({
      micStatus: {
        ...state.micStatus,
        [userId]: !state.micStatus[userId],
      },
    })),
  setMicStatus: (userId, isMicOn) =>
    set((state) => ({
      micStatus: {
        ...state.micStatus,
        [userId]: isMicOn,
      },
    })),
}));
