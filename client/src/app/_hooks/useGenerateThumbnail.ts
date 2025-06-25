import { useState } from "react";

// 썸네일 훅 타입 정의
interface UseGenerateThumbnailReturn {
  thumbnail: File | null; // 생성된 썸네일 (File 객체)
  generateThumbnail: (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds?: number,
  ) => Promise<File | null>; // 썸네일 생성 함수 (Promise로 반환)
}

export const useGenerateThumbnail = (): UseGenerateThumbnailReturn => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const generateThumbnail = (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds: number = 1,
  ): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Canvas context를 가져올 수 없습니다.");
        reject(null);
        return;
      }

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      video.src = URL.createObjectURL(videoFile);
      video.crossOrigin = "anonymous";
      video.preload = "metadata";

      video.addEventListener("loadedmetadata", () => {
        video.currentTime = timeInSeconds;
      });

      video.addEventListener("seeked", () => {
        try {
          context.drawImage(
            video,
            0,
            0,
            video.videoWidth,
            video.videoHeight,
            0,
            0,
            canvas.width,
            canvas.height,
          );

          // 캔버스 내용을 Blob으로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const thumbnailFile = new File([blob], "thumbnail.jpg", {
                  type: "image/jpeg",
                });
                setThumbnail(thumbnailFile); // 상태 업데이트
                resolve(thumbnailFile); // 성공적으로 생성된 파일 반환
              } else {
                console.error("Blob 생성에 실패했습니다.");
                reject(null);
              }
            },
            "image/jpeg",
            0.8, // 이미지 품질 (0~1)
          );
        } catch (error) {
          console.error("썸네일 생성 중 오류가 발생했습니다:", error);
          reject(null);
        }
      });

      video.addEventListener("error", (e) => {
        console.error("동영상을 로드하는 중 오류가 발생했습니다:", e);
        setThumbnail(null);
        reject(null);
      });
    });
  };

  return { thumbnail, generateThumbnail };
};
