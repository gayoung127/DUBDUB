import { create } from "zustand";

export interface UserStore {
  memberId: number | null;
  email: string | null;
  nickName: string | null;
  position: string | null;
  profileUrl: string | null;
  setUser: (user: Partial<UserStore>) => void;

  self: UserStore | null;
  setSelf: (user: UserStore) => void;

  studioMembers: UserStore[];
  setStudioMembers: (members: UserStore[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  memberId: null,
  email: null,
  nickName: null,
  position: null,
  profileUrl: null,
  setUser: (user) => set((state) => ({ ...state, ...user })),

  self: null,
  setSelf: (user) =>
    set((state) => ({
      self: { ...state.self, ...user },
    })),

  studioMembers: [],
  setStudioMembers: (members) => set(() => ({ studioMembers: members })),
}));
