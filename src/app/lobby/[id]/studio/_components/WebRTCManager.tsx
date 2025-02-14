/* eslint-disable @typescript-eslint/no-unused-expressions */

/*
역할
1. OpenVidu 세션을 생성하고 관리
2. 서버에서 세션 ID와 토큰을 가져와 OpenVidu와 연결
3. 오디오 스트림을 OpenVidu에 추가하고 다른 사용자와 공유
*/
import { useMicStore } from "@/app/_store/MicStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
/*
isPlaying → 비디오 재생 상태
time → 현재 재생 위치
 */
interface WebRTCManagerProps {
  studioId: number;
  sessionId: string;
  sessionToken: string;
  userId: number;
  onUserAudioUpdate: (userId: number, stream: MediaStream) => void;
}

interface SyncData {
  type?: "play" | "pause" | "seek";
  isPlaying?: boolean;
  time?: number;
}

const WebRTCManager = ({
  studioId,
  sessionId,
  sessionToken,
  userId,
  onUserAudioUpdate,
}: WebRTCManagerProps) => {
  const [openVidu, setOpenVidu] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { isPlaying, play, pause, time, setTimeFromPx } = useTimeStore();
  const { micStatus, setMicStatus } = useMicStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionToken) return;
        const ov = new OpenVidu();
        setOpenVidu(ov);

        const newSession = ov.initSession();
        setSession(newSession);

        newSession.on("streamCreated", (event) => {
          console.log("📌 새로운 스트림이 생성됨:", event.stream);
          const subscriber = newSession.subscribe(event.stream, undefined);
          console.log("🔍 구독한 스트림 정보:", subscriber.stream);
          const mediaStream = subscriber.stream.getMediaStream();
          console.log("🎵 구독한 미디어 스트림:", mediaStream);

          const audioTracks = mediaStream.getAudioTracks();
          if (audioTracks.length === 0) {
            console.warn("⚠️ 구독한 스트림에 오디오 트랙이 없습니다.");
          } else {
            console.log("🎤 구독한 오디오 트랙:", audioTracks);
          }

          subscriber.stream
            .getMediaStream()
            .getTracks()
            .forEach((track) => {
              console.log(
                "🔊 추가된 트랙 종류:",
                track.kind,
                "상태:",
                track.enabled,
              );
            });

          const peerConnection = (
            subscriber.stream as any
          ).getRTCPeerConnection();
          peerConnection.ontrack = (event: RTCTrackEvent) => {
            console.log(
              "🎤 ontrack 이벤트 발생!",
              event.track.kind,
              event.streams,
            );
          };
          onUserAudioUpdate(userId, mediaStream);
        });

        newSession.on("signal:syncRequest", () => {
          if (session && session.connection) {
            session.signal({
              type: "syncRequest",
              data: JSON.stringify({ isPlaying, time }),
            });
          }
        });

        // 새로운 사용자가 기존 상태를 수신
        newSession.on("signal:syncResponse", (event) => {
          let data: SyncData = {};
          if (typeof event.data === "string") {
            try {
              const parseData = JSON.parse(event.data);
              if (typeof parseData === "object" && parseData !== null) {
                data = parseData;
              }
            } catch (error) {}
          }

          if (typeof data.isPlaying === "boolean") {
            data.isPlaying ? play() : pause();
          }
          if (typeof data.time === "number") {
            setTimeFromPx(data.time);
          }
        });

        newSession.on("streamDestroyed", (event) => {
          if (!event.stream || !event.stream.connection) return;

          console.log(
            "🛑 스트림 제거됨:",
            event.stream.connection.connectionId,
          );

          setSubscribers((prev) =>
            prev.filter((sub) => sub && sub !== event.stream?.streamManager),
          );
        });

        newSession.on("signal:control", (event) => {
          let data: SyncData = {};

          if (typeof event.data === "string") {
            try {
              const parseData = JSON.parse(event.data);
              if (typeof parseData === "object" && parseData !== null) {
                data = parseData;
              }
            } catch (error) {}
          }

          if (data.type === "play") play();
          if (data.type === "pause") pause();
        });

        const hasPermissions = await checkAudioPermissions();
        if (!hasPermissions) {
          toast.warning("마이크 권한이 필요합니다.");
          return;
        }

        await newSession.connect(sessionToken);

        setSession(newSession);

        if (newSession.connection) {
          await publishAudioStream();
          await newSession.signal({ type: "syncRequest" });
        } else {
          console.warn(
            "🚨 세션 연결이 완료되지 않아 syncRequest 신호를 보낼 수 없습니다.",
          );
        }
      } catch (error) {
        console.error("OpenVidu 세션 초기화 실패: ", error);
      }
    };

    initSession();

    return () => {
      if (session) {
        console.log("🔌 세션 종료");
        session.disconnect();
        setSession(null);
      }
      setSubscribers([]);
      setPublisher(null);
    };
  }, [sessionToken]);

  const publishAudioStream = async () => {
    if (!session) return;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("🎤 마이크 스트림 가져오기 성공:", audioStream);

      if (!audioStream || !audioStream.getAudioTracks().length) {
        console.error("🚨 오디오 트랙을 찾을 수 없습니다.");
        return;
      }

      const audioTrack = audioStream.getAudioTracks()[0];
      console.log("🎵 오디오 트랙 정보:", audioTrack);

      const newAudioPublisher = openVidu?.initPublisher(undefined, {
        videoSource: false,
        audioSource: audioTrack,
        publishAudio: true,
      });

      if (!newAudioPublisher) {
        console.error("🚨 오디오 퍼블리셔 생성 실패");
        return;
      }

      console.log("📡 오디오 퍼블리셔 생성 성공, 세션에 발행 중...");
      await session.publish(newAudioPublisher);
      console.log("✅ 오디오 퍼블리싱 완료");

      setPublisher(newAudioPublisher);
      onUserAudioUpdate(userId, newAudioPublisher.stream.getMediaStream());
      console.log("오디오 스트림 설정 성공: ");
    } catch (error) {
      console.error("오디오 스트림 설정 실패: ", error);
    }
  };

  useEffect(() => {
    if (!session || !session.connection) return;

    session.signal({
      type: "control",
      data: JSON.stringify({ type: isPlaying ? "play" : "pause" }),
    });
  }, [isPlaying]);

  const checkAudioPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      console.log("🎤 마이크 접근 가능");

      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("🚨 마이크 접근 거부됨:", error);
      return false;
    }
  };

  const handleSendMicstatus = (userId: number, isMicOn: boolean) => {
    if (!session) return;
    session
      .signal({
        type: "mic-status",
        data: JSON.stringify({ userId, isMicOn }),
      })
      .catch((error) => console.error("Signal Error:", error));
  };
  useEffect(() => {
    if (!session) return;

    const latestStatus = useMicStore.getState().micStatus;
    const myMicStatus = latestStatus[userId];
    if (myMicStatus !== undefined) {
      handleSendMicstatus(userId, myMicStatus);
    }
  }, [micStatus[userId]]);

  useEffect(() => {
    if (!session) return;

    session.on("signal:mic-status", (event) => {
      if (!event.data) return;

      const { userId: senderId, isMicOn } = JSON.parse(event.data);
      if (senderId !== userId) {
        useMicStore.getState().setMicStatus(senderId, isMicOn);
      }
    });

    return () => {
      session?.off("signal:mic-status");
    };
  }, [session]);
  return null;
};
export default WebRTCManager;
