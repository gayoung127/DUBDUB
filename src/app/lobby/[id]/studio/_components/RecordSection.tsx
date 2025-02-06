"use client";

import React, { useEffect, useRef, useState } from "react";

import { AudioFile, initialTracks, Track } from "@/app/_types/studio";

import H4 from "@/app/_components/H4";

import Timeline from "./Timeline";
import AudioTrackTimeline from "./AudioTrackTimeline";
import AudioTrackHeader from "./AudioTrackHeader";

import VideoTrack from "./VideoTrack";
import { mergeAudioBuffers } from "@/app/_utils/mergeAudioBuffers";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  // 1. 트랙 세로 스크롤 동기화
  const trackListRef = useRef<HTMLDivElement | null>(null);
  const timelineTracksRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const headerEl = trackListRef.current;
    const timelineEl = timelineTracksRef.current;

    if (!headerEl || !timelineEl) return;

    const syncScroll = (event: WheelEvent) => {
      event.preventDefault();

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
    if (!audioContextRef.current) return;

    const blocks = tracks
      .flatMap((track) =>
        track.files.map((file) => ({
          file,
          audioBuffers: audioBuffersRef.current, // ✅ audioBuffers 전달
        })),
      )
      .filter((block) => block.audioBuffers?.get(block.file.url));
  }, [tracks]);

  useEffect(() => {
    console.log("호출찡호출찡", tracks);

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const loadAudioFiles = async () => {
      if (!audioContextRef.current) return;
      const context = audioContextRef.current;

      for (const track of tracks) {
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
  }, [setTracks, tracks]);

  return (
    <section className="flex h-full w-full flex-row items-start justify-start overflow-hidden">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-col items-start justify-start overflow-hidden border border-gray-300 bg-gray-400">
        <div className="">
          <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border-b border-t border-gray-300 bg-gray-400 px-5 py-5">
            <H4 className="border-b-2 border-white-100 font-bold text-white-100">
              녹음 세션
            </H4>
          </div>
          <div className="h-full w-full">
            {tracks.map((track) => (
              <AudioTrackHeader
                key={track.trackId}
                trackId={track.trackId}
                recorderId={track.recorderId}
                recorderName={track.recorderName}
                recorderRole={track.recorderRole}
                recorderProfileUrl={track.recorderProfileUrl}
                setTracks={setTracks}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-2 flex h-full w-full flex-col items-start justify-start overflow-x-hidden border border-gray-300 bg-gray-400">
        <div className="scrollbar-horizontal overflow-x-scoll mb-2 h-full w-full overflow-y-hidden">
          <div className="flex h-[60px] w-full flex-grow-0 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
            <Timeline totalDuration={160} />
          </div>
          <div className="h-full w-full">
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
      </div>
    </section>
  );
};

export default RecordSection;
