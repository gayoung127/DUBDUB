import { create } from "zustand";

interface FilterState {
  isFiltered: boolean;
  timeFilter: Array<string>;
  categoryFilter: Array<string>;
  genreFilter: Array<string>;
  setIsFiltered: (value: boolean) => Promise<void>;
  createFilter: (group: "time" | "category" | "genre", badge: string) => void;
  deleteFilter: (group: "time" | "category" | "genre", badge: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  isFiltered: false,
  timeFilter: [],
  categoryFilter: [],
  genreFilter: [],

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
      const key = `${group}Filter` as
        | "timeFilter"
        | "categoryFilter"
        | "genreFilter";
      return {
        [key]: state[key].includes(badge) ? state[key] : [...state[key], badge],
      };
    }),

  deleteFilter: (group, badge) =>
    set((state) => {
      const key = `${group}Filter` as
        | "timeFilter"
        | "categoryFilter"
        | "genreFilter";
      return {
        [key]: state[key].filter((b) => b !== badge), // 필터링 로직 수정
      };
    }),
}));

export default useFilterStore;
