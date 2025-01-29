import React from "react";

import { AudioFile, Track } from "@/app/_types/studio";

import AudioBlock from "./AudioBlock";

const AudioTrack = ({ files, trackId, waveColor, blockColor }: Track) => {
  const totalDuration = Math.max(...files.map((file) => file.endTime));

  return (
    <div className="flex h-10 w-full flex-row items-center justify-start overflow-hidden">
      <div className="flex h-full min-h-10 w-[280px] flex-shrink-0 flex-row items-center justify-between border border-gray-300 px-3 py-2">
        <span className="text-sm font-normal text-white-100">
          오디오 트랙 {trackId}
        </span>
        <div className="flex flex-row items-center gap-x-4">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white-100">
            <span className="text-xs font-bold text-gray-400">E</span>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white-100">
            <span className="text-xs font-bold text-gray-400">M</span>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white-100">
            <span className="text-xs font-bold text-gray-400">S</span>
          </div>
        </div>
      </div>
      <div className="relative flex h-full w-full flex-row items-center justify-start border border-gray-300 px-2">
        {files.map((file, index) => {
          const leftPosition = `${(file.startTime / totalDuration) * 100}%`;
          const width = `${((file.endTime - file.startTime) / totalDuration) * 100}%`;

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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudioTrack;
