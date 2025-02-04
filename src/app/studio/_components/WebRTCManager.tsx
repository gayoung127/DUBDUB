/*
역할
1. OpenVidu 세션을 생성하고 관리
2. 서버에서 세션 ID와 토큰을 가져와 OpenVidu와 연결
3. 비디오 스트림을 OpenVidu에 추가하고 다른 사용자와 공유
4. 비디오 컨트롤 (재생, 정지, 타임라인 이동) 동기화
*/
import { useStreamStore } from "@/app/_store/StreamStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";
/*
videoStream → 공유할 비디오 스트림 (VideoBlock에서 전달)
studioId → 사용자가 속한 방의 ID (WebRTC 세션을 구분하는 역할)
isPlaying → 비디오 재생 상태
time → 현재 재생 위치
 */
interface WebRTCManagerProps {
  studioId: string;
}

const WebRTCManager = ({ studioId }: WebRTCManagerProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { isPlaying, play, pause, time, setTimeFromPx } = useTimeStore();
  const lastSentTime = useRef<number>(0); //마지막으로 time을 전송한 시간
  const { videoStream } = useStreamStore();

  useEffect(() => {
    if (!videoStream) return;

    const initSession = async () => {
      const ov = new OpenVidu();
      const newSession = ov.initSession();

      // 기존 사용자로부터 현재 상태 동기화 요청
      newSession.on("signal:syncRequest", () => {
        session?.signal({
          type: "syncRequest",
          data: JSON.stringify({ isPlaying, time }),
        });
      });

      // 새로운 사용자가 기존 상태를 수신
      newSession.on("signal:syncResponse", (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const data = event.data ? JSON.parse(event.data) : {};

        if (typeof data.isPlaying === "boolean") {
          data.isPlaying ? play() : pause();
        }

        if (typeof data.time === "number") {
          setTimeFromPx(data.time);
        }
      });

      newSession.on("streamCreated", (event) => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      newSession.on("streamDestroyed", (event) => {
        setSubscribers((prev) =>
          prev.filter((sub) => sub && sub !== event.stream?.streamManager),
        );
      });

      newSession.on("signal:control", (event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const data = event.data ? JSON.parse(event.data) : {};

        if (data.type === "play") play();
        if (data.type === "pause") pause();
        if (data.type === "seek" && typeof data.time === "number") {
          //1초 이상 차이나면 동기화
          if (Math.abs(time - data.time) > 1) {
            setTimeFromPx(data.time);
          }
        }
      });

      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!BASE_URL) {
          console.error("백엔드 Url 환경 변수에서 못 찾아옴.");
          return;
        }
        //서버에서 studioId에 대한 WebRTC 토큰을 요청하는 api 필요
        /*
        const token = await fetch(
          `${BASE_URL}/openvidu/token?studioId=${studioId}`,
        ).then((response) => response.text());
        await newSession.connect(token);
        */

        const videoTrack = videoStream.getVideoTracks()[0];
        const newPublisher = ov.initPublisher(undefined, {
          videoSource: videoTrack,
          publishAudio: false,
        });

        await newSession.publish(newPublisher);

        setSession(newSession);
        setPublisher(newPublisher);

        newSession.signal({ type: "syncRequest" });
      } catch (error) {
        console.error("OpenVidu 세션 연결 실패: ", error);
      }
    };

    initSession();

    return () => {
      session?.disconnect();
      setSession(null);
      setPublisher(null);
      setSubscribers([]);
    };
  }, [videoStream, studioId]);

  useEffect(() => {
    if (!session) return;

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
    if (Math.abs(time - lastSentTime.current) > 2) {
      session?.signal({
        type: "control",
        data: JSON.stringify({ type: "seek", time }),
      });
      lastSentTime.current = time;
    }
  }, [time]);
  return null;
};

export default WebRTCManager;
