import { initialTracks } from "@/app/_types/studio";
import { useEffect, useRef, useState } from "react";

interface ReverbProps {
  audioContext: AudioContext | null;
}

const Reverb = () => {
  const [tracks, setTracks] = useState(initialTracks);
  const [reverbOn, setReverbOn] = useState(false);
  //const audioContext = useRef<AudioContext | null>(null);
  //const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const mix = 0.7; // wet/dry의 비율
  const time = 3.0; // 잔향의 길이
  const decay = 2.0; // 잔향이 감소하는 빠르기

  const audioContext = useRef<AudioContext | null>(null);
  let audioBuffer: AudioBuffer | null = null;

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
  }, []);

  async function loadAudio() {
    if (!audioContext.current) {
      return;
    }
    const response = await fetch(tracks[0].files[0].url);
    console.log(tracks[0].files[0]);
    //const response = await fetch("/examples/dummy-audio.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
  }

  function generateIR() {
    if (!audioContext.current) {
      return;
    }
    const sampleRate = audioContext.current.sampleRate;
    const length = sampleRate * time;
    const impulse = audioContext.current.createBuffer(2, length, sampleRate);

    const leftImpulse = impulse.getChannelData(0);
    const rightImpulse = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      leftImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      rightImpulse[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return impulse;
  }

  async function startReverb() {
    if (!audioContext.current) {
      return;
    }

    await loadAudio();

    // 리버브 -------------------------------------------------
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffer;

    const inputNode = audioContext.current.createGain();
    const outputNode = audioContext.current.createGain();

    const wetGainNode = audioContext.current.createGain(); // 리버브 이펙터를 거쳐야 함
    const dryGainNode = audioContext.current.createGain(); // 리버브 이펙터를 거치지 않음

    const reverbNode = audioContext.current.createConvolver();

    source.connect(inputNode);

    inputNode.connect(dryGainNode);
    dryGainNode.connect(outputNode);
    dryGainNode.gain.value = 1 - mix;

    reverbNode.buffer = generateIR() ?? null;

    inputNode.connect(reverbNode);
    reverbNode.connect(wetGainNode);
    wetGainNode.connect(outputNode);
    wetGainNode.gain.value = mix;

    outputNode.connect(audioContext.current.destination);

    source.start();

    // 기존 ------------------------------------------------

    // const source = audioContext.current?.createBufferSource();
    // source.buffer = audioBuffer;
    // source.connect(audioContext.current?.destination);
    // source.start();
  }

  return (
    <div>
      <div className="text-white-100">리버브 공간</div>
      <div className="text-white-100" onClick={startReverb}>
        누르면 실행됨
      </div>
    </div>
  );
};

export default Reverb;
