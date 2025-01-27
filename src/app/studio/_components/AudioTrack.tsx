import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

import H4 from "@/app/_components/H4";

import VideoIcon from "@/public/images/icons/icon-video.svg";
import MixerIcon from "@/public/images/icons/icon-mixer.svg";
import AudioBlock from "./AudioBlock";

interface AudioFile {
  url: string; // 오디오 파일 경로
  startTime: number; // 시작 시간 (초)
  endTime: number; // 종료 시간 (초)
}

interface AudioTrackProps {
  trackNumber: number; // 트랙 번호
  audioFiles: AudioFile[]; // 오디오 파일 배열
}

const AudioTrack: React.FC<AudioTrackProps> = ({ trackNumber, audioFiles }) => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      height: 28,
      waveColor: "rgb(153, 165, 255)",
      progressColor: "rgb(66, 2, 181)",
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
    });

    // 각 오디오 파일을 추가
    audioFiles.forEach((file) => {
      waveSurferRef.current?.load(file.url);

      // 이벤트 리스너로 특정 시간대만 재생되도록 설정
      waveSurferRef.current?.on("ready", () => {
        waveSurferRef.current?.setTime(file.startTime);
      });

      waveSurferRef.current?.on("audioprocess", (currentTime: number) => {
        if (currentTime > file.endTime) {
          waveSurferRef.current?.pause();
        }
      });
    });

    return () => {
      waveSurferRef.current?.destroy();
    };
  }, [audioFiles]);

  return (
    <div className="flex h-10 w-full flex-row items-center justify-start">
      <div className="flex h-full w-[280px] flex-shrink-0 flex-row items-center justify-between border border-gray-300 px-3 py-2">
        <H4 className="text-sm font-normal text-white-100">
          오디오 트랙 {trackNumber}
        </H4>
        <div className="flex flex-row items-center justify-start gap-x-4">
          <VideoIcon width={24} height={24} />
          <div className="flex flex-row items-center justify-start gap-x-2">
            {/* <div>
              <MixerIcon width={18} height={18} />
            </div> */}
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                E
              </span>
            </div>
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                M
              </span>
            </div>
            <div className="flex h-5 w-5 flex-row items-center justify-center rounded-sm bg-white-100">
              <span className="text-xs font-bold leading-none text-gray-400">
                S
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-1 flex-row items-center justify-start border border-gray-300">
        <div ref={containerRef} className="w-[400px] bg-gray-200" />
      </div>
    </div>
  );
};

export default AudioTrack;
