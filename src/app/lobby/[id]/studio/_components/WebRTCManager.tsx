import { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";
import { useUserStore } from "@/app/_store/UserStore";
import { useMicStore } from "@/app/_store/MicStore";

interface WebRTCManagerProps {
  sessionToken: string;
}

const WebRTCManager = ({ sessionToken }: WebRTCManagerProps) => {
  const openViduRef = useRef(new OpenVidu());
  const sessionRef = useRef<Session | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const { self } = useUserStore();
  const { micStatus, setMicStatus } = useMicStore();

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

        newSession.on("signal:mic-status", (event) => {
          // 마이크 상태 받으면 업데이트를 해줘보자
          if (!event.data) return;

          try {
            const { userId, isMicOn } = JSON.parse(event.data);
            console.log(
              `🔔 [시그널 수신] userId=${userId}, isMicOn=${isMicOn}`,
            );

            setMicStatus(userId, isMicOn);
            console.log(
              `✅ [마이크 상태 업데이트 완료] userId=${userId}, isMicOn=${isMicOn}`,
            );
          } catch (error) {
            console.error("🚨 mic-status 데이터 파싱 오류:", error);
          }
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

  // 마이크 상태 변경 전송
  const handleSendMicstatus = (userId: number, isMicOn: boolean) => {
    if (!sessionRef.current) return;
    console.log(`📢 [시그널 전송] userId=${userId}, isMicOn=${isMicOn}`);
    sessionRef.current
      .signal({
        type: "mic-status",
        data: JSON.stringify({ userId, isMicOn }),
      })
      .then(() => {
        console.log(
          `✅ [시그널 전송 성공] userId=${userId}, isMicOn=${isMicOn}`,
        );
      })
      .catch((error) => console.error("🚨 [시그널 전송 오류]:", error));
  };

  // 마이크 상태 감지 및 업데이트
  useEffect(() => {
    if (!publisher || !self) return;

    const userId = self?.memberId ?? -1;
    if (micStatus[userId] === undefined) return;
    console.log(
      `🔊 [마이크 상태 변경 감지] userId=${userId}, micStatus=${micStatus[userId]}`,
    );
    publisher.publishAudio(micStatus[userId]);
    console.log(
      `🎤 [마이크 퍼블리싱 상태 변경] userId=${userId}, publishAudio=${micStatus[userId]}`,
    );
    console.log(
      `🎤 [퍼블리셔 오디오 상태 확인] userId=${userId}, audioActive=${publisher.stream?.audioActive}`,
    );
    handleSendMicstatus(userId, micStatus[userId]);
  }, [micStatus[self?.memberId ?? -1]]);

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
      {subscribers &&
        subscribers.map((sub) => (
          <audio
            key={sub.stream.connection.connectionId}
            ref={(el) => {
              if (el) el.srcObject = sub.stream.getMediaStream();
            }}
            className="pointer-events-none absolute overflow-hidden opacity-0"
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
  );
};

export default WebRTCManager;
