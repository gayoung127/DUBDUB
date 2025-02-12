import React, { JSX, useEffect, useRef, useState } from "react";
import Reverb from "./Reverb";
import Pitcher from "./Pitcher";
import H2 from "@/app/_components/H2";
import H4 from "@/app/_components/H4";
import BeforeIcon from "@/public/images/icons/icon-before.svg";
import Button from "@/app/_components/Button";
import { initialTracks, Track } from "@/app/_types/studio";
import Delay from "./Delay";
import useBlockStore from "@/app/_store/BlockStore";
import { audioBufferToArrayBuffer } from "@/app/_utils/audioBufferToMp3";
import VocalRemoval from "./VocalRemoval";
import Compressor from "./Compressor";
// import {
//   audioBufferToMp3,
//   audioBufferToWebm,
// } from "@/app/_utils/audioBufferToMp3";

interface EffectListProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const EffectList = ({ tracks, setTracks }: EffectListProps) => {
  const audioContextRef = useRef<AudioContext | null>(new AudioContext());
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const { selectedBlock, setSelectedBlock } = useBlockStore();

  const [selectedEffect, setSelectedEffect] = useState<{
    name: string;
    component: JSX.Element;
  } | null>(null);

  useEffect(() => {
    async function loadAudio() {
      if (!audioContextRef.current) {
        console.log("❌ AudioContext가 없습니다.");
        return;
      }

      const file = selectedBlock;
      if (!file) {
        console.log("❌ 선택된 오디오 블럭이 없습니다.");
        return;
      }

      console.log("📂 오디오 파일 로드 시작:", file.url);

      try {
        const response = await fetch(file.url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer.current =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        console.log("✅ 오디오 디코딩 완료:", audioBuffer.current);
      } catch (error) {
        console.error("🚨 오디오 파일 로드 실패:", error);
      }
    }
    loadAudio();
  }, [selectedBlock]);

  useEffect(() => {
    if (selectedEffect && activeSourceRef.current) {
      activeSourceRef.current.stop();
      activeSourceRef.current.disconnect();
      activeSourceRef.current = null;
    }
  }, [selectedEffect]);

  function startAudio() {
    if (!audioContextRef.current) {
      return;
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer.current;
    source.connect(audioContextRef.current.destination);

    source.start();
    activeSourceRef.current = source;
  }

  function updateBuffer(newBuf: AudioBuffer | null) {
    audioBuffer.current = newBuf;
  }

  async function saveAsAssets() {
    if (!audioBuffer.current || !selectedBlock) {
      console.log("먼저 오디오 블럭을 선택해주세요");
      return;
    }

    // 에셋 저장 로직

    // audio buffer를 array buffer 로 변환 후 서버로 보내기.
    const arrayBuffer = audioBufferToArrayBuffer(audioBuffer.current);
    console.log("array buffer = ", arrayBuffer);
    // 소켓에서 이 arraybuffer 클라이언트들에게 뿌리기
    // mp3로 변환해서 에셋에 저장
  }

  const effects = [
    {
      name: "리버브",
      component: (
        <Reverb
          context={audioContextRef}
          audioBuffer={audioBuffer}
          updateBuffer={updateBuffer}
        />
      ),
    },
    {
      name: "딜레이",
      component: (
        <Delay
          context={audioContextRef}
          audioBuffer={audioBuffer}
          updateBuffer={updateBuffer}
        />
      ),
    },
    {
      name: "피치 조정",
      component: (
        <Pitcher
          context={audioContextRef}
          audioBuffer={audioBuffer}
          updateBuffer={updateBuffer}
        />
      ),
    },
    {
      name: "보컬 제거",
      component: (
        <VocalRemoval
          context={audioContextRef}
          audioBuffer={audioBuffer}
          updateBuffer={updateBuffer}
          selectedBlock={selectedBlock}
        />
      ),
    },
    {
      name: "컴프레서",
      component: (
        <Compressor
          context={audioContextRef}
          audioBuffer={audioBuffer}
          updateBuffer={updateBuffer}
          selectedBlock={selectedBlock}
        />
      ),
    },
  ];

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 pb-4 pl-4 pr-3 pt-7">
      <div className="scrollbar relative flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        {selectedEffect ? (
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="flex w-full justify-between pb-5">
              <BeforeIcon
                className="cursor-pointer"
                onClick={() => {
                  setSelectedEffect(null);
                }}
              />
              <H2 className="text-xl font-bold text-white-100">
                {selectedEffect.name}
              </H2>

              <div className="h-4 w-4" />
            </div>
            {selectedEffect.component}
          </div>
        ) : (
          <div className="flex w-full flex-col items-start gap-3">
            {effects.map((effect, index) => (
              <div
                key={index}
                className="w-full border-b-2 pb-3 text-white-100"
                onClick={() => {
                  setSelectedEffect(effect);
                }}
              >
                <H4 className="pl-3">{effect.name}</H4>
              </div>
            ))}
            <div className="absolute bottom-1 flex w-full gap-2">
              <Button small outline className="flex-1" onClick={startAudio}>
                재생
              </Button>
              <Button small className="flex-1" onClick={saveAsAssets}>
                에셋으로 저장
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EffectList;
