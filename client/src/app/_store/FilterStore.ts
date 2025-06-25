import { create } from "zustand";

interface FilterState {
  isFiltered: boolean;
  categoryFilter: Array<string>;
  genreFilter: Array<string>;
  keyword: string;
  setIsFiltered: (value: boolean) => Promise<void>;
  createFilter: (group: "category" | "genre", badge: string) => void;
  deleteFilter: (group: "category" | "genre", badge: string) => void;
  setKeyword: (value: string) => void;
  initiateFilter: () => void;
}

const useFilterStore = create<FilterState>((set) => ({
  isFiltered: false,
  categoryFilter: [],
  genreFilter: [],
  keyword: "",

  setIsFiltered: async (value) => {
    await new Promise<void>((resolve) => {
      set(() => ({
        isFiltered: value,
      }));
      resolve();
    });
  },

  createFilter: (group, badge) =>
    set((state) => {
      const key = `${group}Filter` as "categoryFilter" | "genreFilter";
      return {
        [key]: state[key].includes(badge) ? state[key] : [...state[key], badge],
      };
    }),

  deleteFilter: (group, badge) =>
    set((state) => {
      const key = `${group}Filter` as "categoryFilter" | "genreFilter";
      return {
        [key]: state[key].filter((b) => b !== badge), // 필터링 로직 수정
      };
    }),

  setKeyword: (value) => {
    set({ keyword: value });
  },

  initiateFilter: () => {
    set({ keyword: "", categoryFilter: [], genreFilter: [] });
  },
}));

export default useFilterStore;
