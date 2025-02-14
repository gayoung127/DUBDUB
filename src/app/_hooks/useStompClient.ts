import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useStompStore } from "@/app/_store/StompStore";

const STOMP_URL = "wss://i12a801.p.ssafy.io/api/ws-studio";

const useStompClient = (sessionId: string) => {
  const { stompClientRef, isConnected, setStompClient, setIsConnected } =
    useStompStore();

  useEffect(() => {
    if (!sessionId) return;
    if (stompClientRef) return;

    const client = new Client({
      brokerURL: STOMP_URL,
      connectHeaders: { sessionId },
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ useStompClient: 소켓 연결 성공!");
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("❌ useStompClient: 소켓 연결 실패!", frame);
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
        setIsConnected(false);
        setStompClient(null);
      }
    };
  }, [sessionId]);

  return { stompClientRef, isConnected };
};

export default useStompClient;
