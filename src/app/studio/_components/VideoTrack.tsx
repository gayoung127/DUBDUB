import React from "react";

import H4 from "@/app/_components/H4";

import VideoIcon from "@/public/images/icons/icon-video.svg";

const VideoTrack = () => {
  return (
    <div className="flex h-10 w-full flex-row items-center justify-start">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-row items-center justify-start gap-x-3 border border-gray-300 px-3 py-2">
        <VideoIcon width={24} height={24} />
        <H4 className="text-sm font-normal text-white-100">더빙 동영상</H4>
      </div>
      <div className="flex h-full w-full flex-1 flex-row items-center justify-start border border-gray-300"></div>
    </div>
  );
};

export default VideoTrack;
