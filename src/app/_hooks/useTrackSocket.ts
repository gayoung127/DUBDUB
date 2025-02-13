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
        const receivedFiles: { trackId: number; action: string; file: any }[] =
          JSON.parse(message.body);
        console.log("📥 서버에서 받은 트랙 데이터:", receivedFiles);

        setTracks((prevTracks) => {
          // 🎯 기존 트랙을 복사해서 새로운 데이터 적용
          const updatedTracks = prevTracks.map((track) => {
            // ✅ 이 트랙에 해당하는 새로운 파일 목록 찾기
            const newFiles = receivedFiles
              .filter((item) => item.trackId === track.trackId)
              .map((item) => {
                const existingFile = track.files.find(
                  (f) => f.id === item.file.id,
                );

                return {
                  ...existingFile, // 기존 파일 정보 유지
                  ...item.file, // 서버에서 받은 데이터 덮어쓰기
                  url: existingFile?.url || "", // ✅ 기존 URL 유지
                };
              });

            // ✅ 만약 이 트랙에 해당하는 새로운 파일이 없으면 기존 트랙 유지
            if (newFiles.length === 0) return track;

            return {
              ...track,
              files: newFiles, // ✅ 기존 값 유지하며 업데이트된 파일 적용
            };
          });

          return updatedTracks;
        });
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
