import React, { useEffect, useRef } from "react";

import H4 from "@/app/_components/H4";

import VideoIcon from "@/public/images/icons/icon-video.svg";

const VideoTrack = ({
  isMuted,
  isSolo,
  videoUrl,
  setVideoMuted,
  setVideoSolo,
}: {
  isMuted: boolean;
  isSolo: boolean;
  videoUrl: string;
  setVideoMuted: (muted: boolean) => void;
  setVideoSolo: (solo: boolean) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!videoUrl) return;
    audioRef.current = new Audio(videoUrl);
  });
  // handleMute(): 트랙 음소거
  const handleMute = () => {
    if (!audioRef.current) return;
    const newMutedStatus = !isMuted;
    setVideoMuted(newMutedStatus);
    audioRef.current.muted = newMutedStatus;
  };

  // handleSolo(): 트랙 솔로
  const handleSolo = () => {
    if (!audioRef.current) return;
    const newSoloState = !isSolo;
    setVideoSolo(newSoloState);

    if (newSoloState) {
      setVideoMuted(true);
      audioRef.current.volume = 1;
    } else {
      setVideoMuted(false);
      audioRef.current.volume = 1;
    }
  };
  return (
    <div
      className={`box-border flex h-[60px] min-h-0 w-[280px] flex-row items-center justify-between overflow-hidden border-b border-t border-gray-300 px-3`}
    >
      <H4 className="border-white-100 font-bold text-white-100">Original </H4>
      <div className="flex flex-row items-center gap-x-4">
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isMuted ? "bg-green-500" : "bg-white-100"}`}
          onClick={handleMute}
        >
          <span className="text-xs font-bold text-gray-400">M</span>
        </div>
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isSolo ? "bg-orange-400" : "bg-white-100"}`}
          onClick={handleSolo}
        >
          <span className="text-xs font-bold text-gray-400">S</span>
        </div>
      </div>
    </div>
  );
};

export default VideoTrack;
