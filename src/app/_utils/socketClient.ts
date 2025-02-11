"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";

const STOMP_URL = "ws://i12a801.p.ssafy.io:8081/ws-studio"; // STOMP 서버 URL

const useStompClient = () => {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    stompClientRef.current = new Client({
      brokerURL: STOMP_URL,
      connectHeaders: {},
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        console.log("✅ STOMP WebSocket Connected!");
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Broker Error:", frame.headers["message"]);
      },
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
        console.log("🛑 STOMP WebSocket Disconnected");
      }
    };
  }, []);

  return stompClientRef;
};

export default useStompClient;
