import { useEffect } from "react";
import { OpenVidu, Subscriber } from "openvidu-browser";
import { useUserStore } from "@/app/_store/UserStore";
import { useMicStore } from "@/app/_store/MicStore";
import { useWebRTCStore } from "@/app/_store/WebRTCStore"; // ✅ WebRTC 상태 관리 추가

interface WebRTCManagerProps {
  sessionToken: string;
}

const WebRTCManager = ({ sessionToken }: WebRTCManagerProps) => {
  const openViduRef = new OpenVidu();
  const { self } = useUserStore();
  const { micStatus, setMicStatus } = useMicStore();

  // ✅ 전역 상태로 WebRTC 세션 관리
  const {
    sessionRef,
    setSession,
    subscribers,
    setSubscribers,
    publisher,
    setPublisher,
    disconnectSession,
  } = useWebRTCStore();

  useEffect(() => {
    if (!sessionToken || !self) return;

    // ✅ 기존 세션이 있다면 새로 만들지 않고 바로 반환
    if (sessionRef) {
      console.log("✅ 이미 세션이 존재하므로 재사용: ", sessionRef.sessionId);
      return;
    }

    const initSession = async () => {
      try {
        const newSession = openViduRef.initSession();

        newSession.on("streamCreated", (event) => {
          console.log(
            `📢 새로운 참가자 입장: ${event.stream.connection.connectionId}`,
          );

          const subscriber = newSession.subscribe(event.stream, undefined);
          setSubscribers((prev: Subscriber[]) => [...prev, subscriber]); // ✅ 해결된 부분
        });

        newSession.on("streamDestroyed", (event) => {
          console.log(
            `🚪 참가자 퇴장: ${event.stream.connection.connectionId}`,
          );

          setSubscribers((prev: Subscriber[]) =>
            prev.filter(
              (sub) =>
                sub.stream.connection.connectionId !==
                event.stream.connection.connectionId,
            ),
          ); // ✅ 해결된 부분
        });

        newSession.on("exception", (exception) => {
          console.warn("⚠️ OpenVidu Exception:", exception);
        });

        // 🔥 OpenVidu 세션 연결 (토큰을 props로 받음)
        await newSession.connect(sessionToken, { clientData: self.memberId });

        // 🎤 퍼블리셔 생성 (로컬 오디오 전송)
        const newPublisher = await openViduRef.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: false,
          publishAudio: true,
        });

        await newSession.publish(newPublisher);
        console.log(`🎤 음성 채팅 시작됨 (내 ID: ${self.memberId})`);

        // ✅ 전역 상태로 세션 저장
        setSession(newSession);
        setPublisher(newPublisher);
      } catch (error) {
        console.error("❌ 세션 연결 오류:", error);
      }
    };

    initSession();

    return () => {
      console.log("🚪 사용자 퇴장 - 세션은 유지");
      disconnectSession(); // ✅ 필요할 때만 세션 종료
    };
  }, [sessionToken, self]);

  return (
    <div style={{ display: "none" }}>
      {subscribers.map((sub) => (
        <audio
          key={sub.stream.connection.connectionId}
          ref={(el) => {
            if (el) el.srcObject = sub.stream.getMediaStream();
          }}
          autoPlay
          controls
          muted={false}
        />
      ))}
    </div>
  );
};

export default WebRTCManager;
