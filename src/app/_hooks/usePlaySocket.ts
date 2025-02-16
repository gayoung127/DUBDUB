import { useEffect, useCallback } from "react";
import { useStompStore } from "../_store/StompStore";
import { useSessionIdStore } from "../_store/SessionIdStore";
import { useTimeStore } from "../_store/TimeStore";
import { useRecordingStore } from "../_store/RecordingStore";

interface PlaybackStatus {
  isRecording?: boolean;
  playState?: "PLAY" | "PAUSE" | "STOP";
  timelineMarker?: number;
  trackId?: number; // 🔥 어떤 트랙에서 녹음이 시작되었는지
}

export const usePlaySocket = () => {
  const { stompClientRef, isConnected } = useStompStore();
  const { sessionId } = useSessionIdStore();
  const { play, pause, reset, setTimeFromPx } = useTimeStore();
  const { startRecording, stopRecording } = useRecordingStore();

  // sendPlaybackStatus(): 재생 및 녹음 상태 전송
  const sendPlaybackStatus = useCallback(
    (playbackStatus: PlaybackStatus) => {
      if (!isConnected || !stompClientRef?.connected || !sessionId) {
        console.error("❌ STOMP 연결이 안 되어 있음. 메시지 전송 불가.");
        return;
      }

      console.log("📤 재생 상태 전송 준비:", playbackStatus);

      stompClientRef.publish({
        destination: `/app/studio/${sessionId}/playback`,
        body: JSON.stringify(playbackStatus),
      });

      console.log("✅ 재생 상태 전송 완료:", playbackStatus);
    },
    [isConnected, stompClientRef, sessionId],
  );

  // 🔥 녹음 상태를 구독하고 `useRecordingStore`와 동기화
  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) {
      console.error("⚠️ STOMP 연결되지 않음.");
      return;
    }

    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/playback`,
      (message) => {
        const playbackStatus: PlaybackStatus = JSON.parse(message.body);
        console.log("📥 재생 상태 수신:", playbackStatus);

        // 🎵 재생 관련 로직
        switch (playbackStatus.playState) {
          case "PLAY":
            play();
            break;
          case "PAUSE":
            pause();
            break;
          case "STOP":
            reset();
            stopRecording(); // 녹음도 중지
            break;
        }

        // 🎤 녹음 관련 로직
        if (playbackStatus.isRecording) {
          if (playbackStatus.trackId !== undefined) {
            startRecording(playbackStatus.trackId);
          }
        } else {
          stopRecording();
        }
      },
    );

    return () => {
      subscription.unsubscribe();
      console.log("📴 재생 상태 구독 해제");
    };
  }, [
    isConnected,
    stompClientRef,
    sessionId,
    play,
    pause,
    reset,
    setTimeFromPx,
    startRecording,
    stopRecording,
  ]);

  return { sendPlaybackStatus };
};
