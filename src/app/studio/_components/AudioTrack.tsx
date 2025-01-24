import React from "react";

import H4 from "@/app/_components/H4";

import VideoIcon from "@/public/images/icons/icon-video.svg";
import MixerIcon from "@/public/images/icons/icon-mixer.svg";

interface AudioTrackProps {
  trackNumber: number;
}

const AudioTrack = ({ trackNumber }: AudioTrackProps) => {
  return (
    <div className="flex h-10 w-full flex-row items-center justify-start">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-row items-center justify-between border border-gray-300 px-3 py-2">
        <H4 className="text-sm font-normal text-white-100">
          오디오 트랙 {trackNumber}
        </H4>
        <div className="flex flex-row items-center justify-start gap-x-4">
          <VideoIcon width={24} height={24} />
          <div className="flex flex-row items-center justify-start gap-x-2">
            {/* <div>
              <MixerIcon width={18} height={18} />
            </div> */}
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                E
              </span>
            </div>
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                M
              </span>
            </div>
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                S
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-row items-center justify-start border border-gray-300"></div>
    </div>
  );
};

export default AudioTrack;
