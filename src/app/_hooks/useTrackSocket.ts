import { useEffect, useRef, useState } from "react";
import useStompClient from "@/app/_hooks/useStompClient";
import { Track, initialTracks, AudioFile } from "@/app/_types/studio";

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

    console.log("🚀 [트랙 변경 감지] tracks 상태 변경 감지됨!");

    tracks.forEach((track) => {
      track.files.forEach((file) => {
        const trackFile = {
          trackId: track.trackId,
          action: "SAVE",
          file: {
            id: file.id,
            url: file.url,
            startPoint: file.startPoint,
            duration: file.duration,
            trimStart: file.trimStart,
            trimEnd: file.trimEnd,
            volume: file.volume ?? 1,
            isMuted: file.isMuted ?? false,
            speed: file.speed ?? 1,
          },
        };

        console.log("📤 [트랙 전송] 서버로 보낼 파일 데이터:", trackFile);

        stompClientRef.current?.publish({
          destination: `/app/studio/${sessionId}/track/files`,
          body: JSON.stringify(trackFile),
        });
      });
    });

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
      "📡 [트랙 구독 시작] 변경 사항을 수신할 구독을 설정:",
      `/topic/studio/${sessionId}/track/files`,
    );

    subscriptionRef.current = stompClientRef.current.subscribe(
      `/topic/studio/${sessionId}/track/files`,
      (message) => {
        const receivedFile: {
          trackId: number;
          action: string;
          file: Partial<AudioFile>;
        } = JSON.parse(message.body);
        console.log("📥 [서버에서 받은 트랙 파일]", receivedFile);

        setTracks((prevTracks) => {
          console.log("🔍 [트랙 업데이트 시작] 기존 tracks:", prevTracks);

          const newTracks = prevTracks.map((track) => {
            if (track.trackId !== receivedFile.trackId) return track;

            const existingFileIndex = track.files.findIndex(
              (f) => f.id === receivedFile.file.id,
            );

            const updatedFiles = [...track.files];

            if (existingFileIndex !== -1) {
              const existingFile = updatedFiles[existingFileIndex];

              // 🔥 개별 속성 비교를 통해 변경 확인 (타입 안전하게 개선)
              const hasChanged = Object.entries(receivedFile.file).some(
                ([key, value]) =>
                  existingFile[key as keyof AudioFile] !== value,
              );

              if (hasChanged) {
                console.log(
                  "🛠 [트랙 수정됨] 기존 파일과 다름! 업데이트 진행:",
                  existingFile,
                  "→",
                  receivedFile.file,
                );

                updatedFiles[existingFileIndex] = {
                  ...existingFile,
                  ...receivedFile.file,
                };
              } else {
                console.log("✅ [트랙 유지] 변경 사항 없음.");
              }
            } else {
              console.log("➕ [새 파일 추가] 기존 파일 없음. 추가 진행.");
              updatedFiles.push(receivedFile.file as AudioFile);
            }

            return { ...track, files: updatedFiles };
          });

          console.log("✅ [트랙 업데이트 완료] 새로운 tracks 상태:", newTracks);

          prevTracksRef.current = newTracks; // 🔥 최신 상태 유지
          return newTracks;
        });
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
