import { create } from "zustand";

interface RecordingStore {
  isRecording: boolean;
  audioFiles: Record<number, string[]>;
  offsetMap: Record<string, number>;
  addAudioFile: (userId: number, url: string, startPoint: number) => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  isRecording: false,
  audioFiles: [],
  offsetMap: {},
  addAudioFile: (userId, url, startPoint) =>
    set((state) => {
      const updatedAudioFiles = {
        ...state.audioFiles,
        [userId]: [...(state.audioFiles[userId] || []), url],
      };
      const startTimeMap = {
        ...state.offsetMap,
        [url]: startPoint,
      };

      console.log("🔍 녹음 파일 추가됨:", updatedAudioFiles);
      return { audioFiles: updatedAudioFiles, offsetMap: startTimeMap };
    }),
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
}));
