import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { GenericPlugin } from "wavesurfer.js/dist/base-plugin";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm";

interface TimelineProps {
  wavesurfer: WaveSurfer; // WaveSurfer 인스턴스
  height?: number;
  primaryLabelInterval?: number;
  secondaryLabelInterval?: number;
  timeInterval?: number;
}

const Timeline: React.FC<TimelineProps> = ({
  wavesurfer,
  height = 30,
  primaryLabelInterval = 10,
  secondaryLabelInterval = 5,
  timeInterval = 1,
}) => {
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!timelineContainerRef.current || !wavesurfer) {
      console.error(
        "Timeline container is not initialized or WaveSurfer is not ready.",
      );
      return;
    }

    // Timeline 플러그인 초기화
    const timeline = TimelinePlugin.create({
      container: timelineContainerRef.current,
      height,
      primaryLabelInterval,
      secondaryLabelInterval,
      timeInterval,
    }) as unknown as GenericPlugin; // 타입 단언 추가

    // 플러그인을 등록
    wavesurfer.registerPlugin(timeline);

    return () => {
      timeline.destroy(); // 플러그인 정리
    };
  }, [
    wavesurfer,
    height,
    primaryLabelInterval,
    secondaryLabelInterval,
    timeInterval,
  ]);

  return (
    <div ref={timelineContainerRef} className="h-full w-full bg-gray-800" />
  );
};

export default Timeline;
