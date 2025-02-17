import { useMicStore } from "@/app/_store/MicStore";
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

interface WebRTCManagerProps {
  studioId: number;
  sessionId: string;
  sessionToken: string;
  userId: number;
  onUserAudioUpdate: (userId: number, stream: MediaStream) => void;
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
  const { micStatus, setMicStatus } = useMicStore();

  // 마이크 접근 권한 확인
  const checkAudioPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("🚨 마이크 접근 거부됨:", error);
      toast.warning("마이크 권한이 필요합니다.");
      return false;
    }
  };

  // OpenVidu 세션 생성
  useEffect(() => {
    if (!sessionToken) {
      console.warn(
        "⚠️ [useEffect: 세션 생성] sessionToken이 없음, 초기화 중단",
      );
      return;
    }

    console.log("🎬 [useEffect: 세션 생성] OpenVidu 세션 초기화 시작");
    openViduRef.current = new OpenVidu();
    const newSession = openViduRef.current.initSession();

    console.log(
      "🆕 [useEffect: 세션 생성] 새로운 OpenVidu 세션 객체 생성 완료",
    );

    newSession.on("streamCreated", handleStreamCreated);
    newSession.on("streamDestroyed", handleStreamDestroyed);
    newSession.on("signal:mic-status", handleMicStatusSignal);
    console.log("✅ [useEffect: 세션 생성] 이벤트 핸들러 등록 완료");

    sessionRef.current = newSession;
    setSession(newSession);
  }, [sessionToken]);

  // 세션 연결 (session이 설정된 후 실행)
  useEffect(() => {
    if (!session) {
      console.warn("⚠️ [useEffect: 세션 연결] session 객체가 없음, 연결 중단");
      return;
    }
    if (!sessionToken) {
      console.warn("⚠️ [useEffect: 세션 연결] sessionToken이 없음, 연결 중단");
      return;
    }

    console.log("🔗 [useEffect: 세션 연결] 세션 연결 시도 시작");

    const connectSession = async () => {
      try {
        console.log("⏳ [useEffect: 세션 연결] OpenVidu 세션에 연결 중...");
        await session.connect(sessionToken, JSON.stringify({ userId }));
        console.log("✅ [useEffect: 세션 연결] OpenVidu 세션에 연결 완료");
      } catch (error) {
        console.error(
          "🚨 [useEffect: 세션 연결] OpenVidu 세션 연결 실패: ",
          error,
        );
      }
    };

    connectSession();
  }, [session]);

  // 오디오 스트림 퍼블리싱 (세션 연결 완료 후 실행)
  useEffect(() => {
    if (!session) {
      console.warn(
        "⚠️ [useEffect: 오디오 퍼블리싱] session 객체가 없음, 퍼블리싱 중단",
      );
      return;
    }
    if (!session.connection) {
      console.warn(
        "⚠️ [useEffect: 오디오 퍼블리싱] session이 아직 연결되지 않음, 퍼블리싱 중단",
      );
      return;
    }

    console.log("🎤 [useEffect: 오디오 퍼블리싱] 오디오 스트림 퍼블리싱 시작");

    const initAudioStream = async () => {
      console.log("⏳ [useEffect: 오디오 퍼블리싱] 마이크 권한 확인 중...");
      const hasPermissions = await checkAudioPermissions();
      if (!hasPermissions) {
        console.warn(
          "🚫 [useEffect: 오디오 퍼블리싱] 마이크 권한 없음, 퍼블리싱 중단",
        );
        return;
      }

      console.log(
        "📡 [useEffect: 오디오 퍼블리싱] 마이크 권한 확인 완료, 퍼블리싱 시작",
      );
      await publishAudioStream(session);
      console.log("✅ [useEffect: 오디오 퍼블리싱] 오디오 퍼블리싱 완료");
    };

    initAudioStream();
  }, [session?.connection]);

  useEffect(() => {
    if (subscribers.length === 0) return; // 구독자가 없으면 실행하지 않음

    console.log("🔄 [useEffect] subscribers가 변경됨, 오디오 상태 다시 확인");

    subscribers.forEach((subscriber) => {
      const mediaStream = subscriber.stream.getMediaStream();
      console.log("🎵 [useEffect] 구독한 미디어 스트림:", mediaStream);

      const audioTracks = mediaStream.getAudioTracks();
      console.log("🔍 [useEffect] 오디오 트랙 개수:", audioTracks.length);

      if (audioTracks.length > 0) {
        console.log(
          "✅ [useEffect] 오디오 트랙 정상 확보, onUserAudioUpdate 실행",
        );
        const connectionData = JSON.parse(subscriber.stream.connection.data);
        onUserAudioUpdate(connectionData.userId, mediaStream);
      } else {
        console.warn("🚨 [useEffect] 오디오 트랙이 없음.");
      }
    });
  }, [subscribers]);

  // 오디오 스트림 퍼블리싱 함수
  const publishAudioStream = async (session: Session) => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!audioStream || !audioStream.getAudioTracks().length) {
        console.error("🚨 오디오 트랙을 찾을 수 없습니다.");
        return;
      }

      const newAudioPublisher = session.openvidu.initPublisher(undefined, {
        videoSource: false,
        audioSource: undefined,
        publishAudio: true,
      });

      newAudioPublisher.on("streamCreated", (event) => {
        const mediaStream = event.stream.getMediaStream();
        console.log(
          "🎤 [streamCreated] 이벤트 발생, 오디오 트랙 확인:",
          mediaStream,
        );
        onUserAudioUpdate(userId, mediaStream);
      });

      await session.publish(newAudioPublisher);
      console.log("✅ 오디오 퍼블리싱 완료");

      setPublisher(newAudioPublisher);
    } catch (error) {
      console.error("오디오 스트림 설정 실패: ", error);
    }
  };

  // 새로운 스트림 생성 시 처리
  const handleStreamCreated = (event: { stream: Stream }) => {
    if (!sessionRef.current) return;

    try {
      console.log("📌 새로운 스트림이 생성됨:", event.stream);
      const subscriber = sessionRef.current.subscribe(event.stream, undefined);
      console.log("📌 스트림 구독 성공:", subscriber);

      // 🔥 `subscribe()`가 완료되었는지 체크
      if (!subscriber.stream) {
        console.warn(
          "⚠️ `subscribe()` 실행 후에도 `subscriber.stream`이 없음.",
        );
      } else {
        console.log("✅ `subscribe()` 완료 후 `subscriber.stream`이 존재함.");
      }

      subscriber.on("streamPlaying", () => {
        console.log("🎵 [streamPlaying] 이벤트 발생");
        const mediaStream = subscriber.stream.getMediaStream();
        console.log("🎵 구독한 미디어 스트림:", mediaStream);
        const connectionData = JSON.parse(event.stream.connection.data);
        onUserAudioUpdate(connectionData.userId, mediaStream);
      });

      // 🔥 `streamPlaying`이 실행되지 않는지 확인하는 로그
      if (!subscriber.stream.isLocalStreamPublished) {
        console.warn("⚠️ [직후지만] 스트림이 아직 퍼블리시되지 않음");
      }
      setSubscribers((prev) => [...prev, subscriber]);

      const mediaStream = subscriber.stream.getMediaStream();
      if (mediaStream && mediaStream.getAudioTracks().length > 0) {
        console.log("✅ [직후지만] 오디오 트랙 확보됨, onUserAudioUpdate 실행");
        const connectionData = JSON.parse(event.stream.connection.data);
        onUserAudioUpdate(connectionData.userId, mediaStream);
      } else {
        console.warn("🚨 [직후지만] 오디오 트랙이 없음.");
      }
    } catch (error) {
      console.error("🚨 handleStreamCreated 오류:", error);
    }
  };

  // 스트림 제거 처리
  const handleStreamDestroyed = (event: { stream: Stream }) => {
    console.log("🛑 스트림 제거됨:", event.stream.connection.connectionId);
    setSubscribers((prev) => prev.filter((sub) => sub.stream !== event.stream));
  };

  // 마이크 상태 변경 전송
  const handleSendMicstatus = (userId: number, isMicOn: boolean) => {
    if (!sessionRef.current) return;

    sessionRef.current
      .signal({
        type: "mic-status",
        data: JSON.stringify({ userId, isMicOn }),
      })
      .catch((error) => console.error("Signal Error:", error));
  };

  // 마이크 상태 감지 및 업데이트
  useEffect(() => {
    if (!sessionRef.current || micStatus[userId] === undefined) return;

    if (micStatus[userId] !== publisher?.stream.audioActive) {
      handleSendMicstatus(userId, micStatus[userId]);
    }
  }, [micStatus[userId]]);

  // mic-status 신호 수신 처리
  const handleMicStatusSignal = (event: SignalEvent) => {
    if (!event.data) return;

    try {
      const { userId, isMicOn } = JSON.parse(event.data);
      setMicStatus(userId, isMicOn);
    } catch (error) {
      console.error("🚨 mic-status 데이터 파싱 오류:", error);
    }
  };

  return null;
};

export default WebRTCManager;
