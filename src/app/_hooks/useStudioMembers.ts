import { useEffect } from "react";
import useStompClient from "./useStompClient";
import { useUserStore } from "@/app/_store/UserStore";

export const useStudioMembers = () => {
  const { self, studioMembers, setStudioMembers } = useUserStore();
  const { isConnected, stompClientRef } = useStompClient();

  const publishSelf = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected || !self)
      return;

    const isAlreadyAdded = studioMembers.some(
      (member) => member.memberId === self.memberId,
    );
    if (isAlreadyAdded) {
      console.log("⚠️ Self already exists in studioMembers. Skipping publish.");
      return;
    }

    console.log("🚀 Publishing self to studioMembers:", self);

    stompClientRef.current.publish({
      destination: "/app/studioMembers", // 서버에서 수신하는 경로
      body: JSON.stringify(self), // 내 정보 전송
    });
  };

  useEffect(() => {
    const subscribeToMembers = () => {
      if (!stompClientRef.current || !stompClientRef.current.connected) return;

      console.log("📡 Subscribing to studio members...");

      const subscription = stompClientRef.current.subscribe(
        "/topic/studioMembers",
        (message) => {
          try {
            const data = JSON.parse(message.body);
            setStudioMembers(data);

            if (self) {
              const updatedMembers = [
                ...studioMembers.filter((m) => m.memberId !== self?.memberId),
                self,
              ];

              setStudioMembers(updatedMembers);
              console.log("🎭 Received Studio Members:", updatedMembers);
            }
          } catch (error) {
            console.error("❌ Failed to parse STOMP message:", error);
          }
        },
      );

      return () => {
        subscription.unsubscribe();
        console.log("📴 Unsubscribed from studio members");
      };
    };

    if (stompClientRef.current?.connected) {
      const unsubscribe = subscribeToMembers();
      publishSelf();
      return unsubscribe;
    }

    return;
  }, [stompClientRef.current?.connected, self]);

  return { studioMembers, publishSelf };
};
