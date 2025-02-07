import { create } from "zustand";

interface UserStore {
  memberId: number | null;
  email: string | null;
  position: string | null;
  profileUrl: string | null;
  setUser: (user: Partial<UserStore>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  memberId: null,
  email: null,
  position: null,
  profileUrl: null,
  setUser: (user) => set((state) => ({ ...state, ...user })),
}));
