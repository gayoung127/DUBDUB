"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ForVideoPage() {
  const canvasLRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRRef = useRef<HTMLCanvasElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);

  const file = {
    url: "/examples/sample-drum.wav",
    trimStart: 0,
    trimEnd: 0,
    waveColorL: "#ff8c66",
    waveColorR: "#66aaff",
    blockColor: "#ffffff",
    playbackColor: "#CC7052",
  };

  useEffect(() => {
    const initAudioContext = async () => {
      if (!audioContext) {
        const newAudioContext = new AudioContext();
        setAudioContext(newAudioContext);

        try {
          const response = await fetch(file.url);
          const arrayBuffer = await response.arrayBuffer();
          const decodedBuffer =
            await newAudioContext.decodeAudioData(arrayBuffer);
          setAudioBuffer(decodedBuffer);
        } catch (error) {
          console.error("오디오 로드 실패:", error);
        }
      }
    };

    initAudioContext();
  }, []);

  useEffect(() => {
    if (audioBuffer) {
      visualizeWaveform(audioBuffer, 0);
    }
  }, [audioBuffer]);

  const visualizeWaveform = (buffer: AudioBuffer, playbackPosition: number) => {
    if (!buffer || buffer.numberOfChannels < 2) return;

    visualizeWaveformL(buffer.getChannelData(0), playbackPosition);
    visualizeWaveformR(buffer.getChannelData(1), playbackPosition);
  };

  const visualizeWaveformL = (
    waveform: Float32Array,
    playbackPosition: number,
  ) => {
    const canvas = canvasLRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1000;
    canvas.height = 100;

    const step = Math.ceil(waveform.length / (canvas.width * 2));
    const amp = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.width; i += 3) {
      const min = Math.min(...waveform.slice(i * step, (i + 1) * step));
      const max = Math.max(...waveform.slice(i * step, (i + 1) * step));

      context.fillStyle =
        i < playbackPosition * canvas.width
          ? file.playbackColor
          : file.waveColorL;
      context.fillRect(
        i,
        (1 + min) * amp,
        2,
        Math.max(8, (max - min) * amp * 1.5, 5),
      );
    }
  };

  const visualizeWaveformR = (
    waveform: Float32Array,
    playbackPosition: number,
  ) => {
    const canvas = canvasRRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1000;
    canvas.height = 100;

    const step = Math.ceil(waveform.length / (canvas.width * 2));
    const amp = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.width; i += 3) {
      const min = Math.min(...waveform.slice(i * step, (i + 1) * step));
      const max = Math.max(...waveform.slice(i * step, (i + 1) * step));

      context.fillStyle =
        i < playbackPosition * canvas.width
          ? file.playbackColor
          : file.waveColorR;
      context.fillRect(
        i,
        (1 + min) * amp,
        2,
        Math.max(8, (max - min) * amp * 1.5, 5),
      );
    }
  };

  const updatePlayback = () => {
    if (!audioContext || !audioBuffer || !audioSourceRef.current) return;

    const elapsedTime = audioContext.currentTime - playStartTimeRef.current;
    const progress = Math.min(elapsedTime / audioBuffer.duration, 1);

    setCurrentTime(progress * audioBuffer.duration);
    visualizeWaveform(audioBuffer, progress);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(updatePlayback);
    }
  };

  const playAudio = () => {
    if (!audioContext || !audioBuffer) return;

    if (audioSourceRef.current) {
      stopAudio();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    playStartTimeRef.current = audioContext.currentTime;
    source.start(audioContext.currentTime);
    audioSourceRef.current = source;

    setCurrentTime(0);
    updatePlayback();

    source.onended = () => {
      stopAudio();
    };
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setCurrentTime(0);
    if (audioBuffer) visualizeWaveform(audioBuffer, 0);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {audioBuffer ? (
        <>
          <div className="shadow-lg bg-white relative flex items-center justify-center rounded-lg p-4">
            <canvas ref={canvasLRef} className="rounded-md" />
          </div>
          <div className="shadow-lg bg-white relative flex items-center justify-center rounded-lg p-4">
            <canvas ref={canvasRRef} className="rounded-md" />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="text-white shadow-md rounded-lg bg-green-500 px-4 py-2"
              onClick={playAudio}
            >
              ▶️ 재생
            </button>
            <button
              className="text-white shadow-md rounded-lg bg-red-500 px-4 py-2"
              onClick={stopAudio}
            >
              ⏹ 정지
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">🔄 오디오 로드 중...</p>
      )}
    </div>
  );
}
