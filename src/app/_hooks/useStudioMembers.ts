import { useState, useEffect } from "react";
import { UserStore, useUserStore } from "../_store/UserStore";
import useStompClient from "../_utils/socketClient";

export const useStudioMembers = () => {
  const { memberId, email, nickName, position, profileUrl, setUser } =
    useUserStore();
  const [studioMembers, setStudioMembers] = useState<UserStore[]>([]);
  const stompClientRef = useStompClient();

  useEffect(() => {
    const subscribeToMembers = () => {
      if (!stompClientRef.current || !stompClientRef.current.connected) return;

      console.log("📡 Subscribing to studio members...");

      const subscription = stompClientRef.current.subscribe(
        "/topic/studioMembers",
        (message) => {
          try {
            const data: UserStore[] = JSON.parse(message.body);
            setStudioMembers(data);
            console.log("🎭 Received Studio Members:", data);
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
      return unsubscribe;
    }

    return;
  }, [stompClientRef.current?.connected]);

  return studioMembers;
};
