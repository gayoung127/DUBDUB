"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd"; // ✅ useDrop 추가
import { AudioFile, PX_PER_SECOND, Track } from "@/app/_types/studio";
import AudioBlock from "./AudioBlock";
import { useRecordingStore } from "@/app/_store/RecordingStore";
import LiveAudioBlock from "./LiveAudioBlock";
import { useTimeStore } from "@/app/_store/TimeStore";
import { useUserStore } from "@/app/_store/UserStore";
import { useAssetsStore } from "@/app/_store/AssetsStore";
import { findPossibleId } from "@/app/_utils/findPossibleId";
import { createBlob } from "@/app/_utils/audioUtils";
import { postAsset } from "@/app/_apis/studio";
import { useParams } from "next/navigation";

interface AudioTrackTimelineProps {
  trackId: number;
  isMuted: boolean;
  files: AudioFile[];
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  waveColor: string;
  blockColor: string;
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const AudioTrackTimeline = ({
  trackId,
  isMuted, // 트랙별 음소거 여부부
  files,
  duration,
  setDuration,
  waveColor,
  blockColor,
  audioContext,
  audioBuffers,
  setTracks,
}: AudioTrackTimelineProps) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const {
    audioFiles,
    offsetMap,
    isRecording,
    analyser,
    currentRecordingTrackId,
    setAudioFiles,
  } = useRecordingStore();
  const { time } = useTimeStore();
  const { studioMembers, self } = useUserStore();
  const { audioFiles: assetAudioFiles, addAudioFile } = useAssetsStore();
  const isSyncingRef = useRef(false);
  const lastFilesRef = useRef("");
  const [liveWidth, setLiveWidth] = useState(0);
  const initialXRef = useRef<number | null>(null);
  const recordStartRef = useRef<number | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const params = useParams();
  const pid = params.id;

  useEffect(() => {
    if (isRecording && currentRecordingTrackId == trackId) {
      // 녹음 시작
      if (initialXRef.current === null) {
        initialXRef.current = time * PX_PER_SECOND;
      }
      setLiveWidth(1);
      recordStartRef.current = performance.now();
      startWidthLoop();
    } else {
      if (recordStartRef.current) {
        setLiveWidth(0);
      }
      recordStartRef.current = null;
      initialXRef.current = null;

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    }

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isRecording, time]);

  const startWidthLoop = () => {
    const updateWidth = () => {
      if (!recordStartRef.current) return;
      const currentX = time * PX_PER_SECOND;
      setLiveWidth(Math.max(1, currentX - (initialXRef.current ?? 0)));
      animationIdRef.current = requestAnimationFrame(updateWidth);
    };
    updateWidth();
  };

