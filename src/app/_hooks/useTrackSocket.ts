import { useEffect, useRef, useState } from "react";
import { useStompStore } from "@/app/_store/StompStore";
import { Track, initialTracks, AudioFile } from "@/app/_types/studio";

interface UseTrackSocketProps {
  sessionId: string;
}

export const useTrackSocket = ({ sessionId }: UseTrackSocketProps) => {
  const subscriptionRef = useRef<any>(null);
  const { isConnected, stompClientRef } = useStompStore();

  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const prevTracksRef = useRef<Track[]>(initialTracks);

  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) return;

    const prevTracks = prevTracksRef.current;

    if (JSON.stringify(prevTracks) === JSON.stringify(tracks)) {
      return;
    }

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

        console.log(
          "useTrackSocket: [트랙 전송] 서버로 보낼 파일 데이터:",
          trackFile,
        );

        stompClientRef.publish({
          destination: `/app/studio/${sessionId}/track/files`,
          body: JSON.stringify(trackFile),
        });
      });
    });

    prevTracksRef.current = JSON.parse(JSON.stringify(tracks));
  }, [tracks, isConnected, sessionId]);

  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    try {
      subscriptionRef.current = stompClientRef.subscribe(
        `/topic/studio/${sessionId}/track/files`,
        (message) => {
          const receivedFile: {
            trackId: number;
            action: string;
            file: Partial<AudioFile>;
          } = JSON.parse(message.body);
          console.log(
            "useTrackSocket: [서버에서 받은 트랙 파일]",
            receivedFile,
          );

          setTracks((prevTracks) => {
            const newTracks = prevTracks.map((track) => {
              if (track.trackId !== receivedFile.trackId) return track;

              const existingFileIndex = track.files.findIndex(
                (f) => f.id === receivedFile.file.id,
              );

              const updatedFiles = [...track.files];

              if (existingFileIndex !== -1) {
                const existingFile = updatedFiles[existingFileIndex];

                const hasChanged = Object.entries(receivedFile.file).some(
                  ([key, value]) =>
                    existingFile[key as keyof AudioFile] !== value,
                );

                if (hasChanged) {
                  console.log(
                    "useTrackSocket: 🛠 [트랙 수정됨] 기존 파일과 다름! 업데이트 진행:",
                    existingFile,
                    "→",
                    receivedFile.file,
                  );

                  updatedFiles[existingFileIndex] = {
                    ...existingFile,
                    ...receivedFile.file,
                  };
                }
              } else {
                updatedFiles.push(receivedFile.file as AudioFile);
              }

              return { ...track, files: updatedFiles };
            });

            console.log(
              "useTrackSocket: [트랙 업데이트 완료] 새로운 tracks 상태:",
              newTracks,
            );

            return JSON.stringify(prevTracks) === JSON.stringify(newTracks)
              ? prevTracks
              : [...newTracks];
          });
        },
      );
    } catch (error) {
      console.error("❌ STOMP Subscription 실패:", error);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isConnected, sessionId]);

  return { tracks, setTracks };
};
