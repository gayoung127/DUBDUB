"use client";

import { useEffect, useRef } from "react";
import RoomCard from "./RoomCard";
import H2 from "@/app/_components/H2";
import H3 from "@/app/_components/H3";
import Button from "@/app/_components/Button";

interface DubRoomAreaProps {
  dubbingRooms: DubbingRoom[];
  setPage: (prev: (prev: number) => number) => void;
  isFetching: boolean;
}

const DubRoomArea = ({
  dubbingRooms,
  setPage,
  isFetching,
}: DubRoomAreaProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lastElementRef.current) {
      console.log("❌ lastElementRef.current가 NULL입니다 ㅠ ㅠ");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          console.log("✅ 스크롤 컨테이너 안에서 감지됨: 다음 페이지 로드");
          setPage((prev) => prev + 1);
        }
      },
      {
        root: document.querySelector(".overflow-scroll"),
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    observer.observe(lastElementRef.current);

    return () => observer.disconnect();
  }, [dubbingRooms, isFetching]);

  return (
    <div className="h-[730px] w-full overflow-scroll px-5 py-3">
      {dubbingRooms.length != 0 ? (
        <div className="grid grid-cols-4 gap-5">
          {dubbingRooms.map((room, index) => (
            <div
              key={index}
              ref={index === dubbingRooms.length - 1 ? lastElementRef : null}
            >
              <RoomCard roomInfo={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-10">
          <H2>현재 참여할 수 있는 더빙룸이 없습니다.</H2>
          <H3>더빙룸을 생성하여 사람들을 모아 보세요!</H3>
          <Button outline onClick={() => {}}>
            👉 더빙룸 생성하러 가기 👈
          </Button>
        </div>
      )}
    </div>
  );
};

export default DubRoomArea;
