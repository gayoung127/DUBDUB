import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useStompStore } from "@/app/_store/StompStore";
import { useUserStore } from "@/app/_store/UserStore";

const STOMP_URL = "wss://i12a801.p.ssafy.io/api/ws-studio";

const useStompClient = (sessionId: string) => {
  const { stompClientRef, setIsConnected, setStompClient } = useStompStore();

  const { self } = useUserStore();

  useEffect(() => {
    if (!sessionId) return;
    if (!self || !self.memberId) return;
    if (stompClientRef) return;

    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectStomp = () => {
      console.log("🔄 Stomp 클라이언트 연결 시도...");
      const client = new Client({
        brokerURL: STOMP_URL,
        connectHeaders: {
          sessionId,
          memberId: (self?.memberId ?? 0).toString(),
        },
        reconnectDelay: 5000,

        onConnect: () => {
          console.log("✅ Stomp 클라이언트 연결 성공!");
          setIsConnected(true);
        },

        onStompError: (frame) => {
          console.error("❌ Stomp 에러 발생!", frame);
          setIsConnected(false);
          retryConnection();
        },

        onWebSocketClose: () => {
          console.warn("⚠️ Stomp 웹소켓 닫힘. 재연결 시도...");
          setIsConnected(false);
          retryConnection();
        },
      });

      client.activate();
      setStompClient(client);
    };

    const retryConnection = () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        console.log("🔁 Stomp 재연결 시도...");
        connectStomp();
      }, 5000);
    };

    connectStomp();

    return () => {
      const client = useStompStore.getState().stompClientRef;
      if (client && typeof client.deactivate === "function") {
        client.deactivate();
      }
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      setIsConnected(false);
      setStompClient(null);
    };
  }, [sessionId, self]);
};

export default useStompClient;
