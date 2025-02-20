"use client";

import Filter from "./_components/Filter";
import TabMenu from "./_components/TabMenu";
import Button from "../_components/Button";
import { useSearchParams } from "next/navigation";
import WorkSpace from "./_components/WorkSpace";
import Header from "../_components/Header";
import { useEffect, useRef, useState } from "react";
import useFilterStore from "../_store/FilterStore";
import { categories, genres } from "../_utils/filterTypes";
import { getRoomList } from "../_apis/roomlist";
import { useRouter } from "next/navigation";

const LobbyPage = () => {
  const {
    categoryFilter,
    genreFilter,
    isFiltered,
    setIsFiltered,
    keyword,
    initiateFilter,
  } = useFilterStore();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "CREATED";
  const PAGE_SIZE = 16;
  const [dubbingRooms, setDubbingRooms] = useState<DubbingRoom[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const router = useRouter();

  const getIndexes = (
    filterArray: string[],
    allOptions: string[],
  ): number[] => {
    return filterArray
      .map((item) => allOptions.indexOf(item) + 1)
      .filter((id) => id > 0);
  };

  const getRooms = async () => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: PAGE_SIZE.toString(),
      type: tab,
    });

    const { list, last } = await getRoomList(`${queryParams}`);
    // const list = pageSearch;
    // const last = true;
    if (last) {
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

  useEffect(() => {
    if (isFiltered) {
      if (page !== 0) {
        setPage(0);
      } else {
        getRooms();
      }
    }
  }, [isFiltered]);

  const handleCreateRoom = () => {
    router.push("/create");
  };

  const tabs = [
    { title: "나의 프로젝트", href: "/lobby?tab=CREATED" },
    { title: "참여 프로젝트", href: "/lobby?tab=JOINED" },
  ];

  return (
    <div className="flex h-full flex-col gap-5 bg-gray-400">
      <Header />

      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex h-full">
          {/* <div className="flex flex-[2] items-center justify-center pl-3">
            <Filter
              onClick={async () => {
                await setIsFiltered(false);
                await setIsFiltered(true);
              }}
            />
          </div> */}

          <div className="flex flex-[8] flex-col justify-center">
            <div className="border-gray-300 bg-gray-400 p-1">
              <div className="flex w-full justify-between border-b border-gray-200 px-5 pb-3">
                <TabMenu tabs={tabs} />
                <Button onClick={() => handleCreateRoom()}>
                  + 프로젝트 만들기
                </Button>
              </div>
              <div className="mt-5 px-4">
                <WorkSpace
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

export default LobbyPage;
