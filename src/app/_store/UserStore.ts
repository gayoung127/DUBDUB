import { create } from "zustand";

export interface UserStore {
  memberId: number | null;
  email: string | null;
  nickName: string | null;
  position: string | null;
  profileUrl: string | null;
  studioMembers: UserStore[]; // 👈 추가
  setUser: (user: Partial<UserStore>) => void;
  setStudioMembers: (members: UserStore[]) => void; // 👈 추가
}

export const useUserStore = create<UserStore>((set) => ({
  memberId: null,
  email: null,
  nickName: null,
  position: null,
  profileUrl: null,
  studioMembers: [],
  setUser: (user) => set((state) => ({ ...state, ...user })),
  setStudioMembers: (members) => set(() => ({ studioMembers: members })),
}));
