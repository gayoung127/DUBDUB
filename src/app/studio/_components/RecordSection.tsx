"use client";

import React, { useEffect, useRef, useState } from "react";

import { AudioFile, initialTracks, Track } from "@/app/_types/studio";

import H4 from "@/app/_components/H4";

import Timeline from "./Timeline";
import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [currentTime, setCurrentTime] = useState<number>(0); // 타임라인 현 위치
  const audioContextRef = useRef<AudioContext | null>(null); // 전역 AudioContext

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  }, []);

  // const addFileToTrack = (trackId: number, file: AudioFile) => {
  //   setTracks((prevTracks) =>
  //     prevTracks.map((track) =>
  //       track.trackId === trackId
  //         ? { ...track, files: [...track.files, file] }
  //         : track,
  //     ),
  //   );
  // };

  return (
    <section className="flex h-full w-full flex-grow flex-col items-start justify-start">
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        <div className="flex h-[60px] w-full flex-1 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          <Timeline
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            totalDuration={50}
          />
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-col items-start justify-start bg-gray-400">
        <VideoTrack />
        {tracks.map((track) => (
          <AudioTrack
            key={track.trackId}
            trackId={track.trackId}
            files={track.files}
            waveColor={track.waveColor}
            blockColor={track.blockColor}
            totalDuration={50}
            currentTime={currentTime}
            audioContext={audioContextRef.current}
          />
        ))}
      </div>
    </section>
  );
};

export default RecordSection;
