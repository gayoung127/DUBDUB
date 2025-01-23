import React from "react";
import PlayBar from "./PlayBar";

const VideoPlayer = () => {
  return (
    <section className="flex h-full w-full min-w-[720px] flex-1 flex-col items-start justify-start bg-gray-400">
      <div className="flex h-full max-h-[407px] w-full flex-1 flex-col items-center justify-center border border-gray-300 text-white-100">
        비디오
      </div>
      <PlayBar />
    </section>
  );
};

export default VideoPlayer;
