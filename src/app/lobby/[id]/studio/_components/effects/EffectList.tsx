import React, { JSX, useEffect, useRef, useState } from "react";
import Reverb from "./Reverb";
import Pitcher from "./Pitcher";
import H2 from "@/app/_components/H2";
import H4 from "@/app/_components/H4";
import BeforeIcon from "@/public/images/icons/icon-before.svg";
import Button from "@/app/_components/Button";
import { Asset, AudioFile, initialTracks, Track } from "@/app/_types/studio";
import Delay from "./Delay";
import useBlockStore from "@/app/_store/BlockStore";
import { audioBufferToWav } from "@/app/_utils/audioBufferToMp3";
import VocalRemoval from "./VocalRemoval";
import Compressor from "./Compressor";
import { findPossibleId } from "@/app/_utils/findPossibleId";
import { useUserStore } from "@/app/_store/UserStore";
import { postAsset } from "@/app/_apis/studio";
import { useParams } from "next/navigation";
import { createBlob } from "@/app/_utils/audioUtils";

interface EffectListProps {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  onUpdateFile: (file: Asset | null) => void;
  assets: Asset[] | null;
}

const EffectList = ({
  tracks,
  setTracks,
  onUpdateFile,
  assets,
}: EffectListProps) => {
  const audioContextRef = useRef<AudioContext | null>(new AudioContext());
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const { selectedBlock, selectedBlockObj } = useBlockStore();
  const [version, setVersion] = useState<number>(0);
  const [selectedEffect, setSelectedEffect] = useState<{
    name: string;
    component: JSX.Element;
  } | null>(null);
  const params = useParams();
  const pid = params.id;

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

  useEffect(() => {
    if (!selectedBlock) {
      return;
    }
    setVersion(findPossibleVersion(selectedBlock.id));
  }, [assets]);

  function isSameFile(str1: string, str2: string) {
    return (
      str1.split("-")[0].split("_")[0] === str2.split("-")[0].split("_")[0]
    );
  }

  function getMiddle(input: string) {
    const underscoreSplit = input.split("_");
    if (underscoreSplit.length < 2) {
      return 0;
    }
    const dashSplit = underscoreSplit[1].split("-");
    const middleValue = Number(dashSplit[0]);
    return isNaN(middleValue) ? 0 : middleValue;
  }

  function findPossibleVersion(id: string) {
    let ret = 0;
    for (const audio of assets!) {
      const input = audio.id;
      if (!isSameFile(input, id)) {
        continue;
      }
      ret = Math.max(ret, getMiddle(input));
    }
    return ret + 1;
  }

  async function saveAsAssets() {
    if (!audioBuffer.current || !selectedBlock) {
      return;
    }

    // 에셋 저장 로직
    // const blob = await audioBufferToWav(audioBuffer.current);
    // await postAsset(String(pid), blob);
    // const url = URL.createObjectURL(blob); //
    const blob = await createBlob(audioBuffer.current);
    const url = await postAsset(String(pid), blob);

    // 추가된 파일
    let newFile = {
      ...selectedBlock,
      id: `${selectedBlock.id.split("-")[0].split("_")[0]}_${version}`,
      url,
    };

    // 전체 블럭에 효과 적용,
    if (selectedBlockObj.applyToAll) {
      setTracks(() =>
        tracks.map((prevTracks) => {
          return {
            ...prevTracks,
            files: prevTracks.files.map((file) => {
              if (
                file.id.split("-")[0] ===
                selectedBlockObj.selectedAudioFile!.id.split("-")[0]
              ) {
                newFile = {
                  ...selectedBlock,
                  startPoint: file.startPoint,
                  trimStart: file.trimStart,
                  trimEnd: file.trimEnd,
                  id: `${selectedBlock.id.split("-")[0].split("_")[0]}_${version}-${Date.now() + Math.floor(Math.random() * 1000)}`,
                  url,
                };
                return newFile;
              }
              return file;
            }),
          };
        }),
      );
    } else {
      // 특정 오디오 블럭에만 적용
      setTracks(
        tracks.map((track, index) => {
          if (index === selectedBlockObj.trackId! - 1) {
            return {
              ...track,
              files: track.files.map((file, fIndex) => {
                if (fIndex === selectedBlockObj.blockIndex) {
                  return newFile;
                } else {
                  return file;
                }
              }),
            };
          } else {
            return track;
          }
        }),
      );
    }
    // 파일 추가
    onUpdateFile({
      id: newFile.id,
      url: newFile.url,
      duration: newFile.duration,
    });
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
