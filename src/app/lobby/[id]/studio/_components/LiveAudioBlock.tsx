"use client";
import React, { useEffect, useRef } from "react";
interface LiveAudioBlockProps {
  analyser: AnalyserNode | null;
  isRecording: boolean;
  blockColor: string;
  waveClolor: string;
  width: number;
  initialX: number;
}

const LiveAudioBlock = ({
  analyser,
  isRecording,
  blockColor,
  waveClolor,
  width,
  initialX,
}: LiveAudioBlockProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording || !analyser) return;

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.max(1, width);
    canvas.height = 40;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = blockColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const sliceWidth = canvas.width / bufferLength;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = waveClolor;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = centerY - v * centerY * 0.5;

        if (i === 0) {
          ctx.moveTo(x, centerY);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      ctx.beginPath();
      x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = centerY + v * centerY * 0.5; // 중앙에서 아래로

        if (i === 0) {
          ctx.moveTo(x, centerY);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
    };

    draw();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRecording, analyser, width, blockColor, waveClolor]);

  return (
    <div
      className="absolute left-0"
      style={{
        width: `${width}px`,
        left: `${initialX}px`,
        backgroundColor: blockColor,
      }}
    >
      <canvas ref={canvasRef} width={Math.max(1, width)}></canvas>
    </div>
  );
};

export default LiveAudioBlock;
