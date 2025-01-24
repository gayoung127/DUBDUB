"use client";
import React, { useEffect, useRef } from "react";
import Ruler from "@scena/ruler";

const TimelineRuler = () => {
  const rulerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rulerRef.current) {
      const ruler = new Ruler(rulerRef.current, {
        type: "horizontal",
        backgroundColor: "#1d1d1d",
        lineColor: "#f6f6f6",
        textColor: "#f6f6f6 ",
        height: 28,
        unit: 1, // 눈금 간격 (50px)
        zoom: 120, // 줌 레벨
        textFormat: (scale) => {
          const totalSeconds = Math.round(scale); // 눈금 위치 (초 단위)
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        },
      });

      // 윈도우 크기 변경 시 리사이즈 처리
      const handleResize = () => {
        ruler.resize();
      };
      window.addEventListener("resize", handleResize);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div ref={rulerRef} className="relative w-full bg-gray-400">
      {/* 눈금자 렌더링될 영역 */}
    </div>
  );
};

export default TimelineRuler;
