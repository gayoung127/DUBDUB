import { useEffect, useRef } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useUserStore } from "../_store/UserStore";
import { Track } from "../_types/studio";

export const useTrackRecorders = (
  trackId: number,
  recorderId: number | undefined,
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>,
) => {
  const { sessionId } = useSessionIdStore();
  const { stompClientRef, isConnected } = useStompStore();
  const { studioMembers } = useUserStore();

  const subscriptionRef = useRef<any>(null);

  // sendTrackRecorder(): 트랙 점유자 전송
  const sendTrackRecorder = (trackId: string, recorderId: string) => {
    if (!isConnected || !stompClientRef?.connected) {
      return;
    }

    const trackRecorder = { trackId, recorderId };

    stompClientRef.publish({
      destination: `/app/studio/${sessionId}/track/recorder`,
      body: JSON.stringify(trackRecorder),
    });
  };

  // useEffect(): 트랙 점유자 목록 구독 및 트랙 상태에 따른 전송
  useEffect(() => {
    if (
      !stompClientRef ||
      !stompClientRef.connected ||
      !isConnected ||
      !sessionId
    ) {
      return;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/track/recorder`,
      (message) => {
        try {
          const data = JSON.parse(message.body);

          const recorderIdNum = Number(data.recorderId);
          if (Number.isNaN(recorderIdNum)) {
            return;
          }

          const member = studioMembers.find(
            (m) => m.memberId === recorderIdNum,
          );

          if (member) {
            const updatedTrack = {
              recorderId: member.memberId ?? undefined,
              recorderName: member.nickName ?? undefined,
              recorderRole: member.position ?? undefined,
              recorderProfileUrl: member.profileUrl ?? undefined,
            };

            setTracks((prevTracks) => {
              const existingTrack = prevTracks.find(
                (t) => t.trackId === Number(data.trackId),
              );

              if (
                existingTrack &&
                existingTrack.recorderId === updatedTrack.recorderId &&
                existingTrack.recorderName === updatedTrack.recorderName &&
                existingTrack.recorderRole === updatedTrack.recorderRole &&
                existingTrack.recorderProfileUrl ===
                  updatedTrack.recorderProfileUrl
              ) {
                return prevTracks;
              }

              return prevTracks.map((track) =>
                track.trackId === Number(data.trackId)
                  ? { ...track, ...updatedTrack }
                  : track,
              );
            });
          } else {
          }
        } catch (error) {
          console.error(
            "❌ [STOMP 메시지 오류] 데이터 처리 중 예외 발생:",
            error,
          );
        }
      },
    );

    return () => {
      subscriptionRef.current.unsubscribe();
    };
  }, [isConnected, sessionId, setTracks, studioMembers]); // ✅ studioMembers 추가

  // 트랙 상태 변경 시 자동으로 서버로 전송
  useEffect(() => {
    if (recorderId !== undefined) {
      const currentTrack = studioMembers.find((m) => m.memberId === recorderId);

      if (currentTrack && currentTrack.memberId) {
        sendTrackRecorder(trackId.toString(), currentTrack.memberId.toString());
      }
    }
  }, [trackId, recorderId, studioMembers]);

  return { sendTrackRecorder };
};
