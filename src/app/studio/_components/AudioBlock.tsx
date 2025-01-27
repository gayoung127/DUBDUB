import React, { useCallback, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";

const audioUrl = "/examples/happyhappyhappysong.mp3";

const AudioBlock = () => {
  // Ref를 React.RefObject<HTMLDivElement | null>로 설정
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef, // container에 ref를 전달
    height: 28,
    waveColor: "rgb(153, 165, 255)",
    progressColor: "rgb(100, 0, 100)",
    url: audioUrl,

    barWidth: 1,
    barGap: 1,
    barRadius: 4,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex flex-row items-center justify-start">
      <div
        onClick={onPlayPause}
        ref={containerRef}
        className="h-7 w-24 rounded-md bg-[#4202B5]"
      />
    </div>
  );
};

export default AudioBlock;
