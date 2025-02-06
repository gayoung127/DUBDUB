"use client";

import React, { useRef } from "react";
import { useDrop } from "react-dnd"; // ✅ useDrop 추가
import { AudioFile, Track } from "@/app/_types/studio";
import AudioBlock from "./AudioBlock";

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
