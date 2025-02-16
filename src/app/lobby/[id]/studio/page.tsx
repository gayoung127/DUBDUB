"use client";

import { useEffect, useRef, useState } from "react";
import { useStompStore } from "@/app/_store/StompStore"; // ✅ Zustand 전역 상태 사용
import useStompClient from "@/app/_hooks/useStompClient";
import Header from "@/app/_components/Header";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import VideoPlayer from "./_components/VideoPlayer";
import WebRTCManager from "./_components/WebRTCManager";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useUserStore } from "@/app/_store/UserStore";
import { getMyInfo } from "@/app/_apis/user";
import { useParams } from "next/navigation";
import { createConnectionDirect, createSession } from "@/app/_apis/openvidu";
import { useTrackSocket } from "@/app/_hooks/useTrackSocket";
import { useSessionIdStore } from "@/app/_store/SessionIdStore";
import { useStudioMembers } from "@/app/_hooks/useStudioMembers";
import { useAssetsSocket } from "@/app/_hooks/useAssetSocket";
import { AudioFile, Track } from "@/app/_types/studio";

export default function StudioPage() {
  const { id } = useParams();
  const studioId = Number(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [studioTitle, setStudioTitle] = useState<string>("제목 없음");
  const [videoUrl, setVideoUrl] = useState<string>("/examples/zzangu.mp4");
  const [userAudioStreams, setUserAudioStreams] = useState<
    Record<number, MediaStream>
  >({});

  const [duration, setDuration] = useState<number>(160);
  const [sessionToken, setSessionToken] = useState<string>("");
  const [parsedScripts, setParsedScripts] = useState<
    { role: string; text: string }[]
  >([]);

  const { sessionId, setSessionId } = useSessionIdStore();
  const { memberId, self } = useUserStore();
  const { studioMembers } = useStudioMembers();
  const { tracks, setTracks } = useTrackSocket({ sessionId });
  const { assets, setAssets, sendAsset } = useAssetsSocket({ sessionId });

  useStompClient(sessionId);
  const { stompClientRef, isConnected } = useStompStore(); // ✅ Zustand에서 STOMP 상태 가져오기

  // studioId 확인
  if (!studioId) {
    throw new Error("studioId 없음");
  }

  // useEffect(() => {
  //   const audioFileDummyData: AudioFile[] = [
  //     {
  //       id: "audio1",
  //       url: "https://example.com/audio1.mp3",
  //       startPoint: 0,
  //       duration: 120, // 2분
  //       trimStart: 0,
  //       trimEnd: 0,
  //       volume: 1,
  //       isMuted: false,
  //       speed: 1,
  //     },
  //     {
  //       id: "audio2",
  //       url: "https://example.com/audio2.mp3",
  //       startPoint: 30,
  //       duration: 90, // 1분 30초
  //       trimStart: 5,
  //       trimEnd: 10,
  //       volume: 0.8,
  //       isMuted: false,
  //       speed: 1.5,
  //     },
  //     {
  //       id: "audio3",
  //       url: "https://example.com/audio3.mp3",
  //       startPoint: 60,
  //       duration: 150, // 2분 30초
  //       trimStart: 10,
  //       trimEnd: 5,
  //       volume: 0.5,
  //       isMuted: true,
  //       speed: 1,
  //     },
  //   ];

  //   // Track 더미 데이터
  //   const trackDummyData: Track[] = [
  //     {
  //       trackId: 1,
  //       waveColor: "#FF5733", // 빨간색
  //       blockColor: "#C70039", // 진한 빨간색
  //       files: [audioFileDummyData[0], audioFileDummyData[1]],

  //       recorderId: 101,
  //       recorderName: "John Doe",
  //       recorderRole: "Singer",
  //       recorderProfileUrl: "https://example.com/profile/john.jpg",

  //       isMuted: false,
  //       isSolo: true,
  //     },
  //     {
  //       trackId: 2,
  //       waveColor: "#33FF57", // 초록색
  //       blockColor: "#39C700", // 진한 초록색
  //       files: [audioFileDummyData[2]],

  //       recorderId: 102,
  //       recorderName: "Jane Doe",
  //       recorderRole: "Guitarist",
  //       recorderProfileUrl: "https://example.com/profile/jane.jpg",

  //       isMuted: true,
  //       isSolo: false,
  //     },
  //     {
  //       trackId: 3,
  //       waveColor: "#3357FF", // 파란색
  //       blockColor: "#0039C7", // 진한 파란색
  //       files: [], // 파일 없음 (빈 트랙)

  //       recorderId: 103,
  //       recorderName: "Chris Smith",
  //       recorderRole: "Drummer",
  //       recorderProfileUrl: "https://example.com/profile/chris.jpg",

  //       isMuted: false,
  //       isSolo: false,
  //     },
  //   ];

  //   setTracks(trackDummyData);
  //   setAssets(audioFileDummyData);
  // }, []);

  // handlePointerMove(): 커서 움직이는 함수
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isConnected) return;

    const memberId = self?.memberId || "anonymous";
    const x = e.clientX;
    const y = e.clientY;
    const name = self?.nickName || "익명의 더비";

    if (sessionId !== "") {
      stompClientRef?.publish({
        destination: `/app/studio/${sessionId}/cursor`,
        body: JSON.stringify({ memberId, x, y, name }),
      });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(userAudioStreams).forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [userAudioStreams]);

  // useEffect(): 유저 정보 가져오기 (HTTP API Request)
  useEffect(() => {
    getMyInfo();
  }, []);

  // parseScript(): 스크립트 파싱 함수
  const parseScript = (script: string): { role: string; text: string }[] => {
    return script
      .split("\n")
      .map((line) => {
        const [role, ...textParts] = line.split(":");
        return {
          role: role?.trim() || "",
          text: textParts.join(":").trim() || "",
        };
      })
      .filter((item) => item.role && item.text);
  };

  // useEffect(): 스튜디오 정보 가져오기
  useEffect(() => {
    const getStudioInfo = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!BASE_URL) return;

        const response = await fetch(`${BASE_URL}/project/${studioId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!data) return;

        console.log("📥 받은 스튜디오 데이터:", data);

        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
        }

        if (data.title) {
          setStudioTitle(data.title);
        }

        if (data.script) {
          setParsedScripts(parseScript(data.script));
        }

        if (data.session && data.token) {
          setSessionId(data.session.trim());
          setSessionToken(data.token.trim());
        }

        if (data.workSpaceData) {
          console.log(
            "워크스페이스 트랙 및 에셋 정보 : ",
            data.workSpaceData.tracks,
            ", ",
            data.workSpaceData.assets,
          );
          setTracks(data.workSpaceData.tracks);
          setAssets(data.workSpaceData.assets);
        }
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };

    getStudioInfo();
  }, [studioId]);

  // handleUserAudioUpdate(): 사용자 오디오 스트림 업데이트
  const handleUserAudioUpdate = (userId: number, stream: MediaStream) => {
    console.log(
      `🎤 [handleUserAudioUpdate] userId: ${userId}, stream:`,
      stream,
    );

    setUserAudioStreams((prev) => {
      if (prev[userId]) {
        prev[userId].getTracks().forEach((track) => track.stop());
      }
      return { ...prev, [userId]: stream };
    });
  };

  useEffect(() => {
    console.log("🎵 [StudioPage] 현재 상태:", userAudioStreams);
  }, [userAudioStreams]); // ✅ 상태 변경 시 로그 출력

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        onPointerMove={handlePointerMove}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        className="overflow-hidden"
      >
        <div className="relative flex h-full min-h-screen w-full flex-col items-start justify-start">
          <div className="flex h-full w-full flex-row">
            <div className="flex h-full w-full flex-1 flex-col items-start justify-start">
              <Header studioTitle={studioTitle} />
              <div className="flex h-full w-full flex-1 flex-row items-center justify-start">
                <StudioSideTab
                  userAudioStreams={userAudioStreams}
                  tracks={tracks}
                  setTracks={setTracks}
                  studioMembers={studioMembers}
                  assets={assets}
                  setAssets={setAssets}
                  sendAsset={sendAsset}
                />
                <VideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  duration={duration}
                  setDuration={setDuration}
                  tracks={tracks}
                  setTracks={setTracks}
                  assets={assets}
                />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <StudioScript scripts={parsedScripts} />
            </div>
          </div>
          <RecordSection
            duration={duration}
            setDuration={setDuration}
            tracks={tracks}
            setTracks={setTracks}
            assets={assets}
            setAssets={setAssets}
            sendAsset={sendAsset}
          />
        </div>
        {isConnected && (
          <CursorPresence
            sessionId={sessionId}
            isConnected={isConnected}
            stompClientRef={stompClientRef}
          />
        )}
        <WebRTCManager
          studioId={studioId}
          sessionId={sessionId}
          sessionToken={sessionToken}
          onUserAudioUpdate={handleUserAudioUpdate}
          userId={self?.memberId ?? -1}
        />
      </div>
    </DndProvider>
  );
}
