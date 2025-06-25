import { RefObject, useEffect, useRef } from "react";
import StartButton from "@/public/images/icons/icon-play-asset.svg";
import CheckButton from "@/public/images/icons/icon-store-effect.svg";
import RangeSlider from "./RangeSlider";

interface DelayProps {
  context: RefObject<AudioContext | null>;
  audioBuffer: RefObject<AudioBuffer | null>;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const Delay = ({ context, audioBuffer, updateBuffer }: DelayProps) => {
  type AudioContextType = AudioContext | OfflineAudioContext;
  const audioContext = context.current;
  let activeSource: AudioBufferSourceNode | null = null;

  const mix = useRef<number>(0.5); // wet/dry 비율
  const feedback = useRef<number>(0.5); // 감소시킬 음량
  const time = useRef<number>(0.3); // 메아리 간격

  useEffect(() => {
    return () => {
      if (activeSource) {
        activeSource.stop();
        activeSource.disconnect();
        activeSource = null;
      }
    };
  }, []);

  function createDelayNode(targetContext: AudioContextType) {
    const source = targetContext.createBufferSource();
    source.buffer = audioBuffer.current;

    const inputNode = targetContext.createGain();
    const wetGainNode = targetContext.createGain();
    const dryGainNode = targetContext.createGain();
    const feedbackNode = targetContext.createGain();
    const delayNode = targetContext.createDelay();
    const outputNode = targetContext.createGain();

    delayNode.delayTime.value = time.current;
    feedbackNode.gain.value = feedback.current;

    dryGainNode.gain.value = 1 - mix.current;
    wetGainNode.gain.value = mix.current;

    source.connect(dryGainNode);
    dryGainNode.connect(outputNode);

    source.connect(delayNode);
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(wetGainNode);
    wetGainNode.connect(outputNode);

    outputNode.connect(targetContext.destination);

    return { source };
  }

  async function saveDelay() {
    if (!audioBuffer.current || !audioContext) {
      return;
    }

    const offlineContext = new OfflineAudioContext(
      audioBuffer.current.numberOfChannels,
      audioBuffer.current.length,
      audioBuffer.current.sampleRate,
    );

    const { source } = createDelayNode(offlineContext);

    source.start();
    const newBuffer = await offlineContext.startRendering();
    updateBuffer(newBuffer);
  }

  function startDelay() {
    if (!audioContext) {
      return;
    }
    const { source } = createDelayNode(audioContext);
    activeSource = source;
    source.start();
  }

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div className="flex justify-end gap-4">
        <StartButton className="cursor-pointer" onClick={startDelay} />
        <CheckButton className="cursor-pointer" onClick={saveDelay} />
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
        min={0.01}
        max={1}
        step={0.01}
        value={time.current}
        onChange={(newValue: number) => {
          time.current = newValue;
        }}
      />

      <RangeSlider
        title="FEEDBACK"
        unit="s"
        min={0.01}
        max={1}
        step={0.01}
        value={feedback.current}
        onChange={(newValue: number) => {
          feedback.current = newValue;
        }}
      />
    </div>
  );
};

export default Delay;
