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

  // 🔥 현재 사용자가 직접 타임라인을 조정 중인지 추적하는 ref
  const isAdjustingTimeline = useRef(false);

  // ✅ 소켓으로 재생 & 녹음 상태 전송
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

  // ✅ 소켓으로부터 받은 재생 상태 반영
  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected) {
      console.warn("⚠️ STOMP 연결되지 않음. 소켓 구독 스킵.");
      return;
    }

    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/playback`,
      (message) => {
        const playbackStatus: PlaybackStatus = JSON.parse(message.body);
        console.log("📥 소켓에서 받은 메시지:", playbackStatus);

        // 🎤 녹음 상태 반영
        if (playbackStatus.recording !== undefined) {
          console.log("🎤 isRecording 업데이트됨:", playbackStatus.recording);
          setIsRecording(playbackStatus.recording);
        }

        // ▶️ 재생 상태 반영
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

        // ⏳ 타임라인 마커 동기화 (사용자가 직접 조작 중이 아닐 때만)
        if (
          playbackStatus.timelineMarker !== undefined &&
          !isAdjustingTimeline.current
        ) {
          console.log("⏳ 타임라인 동기화 중:", playbackStatus.timelineMarker);
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

  return { sendPlaybackStatus, isAdjustingTimeline };
};
