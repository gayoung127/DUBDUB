import { useEffect } from "react";
import { OpenVidu, SignalEvent, Subscriber } from "openvidu-browser";
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

        newSession.on("signal:mic-status", (event: SignalEvent) => {
          if (!event.data) return;

          try {
            const { userId, isMicOn } = JSON.parse(event.data);

            if (micStatus[userId] !== isMicOn) {
              console.log(
                `${userId}의 마이크 상태가 ${micStatus[userId]}에서 ${isMicOn}으로 변경됨`,
              );
              setMicStatus(userId, isMicOn);
            }
          } catch (error) {
            console.error("🚨 mic-status 데이터 파싱 오류:", error);
          }
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

  useEffect(() => {
    const userId = self?.memberId ?? -1;

    sessionRef?.signal({
      type: "mic-status",
      data: JSON.stringify({ userId, isMicOn: micStatus[userId] }),
    });

    if (publisher && publisher.stream) {
      const audioTrack = publisher.stream.getMediaStream().getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = micStatus[userId];
    }
  }, [micStatus[self?.memberId ?? -1]]);

  useEffect(() => {
    if (!sessionRef) return;
    const totalUsers = sessionRef.remoteConnections.size + 1;
    console.log(
      `🔍 현재 세션 내 사용자 수: ${totalUsers}, 구독된 스트림 수: ${subscribers.length}`,
    );

    if (subscribers.length === totalUsers) {
      console.log(`🎤 모든 사용자가 내 스트림을 구독 완료 - 마이크 상태 전송`);
      const userId = self?.memberId ?? -1;
      sessionRef?.signal({
        type: "mic-status",
        data: JSON.stringify({
          userId,
          isMicOn: micStatus[userId],
        }),
      });
    }
  }, [subscribers]);

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
