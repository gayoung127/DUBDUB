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

        // ✅ 오디오 태그 생성
        const audioElement = document.createElement("audio");
        audioElement.srcObject = event.stream.getMediaStream();
        audioElement.autoplay = true;
        audioElement.controls = false;
        audioElement.muted = false;

        // ✅ DOM에 추가하여 브라우저 정책 우회
        document.body.appendChild(audioElement);

        // ✅ 오디오 트랙이 비활성화된 경우 강제 활성화
        const audioTracks = event.stream.getMediaStream().getAudioTracks();
        if (audioTracks.length > 0) {
          audioTracks[0].enabled = true;
          console.log("🎵 오디오 트랙 활성화 완료");
        }
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
  }, [sessionToken, self, self?.memberId]);

  return null;
};

export default WebRTCManager;
