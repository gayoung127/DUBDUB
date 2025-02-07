import React from "react";
import UploadIcon from "@/public/images/icons/icon-upload.svg";
import H2 from "@/app/_components/H2";

interface VideoProps {
  onChange: (file: File | null) => void;
}

const Video = ({ onChange }: VideoProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // 선택된 파일 가져오기
    onChange(file);
  };
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4">VIDEO</H2>
      <label htmlFor="video-upload">
        <div className="flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 p-6 focus:outline-none">
          <UploadIcon width={48} height={48} />
          <p className="mt-4 text-center text-gray-600">
            더빙할 동영상을 업로드 해주세요
          </p>
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
