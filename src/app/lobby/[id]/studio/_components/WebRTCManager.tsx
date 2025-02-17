import { useEffect, useRef, useState } from "react";
import { OpenVidu, Session, Publisher, Subscriber } from "openvidu-browser";

interface WebRTCManagerProps {
  sessionId: string;
  sessionToken: string;
}

const WebRTCManager = ({ sessionId, sessionToken }: WebRTCManagerProps) => {
  const openViduRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (!sessionToken) return;

    openViduRef.current = new OpenVidu();
    const newSession = openViduRef.current.initSession();

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub.stream !== event.stream),
      );
    });

    sessionRef.current = newSession;

    const connectSession = async () => {
      try {
        await newSession.connect(sessionToken);
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
      } catch (error) {
        console.error("Session connection error:", error);
      }
    };
    connectSession();

    return () => {
      newSession.disconnect();
      setSubscribers([]);
      setPublisher(null);
    };
  }, [sessionToken]);

  return null;
};

export default WebRTCManager;
