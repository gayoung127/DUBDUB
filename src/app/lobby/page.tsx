"use client";

import Filter from "./_components/Filter";
import TabMenu from "./_components/TabMenu";
import Button from "../_components/Button";
import { useSearchParams } from "next/navigation";
import DubRoomArea from "./_components/DubRoomArea";

const LobbyPage = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "all"; // 기본값: "all"

  const handleCreateRoom = () => {
    alert("방 생성 이동");
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-screen flex-[2] items-center justify-center pl-3">
        <Filter />
      </div>

      <div className="flex h-screen flex-[8] flex-col">
        <div className="p-5">
          <div className="flex w-full justify-between border-b border-gray-500 px-5 pb-3">
            <TabMenu />
            <Button onClick={() => handleCreateRoom()}>
              + 더빙룸 생성하기
            </Button>
          </div>
          <div className="mt-5">
            {tab === "all" && <DubRoomArea isAll={true} />}
            {tab === "my" && <DubRoomArea isAll={false} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
