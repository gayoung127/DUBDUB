/* eslint-disable @typescript-eslint/no-unused-expressions */

/*
역할
1. OpenVidu 세션을 생성하고 관리
2. 서버에서 세션 ID와 토큰을 가져와 OpenVidu와 연결
3. 오디오 스트림을 OpenVidu에 추가하고 다른 사용자와 공유
*/
import { useMicStore } from "@/app/_store/MicStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import {
  OpenVidu,
  Publisher,
  Session,
  Subscriber,
  Stream,
  SignalEvent,
} from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
/*
isPlaying → 비디오 재생 상태
time → 현재 재생 위치
 */
interface WebRTCManagerProps {
  studioId: number;
  sessionId: string;
  sessionToken: string;
  userId: number;
  onUserAudioUpdate: (userId: number, stream: MediaStream) => void;
}

interface SyncData {
  type?: "play" | "pause" | "seek";
  isPlaying?: boolean;
  time?: number;
}

const WebRTCManager = ({
  studioId,
  sessionId,
  sessionToken,
  userId,
  onUserAudioUpdate,
}: WebRTCManagerProps) => {
  const openViduRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { isPlaying, play, pause, time, setTimeFromPx } = useTimeStore();
  const { micStatus, setMicStatus } = useMicStore();

  // 마이크 접근 권한 확인
  const checkAudioPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("🚨 마이크 접근 거부됨:", error);
      toast.warning("마이크 권한이 필요합니다.");
      return false;
    }
  };

  // OpenVidu 세션 초기화
  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionToken) return;
        openViduRef.current = new OpenVidu();

        const newSession = openViduRef.current.initSession();
        sessionRef.current = newSession;
        setSession(newSession);

        newSession.on("streamCreated", handleStreamCreated);
        newSession.on("streamDestroyed", handleStreamDestroyed);
        newSession.on("signal:syncRequest", handleSyncRequest);
        newSession.on("signal:syncResponse", handleSyncResponse);
        newSession.on("signal:mic-status", handleMicStatusSignal);

        await newSession.connect(sessionToken);
        console.log("✅ OpenVidu 세션에 연결됨");

        const hasPermissions = await checkAudioPermissions();
        if (!hasPermissions) {
          toast.warning("마이크 권한이 필요합니다.");
          return;
        }

        if (newSession.connection) {
          await publishAudioStream(newSession);
          await newSession.signal({ type: "syncRequest" });

          newSession.remoteConnections.forEach((connection) => {
            if (connection.stream) {
              handleStreamCreated({ stream: connection.stream });
            }
          });
        } else {
          console.warn(
            "🚨 세션 연결이 완료되지 않아 syncRequest 신호를 보낼 수 없습니다.",
          );
        }
      } catch (error) {
        console.error("OpenVidu 세션 초기화 실패: ", error);
      }
    };

    initSession();

    return () => {
      console.log("🔌 세션 종료");

      if (session) {
        session.off("streamCreated", handleStreamCreated);
        session.off("streamDestroyed", handleStreamDestroyed);
        session.off("signal:syncRequest", handleSyncRequest);
        session.off("signal:syncResponse", handleSyncResponse);
        session.off("signal:mic-status", handleMicStatusSignal);
        session.disconnect();
      }

      setTimeout(() => {
        setSubscribers([]);
      }, 100);
      setPublisher(null);
      openViduRef.current = null;
      sessionRef.current = null;
    };
  }, [sessionToken]);

  // 오디오 스트림 퍼블리싱
  const publishAudioStream = async (session: Session) => {
    try {
      if (!openViduRef.current || !session.connection) {
        console.error("🚨 OpenVidu 인스턴스 또는 세션 연결이 없음");
        return;
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("🎤 마이크 스트림 가져오기 성공:", audioStream);

      if (!audioStream || !audioStream.getAudioTracks().length) {
        console.error("🚨 오디오 트랙을 찾을 수 없습니다.");
        return;
      }

      const audioTrack = audioStream.getAudioTracks()[0];
      console.log("🎵 오디오 트랙 정보:", audioTrack);

      const newAudioPublisher = session.openvidu.initPublisher(undefined, {
        videoSource: false,
        audioSource: audioTrack,
        publishAudio: false,
      });

      if (!newAudioPublisher) {
        console.error("🚨 오디오 퍼블리셔 생성 실패");
        return;
      }

      console.log("📡 오디오 퍼블리셔 생성 성공, 세션에 발행 중...");
      await session.publish(newAudioPublisher);
      console.log("✅ 오디오 퍼블리싱 완료");

      setPublisher(newAudioPublisher);
      onUserAudioUpdate(userId, newAudioPublisher.stream.getMediaStream());
      console.log("오디오 스트림 설정 성공: ");
    } catch (error) {
      console.error("오디오 스트림 설정 실패: ", error);
    }
  };

  // 새로운 스트림 생성 시
  const handleStreamCreated = (event: { stream: Stream }) => {
    const currentSession = sessionRef.current;
    if (!currentSession) {
      console.error("🚨 handleStreamCreated: 세션이 존재하지 않음");
      return;
    }

    try {
      console.log("📌 새로운 스트림이 생성됨:", event.stream);
      const subscriber = currentSession.subscribe(event.stream, undefined);
      if (!subscriber) {
        console.warn("⚠️ 구독자 생성 실패");
        return;
      }

      const mediaStream = subscriber.stream.getMediaStream();
      console.log("🎵 구독한 미디어 스트림:", mediaStream);

      if (!mediaStream || mediaStream.getAudioTracks().length === 0) {
        console.warn("⚠️ 유효한 오디오 트랙이 없음");
        return;
      }

      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });

      setSubscribers((prev) => [...prev, subscriber]);

      const remoteUserId = parseInt(event.stream.connection.data.split('"')[3]);
      onUserAudioUpdate(remoteUserId, mediaStream);
    } catch (error) {}
  };

  // 스트림 제거
  const handleStreamDestroyed = (event: { stream: Stream }) => {
    if (!event.stream || !event.stream.connection) return;

    console.log("🛑 스트림 제거됨:", event.stream.connection.connectionId);

    setSubscribers((prev) => prev.filter((sub) => sub.stream !== event.stream));
  };

  // syncRequest 수신 시 동기화
  const handleSyncRequest = async () => {
    if (session && session.connection) {
      await session.signal({
        type: "syncRequest",
        data: JSON.stringify({ isPlaying, time }),
      });
    }
  };

  // syncResponse 수신 시 상태 동기화
  const handleSyncResponse = (event: SignalEvent) => {
    if (!event.data) {
      console.warn("⚠️ syncResponse 이벤트에 데이터가 없음");
      return;
    }

    try {
      const data: SyncData = JSON.parse(event.data);

      if (typeof data.isPlaying === "boolean") {
        data.isPlaying ? play() : pause();
      }
      if (typeof data.time === "number") {
        setTimeFromPx(data.time);
      }
    } catch (error) {
      console.error("🚨 syncResponse 데이터 파싱 오류:", error);
    }
  };

  // 마이크 상태 전송
  const handleSendMicstatus = (userId: number, isMicOn: boolean) => {
    if (!session) return;
    session
      .signal({
        type: "mic-status",
        data: JSON.stringify({ userId, isMicOn }),
      })
      .catch((error) => console.error("Signal Error:", error));
  };

  // 마이크 상태 변경 시 전송
  useEffect(() => {
    if (!session || micStatus[userId] === undefined) return;
    if (micStatus[userId] === publisher?.stream.audioActive) return;
    handleSendMicstatus(userId, micStatus[userId]);
  }, [session, micStatus, userId]);

  // 퍼블리셔의 오디오 상태 관리
  useEffect(() => {
    if (publisher && micStatus[userId] !== undefined) {
      publisher.publishAudio(micStatus[userId]);
    }
  }, [micStatus[userId], publisher]);

  // mic-status 신호 수신
  const handleMicStatusSignal = (event: SignalEvent) => {
    if (!session || !session.connection) {
      console.warn("⚠️ [handleMicStatusSignal] 세션 또는 커넥션 정보 없음");
      return;
    }

    if (!event.data) {
      console.warn("⚠️ mic-status 이벤트에 데이터가 없음");
      return;
    }

    try {
      const parseData = JSON.parse(event.data);

      if (
        typeof parseData.userId !== "number" ||
        typeof parseData.isMicOn !== "boolean"
      ) {
        console.warn("⚠️ 잘못된 mic-status 데이터 형식:", parseData);
        return;
      }

      const myConnectionId: string = session.connection.connectionId;
      const from = event.from?.connectionId;

      if (from === myConnectionId) {
        console.log("자신이 보낸 마이크 상태 업데이트는 무시합니다.");
        return;
      }

      if (
        parseData.userId !== userId &&
        micStatus[parseData.userId] !== parseData.isMicOn
      ) {
        setMicStatus(parseData.userId, parseData.isMicOn);
      }
    } catch (error) {
      console.error("🚨 mic-status 데이터 파싱 오류:", error);
    }
  };

  return null;
};
export default WebRTCManager;
