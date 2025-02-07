import { create } from "zustand";

interface AuthState {
  prevPage: string | null;
  setPrevPage: (url: string) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loggedInUserId: number | null;
  setLoggedInUserId: (userId: number | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  prevPage: null,
  setPrevPage: (url) => set({ prevPage: url }),
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  loggedInUserId: null,
  setLoggedInUserId: (userId) => set({ loggedInUserId: userId }),
  logout: () => set({ accessToken: null, loggedInUserId: null }),
}));
