"use client";

import Button from "../_components/Button";
import { useSearchParams } from "next/navigation";
import Header from "../_components/Header";
import Profile from "./_components/Profile";
import DubRoomArea from "../lobby/_components/DubRoomArea";
import TabMenu from "../lobby/_components/TabMenu";
import { useEffect, useState } from "react";
import { getRoomList } from "../_apis/roomlist";

const MyPage = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "upcoming"; // 기본값: "all"

  const tabs = [
    { title: "참여 예정 더빙룸", href: "/my?tab=upcoming" },
    { title: "내 작성 더빙룸", href: "/my?tab=my" },
  ];

  // API ================================
  const profileData = {
    nickname: "SSAFY",
    email: "1247840@ssafy.com",
    profileImage: "https://picsum.photos/200/200",
    grade: "PRO",
  };

  const roomData = [
    {
      id: 1,
      thumbnail: "https://picsum.photos/300/200",
      title: "짱구 더빙하실 분",
      time: "02/21:14:00~02/21:17:00",
      isLive: false,
      badges: ["영화", "스릴러", "공포"],
      limit: 6,
      count: 2,
    },
    {
      id: 2,
      thumbnail: "https://picsum.photos/300/200",
      title: "코난 더빙하실 분",
      time: "02/22:14:00~02/22:17:00",
      isLive: false,
      badges: [
        "애니메이션",
        "다큐멘터리",
        "액션",
        "스릴러",
        "로맨스",
        "SF",
        "공포",
        "일상",
      ],
      limit: 8,
      count: 4,
    },
    {
      id: 3,
      thumbnail: "https://picsum.photos/300/200",
      title: "드라마 더빙 모임",
      time: "02/23:14:00~02/23:17:00",
      isLive: false,
      badges: ["드라마", "로맨스"],
      limit: 5,
      count: 3,
    },
    {
      id: 4,
      thumbnail: "https://picsum.photos/300/200",
      title: "판타지 더빙 모임",
      time: "02/24:14:00~02/24:17:00",
      isLive: false,
      badges: ["판타지", "SF"],
      limit: 10,
      count: 8,
    },
    {
      id: 5,
      thumbnail: "https://picsum.photos/300/200",
      title: "공포 더빙 모임",
      time: "02/25:14:00~02/25:17:00",
      isLive: false,
      badges: ["공포", "스릴러"],
      limit: 7,
      count: 6,
    },
    {
      id: 6,
      thumbnail: "https://picsum.photos/300/200",
      title: "일상 더빙 모임",
      time: "02/26:14:00~02/26:17:00",
      isLive: false,
      badges: ["일상", "기타"],
      limit: 4,
      count: 3,
    },
  ];
  // ==========================
  const [page, setPage] = useState(0);
  const [dubbingRooms, setDubbingRooms] = useState<DubbingRoom[]>([]);
  const PAGE_SIZE = 16;
  const [isFetching, setIsFetching] = useState(false);

  const getRooms = async () => {
    const list = await getRoomList("temp", 3);
    if (page <= 2) {
      const list = await getRoomList(`temp`, page);
      setDubbingRooms([...dubbingRooms, ...(list ?? [])]);
    }
  };

  useEffect(() => {
    getRooms();
  }, [tab, page]);

  return (
    <div className="flex h-full flex-col gap-5">
      <Header />

      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex h-full">
          <div className="flex flex-[2.5] items-center justify-center pl-3">
            <Profile profileData={profileData} />
          </div>
          <div className="flex flex-[7.5] flex-col justify-center">
            <div className="p-5">
              <div className="flex w-full justify-between border-b border-gray-500 px-5 pb-3">
                <TabMenu tabs={tabs} />
              </div>
              <div className="mt-5">
                <DubRoomArea
                  dubbingRooms={dubbingRooms}
                  setPage={setPage}
                  isFetching={isFetching}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
