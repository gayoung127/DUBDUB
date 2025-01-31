"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelineMarker from "./TimelineMarker";
import { formatTime } from "@/app/_utils/formatTime";

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
  const [timelineWidth, setTimelineWidth] = useState(totalDuration * 80);

  const mainTickInterval = timelineWidth / totalDuration;
  const subTickInterval = mainTickInterval / 10;

  useEffect(() => {
    if (timelineRef.current) {
      setTimelineWidth(timelineRef.current.scrollWidth);
    }
  }, []);

  // const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (!timelineRef.current || !timelineScrollRef.current) return;

  //   const timelineRect = timelineRef.current.getBoundingClientRect();
  //   const scrollLeft = timelineScrollRef.current.scrollLeft;
  //   const clickX = e.clientX - timelineRect.left + scrollLeft;

  //   setMarkerPosition(clickX);
  // };

  return (
    <div
      ref={timelineRef}
      // onClick={handleTimelineClick}
      className="relative box-border border-b border-gray-300"
      style={{ width: timelineWidth }}
    >
      <div className="absolute bottom-0 left-0 h-[50%] w-full" />
      <div className="relative flex h-[30px] w-full flex-grow-0 items-center">
        {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => {
          const timeLabel = i;

          return (
            <div
              key={`main-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${Math.round(i * mainTickInterval)}px` }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-normal text-white-200">
                  {formatTime(timeLabel, "marker")}
                </span>

                <div className="h-4 w-[1px] bg-white-100"></div>
              </div>
            </div>
          );
        })}

        {Array.from({ length: Math.ceil(totalDuration / 0.2) }).map((_, i) => {
          if (i % 10 === 0) return null;
          return (
            <div
              key={`sub-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${Math.round(i * subTickInterval)}px` }}
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
