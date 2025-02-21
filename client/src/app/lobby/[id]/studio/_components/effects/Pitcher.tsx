import { RefObject, useEffect, useRef } from "react";
import StartButton from "@/public/images/icons/icon-play-asset.svg";
import CheckButton from "@/public/images/icons/icon-store-effect.svg";
import RangeSlider from "./RangeSlider";

interface PitcherProps {
  context: RefObject<AudioContext | null>;
  audioBuffer: RefObject<AudioBuffer | null>;
  updateBuffer: (newBuf: AudioBuffer | null) => void;
}

const Pitcher = ({ context, audioBuffer, updateBuffer }: PitcherProps) => {
  type AudioContextType = AudioContext | OfflineAudioContext;
  const audioContext = context.current;
  let activeSource: AudioBufferSourceNode | null = null;

  const playbackRate = useRef<number>(1);
  const volume = useRef<number>(1);

  useEffect(() => {
    return () => {
      if (activeSource) {
        activeSource.stop();
        activeSource.disconnect();
        activeSource = null;
      }
    };
  }, []);

  function createPitcherNode(targetContext: AudioContextType) {
    const source = targetContext.createBufferSource();
    source.buffer = audioBuffer.current;

    const gain = targetContext.createGain();

    source.playbackRate.value = playbackRate.current;
    source.connect(gain);

    gain.gain.value = volume.current;
    gain.connect(targetContext.destination);

    return { source };
  }

  async function savePitch() {
    if (!audioBuffer.current || !audioContext) {
      return;
    }

    const offlineContext = new OfflineAudioContext(
      audioBuffer.current.numberOfChannels,
      audioBuffer.current.length,
      audioBuffer.current.sampleRate,
    );

    const { source } = createPitcherNode(offlineContext);
    source.start();
    const newBuffer = await offlineContext.startRendering();
    updateBuffer(newBuffer);
  }

  function startPitch() {
    if (!audioContext) {
      return;
    }
    const { source } = createPitcherNode(audioContext);
    activeSource = source;
    source.start();
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-10">
      <div className="flex justify-end gap-4">
        <StartButton className="cursor-pointer" onClick={startPitch} />
        <CheckButton className="cursor-pointer" onClick={savePitch} />
      </div>
      <RangeSlider
        title="PITCH"
        min={0.1}
        step={0.1}
        max={2}
        value={playbackRate.current}
        onChange={(newValue: number) => {
          playbackRate.current = newValue;
        }}
      />

      <RangeSlider
        title="VOLUME"
        min={0}
        max={5}
        step={0.1}
        value={volume.current}
        onChange={(newValue: number) => {
          volume.current = newValue;
        }}
      />
    </div>
  );
};

export default Pitcher;
