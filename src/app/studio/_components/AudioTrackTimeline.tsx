"use client";

import React, { useRef } from "react";
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

  return (
    <div
      ref={timelineRef}
      className="flex h-[60px] min-h-0 flex-shrink-0 flex-row items-center justify-start overflow-y-hidden border border-gray-300"
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
