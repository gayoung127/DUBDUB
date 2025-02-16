import { create } from "zustand";

interface RecordingStore {
  isRecording: boolean;
  currentRecordingTrackId: number | null;
  audioFiles: Record<number, string[]>;
  offsetMap: Record<string, number>;
  mediaRecorder: MediaRecorder | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  setAudioFiles: (
    updateFn: (prev: Record<number, string[]>) => Record<number, string[]>,
  ) => void;
  createAudioFile: (trackId: number, url: string, startPoint: number) => void;
  startRecording: (trackId: number) => void;
  stopRecording: () => void;
  setIsRecording: (isRecording: boolean) => void; // 🔥 `isRecording`을 직접 설정할 수 있는 함수 추가
  setMediaRecorder: (recorder: MediaRecorder | null) => void;
  setAudioContext: (audioContext: AudioContext | null) => void;
  setAnalyser: (analyser: AnalyserNode | null) => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  isRecording: false,
  currentRecordingTrackId: null,
  audioFiles: {},
  offsetMap: {},
  mediaRecorder: null,
  audioContext: null,
  analyser: null,
  setAudioFiles: (updateFn) =>
    set((state) => ({
      audioFiles: updateFn(state.audioFiles),
    })),
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
  stopRecording: () =>
    set({ isRecording: false, currentRecordingTrackId: null }),
  setIsRecording: (isRecording: boolean) => set({ isRecording }), // 🔥 소켓에서 받은 `isRecording`을 설정하는 함수 추가
  setMediaRecorder: (recorder) => set({ mediaRecorder: recorder }),
  setAudioContext: (ctx) => set({ audioContext: ctx }),
  setAnalyser: (analyser) => set({ analyser }),
}));
