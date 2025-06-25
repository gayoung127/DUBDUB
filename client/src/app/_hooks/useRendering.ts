"use client";

import { useState } from "react";

export const useRendering = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [mergedFile, setMergedFile] = useState<File | null>(null);

  const mergeVideoAudio = async (videoFile: File, audioFile: File) => {
    setIsProcessing(true);

    try {
      const start = Date.now();

      // 비디오 & 오디오 파일 로드
      //비디오, 오디오 파일의 바이너리 데이터를 가져와서
      // Blob 객체로 변환함
      const videoBlob = new Blob([await videoFile.arrayBuffer()], {
        type: videoFile.type,
      });
      const audioBlob = new Blob([await audioFile.arrayBuffer()], {
        type: audioFile.type,
      });

      // video, audio html 요소 생성
      const videoElement = document.createElement("video");
      const audioElement = document.createElement("audio");

      videoElement.src = URL.createObjectURL(videoBlob);
      audioElement.src = URL.createObjectURL(audioBlob);

      videoElement.muted = true; // 중복 오디오 방지
      // 🔇 🔹 오디오 트랙을 유지하면서도 브라우저에서 소리가 안 들리도록 설정
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioElement);
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // 🔇 볼륨을 0으로 설정하여 음소거 효과
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 🔹 비디오 & 오디오가 화면에 표시되지 않도록 숨김
      videoElement.style.display = "none";
      audioElement.style.display = "none";
      document.body.appendChild(videoElement);
      document.body.appendChild(audioElement);

      videoElement.crossOrigin = "anonymous";
      audioElement.crossOrigin = "anonymous";

      // onloaddata 이벤트가 발생할 때까지 기다려서 비디오, 오디오 로드 완료
      // 비디오 & 오디오 로드 대기
      await Promise.all([
        new Promise((resolve) => (videoElement.onloadeddata = resolve)),
        new Promise((resolve) => (audioElement.onloadeddata = resolve)),
      ]);

      console.log("비디오 & 오디오 로드 완료");

      // 비디오, 오디오 재생을 기반으로 스트림 캡쳐
      const videoStream = (videoElement as any).captureStream();
      const audioStream = (audioElement as any).captureStream();

      // 하나의 통합된 스트림으로 합침
      const mixedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const mediaRecorder = new MediaRecorder(mixedStream, {
        mimeType: "video/webm",
      });
      const recordedChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data); // 녹화된 데이터를 배열에 저장
        }
      };

      mediaRecorder.onstop = () => {
        console.log("WebM 저장 중...");
        const webmBlob = new Blob(recordedChunks, { type: "video/webm" });
        const file = new File([webmBlob], "output.webm", {
          type: webmBlob.type,
          lastModified: Date.now(),
        });
        setMergedFile(file);

        const webmUrl = URL.createObjectURL(webmBlob);
        setOutputUrl(webmUrl);
        console.log("WebM 변환 완료:", webmUrl);
        console.log(`-- 처리 시간: ${Date.now() - start}ms`);
        document.body.removeChild(videoElement);
        document.body.removeChild(audioElement);
      };

      console.log("비디오 & 오디오 병합 시작...");
      mediaRecorder.start();
      videoElement.play();
      audioElement.play();

      setTimeout(
        () => {
          mediaRecorder.stop();
          console.log("녹화 종료");
        },
        Math.max(videoElement.duration, audioElement.duration) * 1000,
      );
    } catch (error) {
      console.error(error);
    }

    setIsProcessing(false);
  };

  return { mergeVideoAudio, isProcessing, outputUrl, mergedFile };
};
