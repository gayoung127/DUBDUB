import { useEffect } from "react";
import useStompClient from "./useStompClient";
import { useUserStore, UserStore } from "@/app/_store/UserStore";

export const useStudioMembers = () => {
  const { self, studioMembers, setStudioMembers } = useUserStore();
  const { isConnected, stompClientRef } = useStompClient();

  const publishSelf = () => {
    if (
      !isConnected ||
      !stompClientRef.current ||
      !stompClientRef.current.connected ||
      !self
    )
      return;

    const isAlreadyAdded = studioMembers.some(
      (member) => member.memberId === self.memberId,
    );

    if (isAlreadyAdded) {
      console.log("⚠️ Self already exists in studioMembers. Skipping publish.");
      return;
    }

    // ✅ self는 기존 형태 유지, 서버 전송 시만 변환
    const selfDataForServer = {
      userSessionId: Date.now(), // 서버에서 요구하는 필드, 유니크 ID 생성
      sessionId: "test-session-123", // 임시 세션 ID (필요 시 수정)
      email: self.email,
      memberId: self.memberId,
      nickName: self.nickName,
      position: self.position,
      profileUrl: self.profileUrl,
    };

    console.log("🚀 Publishing self to studioMembers:", selfDataForServer);

    try {
      console.log("📤 Publishing message to STOMP server...");
      console.log("📨 Payload:", JSON.stringify(selfDataForServer));
      console.log(
        "📡 Destination:",
        `/app/studio/${selfDataForServer.sessionId}/users/`,
      );

      stompClientRef.current.publish({
        destination: `/app/studio/${selfDataForServer.sessionId}/users/`,
        body: JSON.stringify(selfDataForServer),
      });

      console.log("✅ STOMP Publish successful!");
    } catch (error) {
      console.error("❌ STOMP Publish failed:", error);
    }
  };

  useEffect(() => {
    const subscribeToMembers = () => {
      if (
        !isConnected ||
        !stompClientRef.current ||
        !stompClientRef.current.connected
      ) {
        console.log("⚠️ STOMP is not connected yet. Skipping subscription.");
        return;
      }

      // ✅ STOMP 디버그 로그 활성화
      stompClientRef.current.debug = (msg) =>
        console.log("🐛 STOMP DEBUG:", msg);

      console.log("📡 Trying to subscribe to STOMP topic...");
      console.log("✅ STOMP Client 상태:", stompClientRef.current);
      console.log(
        "✅ STOMP Client 연결 상태:",
        stompClientRef.current?.connected,
      );
      console.log(
        "🟢 Subscribing to topic:",
        `/topic/studio/test-session-123/users`,
      );

      try {
        const subscription = stompClientRef.current.subscribe(
          `/topic/studio/test-session-123/users`,
          (message) => {
            try {
              console.log("📨 Received STOMP message:", message);

              const data = JSON.parse(message.body);
              console.log("🎭 Received raw Studio Members data:", data);

              // ✅ 서버 데이터 구조에 맞춰 변환 (self는 기존 유지)
              const formattedMembers: UserStore[] = data.map((member: any) => ({
                memberId: Number(member.memberId),
                email: member.email,
                nickName: member.nickName,
                position: member.position,
                profileUrl: member.profileUrl,
              }));

              console.log("✅ Processed Studio Members:", formattedMembers);

              if (self) {
                const updatedMembers = [
                  ...formattedMembers.filter(
                    (m) => m.memberId !== self.memberId,
                  ),
                  self, // self는 기존 형태 유지
                ];
                setStudioMembers(updatedMembers);
                console.log("🎭 Updated Studio Members:", updatedMembers);
              } else {
                setStudioMembers(formattedMembers);
              }
            } catch (error) {
              console.error("❌ Failed to parse STOMP message:", error);
            }
          },
        );

        console.log("✅ Subscription 성공!");

        return () => {
          console.log("📴 Unsubscribing from studio members");
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("❌ STOMP Subscription 실패:", error);
      }
    };

    if (isConnected && stompClientRef.current?.connected) {
      console.log("✅ STOMP is connected. Subscribing now...");
      const unsubscribe = subscribeToMembers();
      publishSelf();

      return () => {
        console.log("📴 Cleaning up subscription...");
        if (unsubscribe) unsubscribe();
      };
    }
  }, [isConnected, stompClientRef.current?.connected, self]);

  return { studioMembers, publishSelf };
};
