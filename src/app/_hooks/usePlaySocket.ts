import { useEffect, useCallback, useRef } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useTimeStore } from "../_store/TimeStore";
import { useRecordingStore } from "../_store/RecordingStore";
import { PX_PER_SECOND } from "../_types/studio";

interface PlaybackStatus {
  recording?: boolean;
  playState?: "PLAY" | "PAUSE" | "STOP";
  timelineMarker?: number;
}

export const usePlaySocket = () => {
  const { stompClientRef, isConnected } = useStompStore();
  const { sessionId } = useSessionIdStore();
  const { play, pause, reset, setTimeFromPx } = useTimeStore();
  const { setIsRecording } = useRecordingStore();

  const sendPlaybackStatus = useCallback(
    (playbackStatus: PlaybackStatus) => {
      if (!isConnected || !stompClientRef?.connected) {
        console.warn("⚠️ STOMP 연결이 안 되어 있음. 로컬에서만 실행.");
        return;
      }

      stompClientRef.publish({
        destination: `/app/studio/${sessionId}/playback`,
        body: JSON.stringify(playbackStatus),
      });
    },
    [isConnected, stompClientRef, sessionId],
  );

  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected) {
      console.warn("⚠️ STOMP 연결되지 않음. 소켓 구독 스킵.");
      return;
    }

    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/playback`,
      (message) => {
        const playbackStatus: PlaybackStatus = JSON.parse(message.body);
        console.log(
          "📥 재생 상태 수신 (소켓에서 받은 메시지):",
          playbackStatus,
        );

        if (playbackStatus.recording !== undefined) {
          console.log("🎤 isRecording 업데이트됨:", playbackStatus.recording);
          setIsRecording(playbackStatus.recording);
        }

        switch (playbackStatus.playState) {
          case "PLAY":
            play();
            break;
          case "PAUSE":
            pause();
            break;
          case "STOP":
            reset();
            break;
        }

        if (playbackStatus.timelineMarker !== undefined) {
          setTimeFromPx(playbackStatus.timelineMarker * PX_PER_SECOND);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    isConnected,
    stompClientRef,
    sessionId,
    play,
    pause,
    reset,
    setIsRecording,
    setTimeFromPx,
  ]);

  return { sendPlaybackStatus };
};
