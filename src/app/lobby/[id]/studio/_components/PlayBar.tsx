import React, { useEffect, useState } from "react";
import RecordButton from "@/public/images/icons/icon-record.svg";
import PlayButton from "@/public/images/icons/icon-play.svg";
import StopButton from "@/public/images/icons/icon-stop.svg";
import PauseButton from "@/public/images/icons/icon-pause.svg";
import H4 from "@/app/_components/H4";
import RenderingButton from "./RenderingButton";

import { useTimeStore } from "@/app/_store/TimeStore";
import { formatTime } from "@/app/_utils/formatTime";

interface PlayBarProps {
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
}

const PlayBar = ({ videoRef }: PlayBarProps) => {
  const { time, isPlaying, play, pause, reset } = useTimeStore();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  }, [videoRef.current?.duration]);

  return (
    <section className="flex h-full w-full flex-row items-center justify-between border border-gray-300 px-16 py-[22px]">
      <div className="flex h-full flex-row items-center justify-center gap-x-4">
        <div>
          <RecordButton width={20} height={20} />
        </div>
        <div onClick={isPlaying ? pause : play}>
          {isPlaying ? (
            <PauseButton width={20} height={20} />
          ) : (
            <PlayButton width={20} height={20} />
          )}
        </div>
        <div onClick={reset}>
          <StopButton width={20} height={20} />
        </div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-x-3">
        <H4 className="text-white-100">{formatTime(time)}</H4>
        <H4 className="text-white-100">/</H4>
        <H4 className="text-white-100">{formatTime(duration)}</H4>
      </div>
      <div className="flex h-full">
        <RenderingButton />
      </div>
    </section>
  );
};

export default PlayBar;
