"use client";
import React, { useEffect, useRef, useState } from "react";

interface LiveAudioBlockProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  blockColor: string;
  waveColor: string;
  width: number;
  initialX: number;
}

const LiveAudioBlock = ({
  analyser,
  isRecording,
  blockColor,
  waveColor,
  width,
  initialX,
}: LiveAudioBlockProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // ✅ Low-pass 필터 (노이즈 줄이기)
  const movingAverage = (data: number[], windowSize: number = 5) => {
    if (data.length < windowSize) return data;
    return data.map((_, i) => {
      const start = Math.max(0, i - windowSize + 1);
      const subArray = data.slice(start, i + 1);
      return subArray.reduce((sum, val) => sum + val, 0) / subArray.length;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.max(1, width);
    canvas.height = 40;

    const drawWaveform = (data: number[]) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = blockColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const step = Math.ceil(data.length / canvas.width);
      const amp = canvas.height / 2;

      ctx.fillStyle = waveColor;

      for (let i = 0; i < canvas.width; i += 3) {
        const min = Math.min(...data.slice(i * step, (i + 1) * step));
        const max = Math.max(...data.slice(i * step, (i + 1) * step));

        ctx.fillRect(i, (1 + min) * amp, 2, Math.max(2, (max - min) * amp));
      }
    };

    if (waveformData.length > 0) {
      drawWaveform(waveformData);
    }
  }, [waveformData, blockColor, waveColor, width]);

  useEffect(() => {
    if (!isRecording || !analyser) return;

    analyser.fftSize = 1024;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    const updateWaveformData = () => {
      analyser.getFloatTimeDomainData(dataArray);
      let normalizedData = Array.from(dataArray).map((v) =>
        Math.max(-1, Math.min(1, v)),
      );

      // ✅ 노이즈 필터 적용 (Low-pass filtering)
      normalizedData = movingAverage(normalizedData, 5);

      setWaveformData((prev) => {
        // ✅ 기존 데이터와 50% 혼합해서 부드럽게 변화 (Smoothing)
        const smoothedData = prev.map((val, i) =>
          i < normalizedData.length ? val * 0.5 + normalizedData[i] * 0.5 : val,
        );

        const newData = [...smoothedData, ...normalizedData];

        return newData;
      });

      animationRef.current = requestAnimationFrame(updateWaveformData);
    };

    updateWaveformData();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, analyser, width]);

  return (
    <div
      className="absolute left-0"
      style={{
        width: `${width}px`,
        left: `${initialX}px`,
        backgroundColor: blockColor,
      }}
    >
      <canvas ref={canvasRef} width={width}></canvas>
    </div>
  );
};

export default LiveAudioBlock;
