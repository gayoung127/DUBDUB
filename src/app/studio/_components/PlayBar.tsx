import React from "react";
import RecordButton from "@/public/images/icons/icon-record.svg";
import PlayButton from "@/public/images/icons/icon-play.svg";
import PauseButton from "@/public/images/icons/icon-pause.svg";
import H4 from "@/app/_components/H4";

import { useTimeStore } from "@/app/_store/TimeStore";
import { formatTime } from "@/app/_utils/formatTime";

const PlayBar = () => {
  const { time, isPlaying, play, pause, reset } = useTimeStore();

  return (
    <section className="flex h-full w-full flex-row items-center justify-between border border-gray-300 px-16 py-[22px]">
      <div className="flex h-full flex-row items-center justify-center gap-x-4">
        <div>
          <RecordButton width={20} height={20} />
        </div>
        <div onClick={isPlaying ? play : pause}>
          {isPlaying ? (
            <PlayButton width={20} height={20} />
          ) : (
            <PauseButton width={20} height={20} />
          )}
        </div>
        <div onClick={reset}>
          <PauseButton width={20} height={20} />
        </div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-x-3">
        <H4 className="text-white-100">{formatTime(time)}</H4>
        <H4 className="text-white-100">/</H4>
        <H4 className="text-white-100">{formatTime(50)}</H4>
      </div>
      <div className="flex h-full">하이</div>
    </section>
  );
};

export default PlayBar;
