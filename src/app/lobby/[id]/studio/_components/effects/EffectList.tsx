import React, { JSX, useEffect, useRef, useState } from "react";
import Reverb from "./Reverb";
import Pitcher from "./Pitcher";
import H2 from "@/app/_components/H2";
import H4 from "@/app/_components/H4";
import BeforeIcon from "@/public/images/icons/icon-before.svg";
import Button from "@/app/_components/Button";
import { initialTracks } from "@/app/_types/studio";

const EffectList = () => {
  const [tracks, setTracks] = useState(initialTracks);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(
    null,
  );

  const effects = [
    {
      name: "리버브",
      component: <Reverb />,
    },
    { name: "피치 조정", component: <Pitcher /> },
  ];

  const [selectedEffect, setSelectedEffect] = useState<{
    name: string;
    component: JSX.Element;
  } | null>(null);

  return (
    <div className="h-full min-h-[433px] w-full border border-gray-300 py-7 pl-4 pr-3">
      <div className="scrollbar flex h-full max-h-[393px] w-full flex-1 flex-wrap items-start justify-start gap-6 overflow-y-scroll">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EffectList;
