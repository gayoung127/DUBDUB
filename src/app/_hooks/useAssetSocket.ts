import { useEffect, useRef, useState } from "react";
import useStompClient from "@/app/_hooks/useStompClient";
import { AudioFile } from "@/app/_types/studio";
import { useStompStore } from "../_store/StompStore";

interface UseAssetsSocketProps {
  sessionId: string;
}

export const useAssetsSocket = ({ sessionId }: UseAssetsSocketProps) => {
  const { isConnected, stompClientRef } = useStompStore();
  const subscriptionRef = useRef<any>(null);

  const [assets, setAssets] = useState<AudioFile[]>([]);
  const prevAssetsRef = useRef<AudioFile[]>([]);

  // 보냄
  const sendAsset = (asset: AudioFile) => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) return;
    const audioAsset = {
      action: "SAVE",
      audioAsset: asset,
    };

    console.log("에셋 publish 데이터 ", audioAsset);
    stompClientRef.publish({
      destination: `app/studio/${sessionId}/asset`,
      body: JSON.stringify(audioAsset),
    });
  };

  // ✅ 구독 및 해제 로직
  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) return;

    // 기존 구독 해제
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    console.log("📡 [구독 시작]:", `/topic/studio/${sessionId}/assets`);

    // 새로운 구독 생성
    subscriptionRef.current = stompClientRef.subscribe(
      `/topic/studio/${sessionId}/assets`,
      (message) => {
        const receivedAssets = JSON.parse(message.body);
        console.log("Audio Asset Received:", receivedAssets);

        // 에셋 상태 업데이트
        setAssets((prevAssets) => {
          const updatedAssets = [...prevAssets, ...receivedAssets];
          return updatedAssets;
        });
      },
    );

    // 컴포넌트 언마운트 또는 의존성 변경 시 구독 해제
    return () => {
      if (subscriptionRef.current) {
        console.log("🔴 [구독 해제]:", `/topic/studio/${sessionId}/assets`);
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [isConnected, stompClientRef, sessionId]);

  return { assets, setAssets, sendAsset };
};
