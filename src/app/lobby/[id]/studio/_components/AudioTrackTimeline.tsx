"use client";

import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd"; // ✅ useDrop 추가
import { AudioFile, Track } from "@/app/_types/studio";
import AudioBlock from "./AudioBlock";
import { useRecordingStore } from "@/app/_store/RecordingStore";

interface AudioTrackTimelineProps {
  trackId: number;
  files: AudioFile[];
  totalDuration: number;
  waveColor: string;
  blockColor: string;
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const AudioTrackTimeline = ({
  trackId,
  files,
  totalDuration,
  waveColor,
  blockColor,
  audioContext,
  audioBuffers,
  setTracks,
}: AudioTrackTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { audioFiles } = useRecordingStore();

  useEffect(() => {
    console.log(`🎙️ 트랙(${trackId})의 녹음된 파일 추가 확인:`, audioFiles);

    // 추가되는 오디오 길이 계산
    const loadAudioDuration = async (url: string) => {
      if (!audioContext) return 0;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (audioBuffers) {
          audioBuffers.set(url, audioBuffer);
        }

        // console.log(`✅ ${url}의 오디오 길이:`, audioBuffer.duration);
        return audioBuffer.duration;
      } catch (error) {
        console.error(`❌ ${url} 오디오 로드 실패:`, error);
        return 0;
      }
    };

    // 녹음됨 파일 audioContext로 추가
    const updateTracks = async () => {
      const newFiles = await Promise.all(
        (audioFiles[trackId] ?? []).map(async (url) => {
          const duration = await loadAudioDuration(url);

          if (duration <= 0) {
            console.warn(`⚠️ ${url}의 duration이 0초 이하로 잘못 계산됨`);
            return null;
          }

          return {
            id: `${trackId}-${Date.now()}`,
            url,
            startPoint: 0,
            duration,
            trimStart: 0,
            trimEnd: 0,
            volume: 1,
            isMuted: false,
            speed: 1,
          };
        }),
      );

      const validFiles = newFiles.filter((file) => file !== null);

      if (validFiles.length === 0) {
        console.log(`⚠️ 트랙(${trackId})에 추가할 유효한 파일이 없음`);
        return;
      }

      setTracks((prevTracks) =>
        prevTracks.map((track) => {
          if (track.trackId !== trackId) return track;

          const existingFiles = [...track.files];
          const updatedFiles = [...existingFiles, ...validFiles];

          if (JSON.stringify(existingFiles) === JSON.stringify(updatedFiles)) {
            console.log(`⚠️ 트랙(${trackId}) 파일 변경 없음, 업데이트 생략`);
            return track;
          }

          console.log(
            `🎶 트랙(${trackId})에 녹음된 파일 추가됨:`,
            updatedFiles,
          );
          return {
            ...track,
            files: updatedFiles,
          };
        }),
      );
    };

    updateTracks();
  }, [audioFiles, trackId, setTracks, audioContext, audioBuffers]);

  // ✅ 드롭 가능하도록 `useDrop` 추가
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ASSET", // 드래그 가능한 아이템 타입
    drop: (item: { id: string; url: string }, monitor) => {
      if (!timelineRef.current) return;

      // 현재 드롭한 위치를 초 단위로 변환
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const dropX = offset.x - rect.left;
      const startPoint = Math.max(0, Math.round(dropX / 80)); // 80px = 1초 기준

      setTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.trackId === trackId
            ? {
                ...track,
                files: [
                  ...track.files,
                  {
                    id: `${item.id}-${Date.now()}`,
                    url: item.url,
                    startPoint,
                    duration: 5, // 기본 5초 길이
                    trimStart: 0,
                    trimEnd: 0,
                    volume: 1,
                    isMuted: false,
                    speed: 1,
                  },
                ],
              }
            : track,
        ),
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        timelineRef.current = node;
      }}
      className={`flex h-[60px] min-h-0 flex-shrink-0 flex-row items-center justify-start overflow-y-hidden border border-gray-300 ${
        isOver ? "bg-gray-200" : ""
      }`} // 드롭 시 색상 변경
      style={{ width: `${totalDuration * 80}px` }}
    >
      <div className="relative flex h-full items-center justify-center">
        {files.map((file, index) => {
          const width = `${
            (file.duration - file.trimStart - file.trimEnd) * 80
          }px`;

          return (
            <div
              key={file.id}
              className="relative flex items-center justify-start"
            >
              <AudioBlock
                file={file}
                width={width}
                waveColor={waveColor}
                blockColor={blockColor}
                audioContext={audioContext}
                audioBuffers={audioBuffers}
                setTracks={setTracks}
                timelineRef={timelineRef}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTrackTimeline;
