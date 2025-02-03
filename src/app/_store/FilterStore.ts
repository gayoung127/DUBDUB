import { create } from "zustand";

interface FilterState {
  timeFilter: Array<string>;
  categoryFilter: Array<string>;
  genreFilter: Array<string>;
  createFilter: (group: "time" | "category" | "genre", badge: string) => void;
  deleteFilter: (group: "time" | "category" | "genre", badge: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  timeFilter: [],
  categoryFilter: [],
  genreFilter: [],

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
