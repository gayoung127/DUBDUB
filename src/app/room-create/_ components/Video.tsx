import React from "react";
import UploadIcon from "@/public/images/icons/icon-upload.svg";

const Video = () => {
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <h2 className="mb-4 text-xl font-bold">VIDEO</h2>
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
