import React, { useEffect } from "react";

import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useUserStore } from "../_store/UserStore";
import { Track } from "../_types/studio";

// interface TrackRecorderData {
//   trackId: number;
//   recorderId: number;
// }

export const useTrackRecorders = (
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>,
) => {
  const { sessionId } = useSessionIdStore();
  const { stompClientRef, isConnected } = useStompStore();
  const { studioMembers } = useUserStore();

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
    if (!isConnected || !stompClientRef?.connected) return;

    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/track/recorder`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
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
                  : { ...track },
              ),
            );

            console.log("잘 되냐: ", updatedTrack);
          }
          console.log("소켓에서 불러온 데이터: ", data);
        } catch (error) {
          console.log("트랙 점유자 데이터 처리 오류: ", error);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isConnected, sessionId, stompClientRef]);

  return { sendTrackRecorder };
};
