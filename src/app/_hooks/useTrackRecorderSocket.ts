import { useEffect, useRef } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useUserStore } from "../_store/UserStore";
import { Track } from "../_types/studio";

export const useTrackRecorders = (
  trackId: number,
  recorderId: number | undefined, // recorderId는 undefined일 수 있으므로 타입에 반영
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>,
) => {
  const { sessionId } = useSessionIdStore();
  const { stompClientRef, isConnected } = useStompStore();
  const { studioMembers } = useUserStore();

  const subscriptionRef = useRef<any>(null); // 구독을 추적하는 ref

  // sendTrackRecorder(): 트랙 점유자 전송
  const sendTrackRecorder = (trackId: string, recorderId: string | null) => {
    if (!isConnected || !stompClientRef?.connected) {
      console.log("❌ STOMP 연결이 안 되어 있음. 메시지 전송 불가.");
      return;
    }

    const trackRecorder = { trackId, recorderId };

    console.log("📤 트랙 점유자 전송 준비:", trackRecorder);

    stompClientRef.publish({
      destination: `/app/studio/${sessionId}/track/recorder`,
      body: JSON.stringify(trackRecorder),
    });

    console.log("✅ 트랙 점유자 전송 완료:", trackRecorder);
  };

  // useEffect(): 트랙 점유자 목록 구독 및 트랙 상태에 따른 전송
  useEffect(() => {
    if (
      !stompClientRef ||
      !stompClientRef.connected ||
      !isConnected ||
      !sessionId
    ) {
      console.log("⚠️ 트랙 점유 구독 소켓: STOMP 연결되지 않음");
      return;
    }

    console.log("✅ 트랙 점유 구독 시작");

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      console.log("📴 기존 구독 해제");
    }

    subscriptionRef.current = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/track/recorder`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("📥 트랙 점유 구독 소켓: 받은 데이터:", data);

          const member = studioMembers.find(
            (m) => m.memberId === Number(data.recorderId),
          );

          if (member) {
            const updatedTrack = {
              recorderId: member.memberId ?? undefined,
              recorderName: member.nickName ?? undefined,
              recorderRole: member.position ?? undefined,
              recorderProfileUrl: member.profileUrl ?? undefined,
            };

            setTracks((prevTracks) => {
              // 🚨 중복 체크: 동일한 트랙 점유자가 이미 존재하면 업데이트 안 함
              const existingTrack = prevTracks.find(
                (t) => t.trackId === Number(data.trackId),
              );
              if (
                existingTrack &&
                existingTrack.recorderId == updatedTrack.recorderId &&
                existingTrack.recorderName === updatedTrack.recorderName &&
                existingTrack.recorderRole === updatedTrack.recorderRole &&
                existingTrack.recorderProfileUrl ===
                  updatedTrack.recorderProfileUrl
              ) {
                console.log(
                  "⚠️ 트랙 점유 구독 소켓: 동일한 데이터라 업데이트 건너뜀",
                );
                return prevTracks; // 변경 없이 그대로 반환
              }

              // 변경이 있을 경우만 업데이트 진행
              return prevTracks.map((track) =>
                track.trackId === Number(data.trackId)
                  ? { ...track, ...updatedTrack }
                  : track,
              );
            });

            console.log(
              "🔄 트랙 점유 구독 소켓: 업데이트된 트랙 정보:",
              updatedTrack,
            );
          } else {
            console.log(
              "⚠️ 트랙 점유 구독 소켓: 멤버를 찾을 수 없음",
              data.recorderId,
            );
          }
        } catch (error) {
          console.error("❌ 트랙 점유 구독 소켓: 데이터 처리 오류:", error);
        }
      },
    );

    return () => {
      subscriptionRef.current.unsubscribe();
      console.log("📴 트랙 점유 구독 소켓: 구독 해제");
    };
  }, [isConnected, sessionId, setTracks]);

  return { sendTrackRecorder };
};
