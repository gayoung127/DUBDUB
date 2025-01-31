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
import { useTimeStore } from "@/app/_store/TimeStore";

const RecordSection = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

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
      <div className="flex h-full w-[280px] flex-shrink-0 flex-col items-start justify-start overflow-hidden border border-gray-300 bg-gray-400">
        <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border-b border-t border-gray-300 bg-gray-400 px-5 py-5">
          <H4 className="border-b-2 border-white-100 font-bold text-white-100">
            녹음 세션
          </H4>
        </div>
        {tracks.map((track) => (
          <AudioTrackHeader key={track.trackId} trackId={track.trackId} />
        ))}
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start overflow-x-hidden border border-gray-300 bg-gray-400">
        <div className="flex h-[60px] w-full flex-grow-0 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
          <Timeline totalDuration={160} />
        </div>
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
          />
        ))}
      </div>
    </section>
  );
};

export default RecordSection;
