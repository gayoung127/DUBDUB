import React from "react";

import CropIcon from "@/public/images/icons/icon-scissor.svg";
import DeleteIcon from "@/public/images/icons/icon-trashbin.svg";

const AudioBlockModal = () => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-3 rounded-lg px-3 py-3">
      <div className="">
        <CropIcon width={24} height={24} />
        <DeleteIcon width={24} height={24} />
      </div>
    </div>
  );
};

export default AudioBlockModal;
