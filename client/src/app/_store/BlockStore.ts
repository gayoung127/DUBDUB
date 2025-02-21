import { create } from "zustand";
import { Asset, AudioFile } from "../_types/studio";

interface SelectedBlockInfo {
  applyToAll: boolean;
  selectedAudioFile?: AudioFile | Asset | null;
  trackId?: number | null;
  blockIndex?: number | null;
}

interface BlockStore {
  selectedBlocks: AudioFile[]; // ✅ 배열로 변경 (다중 선택 지원)
  setSelectedBlocks: (
    callback: (prevBlocks: AudioFile[]) => AudioFile[],
  ) => void;
  clearSelectedBlocks: () => void; // 선택된 블록 초기화 함수 추가

  selectedBlockObj: SelectedBlockInfo;
  setSelectedBlockObj: (block: SelectedBlockInfo) => void;
}

const useBlockStore = create<BlockStore>((set) => ({
  selectedBlocks: [], // ✅ 여러 블록 선택을 위한 배열
  setSelectedBlocks: (callback) =>
    set((state) => ({ selectedBlocks: callback(state.selectedBlocks) })),
  clearSelectedBlocks: () => set({ selectedBlocks: [] }),

  selectedBlockObj: {
    applyToAll: false,
    selectedAudioFile: null,
    trackId: null,
    blockIndex: null,
  },
  setSelectedBlockObj: (block) =>
    set((state) => ({
      selectedBlockObj: { ...state.selectedBlockObj, ...block },
    })),
}));

export default useBlockStore;
