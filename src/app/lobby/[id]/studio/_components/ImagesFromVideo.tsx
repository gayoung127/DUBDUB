import { useGenerateThumbnail } from "@/app/_hooks/useGenerateThumbnail";
import React, { useEffect, useRef, useState } from "react";

const ImagesFromVideo = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [lastThumbnail, setLastThumbnail] = useState<string>("");

  useEffect(() => {
    if (!videoUrl) return;

    const captureThumbnails = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      video.addEventListener("loadedmetadata", async () => {
        const duration = Math.round(video.duration);
        const thumbnailCount = duration;
        const interval = duration / (thumbnailCount - 1);
        const ctx = canvas.getContext("2d");

        const newThumbnails: string[] = [];

        for (let i = 0; i < thumbnailCount; i += interval) {
          video.currentTime = i * interval;
          await new Promise((resolve) =>
            video.addEventListener("seeked", resolve, { once: true }),
          );

          canvas.width = 80; // 고정 너비 80px
          canvas.height = (video.videoHeight / video.videoWidth) * 80; // 비율 유지
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              newThumbnails.push(url);
            }
          }, "image/jpeg");
        }

        setThumbnails(newThumbnails);

        video.currentTime = duration;
        await new Promise((resolve) =>
          video.addEventListener("seeked", resolve, { once: true }),
        );
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setLastThumbnail(url);
          }
        }, "image/jpeg");
      });

      video.load(); // 비디오 로드
    };

    captureThumbnails();
  }, [videoUrl]);

  return (
    <div className="flex w-full">
      <video ref={videoRef} src={videoUrl} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      {thumbnails.map((thumb: string, index: number) => (
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
    </div>
  );
};

export default ImagesFromVideo;
