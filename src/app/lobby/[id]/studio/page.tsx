"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  createConnection,
  createSession,
  createConnectionDirect,
  createSessionDirect,
} from "@/app/_apis/openvidu";
import { initialTracks, Track } from "@/app/_types/studio";
import { useTrackSocket } from "@/app/_hooks/useTrackSocket";
import { useSessionIdStore } from "@/app/_store/SessionIdStore";

export default function StudioPage() {
  const { id } = useParams();
  const studioId = Number(id);

  const videoRef = useRef<HTMLVideoElement>(null);
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

  const { stompClientRef, isConnected } = useStompClient();
  const { tracks, setTracks } = useTrackSocket({ sessionId });

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
      stompClientRef.current?.publish({
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
        const [role, ...textParts] = line.split(":"); // ':' 기준으로 나눔
        return {
          role: role?.trim() || "", // 역할 (예: 철수)
          text: textParts.join(":").trim() || "", // 대사 (예: 안녕하세요)
        };
      })
      .filter((item) => item.role && item.text); // 빈 값 제거
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
        if (!data) {
          console.log("data 없음");
          return;
        }

        console.log("📥 받은 스튜디오 데이터:", data);

        // 비디오 URL 설정
        if (data.videoUrl && typeof data.videoUrl === "string") {
          setVideoUrl(data.videoUrl); // 서버에서 받은 videoUrl로 상태 업데이트
        }

        // 스크립트 파싱 및 상태 업데이트
        if (data.script && typeof data.script === "string") {
          const parsedServerScript = parseScript(data.script);
          console.log("파싱된 스크립트:", parsedServerScript);
          setParsedScripts(parsedServerScript); // 파싱된 데이터를 상태로 저장
        }

        const sessionId =
          typeof data.session === "string" ? data.session.trim() : "";
        const sessionToken =
          typeof data.token === "string" ? data.token.trim() : "";

        if (!sessionId) {
          console.log("❌ 세션 아이디 없음");
          return;
        }

        if (!sessionToken) {
          console.log("❌ 세션 토큰 없음");
          return;
        }

        setSessionId(sessionId);
        setSessionToken(sessionToken);
      } catch (error) {
        console.error("❌ 스튜디오 정보 가져오기 실패:", error);
      }
    };

    getStudioInfo();
  }, [studioId]);

  // useEffect(): OpenVidu 테스트 (비동기)
  useEffect(() => {
    const testOv1 = async () => {
      const sessionId = await createSession();
      console.log("✅ 세션 생성 응답:", sessionId);
      if (!sessionId) {
        console.error("❌ 세션 ID를 가져오지 못했습니다.");
        return;
      }
      const token = await createConnectionDirect(sessionId);
      if (!token) {
        console.error("❌ 세션 토큰을 가져오지 못했습니다.");
        return;
      }
      setSessionId(sessionId);
      setSessionToken(token);
    };

    // testOv1(); // 필요할 때 활성화
    const testOv2 = async () => {
      const sessionId = await createSession();
      console.log("✅ 세션 생성 응답:", sessionId);
      if (!sessionId) {
        console.error("❌ 세션 ID를 가져오지 못했습니다.");
        return;
      }
      const token = await createConnectionDirect(sessionId);
      if (!token) {
        console.error("❌ 세션 토큰을 가져오지 못했습니다.");
        return;
      }
      setSessionId(sessionId);
      setSessionToken(token);
    };

    // testOv2(); // 필요할 때 활성화
  }, []);

  // handleUserAudioUpdate(): 사용자 오디오 스트림 업데이트
  const handleUserAudioUpdate = (userId: number, stream: MediaStream) => {
    setUserAudioStreams((prev) => {
      if (prev[userId]) {
        prev[userId].getTracks().forEach((track) => track.stop());
      }
      if (prev[userId] === stream) {
        return prev;
      }
      return { ...prev, [userId]: stream };
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
              <Header />
              <div className="flex h-full w-full flex-1 flex-row items-center justify-start">
                <StudioSideTab
                  userAudioStreams={userAudioStreams}
                  tracks={tracks}
                  setTracks={setTracks}
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
            isConnected={isConnected}
            stompClientRef={stompClientRef}
            sessionId={sessionId}
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
