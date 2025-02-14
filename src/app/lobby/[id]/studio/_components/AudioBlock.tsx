"use client";

import gsap from "gsap";
import { toast } from "sonner";
import { Draggable } from "gsap/Draggable";
import React, { useEffect, useRef, useState } from "react";

import useBlockStore from "@/app/_store/BlockStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { Block, PX_PER_SECOND, Track } from "@/app/_types/studio";

import AudioBlockModal from "./AudioBlockModal";

export interface AudioBlockProps extends Block {
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  trackId: number | null;
  fileIdx: number | null;
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
  trackId,
  fileIdx,
}: AudioBlockProps) => {
  const { time, isPlaying } = useTimeStore();
  const { selectedBlock, setSelectedBlock, setSelectedBlockObj } =
    useBlockStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);

  const [zIndex, setZIndex] = useState<number>(1);
  const [localStartPoint, setLocalStartPoint] = useState<number>(
    (file.startPoint + file.trimStart) * PX_PER_SECOND,
  );

  // useEffect: 블록 선택 시, 가장 위로 올라오게 두기 (z-index = 200 설정)
  useEffect(() => {
    if (selectedBlock?.id === file.id) {
      setZIndex(200);
    } else {
      setZIndex(1);
    }
  }, [selectedBlock]);

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
      cursor: "url('/images/icons/cursor-grab.svg') 10 10, grab;",
      onPress: function () {
        setZIndex(200); // 드래그 시작하면 z-index 최상위로 변경
        gsap.set(blockElement, {
          zIndex: 200,
          cursor: "url('/images/icons/cursor-grabbing.svg') 10 10, grabbing", // 드래그 시작 시 커서 변경
        });
      },
      onDrag: function () {
        const newStartPoint = Math.max(0, Math.round(this.x * 100) / 100);
        setLocalStartPoint(newStartPoint);
        gsap.set(blockElement, { zIndex: 200, x: newStartPoint });
      },
      onDragEnd: function () {
        gsap.set(blockElement, { zIndex: 200 });
        const finalStartPoint = Math.max(
          0,
          Math.round((this.x / PX_PER_SECOND) * 100) / 100,
        );

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
      onRelease: function () {
        gsap.set(blockElement, {
          zIndex: 200,
          cursor: "url('/images/icons/cursor-grab.svg') 10 10, grab", // 드래그 종료 후 다시 grab
        });
      },
    });

    return () => {
      draggable[0].kill();
    };
  }, [setTracks, file.id, timelineRef]);

  // useEffect: 다른 사람이 블록 드래그 시, 해당 좌표 동기화
  useEffect(() => {
    if (blockRef.current) {
      gsap.set(blockRef.current, {
        x: (file.startPoint + file.trimStart) * PX_PER_SECOND,
      });
    }
  }, [file.startPoint, file.trimStart]);

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

  // useEffect: 파일 URL 반영시, 파형 생성
  useEffect(() => {
    if (audioBuffers && file.url && audioBuffers.get(file.url)) {
      visualizeWaveform();
    }
  }, [audioBuffers, file.url]);

  // visualizeWaveForm() : 파형 생성
  const visualizeWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffers || !file.url) return;

    const audioBuffer = audioBuffers.get(file.url);
    if (!audioBuffer) return;

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

  const playAudio = async () => {
    if (!audioContext || audioSourceRef.current) return;

    let audioBuffer = audioBuffers!.get(file.url) ?? null;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = file.isMuted ? 0 : file.volume;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.playbackRate.value = file.speed;

    const offset = Math.max(0, file.trimStart);
    const duration = Math.max(0, file.duration - file.trimStart - file.trimEnd);

    source.start(audioContext.currentTime, offset, duration);

    audioSourceRef.current = source;

    source.onended = () => {
      audioSourceRef.current = null;
    };
  };

  // stopAudio(): 개별 오디오 파일 즉시 정지 함수
  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
  };

  // splitBlock(): 블록 자르기 함수
  const splitBlock = () => {
    const blockStartX = localStartPoint; // 블록의 실제 시작 위치 (px)
    const blockEndX = blockStartX + file.duration * PX_PER_SECOND; // 블록 끝 위치 (px)
    const markerX = time * PX_PER_SECOND; // 현재 마커 위치 (px)

    if (markerX <= blockStartX || markerX >= blockEndX) {
      toast.warning("마커를 오디오 블록 위로 이동해주세요!");
      return;
    }

    const cutTime = (markerX - blockStartX) / PX_PER_SECOND; // 마커 기준으로 블록이 나뉘는 시간 계산

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
        startPoint: file.startPoint, // 기존 startPoint 유지
        trimStart: file.trimStart + cutTime, // trimStart 변경 (마커 이전 부분을 잘라내기)
        trimEnd: file.trimEnd, // 기존 trimEnd 유지
      },
      width: `${(file.duration - cutTime) * PX_PER_SECOND}px`, // 블록 크기 조정
      waveColor,
      blockColor,
    };

    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        files: track.files.flatMap((f) =>
          f.id === file.id ? [newLeftBlock.file, newRightBlock.file] : [f],
        ),
      })),
    );

    toast.success("블록 자르기가 성공적으로 이뤄졌습니다!");
  };

  // deleteBlock(): 블록 삭제 함수
  const deleteBlock = () => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        files: track.files.filter((f) => f.id !== file.id),
      })),
    );
  };

  // useEffect: 오디오 블록 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // c : 자르기 기능
      if (event.key.toLowerCase() === "c" && selectedBlock?.id === file.id) {
        splitBlock();
      }

      // delete : 오디오 블록 삭제 기능
      if (
        event.key.toLowerCase() === "delete" &&
        selectedBlock?.id === file.id
      ) {
        deleteBlock();
        console.log("✅ 블록이 삭제되었습니다!", file.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlock]);

  return (
    <div
      ref={blockRef}
      className="draggable absolute flex h-full items-center justify-start"
      style={{
        width: width,
        transform: `translateX(${localStartPoint}px)`,
        backgroundColor: blockColor,
        borderRadius: `8px`,
        zIndex: zIndex,
      }}
      onClick={() => {
        setSelectedBlock(file);
        setSelectedBlockObj({
          applyToAll: false,
          trackId: trackId,
          blockIndex: fileIdx,
        });
        setZIndex(100);
      }}
    >
      <canvas
        ref={canvasRef}
        className={`h-10 w-full rounded-md border border-transparent hover:border-brand-300 ${file.id === selectedBlock?.id ? "border-2 border-yellow-600" : ""}`} // 선택 시 색상
        style={{
          backgroundColor: blockColor,
        }}
      ></canvas>
      {file.id === selectedBlock?.id && (
        <div className="relative z-[999999] overflow-visible">
          <div className="bg-white shadow-md absolute -top-5 left-2 z-[999999] p-4">
            <AudioBlockModal
              handleCrop={splitBlock}
              handleDelete={deleteBlock}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioBlock;
