import { create } from "zustand";

interface RecordingStore {
  isRecording: boolean;
  currentRecordingTrackId: number | null;
  audioFiles: Record<number, string[]>;
  offsetMap: Record<string, number>;
  mediaRecorder: MediaRecorder | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  createAudioFile: (userId: number, url: string, startPoint: number) => void;
  startRecording: (trackId: number) => void;
  stopRecording: () => void;
  setMediaRecorder: (recorder: MediaRecorder | null) => void;
  setAudioContext: (audioContext: AudioContext | null) => void;
  setAnalyser: (analyser: AnalyserNode | null) => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  isRecording: false,
  currentRecordingTrackId: null,
  audioFiles: [],
  offsetMap: {},
  mediaRecorder: null,
  audioContext: null,
  analyser: null,
  createAudioFile: (trackId, url, startPoint) =>
    set((state) => {
      const updatedAudioFiles = {
        ...state.audioFiles,
        [trackId]: [...(state.audioFiles[trackId] || []), url],
      };
      const startTimeMap = {
        ...state.offsetMap,
        [url]: startPoint,
      };

      console.log("🔍 녹음 파일 추가됨:", updatedAudioFiles);
      return { audioFiles: updatedAudioFiles, offsetMap: startTimeMap };
    }),
  startRecording: (trackId: number) =>
    set({ isRecording: true, currentRecordingTrackId: trackId }),
  stopRecording: () => set({ isRecording: false }),
  setMediaRecorder: (recorder) => set({ mediaRecorder: recorder }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  setAnalyser: (analyser) => set({ analyser }),
}));
