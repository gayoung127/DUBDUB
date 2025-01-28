import React, { useEffect, useRef, useState } from "react";

interface AudioBlockProps {
  audioSource: string;
  startTime: number;
  duration: number;
  color: string;
  playPoint: number;
}

const AudioBlock = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const startTime = 0;
  const duration = 5;
  const color = "#99A5FF";

  useEffect(() => {
    const fetchMockAudioBuffer = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.AudioContext)();
      }

      const response = await fetch("/examples/happyhappyhappysong.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    };

    fetchMockAudioBuffer();
  }, []);

  useEffect(() => {
    if (audioBuffer) {
      visualizeWaveform();
    }
  }, [audioBuffer]);

  const visualizeWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const waveform = audioBuffer.getChannelData(0); // Mono channel
    const step = Math.ceil(waveform.length / canvas.width);
    const amp = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;

    for (let i = 0; i < canvas.width; i += 3) {
      const min = Math.min(...waveform.slice(i * step, (i + 1) * step));
      const max = Math.max(...waveform.slice(i * step, (i + 1) * step));

      context.fillRect(i, (1 + min) * amp, 2, Math.max(2, (max - min) * amp));
    }
  };

  const handlePlayPause = () => {
    if (!audioContextRef.current || !audioBuffer) return;

    if (isPlaying) {
      sourceRef.current?.stop();
      sourceRef.current = null;
      setIsPlaying(false);
    } else {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;

      source.connect(audioContextRef.current.destination);
      source.start(0, startTime, duration);

      sourceRef.current = source;
      setIsPlaying(true);

      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };
    }
  };

  return (
    <div className="relative flex h-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="h-7 w-full rounded-md bg-[#4202B5]"
        onClick={handlePlayPause}
      ></canvas>
    </div>
  );
};

export default AudioBlock;
