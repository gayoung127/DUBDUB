import { toast } from "sonner";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useMicStore } from "@/app/_store/MicStore";
import { useUserStore } from "@/app/_store/UserStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { useRecordingStore } from "@/app/_store/RecordingStore";

import { postAsset } from "@/app/_apis/studio";
import { Asset, Track } from "@/app/_types/studio";
import { formatTime } from "@/app/_utils/formatTime";

import H4 from "@/app/_components/H4";
import ShareButton from "./ShareButton";
import StoreButton from "./StoreButton";
import RenderingButton from "./RenderingButton";

import RecordButton from "@/public/images/icons/icon-record.svg";
import PlayButton from "@/public/images/icons/icon-play.svg";
import StopButton from "@/public/images/icons/icon-stop.svg";
import PauseButton from "@/public/images/icons/icon-pause.svg";

interface PlayBarProps {
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  assets: Asset[];
}

const PlayBar = ({
  videoRef,
  duration,
  setDuration,
  tracks,
  setTracks,
  assets,
}: PlayBarProps) => {
  const { self } = useUserStore();
  const { micStatus } = useMicStore();
  const { time, isPlaying, play, pause, reset } = useTimeStore();
  const {
    isRecording,
    audioContext,
    startRecording,
    stopRecording,
    createAudioFile,
    setMediaRecorder,
    setAudioContext,
    setAnalyser,
  } = useRecordingStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const userId = self?.memberId ?? null;

  const params = useParams();
  const pid = params.id;

  // useEffect: 동영상 길이 초과시, 자동 정지
  useEffect(() => {
    if (time >= duration) {
      pause();
      reset();
    }
  }, [time, duration]);

  // useEffect: SpaceBar -> 재생 / 일시 정지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        ["INPUT", "TEXTAREA"].includes(activeElement.tagName)
      ) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();

        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, play, pause]);

  // useEffect: 동영상 길이에 맞게 전체 duration 설정
  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return; // videoRef가 아직 설정되지 않았다면 아무것도 하지 않음

    const handleMetadataLoaded = () => {
      setDuration(videoElement.duration || 0);
      console.log(
        "📌 비디오 메타데이터 로드됨, duration:",
        videoElement.duration,
      );
    };

    // 🎯 비디오의 `loadedmetadata` 이벤트를 감지하여 `duration`을 설정
    videoElement.addEventListener("loadedmetadata", handleMetadataLoaded);

    // 🎯 cleanup 함수에서 이벤트 제거
    return () => {
      videoElement.removeEventListener("loadedmetadata", handleMetadataLoaded);
    };
  }, [videoRef]);

  // handleRecording(): 녹음하는 함수
  const handleRecording = async () => {
    if (!userId) {
      toast.warning("오류: 사용자 정보가 없어, 녹음을 시작할 수 없습니다.");
      return;
    }

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      stopRecording();
      pause();

      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
        setAnalyser(null);
      }
      setMediaRecorder(null);
    } else {
      const currentTime = time;
      const activeMics = Object.entries(micStatus)
        .filter(([_, isOn]) => isOn)
        .map(([userId]) => userId);

      if (activeMics.length === 0) {
        toast.warning("역할 탭에서 자신의 마이크를 켜주세요!");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        const chunks: Blob[] = [];
        recorder.ondataavailable = (event) => {
          console.log("데이터 저장됨:", event.data);
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        const track = tracks.find((t) => t.recorderId === userId);
        if (!track) {
          toast.warning("오디오 트랙에 참여자를 할당해주세요!");
          return;
        }

        recorder.onstop = async () => {
          toast.success("녹음된 파일을 저장 중입니다...");
          const audioBlob = new Blob(chunks, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          console.log("🎵 생성된 오디오 파일 URL:", url);

          if (!track.recorderId) {
            toast.error(
              "트랙에 할당된 참여자가 없습니다. 녹음 파일 추가에 실패했습니다.",
            );
            return;
          }

          const newUrl = await postAsset(String(pid), audioBlob);
          createAudioFile(track.trackId, newUrl, currentTime);
        };

        recorder.start();
        startRecording(track.trackId);
        play();
        setMediaRecorder(recorder);

        const AudioCtx = window.AudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        setAudioContext(audioCtx);
        setAnalyser(analyser);
      } catch (error) {
        toast.error(`오류가 발생했습니다. ${error}`);
      }
    }
  };

  return (
    <section className="flex h-full max-h-16 w-full flex-grow-0 flex-row items-center justify-between border border-gray-300 px-16 py-[22px]">
      <div className="flex h-full flex-row items-center justify-center gap-x-4">
        <div onClick={handleRecording} className="cursor-pointer">
          <RecordButton width={20} height={20} />
        </div>
        <div onClick={isPlaying ? pause : play} className="cursor-pointer">
          {isPlaying ? (
            <PauseButton width={20} height={20} />
          ) : (
            <PlayButton width={20} height={20} />
          )}
        </div>
        <div onClick={reset} className="cursor-pointer">
          <StopButton width={20} height={20} />
        </div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-x-3">
        <H4 className="text-white-100">{formatTime(time)}</H4>
        <H4 className="text-white-100">/</H4>
        <H4 className="text-white-100">{formatTime(duration)}</H4>
      </div>
      <div className="flex h-full items-center justify-center gap-x-4">
        <ShareButton />
        <RenderingButton />
        <StoreButton tracks={tracks} assets={assets} />
      </div>
    </section>
  );
};

export default PlayBar;
