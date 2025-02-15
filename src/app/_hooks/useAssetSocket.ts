import { useEffect, useRef, useState } from "react";
import useStompClient from "@/app/_hooks/useStompClient";
import { Asset, AudioFile } from "@/app/_types/studio";
import { useStompStore } from "../_store/StompStore";

interface UseAssetsSocketProps {
  sessionId: string;
}

export const useAssetsSocket = ({ sessionId }: UseAssetsSocketProps) => {
  const { isConnected, stompClientRef } = useStompStore();
  const subscriptionRef = useRef<any>(null);

  // const [assets, setAssets] = useState<AudioFile[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const prevAssetsRef = useRef<Asset[]>([]);

  // 보냄
  const sendAsset = (asset: Asset) => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) {
      if (!isConnected) {
        console.log("send !isConnected");
      }
      if (!stompClientRef?.connected) {
        console.log("send !stompClientRef?.connected");
      }
      if (!sessionId) {
        console.log("send !sessionId");
      }
      return;
    }
    console.log("에셋을 보낼 때 연결 설정 완료");

    const audioAsset = {
      action: "SAVE",
      audioAsset: asset,
    };

    console.log("에셋 publish 데이터 ", audioAsset);
    stompClientRef.publish({
      destination: `/app/studio/${sessionId}/asset`,
      body: JSON.stringify(audioAsset),
    });
    console.log("에셋 publish 완료");
  };

  // ✅ 구독 및 해제 로직
  useEffect(() => {
    if (!isConnected || !stompClientRef?.connected || !sessionId) {
      if (!isConnected) {
        console.log("connect !isConnected");
      }
      if (!stompClientRef?.connected) {
        console.log("connect !stompClientRef?.connected");
      }
      if (!sessionId) {
        console.log("connect !sessionId");
      }
      return;
    }

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

        /*
        id, tableId, url
        */
        // 에셋 상태 업데이트

        const newFile: Asset = {
          id: receivedAssets.audioAsset.id,
          url: receivedAssets.audioAsset.url,
          duration: receivedAssets.audioAsset.duration, // 원본 파일 전체 길이
        };
        console.log("new File = ", newFile);
        setAssets((prevAssets) => {
          const updatedAssets = [...prevAssets, newFile];
          return updatedAssets;
        });
      },
    );

    console.log("구독 후 에셋 상태 =", assets);

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
