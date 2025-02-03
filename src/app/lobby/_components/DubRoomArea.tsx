"use client";

import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";
import useFilterStore from "@/app/_store/FilterStore";
import { getRoomList } from "@/app/_apis/roomlist";

interface DubbingRoom {
  id: number;
  thumbnail: string;
  title: string;
  time: string;
  isLive: boolean;
  badges: string[];
  limit: number;
  count: number;
}

interface DubbingRoomListProps {
  dubbingRooms: DubbingRoom[];
}

const DubRoomArea = ({ tab }: { tab: string }) => {
  const { timeFilter, typeFilter, genreFilter } = useFilterStore();
  const [dubbingRooms, setDubbingRooms] = useState<DubbingRoom[]>([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  // ✅ 필터 값 설정
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: PAGE_SIZE.toString(),
    onAir: timeFilter.includes("ON AIR") ? "true" : "false",
    isPrivate: "false", // 공개방만 가져옴
    isRecruiting: "true", // 모집 중인 방만
    participationType: "ALL", // 내가 참여한 리스트가 아닌 전체 리스트

    genreIds: "",
    // if (filters.search) queryParams.append("search", filters.search);
    // if (filters.time) queryParams.append("onAir", filters.time === "ON AIR" ? "true" : "false");
    // if (filters.types.length) queryParams.append("categoryIds", filters.types.join(","));
    // if (filters.genres.length) queryParams.append("genreIds", filters.genres.join(","));
  });

  const getRooms = async () => {
    const list = await getRoomList(`${queryParams}`);
    setDubbingRooms(list);
  };

  useEffect(() => {
    getRooms();
  }, [tab]);

  return (
    <div className="h-[730px] w-full overflow-scroll px-5 py-3">
      <div className="grid grid-cols-4 gap-5">
        {dubbingRooms.map((room) => (
          <RoomCard key={room.id} roomInfo={room} />
        ))}
      </div>
    </div>
  );
};

export default DubRoomArea;
