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
      // heartbeat 설정
      heartbeatIncoming: 0, // 들어오는 heartbeat 비활성화
      heartbeatOutgoing: 0, // 나가는 heartbeat 비활성화
      // 재연결 설정
      reconnectDelay: 0, // 자동 재연결 비활성화
      onConnect: () => {
        console.log("useStompClient : 소켓 연결에 성공했습니다!");
        setIsConnected(true); // 연결 성공 시 상태 변경
      },
      onStompError: (frame) => {
        console.error("useStompClient : 소켓 연결에 실패했습니다!");
        setIsConnected(false);
      },
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
        console.log("useStompClient : 소켓 연결을 중지했습니다.");
        setIsConnected(false);
      }
    };
  }, []);

  return { stompClientRef, isConnected };
};

export default useStompClient;
