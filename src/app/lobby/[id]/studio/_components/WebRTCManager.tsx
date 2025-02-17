import { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";

interface WebRTCManagerProps {
  sessionId: string;
  sessionToken: string;
}

const WebRTCManager = ({ sessionId, sessionToken }: WebRTCManagerProps) => {
  const openViduRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (!sessionToken) return;

    openViduRef.current = new OpenVidu();
    const newSession = openViduRef.current.initSession();

    // 새로운 사람이 들어올 때
    newSession.on("streamCreated", (event) => {
      console.log(
        "📢 새로운 참가자 입장:",
        event.stream.connection.connectionId,
      );

      const subscriber = newSession.subscribe(event.stream, undefined);

      // 오디오 자동 재생
      subscriber.on("streamPlaying", () => {
        console.log(
          "🎤 음성 채팅 활성화됨:",
          event.stream.connection.connectionId,
        );
      });

      setSubscribers((prev) => [...prev, subscriber]);
    });

    // 사람이 나갈 때
    newSession.on("streamDestroyed", (event) => {
      console.log("🚪 참가자 퇴장:", event.stream.connection.connectionId);

      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream !== event.stream),
      );
    });

    sessionRef.current = newSession;

    const connectSession = async () => {
      try {
        await newSession.connect(sessionToken);
        console.log("✅ 세션 연결 완료");

        const newPublisher = await openViduRef.current!.initPublisherAsync(
          undefined,
          {
            audioSource: undefined,
            videoSource: false,
            publishAudio: true,
          },
        );

        await newSession.publish(newPublisher);
        setPublisher(newPublisher);
        console.log("🎤 음성 채팅 시작됨");
      } catch (error) {
        console.error("❌ 세션 연결 오류:", error);
      }
    };

    connectSession();

    return () => {
      console.log("🔌 세션 종료");
      newSession.disconnect();
      setSubscribers([]);
      setPublisher(null);
    };
  }, [sessionToken]);

  return null;
};

export default WebRTCManager;
