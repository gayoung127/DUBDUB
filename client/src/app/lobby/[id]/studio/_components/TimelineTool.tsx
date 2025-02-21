import React from "react";

import RedoIcon from "@/public/images/icons/icon-redo.svg";
import UndoIcon from "@/public/images/icons/icon-undo.svg";
import MarkerIcon from "@/public/images/icons/icon-marker.svg";
import CropIcon from "@/public/images/icons/icon-crop.svg";
import TrashbinIcon from "@/public/images/icons/icon-trashbin.svg";

const TimelineTool = () => {
  return (
    <section className="flex w-full flex-row items-center justify-start gap-x-4 px-6 py-3">
      <div>
        <RedoIcon width={16} height={16} />
      </div>
      <div>
        <UndoIcon width={16} height={16} />
      </div>
      <div>
        <MarkerIcon width={16} height={16} />
      </div>
      <div>
        <CropIcon width={16} height={16} />
      </div>
      <div>
        <TrashbinIcon width={16} height={16} />
      </div>
    </section>
  );
};

export default TimelineTool;
