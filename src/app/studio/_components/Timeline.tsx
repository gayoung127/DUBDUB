"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelineMarker from "./TimelineMarker";

interface TimelineProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  totalDuration: number;
}

const Timeline = ({
  currentTime,
  setCurrentTime,
  totalDuration,
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timelineWidth, setTimelineWidth] = useState(800); // 기본값

  // ✅ 타임라인 너비 동적 계산 (화면 크기 변경 시 반영)
  useEffect(() => {
    if (timelineRef.current) {
      setTimelineWidth(timelineRef.current.offsetWidth);
    }
  }, []);

  // ✅ 메인 눈금 간격 (1초 간격)
  const mainTickInterval = timelineWidth / totalDuration;
  // ✅ 서브 눈금 간격 (0.2초 간격)
  const subTickInterval = mainTickInterval / 5;

  return (
    <div
      ref={timelineRef}
      className="relative flex w-full border-b border-gray-500"
    >
      {/* 🎨 배경 줄무늬 패턴 추가 (눈금 효과) */}
      <div
        className="absolute bottom-0 left-0 h-[50%] w-full"
        style={{
          backgroundImage: `linear-gradient(
            to right,
            rgba(255, 255, 255, 0.2) 1px,
            transparent 1px
          )`,
          backgroundSize: `${subTickInterval}px 100%`,
        }}
      />
      {/* ✅ 타임라인 눈금 & 숫자 */}
      <div className="relative flex h-[30px] w-full items-center">
        {/* 메인 눈금 (1초 간격) */}
        {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => {
          const timeLabel = i;

          return (
            <div
              key={`main-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${i * mainTickInterval}px` }}
            >
              <div className="flex flex-col gap-0.5">
                {/* ⏳ 숫자 (시간 표시) */}
                <span className="text-xs font-normal text-white-200">
                  {timeLabel}
                </span>

                {/* ⚡ 메인 눈금 (굵은 세로선) */}
                <div className="h-4 w-[1px] bg-white-100"></div>
              </div>
            </div>
          );
        })}

        {/* 서브 눈금 (0.2초 간격, 5개씩) */}
        {Array.from({ length: Math.ceil(totalDuration / 0.2) }).map((_, i) => {
          if (i % 5 === 0) return null; // 1초 간격 메인 눈금 제외
          return (
            <div
              key={`sub-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${i * subTickInterval}px` }}
            >
              {/* ⚡ 서브 눈금 (가는 세로선) */}
              <div className="h-2 w-[1px] bg-white-100/50"></div>
            </div>
          );
        })}
      </div>
      {/* ✅ 타임라인 마커 추가 */}
      <TimelineMarker
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        totalDuration={totalDuration}
        timelineWidth={timelineWidth}
      />
    </div>
  );
};

export default Timeline;
