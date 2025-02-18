"use client";

import React, { useEffect, useRef, useState } from "react";

import { Asset, AudioFile, initialTracks, Track } from "@/app/_types/studio";

import H4 from "@/app/_components/H4";

import Timeline from "./Timeline";
import AudioTrackTimeline from "./AudioTrackTimeline";
import AudioTrackHeader from "./AudioTrackHeader";

import VideoTrack from "./VideoTrack";
import { mergeAudioBuffersWithTimeline } from "@/app/_utils/mergeAudioBuffersWithTimeline";
import { audioBufferToMp3 } from "@/app/_utils/audioBufferToMp3";
import { AudioBlockProps } from "./AudioBlock";
import Button from "@/app/_components/Button";
import { resampleAudioBuffer } from "@/app/_utils/resampleAudioBuffer";
import { Role } from "@/app/_types/script";
import ImagesFromVideo from "./ImagesFromVideo";

interface RecordSectionProps {
  roles: Role[];
  duration: number;
  videoUrl: string;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  sendAsset: (asset: Asset) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isVideoMuted: boolean) => void;
  isProcessedAudio: boolean;
  setIsProcessedAudio: (isVideoMuted: boolean) => void;
}

const RecordSection = ({
  roles,
  duration,
  videoUrl,
  setDuration,
  tracks,
  setTracks,
  assets,
  setAssets,
  sendAsset,
  isVideoMuted,
  setIsVideoMuted,
  isProcessedAudio,
  setIsProcessedAudio,
}: RecordSectionProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);

  const [videoSolo, setVideoSolo] = useState<boolean>(false);

  useEffect(() => {
    const hasSoloTrack = tracks.some((track) => track.isSolo);
    setIsVideoMuted(hasSoloTrack);
    if (hasSoloTrack) {
      setVideoSolo(false);
    }
  }, [tracks]);

  useEffect(() => {
    const hasSoloTrack = tracks.some((track) => track.isSolo);
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (videoSolo) {
          return { ...track, isMuted: true, isSolo: false };
        } else {
          if (hasSoloTrack) {
            return { ...track, isMuted: track.isSolo ? false : track.isMuted };
          }
          return { ...track, isMuted: false };
        }
      }),
    );

    if (!videoSolo && !hasSoloTrack) {
      setIsVideoMuted(false);
    }
  }, [videoSolo, setTracks]);

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
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const loadAudioFiles = async () => {
      if (!audioContextRef.current) return;
      const context = audioContextRef.current;

      for (const track of tracks) {
        for (const file of track.files) {
          if (!audioBuffersRef.current.has(file.url) && file.url) {
            const response = await fetch(file.url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await context.decodeAudioData(arrayBuffer);
            audioBuffersRef.current.set(file.url, audioBuffer);
          }
        }
      }
    };

    loadAudioFiles();
  }, [tracks]);

  // const handleDownloadMp3 = async () => {
  //   if (!audioContextRef.current) return;

  //   // ✅ Track[] → AudioBlockProps[] 변환
  //   const audioBlocks: AudioBlockProps[] = tracks.flatMap((track) =>
  //     track.files.map((file) => ({
  //       file,
  //       isMuted: true,
  //       trackId: track.trackId,
  //       fileIdx: 0,
  //       audioBuffers: audioBuffersRef.current,
  //       audioContext: audioContextRef.current,
  //       setTracks,
  //       timelineRef: { current: null },
  //       width: "10000px",
  //       waveColor: "#000",
  //       blockColor: "#FFF",
  //     })),
  //   );

  //   if (audioBlocks.length === 0) {
  //     console.error("❌ 병합할 오디오 블록이 없습니다.");
  //     return;
  //   }

  //   // ✅ 오디오 병합
  //   const mergedAudioBuffer = mergeAudioBuffersWithTimeline(
  //     audioContextRef.current,
  //     audioBlocks,
  //   );

  //   if (!mergedAudioBuffer) {
  //     console.error("❌ 오디오 병합 실패");
  //     return;
  //   }

  //   console.log("✅ 병합된 오디오 버퍼 생성됨:", mergedAudioBuffer);

  //   // ✅ MP3 변환 후 다운로드
  //   await audioBufferToMp3(mergedAudioBuffer);
  // };

  return (
    <section className="flex h-full w-full flex-row items-start justify-start overflow-hidden">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-col items-start justify-start overflow-hidden border border-gray-300 bg-gray-400">
        <div className="">
          <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border-b border-t border-gray-300 bg-gray-400 px-5 py-5">
            <H4 className="border-b-2 border-white-100 font-bold text-white-100">
              녹음 세션
            </H4>
          </div>
          <div className="flex h-[60px] w-[280px] flex-shrink-0 flex-row items-center justify-start border-b border-t border-gray-300 bg-gray-400 py-5">
            <VideoTrack
              isMuted={isVideoMuted}
              isSolo={videoSolo}
              videoUrl={videoUrl}
              isProcessedAudio={isProcessedAudio}
              setVideoMuted={setIsVideoMuted}
              setVideoSolo={setVideoSolo}
              setIsProcessedAudio={setIsProcessedAudio}
            />
          </div>
          <div className="h-full w-full">
            {tracks.map((track, index) => (
              <AudioTrackHeader
                key={track.trackId}
                isMuted={track.isMuted ?? false}
                isSolo={track.isSolo ?? false}
                trackId={track.trackId}
                role={roles[index]?.name}
                recorderId={track.recorderId}
                recorderName={track.recorderName}
                recorderRole={track.recorderRole}
                recorderProfileUrl={track.recorderProfileUrl}
                setTracks={setTracks}
                selectedTrackId={selectedTrackId}
                setSelectedTrackId={setSelectedTrackId}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-2 flex h-full w-full flex-col items-start justify-start overflow-x-hidden border border-gray-300 bg-gray-400">
        <div className="scrollbar-horizontal overflow-x-scoll mb-2 h-full w-full overflow-y-hidden">
          <div className="flex h-[60px] w-full flex-grow-0 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
            <Timeline duration={duration} setDuration={setDuration} />
          </div>
          <div className="flex h-[60px] w-full flex-grow-0 flex-col items-start justify-end border-l border-r border-t border-gray-300 bg-gray-400">
            <ImagesFromVideo videoUrl={videoUrl} />
          </div>
          <div className="h-full w-full">
            {tracks.map((track) => (
              <AudioTrackTimeline
                key={track.trackId}
                trackId={track.trackId}
                isMuted={track.isMuted ?? false}
                files={track.files}
                duration={duration}
                setDuration={setDuration}
                waveColor={track.waveColor}
                blockColor={track.blockColor}
                audioContext={audioContextRef.current}
                audioBuffers={audioBuffersRef.current}
                setTracks={setTracks}
                assets={assets}
                setAssets={setAssets}
                sendAsset={sendAsset}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecordSection;
