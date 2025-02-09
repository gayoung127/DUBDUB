import React, { JSX, useEffect, useRef, useState } from "react";
import Reverb from "./Reverb";
import Pitcher from "./Pitcher";
import H2 from "@/app/_components/H2";
import H4 from "@/app/_components/H4";
import BeforeIcon from "@/public/images/icons/icon-before.svg";
import Button from "@/app/_components/Button";
import { initialTracks } from "@/app/_types/studio";
import Delay from "./Delay";

const EffectList = () => {
  const [tracks, setTracks] = useState(initialTracks);
  const audioContextRef = useRef<AudioContext | null>(new AudioContext());
  const audioBuffer = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    async function loadAudio() {
      if (!audioContextRef.current) {
        return;
      }
      const response = await fetch(tracks[0].files[0].url);
      console.log(tracks[0].files[0]);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer.current =
        await audioContextRef.current.decodeAudioData(arrayBuffer);
    }
    loadAudio();
  }, []);

  function startAudio() {
    if (!audioContextRef.current) {
      return;
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer.current;
    source.connect(audioContextRef.current.destination);

    source.start();
  }

  function updateBuffer(newBuf: AudioBuffer | null) {
    audioBuffer.current = newBuf;
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
  ];

  const [selectedEffect, setSelectedEffect] = useState<{
    name: string;
    component: JSX.Element;
  } | null>(null);

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar relative flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
        {selectedEffect ? (
          <div className="h-full w-full">
            <div className="flex justify-between pb-5">
              <BeforeIcon
                className="cursor-pointer"
                onClick={() => {
                  setSelectedEffect(null);
                }}
              />
              <H2 className="text-xl font-bold text-white-100">
                {selectedEffect.name}
              </H2>

              <div></div>
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
              <Button small className="flex-1" onClick={() => {}}>
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
