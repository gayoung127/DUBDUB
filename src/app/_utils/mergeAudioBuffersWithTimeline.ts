import { AudioBlockProps } from "../lobby/[id]/studio/_components/AudioBlock";

export function mergeAudioBuffersWithTimeline(
  audioContext: AudioContext,
  blocks: AudioBlockProps[],
): AudioBuffer {
  if (blocks.length === 0) return null;

  // 전체 오디오 길이 (트랙에서 가장 늦게 끝나는 블록 기준)
  const totalDuration = Math.max(
    ...blocks.map((block) => block.file.startPoint + block.file.duration),
  );

  const firstBuffer = blocks
    .find((block) => block.audioBuffers?.get(block.file.url))
    ?.audioBuffers?.get(blocks[0].file.url);

  if (!firstBuffer) {
    console.error("❌ 병합할 AudioBuffer가 없음!");
    return null;
  }

  const numChannels = firstBuffer.numberOfChannels;
  const sampleRate = firstBuffer.sampleRate;
  const mergedBuffer = audioContext.createBuffer(
    numChannels,
    totalDuration * sampleRate,
    sampleRate,
  );
  const mergedData = [...Array(numChannels)].map(
    () => new Float32Array(totalDuration * sampleRate),
  );

  blocks.forEach((block) => {
    const { file, audioBuffers } = block;
    const audioBuffer = audioBuffers?.get(file.url); // ✅ audioBuffers에서 가져오기

    if (!audioBuffer) {
      console.warn(`⚠️ ${file.url}에 대한 AudioBuffer 없음, 건너뜀`);
      return;
    }

    const startSample = Math.floor(file.startPoint * sampleRate); // ✅ 타임라인 반영
    const trimStartSample = Math.floor(file.trimStart * sampleRate); // ✅ 잘린 부분 반영
    const trimEndSample = Math.floor(
      (file.duration - file.trimEnd) * sampleRate,
    );

    for (let channel = 0; channel < numChannels; channel++) {
      const blockData = audioBuffer
        .getChannelData(channel)
        .slice(trimStartSample, trimEndSample);
      const speedFactor = file.speed;
      const volumeFactor = file.isMuted ? 0 : file.volume;

      for (let i = 0; i < blockData.length; i++) {
        const targetIndex = startSample + Math.floor(i / speedFactor);
        if (targetIndex < mergedData[channel].length) {
          mergedData[channel][targetIndex] += blockData[i] * volumeFactor;
        }
      }
    }
  });

  for (let channel = 0; channel < numChannels; channel++) {
    mergedBuffer.copyToChannel(mergedData[channel], channel);
  }

  return mergedBuffer;
}
