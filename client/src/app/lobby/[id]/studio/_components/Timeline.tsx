"use client";

import React, { useEffect, useRef } from "react";
import TimelineMarker from "./TimelineMarker";
import { formatTime } from "@/app/_utils/formatTime";
import { useTimeStore } from "@/app/_store/TimeStore";

interface TimelineProps {
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const Timeline = ({ duration }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { time } = useTimeStore(); // ✅ 현재 재생 위치 가져오기

  // ✅ 1초당 80px 변환
  const PX_PER_SECOND = 80;
  const timelineWidth = duration * PX_PER_SECOND;

  useEffect(() => {
    if (!timelineRef.current) return;

    const scrollContainer: HTMLElement | null = timelineRef.current.closest(
      ".scrollbar-horizontal",
    );
    if (!scrollContainer) {
      console.warn("❗ 타임라인 스크롤 컨테이너를 찾을 수 없음");
      return;
    }

    const markerPosition = time * PX_PER_SECOND;
    const scrollWidth = scrollContainer.clientWidth;
    const threshold = scrollWidth * 0.9;

    if (markerPosition > scrollContainer.scrollLeft + threshold) {
      scrollContainer.scrollLeft = markerPosition - threshold;
    }

    if (markerPosition < scrollContainer.scrollLeft + scrollWidth * 0.1) {
      scrollContainer.scrollLeft = markerPosition - scrollWidth * 0.1;
    }
  }, [time]);

  const mainTickInterval = 80; // ✅ 1초마다 눈금 생성
  const subTickInterval = mainTickInterval / 10; // ✅ 0.1초마다 작은 눈금 생성

  return (
    <div
      ref={timelineRef}
      className="relative box-border flex border-b border-gray-300"
      style={{
        width: `${timelineWidth}px`,
        minWidth: `${timelineWidth}px`,
        maxWidth: `${timelineWidth}px`,
      }}
    >
      <div
        className="relative h-[30px]"
        style={{
          width: `${timelineWidth}px`,
          minWidth: `${timelineWidth}px`,
          maxWidth: `${timelineWidth}px`,
          overflow: "hidden",
        }}
      >
        {/* ✅ 1초 간격의 주요 눈금 */}
        {Array.from({ length: duration + 1 }).map((_, i) => {
          const position = i * mainTickInterval; // ✅ 초 단위 변환
          if (position > timelineWidth) return null;
          return (
            <div
              key={`main-${i}`}
              className="absolute flex h-full items-end overflow-hidden"
              style={{ left: `${position}px` }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-normal text-white-200">
                  {formatTime(i, "marker")}
                </span>
                <div className="h-4 w-[1px] bg-white-100"></div>
              </div>
            </div>
          );
        })}

        {/* ✅ 0.1초 간격의 서브 눈금 */}
        {Array.from({ length: duration * 10 }).map((_, i) => {
          const position = i * subTickInterval; // ✅ 0.1초 단위 변환
          if (position > timelineWidth) return null;
          return (
            <div
              key={`sub-${i}`}
              className="absolute flex h-full items-end overflow-hidden"
              style={{ left: `${position}px` }}
            >
              <div
                className={`w-[1px] ${i % 2 === 0 ? "h-2" : "h-1"} bg-white-100/50`}
              ></div>
            </div>
          );
        })}
      </div>
      <TimelineMarker timelineRef={timelineRef} />
    </div>
  );
};

export default Timeline;
