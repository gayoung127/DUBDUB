"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ForVideoPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [originalBuffer, setOriginalBuffer] = useState<AudioBuffer | null>(
    null,
  );
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isVocalRemoved, setIsVocalRemoved] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);

  const file = {
    url: "/examples/sample-song-cut-more.mp3",
    waveColor: "#ff8c66",
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
          setOriginalBuffer(decodedBuffer);
          visualizeWaveform(decodedBuffer, 0);
        } catch (error) {
          console.error("오디오 로드 실패:", error);
        }
      }
    };
    initAudioContext();
  }, []);

  const removeVocals = () => {
    if (
      !audioContext ||
      !originalBuffer ||
      originalBuffer.numberOfChannels < 2
    ) {
      console.error("보컬 제거 불가능 (스테레오 오디오 필요)");
      return;
    }

    const leftChannel = originalBuffer.getChannelData(0);
    const rightChannel = originalBuffer.getChannelData(1);
    const length = leftChannel.length;

    const newBuffer = audioContext.createBuffer(
      1,
      length,
      originalBuffer.sampleRate,
    );
    const newChannel = newBuffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      newChannel[i] = (leftChannel[i] - rightChannel[i]) / 2; // 중앙 성분 제거
    }

    setProcessedBuffer(newBuffer);
    setIsVocalRemoved(true);
    visualizeWaveform(newBuffer, 0);
  };

  const visualizeWaveform = (buffer: AudioBuffer, playbackPosition: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1000;
    canvas.height = 200;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const waveform = buffer.getChannelData(0);
    const step = Math.ceil(waveform.length / canvas.width);
    const amp = canvas.height / 2;

    for (let i = 0; i < canvas.width; i += 3) {
      const min = Math.min(...waveform.slice(i * step, (i + 1) * step));
      const max = Math.max(...waveform.slice(i * step, (i + 1) * step));

      context.fillStyle =
        i < playbackPosition * canvas.width
          ? file.playbackColor
          : file.waveColor;
      context.fillRect(
        i,
        (1 + min) * amp,
        2,
        Math.max(8, (max - min) * amp * 1.5, 5),
      );
    }
  };

  const updatePlayback = () => {
    if (!audioContext || !originalBuffer || !audioSourceRef.current) return;

    const elapsedTime = audioContext.currentTime - playStartTimeRef.current;
    const progress = Math.min(elapsedTime / originalBuffer.duration, 1);

    setCurrentTime(progress * originalBuffer.duration);
    visualizeWaveform(
      isVocalRemoved ? processedBuffer! : originalBuffer,
      progress,
    );

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(updatePlayback);
    }
  };

  const playAudio = () => {
    if (!audioContext) return;
    if (audioSourceRef.current) stopAudio();

    const bufferToPlay = isVocalRemoved ? processedBuffer : originalBuffer;
    if (!bufferToPlay) return;

    const source = audioContext.createBufferSource();
    source.buffer = bufferToPlay;
    source.connect(audioContext.destination);

    playStartTimeRef.current = audioContext.currentTime;
    source.start(audioContext.currentTime);
    audioSourceRef.current = source;

    setCurrentTime(0);
    updatePlayback();
    source.onended = stopAudio;
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    setCurrentTime(0);
    visualizeWaveform(isVocalRemoved ? processedBuffer! : originalBuffer!, 0);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      {originalBuffer ? (
        <>
          <div className="shadow-lg bg-white relative flex items-center justify-center rounded-lg p-4">
            <canvas ref={canvasRef} className="rounded-md" />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="text-white shadow-md rounded-lg bg-green-500 px-4 py-2"
              onClick={playAudio}
            >
              ▶️ 재생 ({isVocalRemoved ? "보컬 제거된" : "원본"})
            </button>
            <button
              className="text-white shadow-md rounded-lg bg-red-500 px-4 py-2"
              onClick={stopAudio}
            >
              ⏹ 정지
            </button>
            <button
              className="text-white shadow-md rounded-lg bg-blue-500 px-4 py-2"
              onClick={removeVocals}
            >
              🎙 보컬 제거
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">🔄 오디오 로드 중...</p>
      )}
    </div>
  );
}
