import { useTimeStore } from "@/app/_store/TimeStore";
import React, { useEffect, useRef } from "react";

interface VideoBlockProps {
  videoUrl: string | undefined;
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
  isMuted: boolean;
  isProcessedAudio: boolean;
}

const VideoBlock = ({
  videoUrl,
  videoRef,
  isMuted,
  isProcessedAudio,
}: VideoBlockProps) => {
  const { isPlaying, time } = useTimeStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const processedBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  useEffect(() => {
    if (isMuted) {
      console.log("[Video Block] 비디오 음소거 O");
    } else {
      console.log("[Video Block] 비디오 음소거 X");
    }

    if (isProcessedAudio) {
      console.log("[Video Block] 보컬 제거 O");
    } else {
      console.log("[Video Block] 보컬 제거 X");
    }
  }, [isMuted, isProcessedAudio]);
  useEffect(() => {
    if (!videoUrl) return;
    const initAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      try {
        const response = await fetch(videoUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
          await audioContextRef.current.decodeAudioData(arrayBuffer);

        // ✅ 보컬 제거된 오디오를 초기 설정
        removeVocals(audioBuffer);
      } catch (error) {
        console.error("❌ 오디오 로드 실패:", error);
      }
    };

    initAudio();
  }, [videoUrl]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isProcessedAudio) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = isMuted;
    }
  }, [isProcessedAudio, isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;

    // 부모에서 전달받은 상태에 따라 재생/정지
    if (isPlaying) {
      videoRef.current
        .play()
        .catch((error) => console.error("비디오 재생 실패: ", error));
      if (isProcessedAudio) {
        handlePlayAudio();
      }
    } else {
      videoRef.current.pause();
      if (isProcessedAudio) {
        handleStopAudio();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;

    // 타임라인 이동 동기화
    if (Math.abs(videoRef.current.currentTime - time) > 0.5) {
      videoRef.current.currentTime = time;
    }
  }, [time]);

  // ✅ 보컬 제거 함수 (렌더링 시 자동 실행)
  const removeVocals = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) {
      console.error("❌ AudioContext가 없습니다.");
      return;
    }

    const numOfChannels = buffer.numberOfChannels;
    if (numOfChannels < 2) {
      console.error("❌ 스테레오 오디오가 아닙니다. 보컬 제거 불가능.");
      return;
    }

    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    const length = leftChannel.length;

    const newBuffer = audioContextRef.current.createBuffer(
      2,
      length,
      buffer.sampleRate,
    );
    const newLeftChannel = newBuffer.getChannelData(0);
    const newRightChannel = newBuffer.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const center = (leftChannel[i] - rightChannel[i]) / 2; // 보컬 제거
      newLeftChannel[i] = center;
      newRightChannel[i] = center;
    }

    console.log("✅ 보컬 제거된 오디오 버퍼 생성 완료");
    processedBufferRef.current = newBuffer;
  };

  const handlePlayAudio = () => {
    if (!audioContextRef.current) {
      console.error("❌ AudioContext가 없습니다.");
      return;
    }

    const bufferToPlay = processedBufferRef.current;

    if (!bufferToPlay) {
      console.error("❌ 재생할 오디오 버퍼가 없습니다.");
      return;
    }

    // 기존 오디오 재생 중지
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = bufferToPlay;

    // ✅ GainNode 추가 (음소거/볼륨 조절)
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
    }

    source.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // ✅ 음소거 상태 반영
    gainNodeRef.current.gain.value = isMuted ? 0 : 1;

    const startTime = videoRef.current?.currentTime;
    source.start(0, startTime);
    source.playbackRate.value = videoRef.current?.playbackRate || 1;

    audioSourceRef.current = source;
    console.log(
      `🎵 ${isProcessedAudio ? "보컬 제거된" : "원본"} 오디오 ${startTime}초부터 재생`,
    );
  };

  const handleStopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop(); // ✅ 기존 오디오 정지
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }

    console.log("🔇 보컬 제거된 오디오 정지");
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} src={videoUrl} className="max-h-[407px]" />
    </div>
  );
};

export default VideoBlock;
