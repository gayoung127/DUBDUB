"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelinePointer from "@/public/images/icons/icon-timeline-pointer.svg";

interface TimelineMarkerProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  totalDuration: number;
  timelineWidth: number;
}

const TimelineMarker = ({
  currentTime,
  setCurrentTime,
  totalDuration,
  timelineWidth,
}: TimelineMarkerProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const markerPosition = (currentTime / totalDuration) * timelineWidth;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !markerRef.current) return;

    const timelineRect =
      markerRef.current.parentElement?.getBoundingClientRect();
    if (!timelineRect) return;

    const newTime =
      ((e.clientX - timelineRect.left) / timelineWidth) * totalDuration;

    if (newTime >= 0 && newTime <= totalDuration) {
      setCurrentTime(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    <div
      ref={markerRef}
      style={{
        left: `${markerPosition - 6}px`,
        top: "18px",
        position: "absolute",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-6px",
          left: "-6px",
          width: "24px",
          height: "24px",
          background: "transparent",
        }}
        onMouseDown={handleMouseDown}
      ></div>
      <TimelinePointer width={12} height={12} />
    </div>
  );
};

export default TimelineMarker;
