"use client";

import Filter from "./_components/Filter";
import TabMenu from "./_components/TabMenu";
import Button from "../_components/Button";
import { useSearchParams } from "next/navigation";
import DubRoomArea from "./_components/DubRoomArea";
import Header from "../_components/Header";

const LobbyPage = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "all"; // 기본값: "all"

  const handleCreateRoom = () => {
    alert("방 생성 이동");
  };

  const tabs = [
    { title: "전체 더빙룸", href: "/lobby?tab=all" },
    { title: "참여 예정 더빙룸", href: "/lobby?tab=my" },
  ];

  // API ================================
  const roomData = [
    {
      id: 1,
      thumbnail: "https://picsum.photos/300/200",
      title: "짱구 더빙하실 분",
      time: "02/21:14:00~02/21:17:00",
      badges: ["영화", "스릴러", "공포"],
      limit: 6,
      count: 2,
    },
    {
      id: 2,
      thumbnail: "https://picsum.photos/300/200",
      title: "코난 더빙하실 분",
      time: "02/22:14:00~02/22:17:00",
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
      badges: ["드라마", "로맨스"],
      limit: 5,
      count: 3,
    },
    {
      id: 4,
      thumbnail: "https://picsum.photos/300/200",
      title: "판타지 더빙 모임",
      time: "02/24:14:00~02/24:17:00",
      badges: ["판타지", "SF"],
      limit: 10,
      count: 8,
    },
    {
      id: 5,
      thumbnail: "https://picsum.photos/300/200",
      title: "공포 더빙 모임",
      time: "02/25:14:00~02/25:17:00",
      badges: ["공포", "스릴러"],
      limit: 7,
      count: 6,
    },
    {
      id: 6,
      thumbnail: "https://picsum.photos/300/200",
      title: "일상 더빙 모임",
      time: "02/26:14:00~02/26:17:00",
      badges: ["일상", "기타"],
      limit: 4,
      count: 3,
    },
    {
      id: 7,
      thumbnail: "https://picsum.photos/300/200",
      title: "코믹 더빙 모임",
      time: "02/27:14:00~02/27:17:00",
      badges: ["코믹", "광고/CF"],
      limit: 6,
      count: 5,
    },
    {
      id: 8,
      thumbnail: "https://picsum.photos/300/200",
      title: "로맨스 더빙 모임",
      time: "02/28:14:00~02/28:17:00",
      badges: ["로맨스", "드라마"],
      limit: 10,
      count: 7,
    },
    {
      id: 9,
      thumbnail: "https://picsum.photos/300/200",
      title: "액션 더빙 모임",
      time: "03/01:14:00~03/01:17:00",
      badges: ["액션", "판타지"],
      limit: 8,
      count: 5,
    },
    {
      id: 10,
      thumbnail: "https://picsum.photos/300/200",
      title: "다큐멘터리 더빙 모임",
      time: "03/02:14:00~03/02:17:00",
      badges: ["다큐멘터리", "기타"],
      limit: 4,
      count: 2,
    },
    {
      id: 11,
      thumbnail: "https://picsum.photos/300/200",
      title: "스릴러 더빙 모임",
      time: "03/03:14:00~03/03:17:00",
      badges: ["스릴러", "공포"],
      limit: 6,
      count: 3,
    },
    {
      id: 12,
      thumbnail: "https://picsum.photos/300/200",
      title: "판타지 더빙 모임",
      time: "03/04:14:00~03/04:17:00",
      badges: ["판타지", "액션"],
      limit: 10,
      count: 8,
    },
    {
      id: 13,
      thumbnail: "https://picsum.photos/300/200",
      title: "광고 더빙 모임",
      time: "03/05:14:00~03/05:17:00",
      badges: ["광고/CF", "다큐멘터리"],
      limit: 7,
      count: 4,
    },
    {
      id: 14,
      thumbnail: "https://picsum.photos/300/200",
      title: "애니메이션 더빙 모임",
      time: "03/06:14:00~03/06:17:00",
      badges: ["애니메이션", "코믹"],
      limit: 6,
      count: 3,
    },
    {
      id: 15,
      thumbnail: "https://picsum.photos/300/200",
      title: "스릴러 더빙 모임",
      time: "03/07:14:00~03/07:17:00",
      badges: ["스릴러", "공포"],
      limit: 8,
      count: 6,
    },
  ];
  // =====================================

  return (
    <div className="flex h-full flex-col gap-5">
      <Header />

      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex h-full">
          <div className="flex flex-[2] items-center justify-center pl-3">
            <Filter />
          </div>

          <div className="flex flex-[8] flex-col justify-center">
            <div className="p-5">
              <div className="flex w-full justify-between border-b border-gray-200 px-5 pb-3">
                <TabMenu tabs={tabs} />
                <Button onClick={() => handleCreateRoom()}>
                  + 더빙룸 생성하기
                </Button>
              </div>
              <div className="mt-5">
                {tab === "all" && <DubRoomArea dubbingRooms={roomData} />}
                {tab === "my" && <DubRoomArea dubbingRooms={roomData} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
