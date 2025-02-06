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

  // ==========================
  const [page, setPage] = useState<number>(0);
  const [dubbingRooms, setDubbingRooms] = useState<DubbingRoom[]>([]);
  //const PAGE_SIZE = 16;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const getRooms = async () => {
    const list = await getRoomList("my", page, false);
    if (list.length === 0) {
      setIsLastPage(true);
    }
    if (page === 0) {
      setDubbingRooms([...(list ?? [])]);
    } else {
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
                  isLastPage={isLastPage}
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
