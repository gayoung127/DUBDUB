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
  const [audioElements, setAudioElements] = useState<
    { id: string; stream: MediaStream }[]
  >([]);

  useEffect(() => {
    if (!sessionToken) return;

    openViduRef.current = new OpenVidu();
    const newSession = openViduRef.current.initSession();

    // 새로운 참가자가 들어올 때
    newSession.on("streamCreated", (event) => {
      const connectionData = JSON.parse(event.stream.connection.data);
      const memberId = connectionData.clientData;

      console.log(
        `📢 새로운 참가자 (${memberId}) 입장:`,
        event.stream.connection.connectionId,
      );

      const subscriber = newSession.subscribe(event.stream, undefined);

      // 🔥 오디오 자동 재생 문제 해결
      subscriber.on("streamPlaying", () => {
        console.log(`🎤 음성 채팅 활성화됨: ${memberId}`);

        setAudioElements((prev) => [
          ...prev,
          {
            id: event.stream.connection.connectionId,
            stream: event.stream.getMediaStream(),
          },
        ]);
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
      setAudioElements((prev) =>
        prev.filter(
          (audio) => audio.id !== event.stream.connection.connectionId,
        ),
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
      setAudioElements([]);
    };
  }, [sessionToken, self, self?.memberId]);

  return (
    <div>
      {audioElements.map((audio) => (
        <audio
          key={audio.id}
          ref={(el) => {
            if (el) el.srcObject = audio.stream;
          }}
          autoPlay
          controls
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#000",
            borderRadius: "8px",
            padding: "10px",
            zIndex: 1000,
          }}
        />
      ))}
    </div>
  );
};

export default WebRTCManager;
