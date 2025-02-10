import React from "react";
import PlayBar from "./PlayBar";
import VideoBlock from "./VideoBlock";

interface VideoPlayerProps {
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
  videoUrl: string | undefined;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const VideoPlayer = ({
  videoRef,
  videoUrl,
  duration,
  setDuration,
}: VideoPlayerProps) => {
  return (
    <section className="flex h-full w-full min-w-[720px] flex-1 flex-col items-start justify-start bg-gray-400">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center border border-gray-300 text-white-100">
        <VideoBlock videoUrl={videoUrl} videoRef={videoRef} />
      </div>
      <PlayBar
        videoRef={videoRef}
        duration={duration}
        setDuration={setDuration}
      />
    </section>
  );
};

export default VideoPlayer;
