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

  // ✅ 트랙 변경 감지 및 개별적으로 서버로 전송
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    tracks.forEach((track) => {
      track.files.forEach((file) => {
        const trackFile = {
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
        };

        console.log("📤 변경된 파일 전송됨:", trackFile);

        stompClientRef.current!.publish({
          destination: `/app/studio/${sessionId}/track/files`,
          body: JSON.stringify(trackFile),
        });
      });
    });
  }, [tracks, isConnected, sessionId]);

  // ✅ 트랙 데이터 구독 및 반영 (서버에서 변경된 데이터 수신)
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    // ✅ 기존 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    console.log("📡 트랙 변경 사항 구독 시작: /topic/studio/", sessionId);

    subscriptionRef.current = stompClientRef.current.subscribe(
      `/topic/studio/${sessionId}/track/files`,
      (message) => {
        const receivedFile: { trackId: number; action: string; file: any } =
          JSON.parse(message.body);
        console.log("📥 서버에서 받은 트랙 파일:", receivedFile);

        setTracks((prevTracks) =>
          prevTracks.map((track) => {
            if (track.trackId !== receivedFile.trackId) return track;

            const existingFileIndex = track.files.findIndex(
              (f) => f.id === receivedFile.file.id,
            );

            const updatedFiles = [...track.files];

            if (existingFileIndex !== -1) {
              updatedFiles[existingFileIndex] = {
                ...updatedFiles[existingFileIndex],
                ...receivedFile.file,
              };
            } else {
              updatedFiles.push(receivedFile.file);
            }

            return {
              ...track,
              files: updatedFiles,
            };
          }),
        );

        // ✅ 최신 tracks 상태 로그 찍기
        setTimeout(() => {
          console.log("🔥 [트랙 최종 상태] 확인:", tracks);
        }, 100);
      },
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [isConnected, sessionId, setTracks, tracks]);
};
