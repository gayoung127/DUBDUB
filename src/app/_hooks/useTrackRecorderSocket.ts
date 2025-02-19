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

  console.log(
    "🎤 [useTrackRecorders] 훅 실행됨 - trackId:",
    trackId,
    "recorderId:",
    recorderId,
  );

  // sendTrackRecorder(): 트랙 점유자 전송
  const sendTrackRecorder = (trackId: string, recorderId: string) => {
    console.log(
      "📤 [sendTrackRecorder] 실행 - trackId:",
      trackId,
      "recorderId:",
      recorderId,
    );

    if (!isConnected || !stompClientRef?.connected) {
      console.log(
        "❌ [sendTrackRecorder] STOMP 연결이 안 되어 있음. 메시지 전송 불가.",
      );
      return;
    }

    const trackRecorder = { trackId, recorderId };
    console.log("📤 [sendTrackRecorder] 트랙 점유자 전송 준비:", trackRecorder);

    stompClientRef.publish({
      destination: `/app/studio/${sessionId}/track/recorder`,
      body: JSON.stringify(trackRecorder),
    });

    console.log("✅ [sendTrackRecorder] 트랙 점유자 전송 완료:", trackRecorder);
  };

  // useEffect(): 트랙 점유자 목록 구독 및 트랙 상태에 따른 전송
  useEffect(() => {
    console.log(
      "🔄 [useEffect] 트랙 점유 구독 시작 - STOMP 상태:",
      isConnected,
      "sessionId:",
      sessionId,
    );

    if (
      !stompClientRef ||
      !stompClientRef.connected ||
      !isConnected ||
      !sessionId
    ) {
      console.log(
        "⚠️ [useEffect] 트랙 점유 구독 소켓: STOMP 연결되지 않음. 구독하지 않음.",
      );
      return;
    }

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      console.log("📴 [useEffect] 기존 STOMP 구독 해제됨");
    }

    console.log("✅ [useEffect] 새로운 STOMP 구독 시작");

    subscriptionRef.current = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/track/recorder`,
      (message) => {
        try {
          console.log("📥 [STOMP 메시지 수신] 원본 메시지:", message.body);
          const data = JSON.parse(message.body);
          console.log("📥 [STOMP 메시지 파싱] 받은 데이터:", data);

          const recorderIdNum = Number(data.recorderId);
          if (Number.isNaN(recorderIdNum)) {
            console.log(
              "❌ [STOMP 메시지 오류] recorderId가 유효한 숫자가 아님:",
              data.recorderId,
            );
            return;
          }

          console.log("🔍 [STOMP 메시지] studioMembers 배열:", studioMembers);
          const member = studioMembers.find(
            (m) => m.memberId === recorderIdNum,
          );

          if (member) {
            console.log(
              "✅ [STOMP 메시지] 해당 recorderId에 대한 멤버 찾음:",
              member,
            );

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
                console.log(
                  "⚠️ [STOMP 메시지] 동일한 데이터라 업데이트 건너뜀",
                );
                return prevTracks;
              }

              console.log(
                "🔄 [STOMP 메시지] 트랙 업데이트 진행:",
                updatedTrack,
              );

              return prevTracks.map((track) =>
                track.trackId === Number(data.trackId)
                  ? { ...track, ...updatedTrack }
                  : track,
              );
            });

            console.log("✅ [STOMP 메시지] 트랙 업데이트 완료");
          } else {
            console.log(
              "⚠️ [STOMP 메시지] 멤버를 찾을 수 없음. recorderId:",
              data.recorderId,
            );
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
      console.log("📴 [useEffect] 트랙 점유 구독 해제됨");
    };
  }, [isConnected, sessionId, setTracks, studioMembers]); // ✅ studioMembers 추가

  // 트랙 상태 변경 시 자동으로 서버로 전송
  useEffect(() => {
    console.log(
      "🛠 [useEffect] 트랙 상태 변경 감지됨 - trackId:",
      trackId,
      "recorderId:",
      recorderId,
    );

    if (recorderId !== undefined) {
      console.log("🔍 [useEffect] recorderId 존재 - studioMembers 조회 시작");
      const currentTrack = studioMembers.find((m) => m.memberId === recorderId);

      if (currentTrack && currentTrack.memberId) {
        console.log(
          "✅ [useEffect] recorderId에 해당하는 멤버 찾음:",
          currentTrack,
        );
        sendTrackRecorder(trackId.toString(), currentTrack.memberId.toString());
      } else {
        console.log(
          "⚠️ [useEffect] recorderId에 해당하는 멤버를 찾을 수 없음",
          recorderId,
        );
      }
    } else {
      console.log(
        "⚠️ [useEffect] recorderId가 undefined 상태. 서버 전송 안 함.",
      );
    }
  }, [trackId, recorderId, studioMembers]);

  return { sendTrackRecorder };
};
