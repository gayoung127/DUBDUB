"use client";
import React from "react";
import Badge from "@/app/_components/Badge";
import C1 from "@/app/_components/C1";
import H3 from "@/app/_components/H3";
import PersonIcon from "@/public/images/icons/icon-person.svg";
import { useRouter } from "next/navigation";

const RoomCard = ({
  roomInfo: {
    id,
    title,
    currentParticipants,
    totalParticipants,
    genres,
    categories,
    thumbnail,
  },
}: {
  roomInfo: DubbingRoom & { thumbnail?: string };
}) => {
  const router = useRouter();
  function handleRoomClick(id: number) {
    router.push(`lobby/${id}/studio`);
  }

  return (
    <div
      className="hover:shadow-lg flex w-[300px] cursor-pointer flex-col gap-3 rounded-lg border border-gray-400 bg-slate-50 p-4 transition-all hover:bg-slate-200"
      onClick={() => handleRoomClick(id)}
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={thumbnail || "https://picsum.photos/300/200"}
          alt="Room Thumbnail"
          className="h-[180px] w-full rounded-md object-cover"
        />
      </div>
      <H3 className="font-semibold text-gray-900">{title}</H3>

      <C1>
        <div className="flex items-center gap-2 text-gray-700">
          <PersonIcon className="text-primary h-5 w-5" />
          <span className="font-medium text-gray-900">
            {currentParticipants} / {totalParticipants}
          </span>
        </div>
      </C1>
    </div>
  );
};

export default RoomCard;
