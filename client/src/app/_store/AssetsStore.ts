import { create } from "zustand";
import { AudioFile } from "../_types/studio";

interface AssetsStore {
  audioFiles: AudioFile[]; // AudioFile 배열
  addAudioFile: (audioFile: AudioFile) => void; // AudioFile 추가
  deleteAudioFile: (id: string) => void; // AudioFile 삭제
}

export const useAssetsStore = create<AssetsStore>((set) => ({
  audioFiles: [],

  addAudioFile: (audioFile: AudioFile) =>
    set((state) => ({
      audioFiles: [...state.audioFiles, audioFile],
    })),

  deleteAudioFile: (id: string) =>
    set((state) => ({
      audioFiles: state.audioFiles.filter((file) => file.id !== id),
    })),
}));
