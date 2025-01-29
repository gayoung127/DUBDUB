"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelinePointer from "@/public/images/icons/icon-timeline-pointer.svg";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

interface TimelineMarkerProps {
  markerPosition: number;
  setMarkerPosition: React.Dispatch<React.SetStateAction<number>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  // currentTime: number;
  // setCurrentTime: (time: number) => void;
  // totalDuration: number;
  // timelineWidth: number;
  // timelineScrollRef: React.RefObject<HTMLDivElement | null>;
  // trackScrollRef: React.RefObject<HTMLDivElement | null>;
}

const TimelineMarker = ({
  markerPosition,
  setMarkerPosition,
  timelineRef,
}: TimelineMarkerProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!markerRef.current || !timelineRef.current) return;

    Draggable.create(markerRef.current, {
      type: "x",
      bounds: timelineRef.current, // ✅ 타임라인 내부에서만 이동 가능
      inertia: true, // ✅ 부드러운 모멘텀 적용
      autoScroll: 1, // ✅ 자동 스크롤 비활성화 (부모 요소 움직임 방지)
    });
  }, [setMarkerPosition]);

  return (
    <>
      <div
        ref={markerRef}
        style={{
          left: `${markerPosition}px`,
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
