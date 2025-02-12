import { useState } from "react";

export const useGenerateThumbnail = () => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const generateThumbnail = (videoFile: File, timeInSeconds: number = 1) => {
    //기본값 1초를 매개변수로 받아옴
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    video.src = URL.createObjectURL(videoFile);
    video.crossOrigin = "anonymous"; // CORS 문제 방지
    video.preload = "metadata";

    video.addEventListener("loadedmetadata", () => {
      video.currentTime = timeInSeconds; // 특정 시간으로 이동
    });

    video.addEventListener("seeked", () => {
      if (context) {
        // 캔버스 크기를 동영상 크기와 동일하게 설정
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 현재 프레임을 캔버스에 그리기
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 캔버스 내용을 base64 이미지 URL로 변환
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 품질 조정 가능
        setThumbnail(imageDataUrl);
      }
    });

    video.addEventListener("error", (e) => {
      console.error("동영상 로드 중 오류:", e);
      setThumbnail(null);
    });
  };

  return { thumbnail, generateThumbnail };
};
