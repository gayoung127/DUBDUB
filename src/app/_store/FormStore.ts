// FormStore.ts
import { create } from "zustand";

interface FormState {
  title: string;
  content: string;
  genreTypes: string[];
  categoryTypes: string[];
  castings: string[];
  script: string;
  videoFile: File | null;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setGenreTypes: (genreTypes: string[]) => void;
  setCategoryTypes: (categoryTypes: string[]) => void;
  setCastings: (castings: string[]) => void;
  setScript: (script: string) => void;
  setVideoFile: (videoFile: File | null) => void;
  setRecruitmentData: (data: RecruitmentData) => void; // 모집글 데이터 저장 액션
}

interface RecruitmentData {
  title: string;
  content: string;
  genreTypes: string[];
  categoryTypes: string[];
  castings: string[];
  script?: string; // script 추가
  videoFile?: File | null; // videoFile 추가
}

export const useFormStore = create<FormState>((set) => ({
  title: "",
  content: "",
  genreTypes: [],
  categoryTypes: [],
  castings: [],
  script: "",
  videoFile: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setGenreTypes: (genreTypes) => set({ genreTypes }),
  setCategoryTypes: (categoryTypes) => set({ categoryTypes }),
  setCastings: (castings) => set({ castings }),
  setScript: (script) => set({ script }),
  setVideoFile: (videoFile) => set({ videoFile }),

  // 모집글 데이터 저장 액션
  setRecruitmentData: (data) =>
    set({
      title: data.title,
      content: data.content,
      genreTypes: data.genreTypes || [],
      categoryTypes: data.categoryTypes || [],
      castings: data.castings || [],
      script: data.script || "", // script 저장
      videoFile: data.videoFile || null, // videoFile 저장
    }),
}));
