"use client";

import React, { useRef, useEffect, useState } from "react";
import TimelinePointer from "@/public/images/icons/icon-timeline-pointer.svg";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useTimeStore } from "@/app/_store/TimeStore";
import { PX_PER_SECOND } from "@/app/_types/studio";

gsap.registerPlugin(Draggable);

interface TimelineMarkerProps {
  timelineRef: React.RefObject<HTMLDivElement | null>;
}

const TimelineMarker = ({ timelineRef }: TimelineMarkerProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const { time, setTimeFromPx } = useTimeStore();

  useEffect(() => {
    if (markerRef.current) {
      gsap.to(markerRef.current, { x: time * PX_PER_SECOND, duration: 0.1 });
    }
  }, [time]);

  useEffect(() => {
    if (!markerRef.current || !timelineRef.current) return;

    Draggable.create(markerRef.current, {
      type: "x",
      bounds: timelineRef.current,
      inertia: true,
      autoScroll: 1,
      onDrag: function () {
        setTimeFromPx(this.x);
      },
    });
  }, []);

  return (
    <>
      <div
        ref={markerRef}
        style={{
          top: "18px",
          position: "absolute",
          transition: "left 0.1s ease-in-out",
          zIndex: 9999,
        }}
      >
        <div style={{ transform: "translateX(-6px)" }}>
          <TimelinePointer width={12} height={12} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "6px",
            width: ".5px",
            height: "36vh",
            backgroundColor: "#f6f6f6",
            transform: "translateX(-6px)",
            zIndex: 9999,
          }}
        />
      </div>
    </>
  );
};

export default TimelineMarker;
