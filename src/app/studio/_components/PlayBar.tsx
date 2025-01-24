import React from "react";
import RecordButton from "@/public/images/icons/icon-record.svg";
import PlayButton from "@/public/images/icons/icon-play.svg";
import PauseButton from "@/public/images/icons/icon-pause.svg";

const PlayBar = () => {
  return (
    <section className="flex h-full w-full flex-row items-center justify-center gap-x-4 border border-gray-300 py-[22px]">
      <div>
        <RecordButton width={20} height={20} />
      </div>
      <div>
        <PlayButton width={20} height={20} />
      </div>
      <div>
        <PauseButton width={20} height={20} />
      </div>
    </section>
  );
};

export default PlayBar;
