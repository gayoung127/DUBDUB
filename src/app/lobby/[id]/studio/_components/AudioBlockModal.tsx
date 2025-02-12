import React from "react";

import CropIcon from "@/public/images/icons/icon-scissor.svg";
import DeleteIcon from "@/public/images/icons/icon-trashbin.svg";

interface AudioBlockModalProps {
  handleCrop: () => void;
  handleDelete: () => void;
}

const AudioBlockModal = ({
  handleCrop,
  handleDelete,
}: AudioBlockModalProps) => {
  return (
    <div className="absolute left-0 top-0 flex flex-row items-center justify-start rounded-lg bg-white-300 px-1 py-1">
      <div
        className="flex h-8 w-8 cursor-pointer flex-row items-center justify-center"
        onClick={handleCrop}
      >
        <CropIcon width={16} height={16} />
      </div>
      <div
        className="flex h-8 w-8 cursor-pointer flex-row items-center justify-center"
        onClick={handleDelete}
      >
        <DeleteIcon width={16} height={16} />
      </div>
    </div>
  );
};

export default AudioBlockModal;
