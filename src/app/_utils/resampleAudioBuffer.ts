export async function resampleAudioBuffer(
  audioBuffer: AudioBuffer,
  targetSampleRate = 44100,
): Promise<AudioBuffer> {
  if (audioBuffer.sampleRate === targetSampleRate) {
    return audioBuffer; // 이미 44100Hz면 변환 불필요
  }

  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    (audioBuffer.duration * targetSampleRate) | 0,
    targetSampleRate,
  );

  const bufferSource = offlineContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineContext.destination);
  bufferSource.start();

  return offlineContext.startRendering();
}
