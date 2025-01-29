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

  return (
    <div
      ref={timelineRef}
      className="relative flex h-[20px] w-full border-b border-gray-300 bg-gray-400"
    >
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
