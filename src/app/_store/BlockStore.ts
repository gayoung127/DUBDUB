import { create } from "zustand";
import { AudioFile } from "../_types/studio";

interface BlockStore {
  selectedBlock: AudioFile | null;
  setSelectedBlock: (value: AudioFile) => void;
}

const useBlockStore = create<BlockStore>((set) => ({
  selectedBlock: null,
  setSelectedBlock: (value) => {
    set({ selectedBlock: value });
  },
}));

export default useBlockStore;
