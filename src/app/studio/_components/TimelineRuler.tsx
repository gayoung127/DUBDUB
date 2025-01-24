"use client";
import React, { useEffect, useRef, useState } from "react";
import Ruler from "@scena/ruler";

import TimelineMarker from "./TimelineMarker";

interface TimelineRulerProps {
  scrollPos: number; // 현재 눈금자 스크롤 위치
  setScrollPos: React.Dispatch<React.SetStateAction<number>>; // 스크롤 상태 업데이트 함수
  markerPosition: number; // 마커의 위치
  setMarkerPosition: React.Dispatch<React.SetStateAction<number>>; // 마커 위치 업데이트 함수
  isScrolling: boolean; // 스크롤 상태 여부
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>; // 스크롤 상태 업데이트 함수
  isDragging: boolean; // 드래그 상태 여부
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>; // 드래그 상태 업데이트 함수
}

const TimelineRuler = ({
  scrollPos,
  setScrollPos,
  markerPosition,
  setMarkerPosition,
  isScrolling,
  setIsScrolling,
  isDragging,
  setIsDragging,
}: TimelineRulerProps) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [rulerInstance, setRulerInstance] = useState<Ruler | null>(null); // Ruler 인스턴스 관리

  useEffect(() => {
    if (rulerRef.current) {
      const ruler = new Ruler(rulerRef.current, {
        type: "horizontal",
        backgroundColor: "#1d1d1d",
        lineColor: "#f6f6f6",
        textColor: "#f6f6f6",
        height: 28,
        unit: 1,
        zoom: 120,
        textFormat: (scale) => {
          const totalSeconds = Math.round(scale);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        },
      });
      setRulerInstance(ruler);

      const handleResize = () => {
        ruler.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // 마커 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const rulerLeft = rulerRef.current?.getBoundingClientRect().left || 0;
      const newPosition = e.clientX - rulerLeft;

      if (newPosition >= 0) {
        setMarkerPosition(Math.max(newPosition, 0)); // 마커 위치 업데이트

        // 오른쪽으로 스크롤 증가
        if (
          newPosition + scrollPos >=
          (rulerRef.current?.offsetWidth || 0) - 1
        ) {
          if (!isScrolling) {
            setIsScrolling(true);

            const scroll = () => {
              setScrollPos((prev) => {
                const newScrollPos = prev + 2;
                rulerInstance?.scroll(newScrollPos);

                if (
                  newPosition + newScrollPos >=
                  (rulerRef.current?.offsetWidth || 0) - 1
                ) {
                  setTimeout(() => requestAnimationFrame(scroll), 50000);
                } else {
                  setIsScrolling(false);
                }

                return newScrollPos;
              });
            };

            requestAnimationFrame(scroll);
          }
        }
        // 왼쪽으로 스크롤 감소
        if (newPosition < 50 && scrollPos > 0) {
          if (!isScrolling) {
            setIsScrolling(true);

            const scrollLeft = () => {
              setScrollPos((prev) => {
                const newScrollPos = Math.max(prev - 2, 0); // 스크롤 감소, 최소값 0
                rulerInstance?.scroll(newScrollPos);

                if (newScrollPos > 0 && newPosition < 50) {
                  setTimeout(() => requestAnimationFrame(scrollLeft), 500);
                } else {
                  setIsScrolling(false); // 스크롤 중단 상태
                }

                return newScrollPos;
              });
            };

            requestAnimationFrame(scrollLeft); // 첫 번째 호출
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsScrolling(false); // 드래그 종료 시 스크롤도 종료
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative w-full bg-gray-400">
      {/* 눈금자 */}
      <div ref={rulerRef} className="relative h-7">
        {/* 드래그 가능한 마커 */}
        <TimelineMarker
          markerRef={markerRef}
          markerPosition={markerPosition}
          handleMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default TimelineRuler;
