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

  return mp3Blob;
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

export function audioBufferToArrayBuffer(
  audioBuffer: AudioBuffer,
): ArrayBuffer {
  const numOfChannels = audioBuffer.numberOfChannels; // 채널 수 (예: 스테레오 = 2)
  const sampleRate = audioBuffer.sampleRate; // 샘플 레이트 (예: 44100)
  const format = 1; // PCM 형식 (Linear PCM)
  const bitDepth = 16; // 16비트 오디오

  // WAV 헤더를 포함한 총 길이 계산
  const totalLength = 44 + audioBuffer.length * numOfChannels * (bitDepth / 8);
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // Helper 함수들
  const writeString = (offset: number, str: string): void => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  const writeUint16 = (offset: number, data: number): void => {
    view.setUint16(offset, data, true); // Little-endian
  };
  const writeUint32 = (offset: number, data: number): void => {
    view.setUint32(offset, data, true); // Little-endian
  };

  // WAV 헤더 작성
  writeString(0, "RIFF"); // ChunkID
  writeUint32(4, totalLength - 8); // ChunkSize
  writeString(8, "WAVE"); // Format
  writeString(12, "fmt "); // Subchunk1ID
  writeUint32(16, 16); // Subchunk1Size (PCM = 16)
  writeUint16(20, format); // AudioFormat (PCM = 1)
  writeUint16(22, numOfChannels); // NumChannels
  writeUint32(24, sampleRate); // SampleRate
  writeUint32(28, sampleRate * numOfChannels * (bitDepth / 8)); // ByteRate
  writeUint16(32, numOfChannels * (bitDepth / 8)); // BlockAlign
  writeUint16(34, bitDepth); // BitsPerSample
  writeString(36, "data"); // Subchunk2ID
  writeUint32(40, audioBuffer.length * numOfChannels * (bitDepth / 8)); // Subchunk2Size

  // 오디오 데이터 작성
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const sample = audioBuffer.getChannelData(channel)[i];
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff; // 16비트 PCM으로 변환
      view.setInt16(offset, intSample, true); // Little-endian
      offset += 2;
    }
  }

  return arrayBuffer;
}
