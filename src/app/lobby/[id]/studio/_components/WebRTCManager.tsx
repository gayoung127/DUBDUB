import { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";
import { useUserStore } from "@/app/_store/UserStore";

interface WebRTCManagerProps {
  sessionId: string;
  sessionToken: string;
}

const WebRTCManager = ({ sessionId, sessionToken }: WebRTCManagerProps) => {
  const openViduRef = useRef(new OpenVidu());
  const sessionRef = useRef<Session | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { self } = useUserStore();

  useEffect(() => {
    if (!sessionToken || !self) return;

    const initSession = async () => {
      try {
        const newSession = openViduRef.current.initSession();

        newSession.on("streamCreated", (event) => {
          console.log(
            `📢 새로운 참가자 입장: ${event.stream.connection.connectionId}`,
          );

          const subscriber = newSession.subscribe(event.stream, undefined);
          setSubscribers((prev) => [...prev, subscriber]);
        });

        newSession.on("streamDestroyed", (event) => {
          console.log(
            `🚪 참가자 퇴장: ${event.stream.connection.connectionId}`,
          );

          setSubscribers((prev) =>
            prev.filter(
              (sub) =>
                sub.stream.connection.connectionId !==
                event.stream.connection.connectionId,
            ),
          );
        });

        newSession.on("exception", (exception) => {
          console.warn("⚠️ OpenVidu Exception:", exception);
        });

        // 세션 저장
        sessionRef.current = newSession;

        // 🔥 OpenVidu 세션 연결 (토큰을 props로 받음)
        await newSession.connect(sessionToken, { clientData: self.memberId });

        // 🎤 퍼블리셔 생성 (로컬 오디오 전송)
        const newPublisher = await openViduRef.current!.initPublisherAsync(
          undefined,
          {
            audioSource: undefined,
            videoSource: false,
            publishAudio: true,
          },
        );

        await newSession.publish(newPublisher);
        console.log(`🎤 음성 채팅 시작됨 (내 ID: ${self.memberId})`);
      } catch (error) {
        console.error("❌ 세션 연결 오류:", error);
      }
    };

    initSession();

    return () => {
      console.log("🔌 세션 종료");
      sessionRef.current?.disconnect();
      setSubscribers([]);
    };
  }, [sessionToken, self]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "20px",
      }}
    >
      <h3>WebRTC 음성 채팅</h3>
      {subscribers.length === 0 ? (
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
          {subscribers.map((sub) => (
            <audio
              key={sub.stream.connection.connectionId}
              ref={(el) => {
                if (el) el.srcObject = sub.stream.getMediaStream();
              }}
              autoPlay
              controls
              muted={false}
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
      <button
        onClick={() => sessionRef.current?.disconnect()}
        style={{ marginTop: "10px" }}
      >
        세션 종료
      </button>
    </div>
  );
};

export default WebRTCManager;
