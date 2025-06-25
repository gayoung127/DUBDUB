import React from "react";
import Title from "./Title";
import DubbingDate from "./DubbingDate";
import Thumbnail from "./Thumbnail";
import DescriptionBox from "./DescriptionBox";
import Badges from "./Badges";

/*
가지고 와야 할 것
1. 썸네일 이미지
2. 더빙룸 상태
2. 제목
3. 더빙 일자, 시작 시간, 예상 종료 시간
4. 타입, 장르 선택 정보
5. 설명
*/

interface DubbingInfoProps {
  thumbnail: string;
  roomStatus: string;
  title: string;
  dubbingDate: string;
  badges: string[];
  description: string;
}

const DubbingInfo = ({
  dubbingInfoData: {
    thumbnail,
    roomStatus,
    title,
    dubbingDate,
    badges,
    description,
  },
}: {
  dubbingInfoData: DubbingInfoProps;
}) => {
  return (
    <section className="flex flex-row gap-6">
      <Thumbnail thumbnail={thumbnail} roomStatus={roomStatus} />
      <div className="flex h-[236px] w-[308px] flex-col">
        <Title title={title} />
        <DubbingDate dubbingDate={dubbingDate} />
        <div className="flex h-[168px] flex-col">
          <Badges badges={badges} />
          <DescriptionBox description={description} />
        </div>
      </div>
    </section>
  );
};

export default DubbingInfo;
