import { toast } from "sonner";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

import { useMicStore } from "@/app/_store/MicStore";
import { useUserStore } from "@/app/_store/UserStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { useRecordingStore } from "@/app/_store/RecordingStore";

import { postAsset } from "@/app/_apis/studio";
import { Asset, PX_PER_SECOND, Track } from "@/app/_types/studio";
import { formatTime } from "@/app/_utils/formatTime";

import H4 from "@/app/_components/H4";
import ShareButton from "./ShareButton";
import StoreButton from "./StoreButton";
import RenderingButton from "./RenderingButton";

import RecordButton from "@/public/images/icons/icon-record.svg";
import PlayButton from "@/public/images/icons/icon-play.svg";
import StopButton from "@/public/images/icons/icon-stop.svg";
import PauseButton from "@/public/images/icons/icon-pause.svg";
import { Client } from "@stomp/stompjs";
import { useSessionIdStore } from "@/app/_store/SessionIdStore";

interface PlayBarProps {
  videoRef: React.RefObject<VideoElementWithCapturestream | null>;
  videoUrl: string | undefined;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  assets: Asset[];
  stompClientRef: Client | null;
  isConnected: boolean;
}

interface PlaybackStatus {
  recording?: boolean;
  playState?: "PLAY" | "PAUSE" | "STOP";
  timelineMarker?: number;
}

