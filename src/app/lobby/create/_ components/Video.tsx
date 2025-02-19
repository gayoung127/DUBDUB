import React, { useState, useRef } from "react";
import UploadIcon from "@/public/images/icons/icon-upload.svg";
import H2 from "@/app/_components/H2";
import { useGenerateThumbnail } from "@/app/_hooks/useGenerateThumbnail";
import { Speaker } from "@/app/_types/script";
import { Segment } from "next/dist/server/app-render/types";

interface VideoProps {
  onChange: (file: File | null) => void;
  onThumbnailChange: (thumbnail: File | null) => void;
  setSpeakers: React.Dispatch<React.SetStateAction<Speaker[]>>;
  setSegments: React.Dispatch<React.SetStateAction<Segment[]>>;
}

const Video = ({
  onChange,
  onThumbnailChange,
  setSegments,
  setSpeakers,
}: VideoProps) => {
  const { generateThumbnail } = useGenerateThumbnail();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null); //stt 결과 추가
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    if (file && sectionRef.current) {
      const containerWidth = sectionRef.current.offsetWidth;
      const containerHeight = sectionRef.current.offsetHeight;

      transcribeVideo(file); // clova-api 호출

      try {
        //썸네일 생성
        const generatedThumbnail = await generateThumbnail(
          file,
          containerWidth,
          containerHeight,
        );
        if (generatedThumbnail) {
          setThumbnailPreview(URL.createObjectURL(generatedThumbnail));
          onThumbnailChange(generatedThumbnail); // 부모 컴포넌트에 전달
        } else {
          console.error("썸네일 생성 실패");
          setThumbnailPreview(null);
          onThumbnailChange(null);
        }
      } catch (error) {
        console.error("썸네일 생성 중 오류:", error);
        onThumbnailChange(null);
      }
    }
    onChange(file); // 부모 컴포넌트로 파일 전달
  };

  // Clova Speech-to-Text API 호출 로직
  const transcribeVideo = async (file: File) => {
    const videoData = new FormData();
    videoData.append("file", file);
    try {
      const response = await fetch("/next-api/clova-speech", {
        method: "POST",
        body: videoData,
      });

      const data = await response.json();

      if (response.ok) {
        setSpeakers(data.result.speakers);
        setSegments(data.result.segments);
      } else {
        alert("오류 발생: " + data.error);
      }
    } catch (error) {
      alert("서버 요청 실패");
    }
  };

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4 text-white-100">VIDEO</H2>
      <label htmlFor="video-upload">
        <div className="flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-200 p-6 focus:outline-none">
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="Video Thumbnail"
              className="h-auto w-full rounded-lg object-cover"
            />
          ) : (
            <>
              <UploadIcon width={48} height={48} />
              <p className="mt-4 text-center text-white-100">
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
