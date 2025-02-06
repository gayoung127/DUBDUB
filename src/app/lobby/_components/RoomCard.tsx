"use client";
import React from "react";
import Badge from "@/app/_components/Badge";
import C1 from "@/app/_components/C1";
import H3 from "@/app/_components/H3";
import ClockIcon from "@/public/images/icons/icon-clock.svg";
import PersonIcon from "@/public/images/icons/icon-person.svg";
import { useRouter } from "next/navigation";

const RoomCard = ({
  roomInfo: {
    id,
    title,
    startTime,
    endTime,
    isRecruiting,
    onAir,
    currentParticipants,
    totalParticipants,
    authorId,
    genres,
    categories,
  },
}: {
  roomInfo: DubbingRoom;
}) => {
  const router = useRouter();
  function handleRoomClick(id: number) {
    router.push(`lobby/${id}`);
  }

  return (
    <div
      className="flex w-[300px] cursor-pointer flex-col gap-3 rounded-[8px] p-4 hover:bg-white-100 hover:shadow-dub"
      onClick={() => {
        handleRoomClick(id);
      }}
    >
      <div className="relative">
        <img src={"https://picsum.photos/300/200"} className="rounded-[4px]" />
        {onAir ? (
          <Badge title="ON AIR" className="absolute right-2 top-2" />
        ) : (
          <Badge title="대기 중" className="absolute right-2 top-2" />
        )}
      </div>
      <C1>
        <div className="flex items-center gap-2">
          <ClockIcon /> {startTime} ~ {endTime}
        </div>
      </C1>

      <H3>{title}</H3>
      <div className="flex h-[4rem] flex-wrap items-center gap-2 overflow-hidden">
        {genres &&
          genres.map((g) => <Badge key={g} id={{ num: g, type: "genre" }} />)}
        {categories &&
          categories.map((c) => (
            <Badge key={c} id={{ num: c, type: "category" }} />
          ))}
      </div>
      <C1>
        <div className="flex items-center gap-2">
          <PersonIcon />
          {currentParticipants} / {totalParticipants}
        </div>
      </C1>
    </div>
  );
};

export default RoomCard;
