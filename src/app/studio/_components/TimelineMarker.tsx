"use client";

import React from "react";
import TimelinePointer from "@/public/images/icons/icon-timeline-pointer.svg";

interface TimelineMarkerProps {
  markerRef: React.RefObject<HTMLDivElement | null>;
  markerPosition: number;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const TimelineMarker = ({
  markerRef,
  markerPosition,
  handleMouseDown,
}: TimelineMarkerProps) => {
  return (
    <div
      ref={markerRef}
      style={{
        left: `${markerPosition - 6}px`, // 삼각형의 아랫꼭지점을 기준으로 보정
        top: "16px", // 마커가 눈금자 위로 위치하도록 설정
        position: "absolute",
      }}
      onMouseDown={handleMouseDown}
      className="relative cursor-pointer"
    >
      {/* 드래그 가능한 영역 확대 */}
      <div
        style={{
          position: "absolute",
          top: "-6px", // 보이는 영역 기준으로 위아래 여유 공간 추가
          left: "-6px",
          width: "24px", // 실제 드래그 가능한 영역
          height: "24px",
          background: "transparent", // 투명 처리
        }}
      ></div>
      {/* 마커 아이콘 */}
      <TimelinePointer width={12} height={12} />
    </div>
  );
};

export default TimelineMarker;
