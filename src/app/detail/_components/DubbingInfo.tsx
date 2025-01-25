import React from "react";
import Title from "./Title";
import DubbingDate from "./DubbingDate";
import Thumbnail from "./Thumbnail";
import DescriptionBox from "./DescriptionBox";
import Badges from "./Badges";

const DubbingInfo = () => {
  return (
    <div className="flex flex-row gap-6">
      <Thumbnail />
      <div className="flex h-[236px] w-[308px] flex-col">
        <Title />
        <DubbingDate />
        <div className="flex h-[168px] flex-col">
          <Badges />
          <DescriptionBox />
        </div>
      </div>
    </div>
  );
};

export default DubbingInfo;
