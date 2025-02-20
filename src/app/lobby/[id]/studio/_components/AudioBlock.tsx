"use client";

import gsap from "gsap";
import { toast } from "sonner";
import { Draggable } from "gsap/Draggable";
import React, { useEffect, useRef, useState } from "react";

import useBlockStore from "@/app/_store/BlockStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import {
  AudioFile,
  Block,
  PX_PER_SECOND,
  SelectingBlock,
  Track,
} from "@/app/_types/studio";

import AudioBlockModal from "./AudioBlockModal";
import { useStompStore } from "@/app/_store/StompStore";
import { useUserStore } from "@/app/_store/UserStore";
import { useSessionIdStore } from "@/app/_store/SessionIdStore";
import { getCursorStyle } from "@/app/_utils/changeIdToColor";

export interface AudioBlockProps extends Block {
  audioContext: AudioContext | null;
  audioBuffers: Map<string, AudioBuffer> | null;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  trackId: number | null;
  fileIdx: number | null;
  setSelectingBlocks?: React.Dispatch<React.SetStateAction<SelectingBlock[]>>;
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
  selecting,
  selectingUser,
  setSelectingBlocks,
}: AudioBlockProps) => {
  const { time, isPlaying } = useTimeStore();
  const {
    selectedBlocks,
    setSelectedBlocks,
    setSelectedBlockObj,
    clearSelectedBlocks,
  } = useBlockStore();
  const { stompClientRef, isConnected } = useStompStore();
  const { sessionId } = useSessionIdStore();
  const { memberId, self } = useUserStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);

  const [zIndex, setZIndex] = useState<number>(1);
  const [localStartPoint, setLocalStartPoint] = useState<number>(
    (file.startPoint + file.trimStart) * PX_PER_SECOND,
  );

  const lastIsPlayingRef = useRef<boolean | null>(null);

  // ✅ 선택된 블록인지 확인하는 함수
  const isSelected = selectedBlocks.some((b) => b.id === file.id);

  // useEffect: 블록 선택 시, 가장 위로 올라오게 두기 (z-index = 200 설정)
  useEffect(() => {
    if (isSelected) {
      setZIndex(200);
    } else {
      setZIndex(1);
    }
  }, [selectedBlocks]);

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

    if (lastIsPlayingRef.current === isPlaying) {
      console.log("⚠️ isPlaying 상태 동일, 실행 방지");
      return;
    }

    lastIsPlayingRef.current = isPlaying; // 변경된 상태 저장

    const startOffset = file.startPoint + file.trimStart;
    const endOffset =
      startOffset + (file.duration - file.trimEnd - file.trimStart);

    console.log(
      "🎯 useEffect 실행 | time:",
      time,
      "| startOffset:",
      startOffset,
      "| endOffset:",
      endOffset,
    );

    if (!isPlaying) {
      console.log("🛑 사용자 정지 신호 감지, 즉시 정지");
      stopAudio();
      return;
    }

    if (time >= endOffset) {
      console.log("🛑 타임라인 초과, 즉시 정지");
      stopAudio();
      return;
    }

    if (
      isPlaying &&
      time >= startOffset &&
      time < endOffset &&
      !audioSourceRef.current
    ) {
      console.log(
        "▶️ 재생 조건 충족 | isPlaying:",
        isPlaying,
        "| time:",
        time,
        "| audioSourceRef.current:",
        audioSourceRef.current,
      );
      playAudio();
    } else {
      console.log("⚠️ 이미 재생 중인 오디오가 있음, 중복 실행 방지");
    }
  }, [time, isPlaying, file.startPoint]);

  // useEffect: 파일 URL 반영시, 파형 생성
  useEffect(() => {
    if (!file.url) return;

    if (audioBuffers?.get(file.url)) {
      // 🔹 이미 `audioBuffers`에 있으면 바로 시각화
      visualizeWaveform(audioBuffers.get(file.url)!);
    } else {
      // 🔹 없으면 fetch()로 받아와서 시각화
      fetchAudioBuffer(file.url).then((audioBuffer) => {
        if (audioBuffer) visualizeWaveform(audioBuffer);
      });
    }
  }, [audioBuffers, file.url]);

  const fetchAudioBuffer = async (url: string): Promise<AudioBuffer | null> => {
    if (!audioContext) return null;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("❌ 오디오 버퍼 가져오기 실패:", error);
      return null;
    }
  };

  // visualizeWaveForm() : 파형 생성
  const visualizeWaveform = (audioBuffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    if (!audioContext || audioSourceRef.current || !file.url) {
      console.warn(
        "⚠️ 재생 불가 | audioContext:",
        audioContext,
        "| audioSourceRef.current:",
        audioSourceRef.current,
        "| file.url:",
        file.url,
      );
      return;
    }

    try {
      console.log("🎵 오디오 로드 시작:", file.url);

      // 🔥 fetch로 오디오 파일 불러오기
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();

      // ✅ `volume`이 유효한 값인지 확인 후 적용
      const volume = Number.isFinite(file.volume) ? file.volume : 1;
      gainNode.gain.value = file.isMuted ? 0 : volume;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // ✅ `speed`도 유효한 값인지 확인 후 적용
      const playbackRate = Number.isFinite(file.speed) ? file.speed : 1;
      source.playbackRate.value = playbackRate;

      // ✅ trimStart, trimEnd 검증 후 값 설정
      const offset = Math.max(0, time - file.startPoint - file.trimStart);
      const duration = Math.max(
        0,
        (file.duration || 0) - offset - (file.trimEnd || 0),
      );

      console.log("🔄 재생 설정 | offset:", offset, "| duration:", duration);

      source.start(audioContext.currentTime, offset, duration);

      audioSourceRef.current = source;

      console.log(
        "✅ 오디오 재생 시작 | audioSourceRef.current:",
        audioSourceRef.current,
      );

      source.onended = () => {
        if (audioSourceRef.current) {
          console.log("🔚 오디오 재생 완료, 리소스 정리");
          audioSourceRef.current = null;
        }
      };
    } catch (error) {
      console.error("❌ 오디오 로드 실패:", error);
      toast.error("오디오 파일을 불러오는 데 실패했습니다.");
    }
  };

  // stopAudio(): 개별 오디오 파일 즉시 정지 함수
  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        console.log(
          "🛑 오디오 정지 호출 | 현재 오디오 소스:",
          audioSourceRef.current,
        );
        console.log("⏳ 오디오 disconnect 실행");
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
        console.log("✅ 오디오 정지 완료");
        audioSourceRef.current = null;
      } catch (error) {
        console.warn("⚠️ 오디오 정지 중 오류 발생:", error);
      }
    } else {
      console.warn("⚠️ stopAudio 호출 시 audioSourceRef가 이미 비어 있음.");
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

    // 🔥 기존 블록을 STOMP 서버에서 삭제 (DELETE 액션)
    if (stompClientRef?.connected && sessionId) {
      const deleteAction = {
        trackId: trackId,
        action: "DELETE",
        file: {
          id: file.id,
        },
      };

      stompClientRef.publish({
        destination: `/app/studio/${sessionId}/track/files`,
        body: JSON.stringify(deleteAction),
      });
    }

    // ✅ 기존 블록을 삭제하고 새로운 블록 추가
    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        files: track.files.flatMap((f) =>
          f.id === file.id ? [newLeftBlock.file, newRightBlock.file] : [f],
        ),
      })),
    );

    // ✅ 선택된 블록 초기화 (삭제된 블록을 참조하는 문제 해결)
    clearSelectedBlocks();
    setSelectedBlockObj({
      applyToAll: false,
      selectedAudioFile: null,
      trackId: null,
      blockIndex: null,
    });

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

    clearSelectedBlocks();
    setSelectedBlockObj({
      applyToAll: false,
      selectedAudioFile: null,
      trackId: null,
      blockIndex: null,
    });

    if (stompClientRef?.connected && sessionId) {
      const deleteAction = {
        trackId: trackId,
        action: "DELETE",
        file: {
          id: file.id,
        },
      };

      stompClientRef.publish({
        destination: `/app/studio/${sessionId}/track/files`,
        body: JSON.stringify(deleteAction),
      });

      toast.success("성공적으로 오디오 블록을 삭제했습니다!");
    }
  };

  // useEffect: 오디오 블록 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // c : 자르기 기능
      if (event.key.toLowerCase() === "c" && isSelected) {
        splitBlock();
      }

      // delete : 오디오 블록 삭제 기능
      if (event.key.toLowerCase() === "delete" && isSelected) {
        deleteBlock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlocks]);

  // ✅ 블록 클릭 이벤트 핸들러
  const handleBlockClick = (e: React.MouseEvent) => {
    setSelectedBlocks((prevBlocks: AudioFile[]) => {
      let updatedBlocks;

      // ✅ 이미 선택된 블록이면 제거
      if (prevBlocks.some((b) => b.id === file.id)) {
        updatedBlocks = prevBlocks.filter((b) => b.id !== file.id);
      } else {
        // ✅ 아니라면 추가
        updatedBlocks = [...prevBlocks, file];
      }

      return updatedBlocks;
    });

    setSelectedBlockObj({
      applyToAll: false,
      selectedAudioFile: file,
      trackId: trackId,
      blockIndex: fileIdx,
    });

    setZIndex(100);

    console.log("---오디오 블럭 선택---");
    const memberId = self?.memberId || "anonymous";
    const x = e.clientX;
    const y = e.clientY;
    const name = self?.nickName || "익명의 더비";

    let selectedAudioBlockId = null;

    if (selecting) {
      selecting = false;
      selectedAudioBlockId = null;
    } else {
      selecting = true;
      selectedAudioBlockId = file.id;
    }

    if (!setSelectingBlocks) {
      return;
    }
    setSelectingBlocks((prevBlocks) => {
      const updatedBlocks = prevBlocks.map((block) => {
        // 선택했음 & 이전에 누군가 선택한 값
        if (selecting && block.selectedAudioBlockId === selectedAudioBlockId) {
          return { ...block, selecting: false, selectedAudioBlockId: null };
        }

        if (block.memberId === self?.memberId) {
          return {
            ...block,
            memberId: Number(self?.memberId),
            selecting: selecting,
            selectedAudioBlockId: selectedAudioBlockId,
          };
        }
        return block;
      });

      if (JSON.stringify(updatedBlocks) === JSON.stringify(prevBlocks)) {
        return prevBlocks;
      } else {
        console.log("자신 update block = ", updatedBlocks);
      }
      return updatedBlocks;
    });

    if (stompClientRef?.connected && sessionId) {
      stompClientRef?.publish({
        destination: `/app/studio/${sessionId}/cursor`,
        body: JSON.stringify({
          memberId: self?.memberId,
          x,
          y,
          name,
          selecting,
          selectedAudioBlockId,
        }),
      });
      console.log(
        "---전송 정보 : selecting = ",
        selecting,
        " , selectedAudioBlockId = ",
        selectedAudioBlockId,
        ", x = ",
        x,
        " y = ",
        y,
        " ,memberId= ",
        memberId,
      );
    } else {
      console.log("세션이 없어서 안 감");
    }
  };

  useEffect(() => {
    if (selecting && selectingUser) {
      console.log(
        "스타일 = ",
        getCursorStyle(String(selectingUser)).borderColor,
      );
    } else {
      console.log("없음");
    }
  }, []);

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
      onClick={handleBlockClick}
    >
      <canvas
        ref={canvasRef}
        className={`h-10 w-full rounded-md border border-transparent hover:border-brand-300 ${selecting && selectingUser ? `border-2 ${getCursorStyle(String(selectingUser)).borderColor}` : ""}`} // 선택 시 색상
        style={{
          backgroundColor: blockColor,
        }}
      ></canvas>
      {isSelected && (
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
