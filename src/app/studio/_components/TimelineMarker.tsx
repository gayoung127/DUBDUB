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
      bounds: timelineRef.current,
      inertia: true,
      autoScroll: 1,
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
          transition: "left 0.1s ease-in-out",
        }}
      >
        {/* 실제 아이콘만 -6px 이동 */}
        <div style={{ transform: "translateX(-6px)" }}>
          <TimelinePointer width={12} height={12} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "10px", // 마커 아이콘 아래
            left: "6px", // 마커 중앙 정렬
            width: ".5px",
            height: "36vh", // 전체 트랙을 덮도록 설정
            backgroundColor: "#f6f6f6", // 줄 색상
            pointerEvents: "none", // 마우스 이벤트 방해 안 받도록
            transform: "translateX(-6px)",
          }}
        />
      </div>
    </>
  );
};

export default TimelineMarker;