  //서버로 변경사항 전송
  useEffect(() => {
    const newFilesString = JSON.stringify(files);

    if (!isSyncingRef.current && lastFilesRef.current !== newFilesString) {
      console.log(`📤 트랙(${trackId})의 변경 사항 서버로 전송`, {
        trackId,
        files,
      });

      // socket.emit("update-track-files", {
      //   trackId,
      //   updatedFiles: files,
      // });

      setTracks((prevTracks) =>
        prevTracks.map((track) => {
          if (track.trackId !== trackId) return track;

          return { ...track, files: files.map((f) => ({ ...f })) };
        }),
      );
      isSyncingRef.current = true;
      lastFilesRef.current = newFilesString;
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 300);
    } else {
      console.log(`⚠️ 트랙(${trackId}) 변경 없음 -> 서버 전송 생략`);
    }
  }, [files.map((f) => JSON.stringify(f)).join(","), trackId]);

  //녹음된 파일을 추가하는 역할
  useEffect(() => {
    console.log(`🎙️ 트랙(${trackId})의 녹음된 파일 추가 확인:`, audioFiles);

    // 추가되는 오디오 길이 계산
    const loadAudioDuration = async (url: string) => {
      if (!audioContext) return 0;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (audioBuffers) {
          audioBuffers.set(url, audioBuffer);
        }

        // console.log(`✅ ${url}의 오디오 길이:`, audioBuffer.duration);
        return audioBuffer.duration;
      } catch (error) {
        console.error(`❌ ${url} 오디오 로드 실패:`, error);
        return 0;
      }
    };

    // 녹음된 파일 audioContext로 추가
    const updateTrack = async () => {
      const existingFilesUrls = new Set(files.map((file) => file.url));

      const newFiles = await Promise.all(
        (audioFiles[trackId] ?? [])
          .filter((url) => !existingFilesUrls.has(url))
          .map(async (url) => {
            const duration = await loadAudioDuration(url);
            const buffer =
              audioBuffers?.get(url) ??
              new AudioBuffer({ length: 1, sampleRate: 44100 });
            const blob = await createBlob(buffer);
            const newUrl = await postAsset(String(pid), blob);

            if (duration <= 0) {
              console.warn(`⚠️ ${url}의 duration이 0초 이하로 잘못 계산됨`);
              return null;
            }

            const starPoint = offsetMap[url] || 0;

            const createdFile = {
              // id: `${trackId}-${Date.now()}`,
              id: findPossibleId(assetAudioFiles, studioMembers, "나"),
              url: newUrl,
              startPoint: starPoint,
              duration,
              trimStart: 0,
              trimEnd: 0,
              volume: 1,
              isMuted: isMuted,
              speed: 1,
            };
            addAudioFile(createdFile);
            return createdFile;
          }),
      );

      const validFiles = newFiles.filter((file) => file !== null);

      if (validFiles.length === 0) {
        console.log(`⚠️ 트랙(${trackId})에 추가할 유효한 파일이 없음`);
        return;
      }

      setTracks((prevTracks) =>
        prevTracks.map((track) => {
          if (track.trackId !== trackId) return track;

          const existingFiles = [...track.files];
          const updatedFiles = [...existingFiles, ...validFiles];

          if (JSON.stringify(existingFiles) === JSON.stringify(updatedFiles)) {
            console.log(`⚠️ 트랙(${trackId}) 파일 변경 없음, 업데이트 생략`);
            return track;
          }

          console.log(
            `🎶 트랙(${trackId})에 녹음된 파일 추가됨:`,
            updatedFiles,
          );
          return {
            ...track,
            files: updatedFiles,
          };
        }),
      );

      setAudioFiles((prev) => ({
        ...prev,
        [trackId]: (prev[trackId] ?? []).filter(
          (url) => !validFiles.some((file) => file.url === url),
        ),
      }));

      validFiles.forEach((file) => {
        delete offsetMap[file.url];
      });
    };

    updateTrack();
  }, [
    // audioFiles,
    setAudioFiles,
    trackId,
    setTracks,
    audioContext,
    audioBuffers,
  ]);

  // ✅ 드롭 가능하도록 `useDrop` 추가
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ASSET", // 드래그 가능한 아이템 타입
    drop: (item: { id: string; url: string }, monitor) => {
      if (!timelineRef.current) return;

      // 현재 드롭한 위치를 초 단위로 변환
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const dropX = offset.x - rect.left;
      const startPoint = Math.max(0, Math.round((dropX / 80) * 100) / 100); // 80px = 1초 기준

      setTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.trackId === trackId
            ? {
                ...track,
                files: [
                  ...track.files,
                  {
                    id: `${item.id}-${Date.now()}`,
                    url: item.url,
                    startPoint,
                    duration: 5, // 기본 5초 길이
                    trimStart: 0,
                    trimEnd: 0,
                    volume: 1,
                    isMuted: false, // 기본 false
                    speed: 1,
                  },
                ],
              }
            : track,
        ),
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        timelineRef.current = node;
      }}
      className={`relative flex h-[60px] min-h-0 flex-shrink-0 flex-row items-center justify-start overflow-y-hidden border border-gray-300 ${
        isOver ? "bg-gray-200" : ""
      }`} // 드롭 시 색상 변경
      style={{ width: `${duration * 80}px` }}
    >
      <div className="relative flex h-full items-center justify-center">
        {files.map((file, index) => {
          const width = `${
            (file.duration - file.trimStart - file.trimEnd) * 80
          }px`;

          return (
            <div
              key={file.id}
              className="relative flex items-center justify-start"
            >
              <AudioBlock
                file={{ ...file, isMuted: isMuted }} // 추가
                trackId={trackId}
                fileIdx={index}
                width={width}
                waveColor={waveColor}
                blockColor={blockColor}
                audioContext={audioContext}
                audioBuffers={audioBuffers}
                setTracks={setTracks}
                timelineRef={timelineRef}
              />
            </div>
          );
        })}

        {isRecording && currentRecordingTrackId === trackId && analyser && (
          <LiveAudioBlock
            waveClolor={waveColor}
            isRecording={isRecording}
            analyser={analyser}
            blockColor={blockColor}
            width={liveWidth}
            initialX={initialXRef.current ?? 0}
          />
        )}
      </div>
    </div>
  );
};

export default AudioTrackTimeline;
