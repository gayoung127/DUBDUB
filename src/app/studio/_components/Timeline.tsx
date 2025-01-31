"use client";

import React, { useRef } from "react";
import TimelineMarker from "./TimelineMarker";
import { formatTime } from "@/app/_utils/formatTime";

interface TimelineProps {
  totalDuration: number;
}

const Timeline = ({ totalDuration }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const timelineWidth = totalDuration * 80;
  const mainTickInterval = timelineWidth / totalDuration;
  const subTickInterval = mainTickInterval / 10;

  return (
    <div
      ref={timelineRef}
      className="relative box-border border-b border-gray-300"
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
        {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => {
          const position = Math.round(i * mainTickInterval);
          if (position > timelineWidth) {
            return null;
          }

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

        {Array.from({ length: Math.ceil(totalDuration / 0.2) }).map((_, i) => {
          const position = Math.round(i * subTickInterval);
          if (position > timelineWidth) {
            return null;
          }

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
