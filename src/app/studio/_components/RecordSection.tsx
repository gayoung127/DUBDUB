"use client";

import React, { useState } from "react";
import H4 from "@/app/_components/H4";

import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";
import Timeline from "./Timeline";
import { AudioFile, initialTracks, Track } from "@/app/_types/studio";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  // ✅ 오디오 파일을 특정 트랙에 추가하는 함수
  const addFileToTrack = (trackId: number, file: AudioFile) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.trackId === trackId
          ? { ...track, files: [...track.files, file] }
          : track,
      ),
    );
  };

  return (
    <section className="flex h-full w-full flex-grow flex-col items-start justify-start">
      <div className="flex w-full flex-row items-center justify-start">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        <div className="flex h-[60px] w-full flex-1 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          {/* <Timeline /> */}
          타임라인
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
          />
        ))}
      </div>
    </section>
  );
};

export default RecordSection;
