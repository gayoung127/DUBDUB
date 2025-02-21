import { create } from "zustand";

interface MicStore {
  micStatus: Record<number, boolean>;
  setMicStatus: (userId: number, isMicOn: boolean) => void;
}

export const useMicStore = create<MicStore>((set) => ({
  micStatus: {},
  setMicStatus: (userId, isMicOn) =>
    set((state) => ({
      micStatus: {
        ...state.micStatus,
        [userId]: isMicOn,
      },
    })),
}));
