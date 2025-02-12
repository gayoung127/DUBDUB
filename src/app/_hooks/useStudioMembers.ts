import { useState, useEffect } from "react";
import useStompClient from "../_utils/socketClient";

interface Member {
  memberId: number;
  email: string;
  nickName: string;
  position: string;
  profileUrl: string;
}

export const useStudioMembers = () => {
  const [studioMembers, setStudioMembers] = useState<Member[]>([]);
  const stompClientRef = useStompClient();

  useEffect(() => {
    const subscribeToMembers = () => {
      if (!stompClientRef.current || !stompClientRef.current.connected) return;

      console.log("📡 Subscribing to studio members...");

      const subscription = stompClientRef.current.subscribe(
        "/topic/studioMembers", // 서버에서 발행하는 경로
        (message) => {
          try {
            const data: Member[] = JSON.parse(message.body);
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

    // STOMP 연결이 완료되었을 때 구독
    if (stompClientRef.current?.connected) {
      const unsubscribe = subscribeToMembers();
      return unsubscribe;
    }

    return;
  }, [stompClientRef.current?.connected]); // STOMP 연결 여부가 변경될 때만 실행

  return studioMembers;
};
