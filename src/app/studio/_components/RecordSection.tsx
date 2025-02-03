"use client";

import React, { useEffect, useRef, useState } from "react";

import { AudioFile, initialTracks, Track } from "@/app/_types/studio";

import H4 from "@/app/_components/H4";

import Timeline from "./Timeline";
import VideoTrack from "./VideoTrack";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AudioTrackTimeline from "./AudioTrackTimeline";
import AudioTrackHeader from "./AudioTrackHeader";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  const trackListRef = useRef<HTMLDivElement | null>(null);
  const timelineTracksRef = useRef<HTMLDivElement | null>(null);

  // ✅ 휠 스크롤을 활용하여 동기화
  useEffect(() => {
    const headerEl = trackListRef.current;
    const timelineEl = timelineTracksRef.current;

    if (!headerEl || !timelineEl) return;

    const syncScroll = (event: WheelEvent) => {
      event.preventDefault(); // 기본 스크롤 방지

      headerEl.scrollTop += event.deltaY;
      timelineEl.scrollTop += event.deltaY;
    };

    headerEl.addEventListener("wheel", syncScroll, { passive: false });
    timelineEl.addEventListener("wheel", syncScroll, { passive: false });

    return () => {
      headerEl.removeEventListener("wheel", syncScroll);
      timelineEl.removeEventListener("wheel", syncScroll);
    };
  }, []);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const loadAudioFiles = async () => {
      if (!audioContextRef.current) return;
      const context = audioContextRef.current;

      for (const track of initialTracks) {
        for (const file of track.files) {
          if (!audioBuffersRef.current.has(file.url)) {
            const response = await fetch(file.url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);
            audioBuffersRef.current.set(file.url, audioBuffer);
          }
        }
      }
    };

    loadAudioFiles();
  }, []);

  return (
    <section className="flex h-full w-full flex-row items-start justify-start overflow-hidden">
      {/* 🎯 Track Header (왼쪽 트랙 목록) */}
      <div className="flex h-full w-[280px] flex-shrink-0 flex-col border border-gray-300 bg-gray-400">
        {/* 🔹 "녹음 세션" 헤더 (고정) */}
        <div className="sticky top-0 z-10 flex h-[60px] w-full flex-row items-center justify-start border-b border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        {/* 🔹 트랙 목록 (스크롤 가능) */}
        <div
          ref={trackListRef}
          className="scrollbar-track flex-1 overflow-y-auto pr-1"
        >
          {tracks.map((track) => (
            <AudioTrackHeader key={track.trackId} trackId={track.trackId} />
          ))}
        </div>
      </div>

      {/* 🎯 Timeline (오른쪽 타임라인) */}
      <div className="flex h-full w-full flex-col border border-gray-300 bg-gray-400">
        {/* 🔹 "타임라인" 헤더 (고정) */}
        <div className="sticky top-0 z-10 flex h-[60px] w-full flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          <Timeline totalDuration={160} />
        </div>
        {/* 🔹 타임라인 트랙 목록 (스크롤 가능) */}
        <div
          ref={timelineTracksRef}
          className="scrollbar-horizontal flex-1 overflow-y-auto overflow-x-scroll"
        >
          {tracks.map((track) => (
            <AudioTrackTimeline
              key={track.trackId}
              trackId={track.trackId}
              files={track.files}
              totalDuration={160}
              waveColor={track.waveColor}
              blockColor={track.blockColor}
              audioContext={audioContextRef.current}
              audioBuffers={audioBuffersRef.current}
              setTracks={setTracks}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
