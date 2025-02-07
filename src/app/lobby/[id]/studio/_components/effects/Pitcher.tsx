"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";

const Pitcher = () => {
  // 오디오의 재생 속도(피치)를 조절하는 상태를 초기화.
  const [playbackRate, setPlaybackRate] = useState(1);
  // Web Audio API의 AudioContext를 참조하기 위한 useRef 생성
  const audioContextRef = useRef<AudioContext | null>(null);
  // 디코딩된 오디오 데이터를 저장하는 AudioBuffer를 참조하기 위한 useRef
  const audioBuffersRef = useRef<AudioBuffer | null>(null);
  return <div></div>;
};

export default Pitcher;
