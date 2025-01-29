"use client";

import React, { useEffect, useRef, useState } from "react";

import { AudioFile, initialTracks, Track } from "@/app/_types/studio";

import H4 from "@/app/_components/H4";

import Timeline from "./Timeline";
import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AudioTrackTimeline from "./AudioTrackTimeline";
import AudioTrackHeader from "./AudioTrackHeader";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

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
    <section className="flex h-full w-full flex-row items-start justify-start overflow-hidden">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-col items-start justify-start overflow-hidden border border-gray-300 bg-gray-400">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border-b border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        {tracks.map((track) => (
          <AudioTrackHeader key={track.trackId} trackId={track.trackId} />
        ))}
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start overflow-hidden bg-gray-400">
        <div className="flex h-[60px] w-full flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          <Timeline
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            totalDuration={50}
          />
        </div>
        {tracks.map((track) => (
          <AudioTrackTimeline
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
