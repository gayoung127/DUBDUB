import { useGenerateThumbnail } from "@/app/_hooks/useGenerateThumbnail";
import { resolve } from "path";
import React, { useEffect, useRef, useState } from "react";

const ImagesFromVideo = ({
  videoUrl,
  duration,
}: {
  videoUrl: string;
  duration: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [lastThumbnail, setLastThumbnail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!videoUrl) return;

    setIsLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    video.crossOrigin = "anonymous";
    const ctx = canvas.getContext("2d");

    const captureThumbnails = async () => {
      await new Promise((resolve) => {
        video.addEventListener("loadedmetadata", resolve, { once: true });
      });

      const interval = duration / (duration - 1);

      const newThumbnails: string[] = [];

      for (let i = 0; i < duration; i++) {
        video.currentTime = i * interval;
        await new Promise((resolve) =>
          video.addEventListener("seeked", resolve, { once: true }),
        );

        canvas.width = 80; // 고정 너비 80px
        canvas.height = (video.videoHeight / video.videoWidth) * 80; // 비율 유지
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/jpeg");
        });

        if (blob) {
          newThumbnails.push(URL.createObjectURL(blob));
        }
      }

      setThumbnails(newThumbnails);

      video.currentTime = duration;
      await new Promise((resolve) =>
        video.addEventListener("seeked", resolve, { once: true }),
      );
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const lastBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg");
      });

      if (lastBlob) {
        setLastThumbnail(URL.createObjectURL(lastBlob));
      }

      setIsLoading(false);
    };

    video.load(); // 비디오 로드

    captureThumbnails();
    return () => {
      setThumbnails([]);
      setLastThumbnail("");
      setIsLoading(true);
    };
  }, [videoUrl]);

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ width: `${duration * 80}px` }}
    >
      <video ref={videoRef} src={videoUrl} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      {isLoading ? (
        <ImagesFromVideo.Skeleton />
      ) : (
        <>
          {thumbnails.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              alt={`Thumbnail ${index + 1}`}
              className="h-auto w-[80px] flex-shrink-0"
            />
          ))}
          {lastThumbnail && (
            <img
              src={lastThumbnail}
              alt="Last Thumbnail"
              className="h-auto w-[80px] flex-shrink-0"
            />
          )}
        </>
      )}
    </div>
  );
};

// ✅ Skeleton 컴포넌트도 display name 추가
ImagesFromVideo.Skeleton = function Skeleton() {
  return <div className="h-full w-full animate-pulse bg-gray-300" />;
};

export default ImagesFromVideo;
