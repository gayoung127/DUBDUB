import { useState } from "react";

// 썸네일 훅 타입 정의
interface UseGenerateThumbnailReturn {
  thumbnail: string | null; // 생성된 썸네일의 URL (Base64 형식)
  generateThumbnail: (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds?: number,
  ) => void; // 썸네일 생성 함수
}

export const useGenerateThumbnail = (): UseGenerateThumbnailReturn => {
  // 썸네일 URL을 저장하는 상태 변수
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // 썸네일 생성 함수
  const generateThumbnail = (
    videoFile: File,
    containerWidth: number,
    containerHeight: number,
    timeInSeconds: number = 1,
  ): void => {
    // 동적으로 <video>와 <canvas> 요소 생성
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Canvas context를 가져올 수 없습니다.");
      return;
    }

    // 캔버스 크기를 부모 컴포넌트의 크기로 설정
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // 동영상 파일을 브라우저에서 사용할 수 있는 URL로 변환
    video.src = URL.createObjectURL(videoFile);
    video.crossOrigin = "anonymous"; // CORS 문제 방지
    video.preload = "metadata"; // 메타데이터 미리 로드

    // 동영상 메타데이터가 로드되면 특정 시간으로 이동
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = timeInSeconds;
    });

    // 지정된 시간으로 이동 후 해당 프레임을 캡처
    video.addEventListener("seeked", () => {
      // 현재 프레임을 캔버스에 그리기
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

      // 캔버스 내용을 Base64 이미지 URL로 변환
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 품질 조정 가능
      setThumbnail(imageDataUrl); // 상태 업데이트
    });

    // 동영상 로드 중 오류 처리
    video.addEventListener("error", (e) => {
      console.error("동영상을 로드하는 중 오류가 발생했습니다:", e);
      setThumbnail(null); // 오류 발생 시 썸네일 초기화
    });
  };

  return { thumbnail, generateThumbnail }; // 상태와 함수 반환
};

// <video>와 < canvas > 를 이용해 특정 시간의 프레임을 캡처.
// 캡처한 이미지를 Base64 URL로 변환.
// 변환된 URL을 상태로 저장하여 컴포넌트에서 사용할 수 있도록 제공.
