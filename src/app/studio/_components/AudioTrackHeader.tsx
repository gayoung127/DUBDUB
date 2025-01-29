import React from "react";

interface AudioTrackHeaderProps {
  trackId: number;
}

const AudioTrackHeader = ({ trackId }: AudioTrackHeaderProps) => {
  return (
    <div className="flex h-[60px] min-h-10 w-[280px] flex-shrink-0 flex-row items-center justify-between border-b border-t border-gray-300 bg-gray-400 px-3 py-2">
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
  );
};

export default AudioTrackHeader;
