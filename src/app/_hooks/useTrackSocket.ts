import { useEffect, useRef } from "react";
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
  const subscriptionRef = useRef<any>(null);

  // ✅ 트랙 데이터 서버로 전송 (트랙 변경 감지)
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    const trackFiles = tracks.flatMap((track) =>
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
  }, [tracks, isConnected, sessionId]);

  // ✅ 트랙 데이터 구독 및 반영 (서버에서 변경된 데이터 수신)
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    // ✅ 기존 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = stompClientRef.current.subscribe(
      `/topic/studio/${sessionId}/track/files`,
      (message) => {
        const receivedFiles: { trackId: number; action: string; file: any }[] =
          JSON.parse(message.body);
        console.log("📥 서버에서 받은 트랙 데이터:", receivedFiles);

        setTracks((prevTracks) => {
          const updatedTracks = prevTracks.map((track) => {
            // ✅ 서버에서 받은 파일 중 이 트랙에 해당하는 것만 필터링
            const newFiles = receivedFiles
              .filter((item) => item.trackId === track.trackId)
              .map((item) => {
                const existingFile = track.files.find(
                  (f) => f.id === item.file.id,
                );

                return {
                  ...existingFile, // ✅ 기존 데이터 유지
                  ...item.file, // ✅ 서버에서 받은 데이터 덮어쓰기
                  url: existingFile?.url || "", // ✅ 기존 URL 유지
                };
              });

            // ✅ 기존 파일과 새로운 파일을 병합하여 업데이트
            const mergedFiles = [...track.files];

            newFiles.forEach((newFile) => {
              const index = mergedFiles.findIndex((f) => f.id === newFile.id);
              if (index !== -1) {
                mergedFiles[index] = newFile; // ✅ 기존 파일 업데이트
              } else {
                mergedFiles.push(newFile); // ✅ 새 파일 추가
              }
            });

            return {
              ...track,
              files: mergedFiles,
            };
          });

          return updatedTracks;
        });

        // 🔥 트랙 업데이트 후 `setTimeout`을 사용해 다음 렌더링에서 `tracks`를 찍음
        setTimeout(() => {
          console.log("✅ 트랙 업데이트 완료! 최신 tracks:", tracks);
        }, 100);
      },
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [isConnected, sessionId, setTracks]);

  // ✅ `tracks` 상태가 변경될 때마다 로그 찍기 (최신 상태 확인)
  useEffect(() => {
    console.log("🔥 현재 tracks 상태:", tracks);
  }, [tracks]);
};
