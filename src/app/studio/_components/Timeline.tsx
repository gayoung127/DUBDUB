"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelineMarker from "./TimelineMarker";

interface TimelineProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  totalDuration: number;
  timelineScrollRef: React.RefObject<HTMLDivElement | null>;
  trackScrollRef: React.RefObject<HTMLDivElement | null>;
}

const Timeline = ({
  currentTime,
  setCurrentTime,
  totalDuration,
  timelineScrollRef,
  trackScrollRef,
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timelineWidth, setTimelineWidth] = useState(4000);
  const [markerPosition, setMarkerPosition] = useState<number>(0);

  const mainTickInterval = timelineWidth / totalDuration;
  const subTickInterval = mainTickInterval / 5;

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
      className="relative flex border-b border-gray-500"
      style={{ width: timelineWidth }}
    >
      <div className="absolute bottom-0 left-0 h-[50%] w-full" />
      <div className="relative flex h-[30px] w-full items-center">
        {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => {
          const timeLabel = i;

          return (
            <div
              key={`main-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${i * mainTickInterval}px` }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-normal text-white-200">
                  {timeLabel}
                </span>

                <div className="h-4 w-[1px] bg-white-100"></div>
              </div>
            </div>
          );
        })}

        {Array.from({ length: Math.ceil(totalDuration / 0.2) }).map((_, i) => {
          if (i % 5 === 0) return null;
          return (
            <div
              key={`sub-${i}`}
              className="absolute flex h-full items-end"
              style={{ left: `${i * subTickInterval}px` }}
            >
              <div className="h-2 w-[1px] bg-white-100/50"></div>
            </div>
          );
        })}
      </div>
      <TimelineMarker
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
        timelineRef={timelineRef}
      />
    </div>
  );
};

export default Timeline;
