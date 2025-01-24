"use client";

import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";

import TimelineTool from "./TimelineTool";
import TimelineRuler from "./TimelineRuler";

import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";

const RecordSection = () => {
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [markerPosition, setMarkerPosition] = useState<number>(0);

  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return (
    <section className="flex h-full w-full flex-grow flex-col items-start justify-start">
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        <div className="flex h-[60px] w-full flex-1 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          <TimelineRuler
            scrollPos={scrollPos}
            setScrollPos={setScrollPos}
            markerPosition={markerPosition}
            setMarkerPosition={setMarkerPosition}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-col items-start justify-start bg-gray-400">
        <VideoTrack />
        <AudioTrack trackNumber={1} />
        <AudioTrack trackNumber={2} />
        <AudioTrack trackNumber={3} />
        <AudioTrack trackNumber={4} />
        <AudioTrack trackNumber={5} />
        <AudioTrack trackNumber={6} />
      </div>
    </section>
  );
};

export default RecordSection;
