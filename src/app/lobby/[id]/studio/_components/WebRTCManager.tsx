/* eslint-disable @typescript-eslint/no-unused-expressions */

/*
역할
1. OpenVidu 세션을 생성하고 관리
2. 서버에서 세션 ID와 토큰을 가져와 OpenVidu와 연결
3. 비디오 스트림을 OpenVidu에 추가하고 다른 사용자와 공유
4. 비디오 컨트롤 (재생, 정지, 타임라인 이동) 동기화
*/
import { useMicStore } from "@/app/_store/MicStore";
import { useStreamStore } from "@/app/_store/StreamStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
/*
videoStream → 공유할 비디오 스트림 (VideoBlock에서 전달)
isPlaying → 비디오 재생 상태
time → 현재 재생 위치
 */
interface WebRTCManagerProps {
  studioId: number;
  sessionId: string;
  sessionToken: string;
  userId: number;
  onUserAudioUpdate: (userId: number, stream: MediaStream) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
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
  videoRef,
}: WebRTCManagerProps) => {
  const [openVidu, setOpenVidu] = useState<OpenVidu | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { isPlaying, play, pause, time, setTimeFromPx } = useTimeStore();
  const lastSentTime = useRef<number>(0); //마지막으로 time을 전송한 시간
  const { videoStream } = useStreamStore();
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
          const subscriber = newSession.subscribe(event.stream, undefined);
          onUserAudioUpdate(userId, subscriber.stream.getMediaStream());
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
          if (data.type === "seek" && typeof data.time === "number") {
            //1초 이상 차이나면 동기화
            if (Math.abs(time - data.time) > 1) {
              setTimeFromPx(data.time);
            }
          }
        });

        const hasPermissions = await checkAudioPermissions();
        if (!hasPermissions) {
          toast.warning("카메라 및 마이크 권한이 필요합니다.");
          return;
        }

        await newSession.connect(sessionToken);

        setSession(newSession);

        if (newSession.connection) {
          await publishAudioStream();
          await newSession.signal({ type: "syncRequest" });
          setupVideoPublisher(newSession);
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
        session.disconnect();
        setSession(null);
      }
      setSubscribers([]);
      setPublisher(null);
    };
  }, [sessionToken]);

  const setupVideoPublisher = async (session: Session) => {
    if (!session) return;
    try {
      if (!videoRef.current) return;

      const getVideoStream = (
        videoElement: VideoElementWithCapturestream,
      ): MediaStream | null => {
        if (!videoElement) return null;
        if (typeof videoElement.captureStream === "function") {
          return videoElement.captureStream();
        }
        return null;
      };

      const mediaStream = videoRef.current
        ? getVideoStream(videoRef.current)
        : null;
      if (!mediaStream) return;

      const videoTrack = mediaStream.getVideoTracks()[0];

      const newVideoPublisher = openVidu?.initPublisher(undefined, {
        videoSource: videoTrack,
        audioSource: false,
        publishAudio: false,
      });

      if (newVideoPublisher) {
        await session.publish(newVideoPublisher);
        setPublisher(newVideoPublisher);
      }
    } catch (error) {
      console.error("비디오 스트림 설정 실패: ", error);
    }
  };

  const publishAudioStream = async () => {
    if (!session) return;

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioTrack = audioStream.getAudioTracks()[0];

      const newAudioPublisher = openVidu?.initPublisher(undefined, {
        videoSource: false,
        audioSource: audioTrack,
        publishAudio: true,
      });

      if (newAudioPublisher) {
        await session.publish(newAudioPublisher);

        onUserAudioUpdate(userId, newAudioPublisher.stream.getMediaStream());
        console.log("오디오 스트림 설정 성공: ");
      }
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

  useEffect(() => {
    if (!session) return;

    if (typeof lastSentTime.current !== "number") {
      lastSentTime.current = 0;
    }

    // 2초 이상 차이나면 time 동기화 전송
    if (
      session &&
      session.connection &&
      Math.abs(time - lastSentTime.current) > 2
    ) {
      session.signal({
        type: "control",
        data: JSON.stringify({ type: "seek", time }),
      });
      lastSentTime.current = time;
    }
  }, [time]);

  const checkAudioPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      console.log("🎤 카메라 및 마이크 접근 가능");
      return true;
    } catch (error) {
      console.error("🚨 카메라/마이크 접근 거부됨:", error);
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
