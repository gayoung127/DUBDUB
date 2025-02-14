import React, { useState, useRef } from "react";
import UploadIcon from "@/public/images/icons/icon-upload.svg";
import H2 from "@/app/_components/H2";
import { useGenerateThumbnail } from "@/app/_hooks/useGenerateThumbnail";

interface VideoProps {
  onChange: (file: File | null) => void;
  onThumbnailChange: (thumbnail: File | null) => void;
}

const Video = ({ onChange, onThumbnailChange }: VideoProps) => {
  const { generateThumbnail } = useGenerateThumbnail();
  const [thumbnail, setThumbnail] = useState<string | null>(null); // 썸네일 상태 추가
  const [transcription, setTranscription] = useState<string | null>(null); //stt 결과 추가
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    if (file && sectionRef.current) {
      const containerWidth = sectionRef.current.offsetWidth;
      const containerHeight = sectionRef.current.offsetHeight;

      try {
        const generatedThumbnail = await generateThumbnail(
          file,
          containerWidth,
          containerHeight,
        );
        if (generatedThumbnail) {
          setThumbnail(URL.createObjectURL(generatedThumbnail)); // Blob URL로 변환하여 상태 업데이트
          onThumbnailChange(generatedThumbnail); // 부모 컴포넌트에 전달
        } else {
          console.error("썸네일 생성 실패");
          setThumbnail(null);
          onThumbnailChange(null);
        }
      } catch (error) {
        console.error("썸네일 생성 중 오류:", error);
        setThumbnail(null); // 오류 발생 시 초기화
        onThumbnailChange(null);
      }
    }
    onChange(file); // 부모 컴포넌트로 파일 전달
  };

  // Google Speech-to-Text API 호출 로직
  const transcribeVideo = async (file: File): Promise<string | null> => {
    try {
      // FormData에 파일 추가
      const formData = new FormData();
      formData.append("file", file);

      // Next.js API 라우트로 요청 전송
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("STT 요청 실패");
      }

      const data = await response.json();
      return data.transcription || null; // STT 결과 반환
    } catch (error) {
      console.error("STT 호출 중 오류:", error);
      return null;
    }
  };

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4">VIDEO</H2>
      <label htmlFor="video-upload">
        <div className="flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 p-6 focus:outline-none">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="h-auto w-full rounded-lg object-cover"
            />
          ) : (
            <>
              <UploadIcon width={48} height={48} />
              <p className="mt-4 text-center text-gray-600">
                더빙할 동영상을 업로드 해주세요
              </p>
            </>
          )}
          <input
            id="video-upload"
            type="file"
            accept="video/*" // 비디오 파일만 허용
            className="hidden"
            onChange={handleFileChange} // 파일 변경 이벤트 핸들러 연결
          />
        </div>
      </label>
    </section>
  );
};

export default Video;
