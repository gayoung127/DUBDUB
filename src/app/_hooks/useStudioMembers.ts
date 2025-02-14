import { useEffect } from "react";
import useStompClient from "./useStompClient";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useUserStore, UserStore } from "@/app/_store/UserStore";

export const useStudioMembers = () => {
  const { sessionId } = useSessionIdStore();
  const { self, studioMembers, setStudioMembers } = useUserStore();
  const { isConnected, stompClientRef } = useStompClient(sessionId);

  const publishSelf = () => {
    if (!isConnected || !stompClientRef.current?.connected || !self) return;

    const isAlreadyAdded = studioMembers.some(
      (member) => member.memberId === self.memberId,
    );

    if (isAlreadyAdded) return;

    const selfDataForServer = {
      userSessionId: Date.now(),
      sessionId: sessionId,
      email: self.email,
      memberId: self.memberId,
      nickName: self.nickName,
      position: self.position,
      profileUrl: self.profileUrl,
    };

    try {
      stompClientRef.current.publish({
        destination: `/app/studio/${selfDataForServer.sessionId}/users/`,
        body: JSON.stringify(selfDataForServer),
      });
    } catch (error) {
      console.error("❌ STOMP Publish failed:", error);
    }
  };

  useEffect(() => {
    const subscribeToMembers = () => {
      if (!isConnected || !stompClientRef.current?.connected) return;

      try {
        const subscription = stompClientRef.current.subscribe(
          `/topic/studio/${sessionId}/users`, // ✅ sessionId 반영됨!
          (message) => {
            try {
              const data = JSON.parse(message.body);
              const formattedMembers: UserStore[] = data.map((member: any) => ({
                memberId: Number(member.memberId),
                email: member.email,
                nickName: member.nickName,
                position: member.position,
                profileUrl: member.profileUrl,
              }));

              if (self) {
                const updatedMembers = [
                  ...formattedMembers.filter(
                    (m) => m.memberId !== self.memberId,
                  ),
                  self,
                ];
                setStudioMembers(updatedMembers);
              } else {
                setStudioMembers(formattedMembers);
              }
            } catch (error) {
              console.error("❌ JSON Parsing Error:", error);
            }
          },
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("❌ STOMP Subscription 실패:", error);
      }
    };

    if (isConnected && stompClientRef.current?.connected) {
      const unsubscribe = subscribeToMembers();
      publishSelf();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [sessionId, isConnected, stompClientRef.current?.connected, self]); // ✅ sessionId 추가됨!

  return { studioMembers, publishSelf };
};
