import { create } from "zustand";

interface MicStore {
  micStatusMap: Record<number, boolean>;
  toggleMic: (userId: number) => void;
  setMicStatus: (userId: number, isMicOn: boolean) => void;
}

export const useMicStore = create<MicStore>((set) => ({
  micStatusMap: {},
  toggleMic: (userId) =>
    set((state) => ({
      micStatusMap: {
        ...state.micStatusMap,
        [userId]: !state.micStatusMap[userId],
      },
    })),
  setMicStatus: (userId, isMicOn) =>
    set((state) => ({
      micStatusMap: {
        ...state.micStatusMap,
        [userId]: isMicOn,
      },
    })),
}));
