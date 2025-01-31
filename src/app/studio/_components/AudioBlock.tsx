import { useTimeStore } from "@/app/_store/TimeStore";
import { Block } from "@/app/_types/studio";
import React, { useEffect, useRef, useState } from "react";

interface AudioBlockProps extends Block {
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
}

const AudioBlock = ({
  file,
  waveColor,
  blockColor,
  audioContext,
  audioBuffers,
}: AudioBlockProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const { time, isPlaying } = useTimeStore();

  useEffect(() => {
    if (!audioContext || !isPlaying) return;

    const startOffset = file.startPoint + file.trimStart;
    const endOffset =
      startOffset + (file.duration - file.trimEnd - file.trimStart);

    // 🔹 타임라인의 `time`이 파일의 `startPoint`에 도달했을 때만 실행
    if (time >= startOffset && time < endOffset && !audioSourceRef.current) {
      playAudio();
    } else if (time >= endOffset && audioSourceRef.current) {
      stopAudio();
    }
  }, [time, isPlaying]);

  // 🎵 개별 오디오 파일 재생 함수
  const playAudio = () => {
    if (!audioContext || audioSourceRef.current) return;

    const audioBuffer = audioBuffers!.get(file.url);
    if (!audioBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // 볼륨 적용
    const gainNode = audioContext.createGain();
    gainNode.gain.value = file.isMuted ? 0 : file.volume;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 속도 적용
    source.playbackRate.value = file.speed;

    // ✅ 원본 오디오의 `trimStart` 부분부터 재생
    const offset = file.trimStart; // 원본 오디오의 `trimStart`초부터 재생
    const duration = file.duration - file.trimStart - file.trimEnd; // 트리밍 반영된 길이

    // ⏳ 원본 오디오에서 `trimStart`부터 `duration` 길이만큼 재생
    source.start(audioContext.currentTime, offset, duration);

    // 참조 저장하여 중복 재생 방지
    audioSourceRef.current = source;
  };

  // ⏹ 개별 오디오 파일 중단 함수
  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  };

  useEffect(() => {
    const fetchMockAudioBuffer = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.AudioContext)();
      }

      const response = await fetch("/examples/happyhappyhappysong.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    };

    fetchMockAudioBuffer();
  }, []);

  // 파형 시각화
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
