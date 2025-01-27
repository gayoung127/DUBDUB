"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

import H4 from "@/app/_components/H4";

import TimelineTool from "./TimelineTool";
import TimelineRuler from "./TimelineRuler";

import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";
import Timeline from "./Timeline";

const RecordSection = () => {
  const audioTracks = [
    [
      { url: "/examples/happyhappyhappysong.mp3", startTime: 0, endTime: 10 },
      { url: "/examples/happyhappyhappysong.mp3", startTime: 12, endTime: 20 },
    ],
    [
      { url: "/examples/happyhappyhappysong.mp3", startTime: 5, endTime: 15 },
      { url: "/examples/happyhappyhappysong.mp3", startTime: 18, endTime: 30 },
    ],
  ];

  const [scrollPos, setScrollPos] = useState<number>(0);
  const [markerPosition, setMarkerPosition] = useState<number>(0);

  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      height: 28,
      waveColor: "rgb(153, 165, 255)",
      progressColor: "rgb(66, 2, 181)",
    });

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, []);

  return (
    <section className="flex h-full w-full flex-grow flex-col items-start justify-start">
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        <div className="flex h-[60px] w-full flex-1 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          {waveSurferRef.current && (
            <Timeline wavesurfer={waveSurferRef.current} />
          )}
          하이
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-col items-start justify-start bg-gray-400">
        <VideoTrack />
        {audioTracks.map((files, index) => (
          <AudioTrack key={index} trackNumber={index + 1} audioFiles={files} />
        ))}
      </div>
    </section>
  );
};

export default RecordSection;
