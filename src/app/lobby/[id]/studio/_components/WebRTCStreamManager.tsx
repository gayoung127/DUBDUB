import { useStreamStore } from "@/app/_store/StreamStore";
import { useTimeStore } from "@/app/_store/TimeStore";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { useEffect, useRef, useState } from "react";

interface WebRTCStreamManagerProps {
  session: Session;
}

interface SyncData {
  type?: "play" | "pause" | "seek";
  isPlaying?: boolean;
  time?: number;
}

const WebRTCStreamManager = ({ session }: WebRTCStreamManagerProps) => {
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { isPlaying, play, pause, time, setTimeFromPx } = useTimeStore();
  const lastSentTime = useRef<number>(0); //마지막으로 time을 전송한 시간
  const { videoStream } = useStreamStore();
  const ovRef = useRef<OpenVidu | null>(null);

  useEffect(() => {
    if (!videoStream) return;

    const publishStream = async () => {
      try {
        ovRef.current = new OpenVidu();

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        const audioTrack = audioStream.getAudioTracks()[0];

        const newPublisher = ovRef.current!.initPublisher(undefined, {
          videoSource: videoTrack,
          audioSource: audioTrack,
          publishAudio: true,
        });

        await session.publish(newPublisher);

        setPublisher(newPublisher);
        session.signal({ type: "syncRequest" });
      } catch (error) {
        console.error("비디오 스트림 게시 실패: ", error);
      }
    };

    publishStream();

    return () => {
      if (session && publisher) {
        session.unpublish(publisher);
      }
      setPublisher(null);
    };
  }, [videoStream, session]);

  useEffect(() => {
    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    session.on("streamDestroyed", (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub && sub !== event.stream?.streamManager),
      );
    });

    session.on("signal:syncResponse", (event) => {
      try {
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
      } catch (error) {
        console.error("Sync Response 처리 오류:", error);
      }
    });

    session.on("signal:control", (event) => {
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

    return () => {
      session.off("streamCreated");
      session.off("streamDestroyed");
      session.off("signal:syncResponse");
      session.off("signal:control");
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

    if (session && session.connection) {
      session.signal({
        type: "control",
        data: JSON.stringify({ type: isPlaying ? "play" : "pause" }),
      });
    }
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

  return null;
};

export default WebRTCStreamManager;
