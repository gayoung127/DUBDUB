import { create } from "zustand";

interface RecordingStore {
  isRecording: boolean;
  audioFiles: Record<number, string[]>;
  addAudioFile: (userId: number, url: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  isRecording: false,
  audioFiles: [],
  addAudioFile: (userId, url) =>
    set((state) => {
      const updatedAudioFiles = {
        ...state.audioFiles,
        [userId]: [...(state.audioFiles[userId] || []), url],
      };

      console.log("🔍 녹음 파일 추가됨:", updatedAudioFiles);
      return { audioFiles: updatedAudioFiles };
    }),
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
}));
