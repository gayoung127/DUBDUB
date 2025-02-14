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

  useStompClient(sessionId);
  const { stompClientRef, isConnected } = useStompStore(); // ✅ Zustand에서 STOMP 상태 가져오기

  // studioId 확인
  if (!studioId) {
    throw new Error("studioId 없음");
  }

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
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };

    getStudioInfo();
  }, [studioId]);

  // handleUserAudioUpdate(): 사용자 오디오 스트림 업데이트
  const handleUserAudioUpdate = (userId: number, stream: MediaStream) => {
    setUserAudioStreams((prev) => {
      if (prev[userId]) {
        prev[userId].getTracks().forEach((track) => track.stop());
      }
      return prev[userId] === stream ? prev : { ...prev, [userId]: stream };
    });
  };

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
                />
                <VideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  duration={duration}
                  setDuration={setDuration}
                  tracks={tracks}
                  setTracks={setTracks}
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
          userId={memberId!}
          videoRef={videoRef}
        />
      </div>
    </DndProvider>
  );
}
