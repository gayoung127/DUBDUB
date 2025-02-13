import { useEffect, useRef, useState } from "react";
import useStompClient from "@/app/_hooks/useStompClient";
import { Track, initialTracks } from "@/app/_types/studio";

interface UseTrackSocketProps {
  sessionId: string;
}

export const useTrackSocket = ({ sessionId }: UseTrackSocketProps) => {
  const { isConnected, stompClientRef } = useStompClient();
  const subscriptionRef = useRef<any>(null);

  // ✅ tracks 상태를 useState로 관리
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const prevTracksRef = useRef<Track[]>(tracks); // 🔥 이전 상태 저장

  // ✅ 트랙 변경 감지 및 서버로 전송
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    const prevTracks = prevTracksRef.current; // 🔥 이전 트랙 데이터

    const hasChanges = tracks.some((track) =>
      track.files.some((file) => {
        const prevTrack = prevTracks.find((t) => t.trackId === track.trackId);
        const prevFile = prevTrack?.files.find((f) => f.id === file.id);

        return (
          !prevFile ||
          prevFile.startPoint !== file.startPoint ||
          prevFile.duration !== file.duration ||
          prevFile.trimStart !== file.trimStart ||
          prevFile.trimEnd !== file.trimEnd ||
          prevFile.volume !== file.volume ||
          prevFile.isMuted !== file.isMuted ||
          prevFile.speed !== file.speed
        );
      }),
    );

    if (!hasChanges) return; // 변경 사항이 없으면 서버 전송 X

    tracks.forEach((track) => {
      track.files.forEach((file) => {
        stompClientRef.current?.publish({
          destination: `/app/studio/${sessionId}/track/files`,
          body: JSON.stringify({
            trackId: track.trackId,
            action: "SAVE",
            file: {
              id: file.id,
              startPoint: file.startPoint,
              duration: file.duration,
              trimStart: file.trimStart,
              trimEnd: file.trimEnd,
              volume: file.volume ?? 1,
              isMuted: file.isMuted ?? false,
              speed: file.speed ?? 1,
            },
          }),
        });
      });
    });

    console.log("📤 변경된 파일 전송 완료!");
    prevTracksRef.current = JSON.parse(JSON.stringify(tracks)); // 🔥 깊은 복사로 상태 저장
  }, [tracks, isConnected, sessionId]);

  // ✅ 트랙 데이터 구독 및 반영 (서버에서 변경된 데이터 수신)
  useEffect(() => {
    if (!isConnected || !stompClientRef.current) return;

    // ✅ 기존 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    console.log(
      "📡 트랙 변경 사항 구독 시작:",
      `/topic/studio/${sessionId}/track/files`,
    );

    subscriptionRef.current = stompClientRef.current.subscribe(
      `/topic/studio/${sessionId}/track/files`,
      (message) => {
        const receivedFile: { trackId: number; action: string; file: any } =
          JSON.parse(message.body);
        console.log("📥 서버에서 받은 트랙 파일:", receivedFile);

        setTracks((prevTracks) => {
          const newTracks = prevTracks.map((track) => {
            if (track.trackId !== receivedFile.trackId) return track;

            const existingFileIndex = track.files.findIndex(
              (f) => f.id === receivedFile.file.id,
            );

            const updatedFiles = [...track.files];

            if (existingFileIndex !== -1) {
              const existingFile = updatedFiles[existingFileIndex];

              // 🔥 변경 사항이 있는 경우만 업데이트
              if (
                JSON.stringify(existingFile) !==
                JSON.stringify(receivedFile.file)
              ) {
                updatedFiles[existingFileIndex] = {
                  ...existingFile,
                  ...receivedFile.file,
                };
              }
            } else {
              updatedFiles.push(receivedFile.file);
            }

            return { ...track, files: updatedFiles };
          });

          return JSON.stringify(prevTracks) !== JSON.stringify(newTracks)
            ? newTracks
            : prevTracks;
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
  }, [isConnected, sessionId]); // ✅ `tracks` 의존성 제거 (불필요한 실행 방지)

  // ✅ `tracks` 상태 변경 로그
  useEffect(() => {
    console.log("🔥 현재 tracks 상태:", tracks);
  }, [tracks]);

  return { tracks, setTracks };
};
