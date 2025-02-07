export async function resampleAudioBuffer(
  audioBuffer: AudioBuffer,
  targetSampleRate = 48000,
): Promise<AudioBuffer> {
  if (audioBuffer.sampleRate === targetSampleRate) {
    return audioBuffer;
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
