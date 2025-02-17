import { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";
import { useUserStore } from "@/app/_store/UserStore";

interface WebRTCManagerProps {
  sessionId: string;
  sessionToken: string;
}

const WebRTCManager = ({ sessionId, sessionToken }: WebRTCManagerProps) => {
  const openViduRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { self } = useUserStore();

  useEffect(() => {
    if (!sessionToken) return;

    openViduRef.current = new OpenVidu();
    const newSession = openViduRef.current.initSession();

    // 새로운 사람이 들어올 때
    newSession.on("streamCreated", (event) => {
      const connectionData = JSON.parse(event.stream.connection.data);
      const memberId = connectionData.clientData; // 사용자 ID 가져오기

      console.log(
        `📢 새로운 참가자 (${memberId}) 입장:`,
        event.stream.connection.connectionId,
      );

      const subscriber = newSession.subscribe(event.stream, undefined);

      // 오디오 자동 재생
      subscriber.on("streamPlaying", () => {
        console.log(`🎤 음성 채팅 활성화됨: ${memberId}`);
      });

      setSubscribers((prev) => [...prev, subscriber]);
    });

    // 사람이 나갈 때
    newSession.on("streamDestroyed", (event) => {
      const connectionData = JSON.parse(event.stream.connection.data);
      const memberId = connectionData.clientData;

      console.log(
        `🚪 참가자 (${memberId}) 퇴장:`,
        event.stream.connection.connectionId,
      );

      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream !== event.stream),
      );
    });

    sessionRef.current = newSession;
    const connectSession = async () => {
      if (!self) {
        console.error("❌ self가 존재하지 않음. 세션 연결을 중단합니다.");
        return;
      }

      try {
        await newSession.connect(sessionToken, { clientData: self.memberId });
        console.log(`✅ 세션 연결 완료 (내 ID: ${self.memberId})`);

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
        console.log(`🎤 음성 채팅 시작됨 (내 ID: ${self.memberId})`);
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
  }, [sessionToken, self, self?.memberId]); // self.memberId가 변경되면 다시 실행

  return null;
};

export default WebRTCManager;
