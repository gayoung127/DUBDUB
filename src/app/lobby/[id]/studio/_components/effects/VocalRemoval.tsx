import React, { useRef } from "react";
import { AudioFile } from "@/app/_types/studio";
import { playAudio } from "@/app/_utils/audioUtils";
import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import Button from "@/app/_components/Button";

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
    const bufferToPlay = previewBufferRef.current || audioBuffer.current;

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
    <section className="flex h-full w-full flex-col items-center justify-between pb-2 pt-16">
      <div className="flex w-full flex-col items-start justify-start gap-y-4 rounded-md bg-gray-200 px-3 py-3">
        <C1 className="text-sm font-normal text-white-200">
          선택된 오디오 블록
        </C1>
        <H4 className="text-base text-white-100">
          ▶ {selectedBlock ? selectedBlock.id : "선택 없음"}
        </H4>
      </div>
      <div className="flex w-full flex-col items-center justify-start gap-y-3">
        <Button className="w-full" onClick={handleVocalRemoval}>
          보컬 제거하기
        </Button>
        <div className="flex w-full flex-row items-center justify-between gap-x-2">
          <Button
            className="w-full bg-white-bg"
            outline={true}
            onClick={handlePlay}
          >
            미리 듣기
          </Button>
          <Button className="w-full" onClick={() => {}}>
            적용하기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VocalRemoval;
