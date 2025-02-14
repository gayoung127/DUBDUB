import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const STOMP_URL = "wss://i12a801.p.ssafy.io/api/ws-studio"; // STOMP 서버 URL

const useStompClient = (sessionId: string) => {
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId) return; // sessionId가 없으면 실행 X

    console.log("🔄 useStompClient: sessionId 변경됨", sessionId);

    stompClientRef.current = new Client({
      brokerURL: STOMP_URL,
      connectHeaders: { sessionId },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      reconnectDelay: 0,
      onConnect: () => {
        console.log("✅ useStompClient: 소켓 연결 성공!");
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("❌ useStompClient: 소켓 연결 실패!", frame);
        setIsConnected(false);
      },
    });

    stompClientRef.current.activate();

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.deactivate();
        console.log("🛑 useStompClient: 소켓 연결 해제");
        setIsConnected(false);
      }
    };
  }, [sessionId]); // sessionId가 변경될 때마다 실행됨

  return { stompClientRef, isConnected };
};

export default useStompClient;
