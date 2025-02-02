import { useTimeStore } from "@/app/_store/TimeStore";
import { error } from "console";
import React, { useEffect, useRef } from "react";

interface VideoBlockProps {
  videoUrl: string;
  onVideoReady: (stream: MediaStream) => void; //부모에게 WebRTC로 공유할 비디오 스트림을 전달하는 함수
}

// captureStream()을 포함하는 타입 확장
interface VideoElementWithCapturestream extends HTMLVideoElement {
  captureStream?: () => MediaStream;
}

const VideoBlock = ({ videoUrl, onVideoReady }: VideoBlockProps) => {
  const videoRef = useRef<VideoElementWithCapturestream>(null);
  const { isPlaying, time } = useTimeStore();

  useEffect(() => {
    if (!videoRef.current) return;

    if (
      "captureStream" in videoRef.current &&
      typeof videoRef.current.captureStream === "function"
    ) {
      const captureStream = videoRef.current.captureStream();
      if (captureStream) onVideoReady(captureStream);
    }

    // 비디오는 항상 음소거
    videoRef.current.muted = true;
  }, [videoUrl, onVideoReady]);

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
      <video ref={videoRef} src={videoUrl} />
    </div>
  );
};

export default VideoBlock;
