import React from "react";
import PlayBar from "./PlayBar";
import VideoBlock from "./VideoBlock";
import { Asset, AudioFile, Track } from "@/app/_types/studio";

interface VideoPlayerProps {
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
  videoUrl: string | undefined;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  assets: Asset[];
  isVideoMuted: boolean;
  isProcessedAudio: boolean;
}

const VideoPlayer = ({
  videoRef,
  videoUrl,
  duration,
  setDuration,
  tracks,
  setTracks,
  assets,
  isVideoMuted,
  isProcessedAudio,
}: VideoPlayerProps) => {
  return (
    <section className="flex h-full w-full min-w-[720px] flex-1 flex-col items-start justify-start bg-gray-400">
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center border border-gray-300 text-white-100">
        <VideoBlock
          videoUrl={videoUrl}
          videoRef={videoRef}
          isMuted={isVideoMuted}
          isProcessedAudio={isProcessedAudio}
        />
      </div>
      <PlayBar
        videoUrl={videoUrl}
        videoRef={videoRef}
        duration={duration}
        setDuration={setDuration}
        tracks={tracks}
        setTracks={setTracks}
        assets={assets}
      />
    </section>
  );
};

export default VideoPlayer;
