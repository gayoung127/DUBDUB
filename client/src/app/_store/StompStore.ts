import { create } from "zustand";
import { Client } from "@stomp/stompjs";

interface StompStore {
  stompClientRef: Client | null;
  isConnected: boolean;
  setStompClient: (client: Client | null) => void;
  setIsConnected: (status: boolean) => void;
}

export const useStompStore = create<StompStore>((set) => ({
  stompClientRef: null,
  isConnected: false,
  setStompClient: (client) => set({ stompClientRef: client }),
  setIsConnected: (status) => set({ isConnected: status }),
}));
