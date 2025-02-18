import { useEffect, useCallback } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useTimeStore } from "../_store/TimeStore";
import { useRecordingStore } from "../_store/RecordingStore";

interface PlaybackStatus {
  recording?: boolean;
  playState?: "PLAY" | "PAUSE" | "STOP";
  timelineMarker?: number;
}

export const usePlaySocket = () => {
  const { stompClientRef, isConnected } = useStompStore();
  const { sessionId } = useSessionIdStore();
  const { play, pause, reset, setTimeFromPx } = useTimeStore();
  const { setIsRecording } = useRecordingStore(); // 🔥 `setIsRecording`만 사용

  // 🔥 재생 및 녹음 상태 전송 (isRecording만 주고받음)
  const sendPlaybackStatus = useCallback(
    (playbackStatus: PlaybackStatus) => {
      if (!isConnected || !stompClientRef?.connected || !sessionId) {
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

  // 🔥 소켓 메시지를 받아 `isRecording`을 업데이트
  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) {
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
  ]);

  return { sendPlaybackStatus };
};
