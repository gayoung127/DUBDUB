import React from "react";
import UploadIcon from "@/public/images/icons/icon-upload.svg";
import H2 from "@/app/_components/H2";

const Video = () => {
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4">VIDEO</H2>
      <div className="flex min-h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 p-6 focus:outline-none">
        <UploadIcon width={48} height={48} />
        <p className="mt-4 text-center text-gray-600">
          더빙할 동영상을 업로드 해주세요
        </p>
      </div>
    </section>
  );
};

export default Video;
