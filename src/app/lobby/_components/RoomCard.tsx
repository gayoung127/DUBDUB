"use client";

import Badge from "@/app/_components/Badge";
import C1 from "@/app/_components/C1";
import H3 from "@/app/_components/H3";
import ClockIcon from "@/public/images/icons/icon-clock.svg";
import PersonIcon from "@/public/images/icons/icon-person.svg";

// API 나오면 수정할 것
interface RoomInfoProps {
  id: number;
  thumbnail: string;
  title: string;
  time: string;
  badges: string[];
  limit: number;
  count: number;
}

const RoomCard = ({
  roomInfo: { id, thumbnail, title, time, badges, limit, count },
}: {
  roomInfo: RoomInfoProps;
}) => {
  function handleRoomClick(id: number) {
    alert("id : " + id + " 인 더빙룸 상세 페이지 이동");
  }

  return (
    <div
      className="hover:shadow-dub flex w-[300px] cursor-pointer flex-col gap-3 rounded-[8px] p-4 hover:bg-white-100"
      onClick={() => {
        handleRoomClick(id);
      }}
    >
      <img src={thumbnail} className="rounded-[4px]" />
      <C1>
        <div className="flex items-center gap-2">
          <ClockIcon /> {time}
        </div>
      </C1>

      <H3>{title}</H3>
      <div className="flex h-[4rem] flex-wrap items-center gap-2 overflow-hidden">
        {badges.map((badge) => (
          <Badge key={badge} title={badge} />
        ))}
      </div>
      <C1>
        <div className="flex items-center gap-2">
          <PersonIcon />
          {count} / {limit}
        </div>
      </C1>
    </div>
  );
};

export default RoomCard;
