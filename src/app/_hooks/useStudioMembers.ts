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

    stompClientRef.current.publish({
      destination: `/app/studio/${selfDataForServer.sessionId}/users/`,
      body: JSON.stringify(selfDataForServer),
    });
  };

  useEffect(() => {
    const subscribeToMembers = () => {
      if (
        !isConnected ||
        !stompClientRef.current ||
        !stompClientRef.current.connected
      )
        return;

      console.log("📡 Subscribing to studio members...");

      const subscription = stompClientRef.current.subscribe(
        `/topic/studio/test-session-123/users`,
        (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log("🎭 Received raw Studio Members data:", data);

            // ✅ 서버 데이터 구조에 맞춰 변환 (self는 기존 유지)
            const formattedMembers: UserStore[] = data.map((member: any) => ({
              memberId: Number(member.memberId), // memberId를 숫자로 변환
              email: member.email,
              nickName: member.nickName,
              position: member.position,
              profileUrl: member.profileUrl,
            }));

            console.log("✅ Processed Studio Members:", formattedMembers);

            if (self) {
              // ✅ 기존 self 유지하고 studioMembers만 서버 데이터 형태로 변환
              const updatedMembers = [
                ...formattedMembers.filter((m) => m.memberId !== self.memberId),
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
