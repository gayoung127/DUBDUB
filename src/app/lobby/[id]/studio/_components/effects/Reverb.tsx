import { RefObject, useRef, useState } from "react";
import RangeSlider from "./RangeSlider";
import StartButton from "@/public/images/icons/icon-play.svg";
import CheckButton from "@/public/images/icons/icon-check.svg";

interface ReverbProps {
  context: RefObject<AudioContext | null>; // Ref 타입 지정
  audioBuffer: RefObject<AudioBuffer | null>;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const Reverb = ({ context, audioBuffer, updateBuffer }: ReverbProps) => {
  type AudioContextType = AudioContext | OfflineAudioContext;
  const audioContext = context.current;

  const mix = useRef<number>(0); // wet/dry의 비율
  const time = useRef<number>(3); // 잔향의 길이
  const decay = useRef<number>(2); // 잔향이 감소하는 빠르기

  function generateIR() {
    if (!audioContext) {
      return;
    }
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * time.current;
    const impulse = audioContext.createBuffer(2, length, sampleRate);

    const leftImpulse = impulse.getChannelData(0);
    const rightImpulse = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      leftImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay.current);
      rightImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay.current);
    }
    return impulse;
  }

  function createReverbNodes(targetContext: AudioContextType): {
    source: AudioBufferSourceNode;
    reverbNode: ConvolverNode;
  } {
    const source = targetContext.createBufferSource();
    source.buffer = audioBuffer.current;

    const inputNode = targetContext.createGain();
    const dryGainNode = targetContext.createGain();
    const wetGainNode = targetContext.createGain();
    const reverbNode = targetContext.createConvolver();

    source.connect(inputNode);

    inputNode.connect(dryGainNode);
    dryGainNode.connect(targetContext.destination);
    dryGainNode.gain.value = 1 - mix.current;

    reverbNode.buffer = generateIR() || null;
    inputNode.connect(reverbNode);

    reverbNode.connect(wetGainNode);
    wetGainNode.connect(targetContext.destination);
    wetGainNode.gain.value = mix.current;

    return { source, reverbNode };
  }

  async function saveReverb() {
    if (!audioContext || !audioBuffer.current) {
      return;
    }

    const offlineContext = new OfflineAudioContext(
      audioBuffer.current.numberOfChannels,
      audioBuffer.current.length,
      audioBuffer.current.sampleRate,
    );

    const { source } = createReverbNodes(offlineContext);

    source.start();
    const newBuffer = await offlineContext.startRendering();

    updateBuffer(newBuffer);
  }

  async function startReverb() {
    if (!audioContext || !audioBuffer.current) {
      return;
    }
    const { source } = createReverbNodes(audioContext);
    source.start();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end gap-4">
        <StartButton className="cursor-pointer" onClick={startReverb} />
        <CheckButton className="cursor-pointer" onClick={saveReverb} />
      </div>
      <RangeSlider
        title="MIX"
        unit="%"
        min={0}
        step={0.05}
        max={1}
        value={mix.current}
        onChange={(newValue: number) => {
          mix.current = newValue;
        }}
      />

      <RangeSlider
        title="TIME"
        unit="s"
        min={0}
        max={5}
        step={0.01}
        value={time.current}
        onChange={(newValue: number) => {
          time.current = newValue;
        }}
      />

      <RangeSlider
        title="DECAY"
        unit="s"
        min={0}
        max={5}
        step={0.01}
        value={decay.current}
        onChange={(newValue: number) => {
          decay.current = newValue;
        }}
      />
    </div>
  );
};

export default Reverb;
