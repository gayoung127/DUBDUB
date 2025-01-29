import { Block } from "@/app/_types/studio";
import React, { useEffect, useRef, useState } from "react";

interface AudioBlockProps extends Block {
  audioContext: AudioContext | null;
  currentTime: number;
}

const AudioBlock = ({
  file,
  waveColor,
  blockColor,
  currentTime,
  audioContext,
}: AudioBlockProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const startTime = 0 + file.trimStart;
  const duration = file.duration - file.trimEnd - file.trimStart;

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

  // useEffect(() => {
  //   if (!audioContext || !audioBuffer || hasPlayed) return;

  //   if (currentTime >= file.startPoint) {
  //     const source = audioContext.createBufferSource();
  //     source.buffer = audioBuffer;
  //     source.connect(audioContext.destination);

  //     const offset = (currentTime = file.startPoint);
  //     source.start(0, startTime + offset, duration - offset);

  //     sourceRef.current = source;
  //     setHasPlayed(true);
  //   }
  // }, [currentTime, audioBuffer]);

  const visualizeWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const waveform = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    const startIndex = Math.floor(file.trimStart * sampleRate);
    const endIndex = Math.floor((file.duration - file.trimEnd) * sampleRate);

    const trimmedWaveform = waveform.slice(startIndex, endIndex);

    const step = Math.ceil(trimmedWaveform.length / canvas.width);
    const amp = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = waveColor;

    for (let i = 0; i < canvas.width; i += 3) {
      const min = Math.min(...trimmedWaveform.slice(i * step, (i + 1) * step));
      const max = Math.max(...trimmedWaveform.slice(i * step, (i + 1) * step));

      context.fillRect(i, (1 + min) * amp, 2, Math.max(2, (max - min) * amp));
    }
  };

  return (
    <div className="relative flex h-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="h-10 w-full rounded-md"
        style={{ backgroundColor: blockColor }}
      ></canvas>
    </div>
  );
};

export default AudioBlock;
