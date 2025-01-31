import React from "react";
import { AudioFile } from "@/app/_types/studio";
import AudioBlock from "./AudioBlock";

interface AudioTrackTimelineProps {
  trackId: number;
  files: AudioFile[];
  totalDuration: number;
  waveColor: string;
  blockColor: string;
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
}

const AudioTrackTimeline = ({
  trackId,
  files,
  totalDuration,
  waveColor,
  blockColor,
  audioContext,
  audioBuffers,
}: AudioTrackTimelineProps) => {
  return (
    <div
      className="flex h-[60px] flex-row items-center justify-start overflow-hidden border border-gray-300"
      style={{ width: `${totalDuration * 80}px` }}
    >
      <div className="relative flex h-full">
        {files.map((file, index) => {
          const leftPosition = `${(file.startPoint + file.trimStart) * 80}px`;
          const width = `${
            (file.duration - file.trimStart - file.trimEnd) * 80
          }px`;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: leftPosition,
                width: width,
                height: "100%",
              }}
            >
              <AudioBlock
                file={file}
                waveColor={waveColor}
                blockColor={blockColor}
                audioContext={audioContext}
                audioBuffers={audioBuffers}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTrackTimeline;
