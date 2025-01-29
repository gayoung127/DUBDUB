"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelinePointer from "@/public/images/icons/icon-timeline-pointer.svg";

interface TimelineMarkerProps {
  calculatedPosition: number;
  setCalculatedPosition: React.Dispatch<React.SetStateAction<number>>;
  // currentTime: number;
  // setCurrentTime: (time: number) => void;
  // totalDuration: number;
  // timelineWidth: number;
  // timelineScrollRef: React.RefObject<HTMLDivElement | null>;
  // trackScrollRef: React.RefObject<HTMLDivElement | null>;
}

const TimelineMarker = ({
  calculatedPosition,
  setCalculatedPosition,
}: TimelineMarkerProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        ref={markerRef}
        style={{
          left: `${calculatedPosition}px`,
          top: "18px",
          position: "absolute",
          cursor: "pointer",
          transition: "left 0.1s ease-in-out",
        }}
      >
        <TimelinePointer width={12} height={12} />
      </div>
    </>
  );
};

export default TimelineMarker;
