import React from "react";
import { AudioFile } from "@/app/_types/studio";
import AudioBlock from "./AudioBlock";

interface AudioTrackTimelineProps {
  trackId: number;
  files: AudioFile[];
  totalDuration: number;
  currentTime: number;
  waveColor: string;
  blockColor: string;
  audioContext: AudioContext | null;
}

const AudioTrackTimeline = ({
  trackId,
  files,
  totalDuration,
  currentTime,
  waveColor,
  blockColor,
  audioContext,
}: AudioTrackTimelineProps) => {
  return (
    <div className="relative flex h-[60px] w-full flex-row items-center justify-start overflow-hidden border border-gray-300 px-2">
      <div className="relative flex h-full w-full">
        {files.map((file, index) => {
          const leftPosition = `${(file.startPoint / totalDuration) * 100}%`;
          const width = `${
            ((file.duration - file.trimStart - file.trimEnd) / totalDuration) *
            100
          }%`;

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
                currentTime={currentTime}
                audioContext={audioContext}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTrackTimeline;
