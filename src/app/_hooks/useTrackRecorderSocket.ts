import { useEffect, useState } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useUserStore } from "../_store/UserStore";
import { Track } from "../_types/studio";

export const useTrackRecorders = (
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>,
) => {
  const { sessionId } = useSessionIdStore();
  const { stompClientRef, isConnected } = useStompStore();
  const { studioMembers } = useUserStore();

  // `stompClientRef` 상태를 추적할 useState 추가
  const [clientConnected, setClientConnected] = useState<boolean>(isConnected);

  // sendTrackRecorder(): 트랙 점유자 전송
  const sendTrackRecorder = (trackId: string, recorderId: string) => {
    const trackRecorder = {
      trackId: trackId,
      recorderId: recorderId,
    };

    stompClientRef?.publish({
      destination: `/app/studio/${sessionId}/track/recorder`,
      body: JSON.stringify(trackRecorder),
    });
  };

  // useEffect(): 트랙 점유자 목록 구독
  useEffect(() => {
    // STOMP 연결 상태가 변경될 때마다 상태를 업데이트
    if (isConnected !== clientConnected) {
      setClientConnected(isConnected);
    }

    // stompClient 연결이 되어 있는지 확인
    if (!stompClientRef || !stompClientRef?.connected || !isConnected) {
      console.log("트랙 점유 구독 소켓: STOMP 연결되지 않음");
      return;
    }

    // sessionId가 유효한지 확인
    if (!sessionId) {
      console.error("트랙 점유 구독 소켓: Session ID가 없습니다.");
      return;
    }

    console.log("혹시 트랙 점유 구독이 안 되는거냐?");

    // 구독 시작
    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/track/recorder`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("트랙 점유 구독 소켓: 받은 데이터:", data);

          const member = studioMembers.find(
            (member) => member.memberId === data.recorderId,
          );

          if (member) {
            const updatedTrack = {
              recorderId: member.memberId ?? undefined,
              recorderName: member.nickName ?? undefined,
              recorderRole: member.position ?? undefined,
              recorderProfileUrl: member.profileUrl ?? undefined,
            };

            setTracks((prevTracks) =>
              prevTracks.map((track) =>
                track.trackId === data.trackId
                  ? { ...track, ...updatedTrack }
                  : track,
              ),
            );

            console.log(
              "트랙 점유 구독 소켓: 업데이트된 트랙 정보:",
              updatedTrack,
            );
          } else {
            console.log(
              "트랙 점유 구독 소켓: 멤버를 찾을 수 없음:",
              data.recorderId,
            );
          }
        } catch (error) {
          console.error(
            "트랙 점유 구독 소켓: 트랙 점유자 데이터 처리 오류:",
            error,
          );
        }
      },
    );

    // 구독 종료 시 처리
    return () => {
      subscription.unsubscribe();
    };
  }, [clientConnected, stompClientRef, sessionId, studioMembers, setTracks]);

  return { sendTrackRecorder };
};
