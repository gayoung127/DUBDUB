import React, { useEffect, useRef, useState } from "react";

import H4 from "@/app/_components/H4";

const VideoTrack = ({
  isMuted,
  isSolo,
  videoUrl,
  isProcessedAudio,
  setVideoMuted,
  setVideoSolo,
  setIsProcessedAudio,
}: {
  isMuted: boolean;
  isSolo: boolean;
  videoUrl: string;
  isProcessedAudio: boolean;
  setVideoMuted: (muted: boolean) => void;
  setVideoSolo: (solo: boolean) => void;
  setIsProcessedAudio: (isProcessed: boolean) => void;
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const processedBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!videoUrl) return;
    const initAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      try {
        const response = await fetch(videoUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;

        // ✅ 보컬 제거된 오디오를 초기 설정
        removeVocals(audioBuffer);
      } catch (error) {
        console.error("❌ 오디오 로드 실패:", error);
      }
    };

    initAudio();
  }, [videoUrl]);

  // ✅ 보컬 제거 함수 (렌더링 시 자동 실행)
  const removeVocals = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) {
      console.error("❌ AudioContext가 없습니다.");
      return;
    }

    const numOfChannels = buffer.numberOfChannels;
    if (numOfChannels < 2) {
      console.error("❌ 스테레오 오디오가 아닙니다. 보컬 제거 불가능.");
      return;
    }

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    const length = leftChannel.length;

    const newBuffer = audioContextRef.current.createBuffer(
      2,
      length,
      buffer.sampleRate,
    );
    const newLeftChannel = newBuffer.getChannelData(0);
    const newRightChannel = newBuffer.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const center = (leftChannel[i] - rightChannel[i]) / 2; // 보컬 제거
      newLeftChannel[i] = center;
      newRightChannel[i] = center;
    }

    console.log("✅ 보컬 제거된 오디오 버퍼 생성 완료");
    processedBufferRef.current = newBuffer;
  };

  // ✅ 원본/보컬 제거 오디오 토글
  const handleToggleAudio = () => {
    const newIsProcessedAudio = !isProcessedAudio;
    setIsProcessedAudio(newIsProcessedAudio);
  };

  const handlePlayAudio = (useProcessedAudio: boolean) => {
    if (!audioContextRef.current) {
      console.error("❌ AudioContext가 없습니다.");
      return;
    }

    const bufferToPlay = useProcessedAudio
      ? processedBufferRef.current
      : audioBufferRef.current;

    if (!bufferToPlay) {
      console.error("❌ 재생할 오디오 버퍼가 없습니다.");
      return;
    }

    // 기존 오디오 재생 중지
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = bufferToPlay;

    // ✅ GainNode 추가 (음소거/볼륨 조절)
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
    }

    source.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // ✅ 음소거 상태 반영
    gainNodeRef.current.gain.value = isMuted ? 0 : 1;

    source.start();
    audioSourceRef.current = source;
  };

  // handleMute(): 트랙 음소거
  const handleMute = () => {
    const newMutedStatus = !isMuted;
    setVideoMuted(newMutedStatus);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newMutedStatus ? 0 : 1;
    }
  };

  // handleSolo(): 트랙 솔로
  const handleSolo = () => {
    const newSoloState = !isSolo;
    setVideoSolo(newSoloState);

    if (newSoloState) {
      setVideoMuted(true);
    } else {
      setVideoMuted(false);
    }
  };

  return (
    <div
      className={`box-border flex h-[60px] min-h-0 w-[280px] flex-row items-center justify-between overflow-hidden border-b border-t border-gray-300 px-3`}
    >
      <H4 className="border-white-100 font-bold text-white-100">Original </H4>
      <div className="flex flex-row items-center gap-x-4">
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isProcessedAudio ? "bg-green-500" : "bg-white-100"}`}
          onClick={() => handlePlayAudio(isProcessedAudio)}
        >
          <span className="text-xs font-bold text-gray-400">P</span>
        </div>
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isProcessedAudio ? "bg-green-500" : "bg-white-100"}`}
          onClick={() => handleToggleAudio()}
        >
          <span className="text-xs font-bold text-gray-400">V</span>
        </div>
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isMuted ? "bg-green-500" : "bg-white-100"}`}
          onClick={handleMute}
        >
          <span className="text-xs font-bold text-gray-400">M</span>
        </div>
        <div
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm ${isSolo ? "bg-orange-400" : "bg-white-100"}`}
          onClick={handleSolo}
        >
          <span className="text-xs font-bold text-gray-400">S</span>
        </div>
      </div>
    </div>
  );
};

export default VideoTrack;
