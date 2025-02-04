import { create } from "zustand";

interface StreamStore {
  videoStream: MediaStream | null;
  setVideoStream: (stream: MediaStream) => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  videoStream: null,
  setVideoStream: (stream) => set({ videoStream: stream }),
}));
