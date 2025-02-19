import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useUserStore } from "@/app/_store/UserStore";
import { useStompStore } from "@/app/_store/StompStore";

const STOMP_URL = "wss://i12a801.p.ssafy.io/api/ws-studio";

const useStompClient = (sessionId: string) => {
  const { stompClientRef, setIsConnected, setStompClient } = useStompStore();

  const { self } = useUserStore();

  useEffect(() => {
    if (!sessionId) return;
    if (!self || !self.memberId) return;
    if (stompClientRef) return;

    const client = new Client({
      brokerURL: STOMP_URL,
      connectHeaders: { sessionId, memberId: self.memberId.toString() }, // ✅ 안전하게 memberId 접근
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
  }, [sessionId, self]);
};

export default useStompClient;
