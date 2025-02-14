"use client";

import { useEffect, useRef, useState } from "react";

import { Client } from "@stomp/stompjs";

import { useSessionIdStore } from "../_store/SessionIdStore";

const STOMP_URL = "wss://i12a801.p.ssafy.io/api/ws-studio"; // STOMP 서버 URL

const sessionId = useSessionIdStore.getState().sessionId;

const useStompClient = () => {
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    stompClientRef.current = new Client({
      brokerURL: STOMP_URL,
      connectHeaders: { sessionId: sessionId },
      // debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        console.log("✅ STOMP WebSocket Connected!");
        setIsConnected(true); // 연결 성공 시 상태 변경
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Broker Error:", frame.headers["message"]);
        setIsConnected(false);
      },
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
        console.log("🛑 STOMP WebSocket Disconnected");
        setIsConnected(false);
      }
    };
  }, []);

  return { stompClientRef, isConnected };
};

export default useStompClient;
