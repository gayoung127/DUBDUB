import { create } from "zustand";

const PX_PER_SECOND = 80; // ✅ 1초 = 80px 고정

interface TimeStore {
  time: number; // 현재 재생 시간 (초)
  setTimeFromPx: (px: number) => void; // px 값을 받아서 초로 변환하는 함수
}

export const useTimeStore = create<TimeStore>((set) => ({
  time: 0, // 초기값: 0초
  setTimeFromPx: (px) => set({ time: px / PX_PER_SECOND }), // ✅ px → 초 변환
}));
