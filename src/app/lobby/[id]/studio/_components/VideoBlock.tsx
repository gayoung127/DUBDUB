import { useStreamStore } from "@/app/_store/StreamStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import React, { useEffect } from "react";

interface VideoBlockProps {
  videoUrl: string | undefined;
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
}

const VideoBlock = ({ videoUrl, videoRef }: VideoBlockProps) => {
  const { setVideoStream } = useStreamStore();
  const { isPlaying, time } = useTimeStore();

  useEffect(() => {
    if (!videoRef.current) return;

    if (
      "captureStream" in videoRef.current &&
      typeof videoRef.current.captureStream === "function"
    ) {
      const captureStream = videoRef.current.captureStream();
      if (captureStream) setVideoStream(captureStream);
    }

    // 비디오는 항상 음소거
    videoRef.current.muted = true;
  }, [videoUrl]);

  useEffect(() => {
    if (!videoRef.current) return;

    // 부모에서 전달받은 상태에 따라 재생/정지
    if (isPlaying) {
      videoRef.current
        .play()
        .catch((error) => console.error("비디오 재생 실패: ", error));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;

    // 타임라인 이동 동기화
    if (Math.abs(videoRef.current.currentTime - time) > 0.5) {
      videoRef.current.currentTime = time;
    }
  }, [time]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} src={videoUrl} className="max-h-[407px]" />
    </div>
  );
};

export default VideoBlock;
