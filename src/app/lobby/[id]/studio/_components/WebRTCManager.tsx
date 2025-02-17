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
      const connectionId = event.stream.connection.connectionId;

      console.log(`📢 새로운 참가자 (${memberId}) 입장: ${connectionId}`);

      const subscriber = newSession.subscribe(event.stream, undefined);

      subscriber.on("streamPlaying", () => {
        console.log(`🎤 음성 채팅 활성화됨: ${memberId}`);

        setSubscribers((prev) => [...prev, subscriber]);
      });
    });

    // 사람이 나갈 때
    newSession.on("streamDestroyed", (event) => {
      const connectionId = event.stream.connection.connectionId;
      console.log(`🚪 참가자 퇴장: ${connectionId}`);

      setSubscribers((prev) =>
        prev.filter(
          (sub) => sub.stream.connection.connectionId !== connectionId,
        ),
      );
      setAudioElements((prev) =>
        prev.filter((audio) => audio.id !== connectionId),
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

  // 🔥 subscribers 상태가 변경될 때마다 audioElements 업데이트
  useEffect(() => {
    const newAudioElements = subscribers
      .map((subscriber) => {
        if (!subscriber || !subscriber.stream) return null;

        const stream = subscriber.stream.getMediaStream();
        if (!stream) return null;

        return { id: subscriber.stream.connection.connectionId, stream };
      })
      .filter((audio) => audio !== null) as {
      id: string;
      stream: MediaStream;
    }[];

    setAudioElements(newAudioElements);
    console.log("🎧 현재 오디오 요소 리스트:", newAudioElements);
  }, [subscribers]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        flexDirection: "column",
      }}
    >
      {audioElements.length === 0 ? (
        <p style={{ fontSize: "16px", color: "#888", textAlign: "center" }}>
          현재 참가자가 없습니다.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {audioElements.map((audio) => (
            <audio
              key={audio.id}
              ref={(el) => {
                if (el) el.srcObject = audio.stream;
              }}
              autoPlay
              controls
              style={{
                width: "250px",
                maxWidth: "100%",
                background: "#ddd",
                borderRadius: "8px",
                padding: "5px",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WebRTCManager;
