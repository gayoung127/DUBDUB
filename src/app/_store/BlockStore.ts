import { create } from "zustand";
import { AudioFile } from "../_types/studio";

interface SelectedBlockInfo {
  applyToAll: boolean;
  selectedAudioFile?: AudioFile | null;
  trackId?: number | null;
  blockIndex?: number | null;
}
interface BlockStore {
  selectedBlock: AudioFile | null;
  setSelectedBlock: (value: AudioFile | null) => void;

  selectedBlockObj: SelectedBlockInfo;
  setSelectedBlockObj: (block: SelectedBlockInfo) => void;
}

const useBlockStore = create<BlockStore>((set) => ({
  selectedBlock: null,
  setSelectedBlock: (value) => {
    set({ selectedBlock: value });
  },

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
