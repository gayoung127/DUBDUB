import { useEffect, useState, useRef } from "react";
import useStompClient from "@/app/_hooks/useStompClient";
import { Track } from "@/app/_types/studio";

interface UseTrackSocketProps {
  sessionId: string;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

export const useTrackSocket = ({
  sessionId,
  tracks,
  setTracks,
}: UseTrackSocketProps) => {
  const { isConnected, stompClientRef } = useStompClient();
  const [debouncedTracks, setDebouncedTracks] = useState(tracks);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionRef = useRef<any>(null); // ✅ 구독 참조 저장

  // 🎯 디바운스 로직 (500ms 대기 후 전송)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setDebouncedTracks(tracks);
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tracks]);

  // 🎯 트랙 데이터 서버로 전송
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    const trackFiles = debouncedTracks.flatMap((track) =>
      track.files.map((file) => ({
        trackId: track.trackId,
        action: "SAVE",
        file: {
          id: file.id,
          assetId: file.id.split("-")[0], // ✅ 대시(`-`) 기준으로 앞부분만 추출
          startPoint: file.startPoint,
          duration: file.duration,
          trimStart: file.trimStart,
          trimEnd: file.trimEnd,
          volume: file.volume ?? 1,
          isMuted: file.isMuted ?? false,
          speed: file.speed ?? 1,
        },
      })),
    );

    stompClientRef.current.publish({
      destination: `/app/studio/${sessionId}/track/files`,
      body: JSON.stringify(trackFiles),
    });

    console.log("📤 트랙 데이터 전송됨:", trackFiles);
  }, [debouncedTracks, isConnected, sessionId]);

  // 🎯 트랙 데이터 구독 및 반영
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    // ✅ 기존 구독이 있다면 정리
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // ✅ 새롭게 구독 설정
    subscriptionRef.current = stompClientRef.current.subscribe(
      `/topic/studio/${sessionId}/track/files`,
      (message) => {
        const receivedTracks: Track[] = JSON.parse(message.body);
        console.log("📥 서버에서 받은 트랙 데이터:", receivedTracks);

        setTracks(receivedTracks); // ✅ 서버에서 받은 데이터로 업데이트
      },
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [isConnected, sessionId]);

  return null;
};
