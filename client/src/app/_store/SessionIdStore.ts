import { create } from "zustand";

interface SessionIdState {
  sessionId: string;
  setSessionId: (id: string) => void;
}

export const useSessionIdStore = create<SessionIdState>((set) => ({
  sessionId: "",
  setSessionId: (id) => set({ sessionId: id }),
}));
