import { create } from "zustand";

interface FilterState {
  timeFilter: Array<string>;
  typeFilter: Array<string>;
  genreFilter: Array<string>;
  createFilter: (group: "time" | "type" | "genre", badge: string) => void;
  deleteFilter: (group: "time" | "type" | "genre", badge: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
  timeFilter: [],
  typeFilter: [],
  genreFilter: [],

  createFilter: (group, badge) =>
    set((state) => {
      const key = `${group}Filter` as
        | "timeFilter"
        | "typeFilter"
        | "genreFilter";
      return {
        [key]: state[key].includes(badge) ? state[key] : [...state[key], badge],
      };
    }),

  deleteFilter: (group, badge) =>
    set((state) => {
      const key = `${group}Filter` as
        | "timeFilter"
        | "typeFilter"
        | "genreFilter";
      return {
        [key]: state[key].filter((b) => b !== badge), // 필터링 로직 수정
      };
    }),
}));

export default useFilterStore;
