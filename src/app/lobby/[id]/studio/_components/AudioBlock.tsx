"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import React, { useEffect, useRef, useState } from "react";

import useBlockStore from "@/app/_store/BlockStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { Block, PX_PER_SECOND, Track } from "@/app/_types/studio";

export interface AudioBlockProps extends Block {
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
}

gsap.registerPlugin(Draggable);

const AudioBlock = ({
  file,
  width,
  waveColor,
  blockColor,
  audioContext,
  audioBuffers,
  setTracks,
  timelineRef,
}: AudioBlockProps) => {
  const { time, isPlaying } = useTimeStore();
  const { selectedBlock, setSelectedBlock } = useBlockStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);

  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [localStartPoint, setLocalStartPoint] = useState(
    (file.startPoint + file.trimStart) * PX_PER_SECOND,
  );

  // useEffect: 타임라인 내 시작점 업데이트 (자르기 시작 반영한 부분 반영)
  useEffect(() => {
    setLocalStartPoint((file.startPoint + file.trimStart) * PX_PER_SECOND);
  }, [file.startPoint, file.trimStart]);

  // useEffect: 오디오 블록 드래그
  useEffect(() => {
    if (!blockRef.current || !timelineRef.current) return;

    const blockElement = blockRef.current;
    const timelineElement = timelineRef.current as HTMLElement;

    const draggable = Draggable.create(blockElement, {
      type: "x",
      bounds: timelineElement,
      inertia: true,
      onPress: function () {
        gsap.set(blockElement, { zIndex: 5 });
      },
      onDrag: function () {
        const newStartPoint = Math.max(0, Math.round(this.x));
        setLocalStartPoint(newStartPoint);
        gsap.set(blockElement, { x: newStartPoint });
      },
      onDragEnd: function () {
        const finalStartPoint = Math.max(0, Math.round(this.x / PX_PER_SECOND));

        setTracks((prevTracks) =>
          prevTracks.map((track) => ({
            ...track,
            files: track.files.map((f) =>
              f.id === file.id
                ? { ...f, startPoint: finalStartPoint - f.trimStart }
                : f,
            ),
          })),
        );
      },
    });

    return () => {
      draggable[0].kill();
    };
  }, [setTracks, file.id, timelineRef]);

  // useEffect: 오디오 트랙 시작점 반영
  useEffect(() => {
    if (!audioContext) return;

    const startOffset = file.startPoint + file.trimStart;
    const endOffset =
      startOffset + (file.duration - file.trimEnd - file.trimStart);

    if (!isPlaying && audioSourceRef.current) {
      stopAudio();
    }

    if (
      isPlaying &&
      time >= startOffset &&
      time < endOffset &&
      !audioSourceRef.current
    ) {
      playAudio();
    } else if (time >= endOffset && audioSourceRef.current) {
      stopAudio();
    }
  }, [time, isPlaying, file.startPoint]);

  // playAudio : 개별 오디오 파일 재생 함수
  const playAudio = () => {
    if (!audioContext || audioSourceRef.current) return;

    const audioBuffer = audioBuffers!.get(file.url);
    if (!audioBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = file.isMuted ? 0 : file.volume;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.playbackRate.value = file.speed;

    // 🎯 Right block의 경우, trimStart를 정확히 반영해야 함
    const offset = Math.max(0, file.trimStart);
    const duration = Math.max(0, file.duration - file.trimStart - file.trimEnd);

    source.start(audioContext.currentTime, offset, duration);

    audioSourceRef.current = source;

    source.onended = () => {
      audioSourceRef.current = null;
    };
  };

  // stopAudio : 개별 오디오 파일 즉시 정지 함수
  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect(); // 연결을 끊어 즉시 정지
      audioSourceRef.current = null;
    }
  };

  // useEffect : 모킹 데이터 불러오기
  useEffect(() => {
    const fetchMockAudioBuffer = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.AudioContext)();
      }

      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
    };

    fetchMockAudioBuffer();
  }, []);

  // useEffect : 파형 시각화
  useEffect(() => {
    if (audioBuffer) {
      visualizeWaveform();
    }
  }, [audioBuffer]);

  // visualizeWaveForm : 파형 시각화 함수
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

  // 🎯 C 키를 눌렀을 때 블록을 두 개로 분할
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "c" && selectedBlock?.id === file.id) {
        splitBlock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlock]);

  // 🎯 블록을 현재 마커 위치 기준으로 두 개로 나누는 함수
  const splitBlock = () => {
    const blockStartX = localStartPoint; // 🎯 블록의 실제 시작 위치 (px)
    const markerX = time * PX_PER_SECOND; // 🎯 현재 마커 위치 (px)

    // 🎯 마커 기준으로 블록이 왼쪽/오른쪽으로 나뉘는 시간 계산
    const cutTime = (markerX - blockStartX) / PX_PER_SECOND;

    // 🎯 새로운 블록 생성
    const newLeftBlock: Block = {
      file: {
        ...file,
        id: `${file.id}-left`,
        trimStart: file.trimStart, // 기존 trimStart 유지
        trimEnd: file.duration - cutTime - file.trimStart, // trimEnd 변경 (마커 이후 잘라냄)
      },
      width: `${cutTime * PX_PER_SECOND}px`, // 블록 크기 조정
      waveColor,
      blockColor,
    };

    const newRightBlock: Block = {
      file: {
        ...file,
        id: `${file.id}-right`,
        startPoint: file.startPoint, // 🎯 기존 startPoint 유지
        trimStart: file.trimStart + cutTime, // 🎯 trimStart 변경 (마커 이전 부분을 잘라내기)
        trimEnd: file.trimEnd, // 🎯 기존 trimEnd 유지
      },
      width: `${(file.duration - cutTime) * PX_PER_SECOND}px`, // 🎯 블록 크기 조정
      waveColor,
      blockColor,
    };

    // 🎯 기존 블록을 삭제하고 새로운 두 블록 추가
    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        files: track.files.flatMap((f) =>
          f.id === file.id ? [newLeftBlock.file, newRightBlock.file] : [f],
        ),
      })),
    );

    console.log("✅ 블록이 분할되었습니다!", newLeftBlock, newRightBlock);
  };

  return (
    <div
      ref={blockRef}
      className="absolute flex h-full items-center justify-start"
      style={{
        width: width,
        transform: `translateX(${localStartPoint}px)`,
        backgroundColor: blockColor,
        borderRadius: `8px`,
      }}
      onClick={() => {
        setSelectedBlock(file);
      }}
    >
      <canvas
        ref={canvasRef}
        className={`h-10 w-full rounded-md border border-transparent hover:border-brand-300 ${file.id === selectedBlock?.id ? "border border-yellow-600" : ""}`}
        style={{
          backgroundColor: blockColor,
        }}
      ></canvas>
    </div>
  );
};

export default AudioBlock;