const PlayBar = ({
  videoRef,
  videoUrl,
  duration,
  setDuration,
  tracks,
  setTracks,
  assets,
  stompClientRef,
  isConnected,
}: PlayBarProps) => {
  const { self } = useUserStore();
  const { micStatus } = useMicStore();
  const { sessionId } = useSessionIdStore();
  const { time, isPlaying, play, pause, reset, setTimeFromPx } = useTimeStore();
  const {
    isRecording,
    audioContext,
    startRecording,
    stopRecording,
    createAudioFile,
    setMediaRecorder,
    setAudioContext,
    setAnalyser,
    setIsRecording,
  } = useRecordingStore();

  // useEffect: 소켓 재생 및 녹음 상태 수신
  useEffect(() => {
    if (!isConnected || !stompClientRef || sessionId === "") {
      console.log(
        "재생 및 녹음 하려는데, 소켓이 연결 안 되었어요: ",
        isConnected,
        stompClientRef,
        sessionId,
      );
      return;
    }

    const subscription = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/playback`,
      (message) => {
        const playbackStatus: PlaybackStatus = JSON.parse(message.body);
        console.log(
          "📥 재생 상태 수신 (소켓에서 받은 메시지):",
          playbackStatus,
        );

        if (playbackStatus.recording !== undefined) {
          console.log("🎤 isRecording 업데이트됨:", playbackStatus.recording);
          setIsRecording(playbackStatus.recording);
        }

        switch (playbackStatus.playState) {
          case "PLAY":
            play();
            break;
          case "PAUSE":
            pause();
            break;
          case "STOP":
            reset();
            break;
        }

        if (playbackStatus.timelineMarker !== undefined) {
          setTimeFromPx(playbackStatus.timelineMarker * PX_PER_SECOND);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isConnected, sessionId]);

  // sendPlaybackStatus(): 소켓으로 재생 및 녹음 상태 전송
  const sendPlaybackStatus = (playbackStatus: PlaybackStatus) => {
    if (!isConnected) {
      console.log(
        "sendPlaybackStatus() 호출 하려하는데, 안 돼요: ",
        isConnected,
        stompClientRef,
        sessionId,
      );
      return;
    }

    stompClientRef?.publish({
      destination: `/app/studio/${sessionId}/playback`,
      body: JSON.stringify(playbackStatus),
    });
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const userId = self?.memberId ?? null;

  const params = useParams();
  const pid = params.id;

  const isManualRecording = useRef<boolean>(false);

  useEffect(() => {
    console.log("🔄 `useEffect` 감지 - isRecording 변경됨:", isRecording);

    if (!isManualRecording.current) {
      if (isRecording) {
        console.log("🔥 소켓에서 받은 recording으로 녹음 시작");
        startRecordingFromSocket();
      } else {
        console.log("🔥 소켓에서 받은 recording으로 녹음 정지");
        stopRecordingFromSocket();
      }
    }
  }, [isRecording]);

  // useEffect: 동영상 길이 초과시, 자동 정지 (녹음시, 녹음도 정지)
  useEffect(() => {
    if (time >= duration) {
      mediaRecorderRef.current?.stop();
      stopRecording();

      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
        setAnalyser(null);
      }

      setMediaRecorder(null);
      pause();
      reset();
    }
  }, [time, duration]);

  // 스페이스 바 기능 주석 처리
  // useEffect: SpaceBar -> 재생 / 일시 정지
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     const activeElement = document.activeElement;
  //     if (
  //       activeElement &&
  //       ["INPUT", "TEXTAREA"].includes(activeElement.tagName)
  //     ) {
  //       return;
  //     }
  //     if (event.code === "Space") {
  //       event.preventDefault();

  //       if (isPlaying) {
  //         sendPlaybackStatus({
  //           recording: isRecording,
  //           playState: "STOP",
  //           timelineMarker: 0,
  //         });
  //       } else {
  //         sendPlaybackStatus({
  //           recording: isRecording,
  //           playState: "PLAY",
  //           timelineMarker: 0,
  //         });
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [isPlaying, play, pause]);

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
    console.log("🎤 handleRecording 실행됨! 현재 isRecording:", isRecording);

    if (!userId) {
      toast.warning("오류: 사용자 정보가 없어, 녹음을 시작할 수 없습니다.");
      return;
    }

    sendPlaybackStatus({
      recording: !isRecording,
      playState: isRecording ? "STOP" : "PLAY",
      timelineMarker: isRecording ? 0 : time,
    });

    if (isRecording) {
      console.log("🛑 녹음 중지 처리 중...");
      mediaRecorderRef.current?.stop();
      stopRecording();

      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
        setAnalyser(null);
      }

      setMediaRecorder(null);
      isManualRecording.current = false; // 🔥 녹음 종료 후 플래그 초기화
      return;
    }

    console.log("🎬 녹음 시작!");
    isManualRecording.current = true; // 🔥 사용자가 직접 실행한 녹음

    const currentTime = time;
    const activeMics = Object.entries(micStatus)
      .filter(([_, isOn]) => isOn)
      .map(([userId]) => userId);

    if (activeMics.length === 0) {
      toast.warning("역할 탭에서 자신의 마이크를 켜주세요!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
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
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        console.log("🎵 생성된 오디오 파일 URL:", url);

        if (!track.recorderId) {
          toast.error("트랙에 할당된 참여자가 없습니다.");
          return;
        }
        const newUrl = await postAsset(String(pid), audioBlob);
        createAudioFile(track.trackId, newUrl, currentTime);
      };

      recorder.start();
      startRecording(track.trackId);
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
  };

  // startRecordingFromSocket(): 소켓 상태 받아서 자동 녹음 진행
  const startRecordingFromSocket = async () => {
    console.log("🎬 [소켓] 녹음 시작 - isRecording 상태:", isRecording);

    if (!userId) {
      toast.warning("오류: 사용자 정보가 없어 녹음을 시작할 수 없습니다.");
      return;
    }

    const currentTime = time;
    const activeMics = Object.entries(micStatus)
      .filter(([_, isOn]) => isOn)
      .map(([userId]) => userId);

    if (activeMics.length === 0) {
      toast.warning("역할 탭에서 자신의 마이크를 켜주세요!");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
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
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        console.log("🎵 생성된 오디오 파일 URL:", url);

        if (!track.recorderId) {
          toast.error("트랙에 할당된 참여자가 없습니다.");
          return;
        }

        const newUrl = await postAsset(String(pid), audioBlob);
        createAudioFile(track.trackId, newUrl, currentTime);
      };

      recorder.start();
      startRecording(track.trackId);
      setMediaRecorder(recorder);

      // 기존 try 블록의 AudioContext 관련 로직도 포함
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
  };

  // stopRecordingFromSocket(): 소켓 상태 받아 자동 녹음 정지
  const stopRecordingFromSocket = () => {
    console.log("🛑 [소켓] 녹음 중지 실행됨!");

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    stopRecording();

    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setAnalyser(null);
    }

    setMediaRecorder(null);
  };

  // handlePlayButton(): 재생/일시정지 버튼 클릭 함수
  const handlePlayButton = () => {
    if (isPlaying) {
      sendPlaybackStatus({
        recording: false,
        playState: "PAUSE",
        timelineMarker: time,
      });
    } else {
      sendPlaybackStatus({
        recording: false,
        playState: "PLAY",
        timelineMarker: time,
      });
    }
  };

  // handleStopButton(): 정지 버튼 클릭 함수
  const handleStopButton = () => {
    sendPlaybackStatus({
      recording: isRecording,
      playState: "STOP",
      timelineMarker: 0,
    });
  };

  return (
    <section className="flex h-full max-h-16 w-full flex-grow-0 flex-row items-center justify-between border border-gray-300 px-16 py-[22px]">
      <div className="flex h-full flex-row items-center justify-center gap-x-4">
        <div onClick={handleRecording} className="cursor-pointer">
          <RecordButton width={20} height={20} />
        </div>
        <div onClick={handlePlayButton} className="cursor-pointer">
          {isPlaying ? (
            <PauseButton width={20} height={20} />
          ) : (
            <PlayButton width={20} height={20} />
          )}
        </div>
        <div onClick={handleStopButton} className="cursor-pointer">
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
        <RenderingButton
          videoUrl={videoUrl}
          tracks={tracks}
          setTracks={setTracks}
        />
        <StoreButton tracks={tracks} assets={assets} />
      </div>
    </section>
  );
};

export default PlayBar;
