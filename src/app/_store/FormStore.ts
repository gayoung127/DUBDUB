// FormStore.ts
import { create } from "zustand";

interface FormState {
  title: string;
  content: string;
  genreTypes: string[];
  categoryTypes: string[];
  castings: string[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setGenreTypes: (genreTypes: string[]) => void;
  setCategoryTypes: (categoryTypes: string[]) => void;
  setCastings: (castings: string[]) => void;
  setRecruitmentData: (data: RecruitmentData) => void; // 추가
}

interface RecruitmentData {
  title: string;
  content: string;
  genreTypes: string[];
  categoryTypes: string[];
  castings: string[];
}

export const useFormStore = create<FormState>((set) => ({
  title: "",
  content: "",
  genreTypes: [],
  categoryTypes: [],
  castings: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setGenreTypes: (genreTypes) => set({ genreTypes }),
  setCategoryTypes: (categoryTypes) => set({ categoryTypes }),
  setCastings: (castings) => set({ castings }),

  // 모집글 데이터 저장 액션
  setRecruitmentData: (data) =>
    set({
      title: data.title,
      content: data.content,
      genreTypes: data.genreTypes,
      categoryTypes: data.categoryTypes,
      castings: data.castings,
    }),
}));
