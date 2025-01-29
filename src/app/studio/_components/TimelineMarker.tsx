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
        <TimelinePointer width={12} height={12} />
      </div>
    </>
  );
};

export default TimelineMarker;
