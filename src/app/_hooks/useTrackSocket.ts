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
  const prevTracksRef = useRef<Track[]>(tracks); // 🔥 이전 상태 저장

  // ✅ 트랙 변경 감지 및 개별적으로 서버로 전송
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    const prevTracks = prevTracksRef.current; // 🔥 이전 트랙 데이터

    tracks.forEach((track) => {
      track.files.forEach((file) => {
        // 🔥 기존 데이터에서 동일한 파일 찾기
        const prevTrack = prevTracks.find((t) => t.trackId === track.trackId);
        const prevFile = prevTrack?.files.find((f) => f.id === file.id);

        // 🔥 새 파일이거나 기존 파일이 변경되었을 경우만 publish
        const hasChanged =
          !prevFile || // 새 파일이 추가됨
          prevFile.startPoint !== file.startPoint ||
          prevFile.duration !== file.duration ||
          prevFile.trimStart !== file.trimStart ||
          prevFile.trimEnd !== file.trimEnd ||
          prevFile.volume !== file.volume ||
          prevFile.isMuted !== file.isMuted ||
          prevFile.speed !== file.speed;

        if (hasChanged && stompClientRef.current) {
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

          stompClientRef.current.publish({
            destination: `/app/studio/${sessionId}/track/files`,
            body: JSON.stringify(trackFile),
          });
        }
      });
    });

    // 🔥 현재 상태를 저장하여 다음 변경 감지에 활용
    prevTracksRef.current = tracks;
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

        setTracks((prevTracks) => {
          return prevTracks.map((track) => {
            if (track.trackId !== receivedFile.trackId) return track;

            // ✅ 기존 파일이 있으면 업데이트, 없으면 추가
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
          });
        });

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
  }, [isConnected, sessionId, setTracks]);

  // ✅ `tracks` 상태가 변경될 때마다 로그 찍기 (최신 상태 확인)
  useEffect(() => {
    console.log("🔥 현재 tracks 상태:", tracks);
  }, [tracks]);
};
