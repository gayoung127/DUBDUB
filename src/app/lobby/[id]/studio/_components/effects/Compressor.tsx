import React from "react";
import { AudioFile } from "@/app/_types/studio";
import C1 from "@/app/_components/C1";
import H4 from "@/app/_components/H4";
import Button from "@/app/_components/Button";

interface CompressorProps {
  context: React.RefObject<AudioContext | null>;
  audioBuffer: React.RefObject<AudioBuffer | null>;
  selectedBlock: AudioFile | null;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const Compressor = ({
  context,
  audioBuffer,
  selectedBlock,
  updateBuffer,
}: CompressorProps) => {
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
        <div className="flex w-full flex-row items-center justify-between gap-x-2">
          <Button
            className="w-full bg-white-bg"
            outline={true}
            onClick={() => {}}
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

export default Compressor;
