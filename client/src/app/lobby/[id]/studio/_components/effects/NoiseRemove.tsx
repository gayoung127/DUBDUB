import React, { useEffect, useRef } from "react";
import { AudioFile } from "@/app/_types/studio";
import { playAudio } from "@/app/_utils/audioUtils";
import H4 from "@/app/_components/H4";
import C1 from "@/app/_components/C1";
import Button from "@/app/_components/Button";
import StartButton from "@/public/images/icons/icon-play-asset.svg";
import CheckButton from "@/public/images/icons/icon-store-effect.svg";
import RangeSlider from "./RangeSlider";

interface NoiseRemovalProps {
  context: React.RefObject<AudioContext | null>;
  audioBuffer: React.RefObject<AudioBuffer | null>;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const NoiseRemoval = ({
  context,
  audioBuffer,
  updateBuffer,
}: NoiseRemovalProps) => {
  type AudioContextType = AudioContext | OfflineAudioContext;
  const audioContext = context.current;
  let activeSource: AudioBufferSourceNode | null = null;

  // 노이즈 제거 필터 강도 조절
  const highPassFreq = useRef<number>(100); // 100Hz 이하 제거
  const lowPassFreq = useRef<number>(8000); // 8kHz 이상 제거

  useEffect(() => {
    return () => {
      if (activeSource) {
        activeSource.stop();
        activeSource.disconnect();
        activeSource = null;
      }
    };
  }, []);

  function createFilterNode(targetContext: AudioContextType) {
    const source = targetContext.createBufferSource();
    source.buffer = audioBuffer.current;

    // 노이즈 필터 설정
    const highPassFilter = targetContext.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = highPassFreq.current; // 저주파 노이즈 제거

    const lowPassFilter = targetContext.createBiquadFilter();
    lowPassFilter.type = "lowpass";
    lowPassFilter.frequency.value = lowPassFreq.current; // 고주파 노이즈 제거

    // 필터 체인 연결
    source.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(targetContext.destination);

    return { source };
  }

  async function saveNoiseReduction() {
    if (!audioBuffer.current || !audioContext) {
      return;
    }

    const offlineContext = new OfflineAudioContext(
      audioBuffer.current.numberOfChannels,
      audioBuffer.current.length,
      audioBuffer.current.sampleRate,
    );

    const { source } = createFilterNode(offlineContext);
    source.start();
    const newBuffer = await offlineContext.startRendering();
    updateBuffer(newBuffer);
  }

  function startNoiseReduction() {
    if (!audioContext) {
      return;
    }
    const { source } = createFilterNode(audioContext);
    activeSource = source;
    source.start();
  }

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div className="flex justify-end gap-4">
        <StartButton className="cursor-pointer" onClick={startNoiseReduction} />
        <CheckButton className="cursor-pointer" onClick={saveNoiseReduction} />
      </div>

      <RangeSlider
        title="LOW PASS"
        unit="Hz"
        min={500}
        step={100}
        max={10000}
        value={lowPassFreq.current}
        onChange={(newValue: number) => {
          lowPassFreq.current = newValue;
        }}
      />

      <RangeSlider
        title="HIGH PASS"
        unit="Hz"
        min={10}
        max={500}
        step={10}
        value={highPassFreq.current}
        onChange={(newValue: number) => {
          highPassFreq.current = newValue;
        }}
      />
    </div>
  );
};

export default NoiseRemoval;
