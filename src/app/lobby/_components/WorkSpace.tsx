"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import RoomCard from "./RoomCard";
import H2 from "@/app/_components/H2";
import H3 from "@/app/_components/H3";
import Button from "@/app/_components/Button";

interface WorkSpaceProps {
  dubbingRooms: DubbingRoom[];
  setPage: (prev: (prev: number) => number) => void;
  isFetching: boolean;
  isLastPage: boolean;
}

const WorkSpace = ({
  dubbingRooms,
  setPage,
  isFetching,
  isLastPage,
}: WorkSpaceProps) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!lastElementRef.current) {
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
    if (isLastPage) {
      console.log("비활성화");
      observer.disconnect();
    }

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
          <H2>나의 작업물이 없습니다.</H2>
          <H3>프로젝트를 생성하고 친구들을 초대해보세요.</H3>
          <Button
            outline
            onClick={() => {
              router.push("/lobby/create");
            }}
          >
            👉 프로젝트 만들기 👈
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkSpace;
