import { create } from "zustand";
import { Session, Subscriber, Publisher } from "openvidu-browser";

interface WebRTCState {
  sessionRef: Session | null;
  setSession: (session: Session | null) => void;
  subscribers: Subscriber[];
  setSubscribers: (
    subs: Subscriber[] | ((prev: Subscriber[]) => Subscriber[]),
  ) => void; // ✅ 변경됨
  publisher: Publisher | null;
  setPublisher: (pub: Publisher | null) => void;
  disconnectSession: () => void;
}

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  sessionRef: null,
  setSession: (session) => set({ sessionRef: session }),
  subscribers: [],
  setSubscribers: (subs) =>
    set((state) => ({
      subscribers: typeof subs === "function" ? subs(state.subscribers) : subs, // ✅ 업데이트 함수 허용
    })),
  publisher: null,
  setPublisher: (pub) => set({ publisher: pub }),

  disconnectSession: () => {
    const session = get().sessionRef;
    if (session) {
      console.log("🔌 WebRTC 세션 종료");
      session.disconnect();
      set({ sessionRef: null, subscribers: [], publisher: null });
    }
  },
}));
