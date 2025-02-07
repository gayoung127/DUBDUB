import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { saveAs } from "file-saver";

/**
 * AudioBuffer를 WAV로 변환하는 함수
 */
async function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const samples: Float32Array[] = [];
  for (let channel = 0; channel < numChannels; channel++) {
    samples.push(audioBuffer.getChannelData(channel));
  }

  const interleaved = interleave(samples);
  const buffer = new ArrayBuffer(44 + interleaved.length * 2);
  const view = new DataView(buffer);

  // WAV Header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + interleaved.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, interleaved.length * 2, true);

  // PCM 데이터 작성
  let offset = 44;
  for (let i = 0; i < interleaved.length; i++, offset += 2) {
    view.setInt16(offset, interleaved[i] * 0x7fff, true);
  }

  return new Blob([view], { type: "audio/wav" });
}

/**
 * FFmpeg을 사용해 WAV를 MP3로 변환하는 함수
 */
export async function audioBufferToMp3(audioBuffer: AudioBuffer) {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  // AudioBuffer를 WAV로 변환
  const wavBlob = await audioBufferToWav(audioBuffer);
  const wavFile = new File([wavBlob], "input.wav");

  // FFmpeg에 파일 로드
  await ffmpeg.writeFile("input.wav", await fetchFile(wavFile));

  // WAV → MP3 변환 실행
  await ffmpeg.exec(["-i", "input.wav", "-b:a", "192k", "output.mp3"]);

  // 변환된 MP3 파일 가져오기
  const mp3Data = await ffmpeg.readFile("output.mp3");
  // @ts-expect-error FFmpeg의 반환 타입이 명확하지 않음

  const mp3Blob = new Blob([mp3Data.buffer], { type: "audio/mpeg" });

  // MP3 다운로드
  saveAs(mp3Blob, "output.mp3");
}

/**
 * 채널 데이터 interleaving (모노/스테레오 지원)
 */
function interleave(samples: Float32Array[]): Float32Array {
  const length = samples[0].length;
  const result = new Float32Array(length * samples.length);
  let index = 0;

  for (let i = 0; i < length; i++) {
    for (let j = 0; j < samples.length; j++) {
      result[index++] = samples[j][i];
    }
  }
  return result;
}

/**
 * 문자열을 WAV 헤더에 기록
 */
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
