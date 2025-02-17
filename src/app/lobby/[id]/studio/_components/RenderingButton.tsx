import React, { useEffect, useRef, useState } from "react";
import Button from "@/app/_components/Button";
import StopBrandButton from "@/public/images/icons/icon-stop-brand.svg";

import { useRendering } from "@/app/_hooks/useRendering";
import { toast } from "sonner";
import { mergeAudioBuffersWithTimeline } from "@/app/_utils/mergeAudioBuffersWithTimeline";
import { audioBufferToMp3 } from "@/app/_utils/audioBufferToMp3";
import { Track } from "@/app/_types/studio";
import { AudioBlockProps } from "./AudioBlock";

interface RenderingProps {
  videoUrl: string | undefined;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}
const RenderingButton = ({ videoUrl, tracks, setTracks }: RenderingProps) => {
  const [isRendering, setIsRendering] = useState(false);
  const { mergeVideoAudio, isProcessing, outputUrl } = useRendering();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  const loadAudioFiles = async () => {
    if (!audioContextRef.current) return;
    const context = audioContextRef.current;

    for (const track of tracks) {
      for (const file of track.files) {
        if (!audioBuffersRef.current.has(file.url) && file.url) {
          const response = await fetch(file.url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);
          audioBuffersRef.current.set(file.url, audioBuffer);
        }
      }
    }
  };

  const handleDownloadMp3 = async () => {
    if (!audioContextRef.current) return;

    // ✅ Track[] → AudioBlockProps[] 변환
    const audioBlocks: AudioBlockProps[] = tracks.flatMap((track) =>
      track.files.map((file) => ({
        file,
        isMuted: true,
        trackId: track.trackId,
        fileIdx: 0,
        audioBuffers: audioBuffersRef.current,
        audioContext: audioContextRef.current,
        setTracks,
        timelineRef: { current: null },
        width: "10000px",
        waveColor: "#000",
        blockColor: "#FFF",
      })),
    );

    if (audioBlocks.length === 0) {
      console.error("❌ 병합할 오디오 블록이 없습니다.");
      return;
    }

    // ✅ 오디오 병합
    const mergedAudioBuffer = mergeAudioBuffersWithTimeline(
      audioContextRef.current,
      audioBlocks,
    );

    if (!mergedAudioBuffer) {
      console.error("❌ 오디오 병합 실패");
      return;
    }

    console.log("✅ 병합된 오디오 버퍼 생성됨:", mergedAudioBuffer);

    // ✅ MP3 변환 후 다운로드
    return audioBufferToMp3(mergedAudioBuffer);
  };

  // 렌더링
  async function handleStartRendering(videoUrl: string | undefined) {
    if (!videoUrl) {
      toast.error("저장된 영상이 존재하지 않습니다.");
      return;
    }
    setIsRendering(true);

    await loadAudioFiles();
    const audioBlob = await handleDownloadMp3();
    if (!audioBlob) {
      return;
    }
    const audioFile = new File([audioBlob], "sampleAudio.mp3", {
      type: "audio/mp3",
    });

    // 비디오 파일
    const video = await fetch(videoUrl);
    const blob2 = await video.blob();
    const videoFile = new File([blob2], "video.mp4", {
      type: "video/mp4",
    });

    if (!videoFile || !audioFile) {
      console.error("비디오나 오디오가 존재하지 않음");
    }
    mergeVideoAudio(videoFile, audioFile);
  }

  function handleFinishRendering() {
    setIsRendering(false);
  }

  useEffect(() => {
    if (!isProcessing && outputUrl) {
      setIsRendering(false);
      const link = document.createElement("a");
      link.href = outputUrl;
      link.download = "output.webm";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [isProcessing, outputUrl]);

  return (
    <>
      {!isRendering ? (
        <Button
          className="flex items-center justify-center px-2 py-1.5"
          onClick={() => {
            handleStartRendering(videoUrl);
          }}
        >
          영상 저장하기
        </Button>
      ) : (
        <Button
          outline
          onClick={handleFinishRendering}
          className="flex items-center justify-center gap-2 px-2 py-1.5"
        >
          <div className="flex items-center">
            <StopBrandButton />
          </div>
          저장 중 ...
        </Button>
      )}
    </>
  );
};

export default RenderingButton;
