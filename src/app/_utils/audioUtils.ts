import { AudioFile } from "@/app/_types/studio";

// 오디오 블록 재생
export const playAudio = ({
  audioContext,
  audioBuffer,
  audioSourceRef,
  file,
}: {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  audioSourceRef: React.MutableRefObject<AudioBufferSourceNode | null>;
  file: AudioFile;
}) => {
  if (!audioContext || audioSourceRef.current) return;

  if (!audioBuffer || !(audioBuffer instanceof AudioBuffer)) {
    console.error("Invalid audioBuffer:", audioBuffer);
    return;
  }

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer; // 🔥 여기서 오류가 발생하면 audioBuffer가 잘못된 값

  const gainNode = audioContext.createGain();
  gainNode.gain.value = file.isMuted ? 0 : file.volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.playbackRate.value = file.speed;

  const offset = Math.max(0, file.trimStart);
  const duration = Math.max(0, file.duration - file.trimStart - file.trimEnd);

  source.start(audioContext.currentTime, offset, duration);

  audioSourceRef.current = source;

  source.onended = () => {
    audioSourceRef.current = null;
  };
};
