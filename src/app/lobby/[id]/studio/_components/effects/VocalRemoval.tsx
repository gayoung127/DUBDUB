import React, { useRef } from "react";
import { AudioFile } from "@/app/_types/studio";
import { playAudio } from "@/app/_utils/audioUtils";

interface VocalRemovalProps {
  context: React.RefObject<AudioContext | null>;
  audioBuffer: React.RefObject<AudioBuffer | null>;
  selectedBlock: AudioFile | null;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const VocalRemoval = ({
  context,
  audioBuffer,
  selectedBlock,
  updateBuffer,
}: VocalRemovalProps) => {
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const previewBufferRef = useRef<AudioBuffer | null>(null); // 보컬 제거된 버퍼 저장

  const handleVocalRemoval = () => {
    if (!context.current) {
      console.error("❌ audioContext가 없습니다.");
      return;
    }
    if (!audioBuffer.current) {
      console.error("❌ audioBuffer가 null입니다.");
      return;
    }

    const numOfChannels = audioBuffer.current.numberOfChannels;
    if (numOfChannels < 2) {
      console.error("❌ 스테레오 오디오가 아닙니다. 보컬 제거 불가능.");
      return;
    }

    // 좌우 채널 데이터 가져오기
    const leftChannel = audioBuffer.current.getChannelData(0); // L 채널
    const rightChannel = audioBuffer.current.getChannelData(1); // R 채널
    const length = leftChannel.length;

    // 보컬 제거된 데이터 버퍼 생성
    const newBuffer = context.current.createBuffer(
      2,
      length,
      audioBuffer.current.sampleRate,
    );
    const newLeftChannel = newBuffer.getChannelData(0);
    const newRightChannel = newBuffer.getChannelData(1);

    // L - R 로 중앙 성분 제거
    for (let i = 0; i < length; i++) {
      const center = (leftChannel[i] - rightChannel[i]) / 2; // 중앙 성분 제거
      newLeftChannel[i] = center;
      newRightChannel[i] = center;
    }

    console.log("✅ 보컬 제거된 오디오 버퍼 생성 완료");
    previewBufferRef.current = newBuffer; // 미리 듣기용 버퍼 저장
    updateBuffer(newBuffer); // 새로운 버퍼 업데이트
  };

  const handlePlay = () => {
    if (!context.current) {
      console.error("❌ audioContext가 없습니다.");
      return;
    }
    if (!selectedBlock) {
      console.error("❌ 선택된 오디오 블록이 없습니다.");
      return;
    }

    // 보컬 제거된 버퍼가 있으면 그 버퍼로 재생
    const bufferToPlay = previewBufferRef.current || audioBuffer;

    if (!bufferToPlay) {
      console.error("❌ 재생할 오디오 버퍼가 없습니다.");
      return;
    }

    console.log("✅ audioContext:", context.current);
    console.log("✅ bufferToPlay:", bufferToPlay);
    console.log("✅ selectedBlock:", selectedBlock);

    playAudio({
      audioContext: context.current,
      audioBuffer: bufferToPlay, // 여기서 보컬 제거된 버퍼 또는 원본 버퍼 사용
      audioSourceRef,
      file: selectedBlock,
    });
  };

  return (
    <section>
      <button onClick={handleVocalRemoval}>보컬 제거</button>
      <button onClick={() => handlePlay()}>재생</button>
    </section>
  );
};

export default VocalRemoval;
