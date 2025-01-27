"use client";

import React, { useEffect, useRef } from "react";
import WaveformPlaylist from "waveform-playlist";

const RecordSectionTest: React.FC = () => {
  const playlistContainerRef = useRef<HTMLDivElement | null>(null);
  const playlistRef = useRef<any>(null);

  useEffect(() => {
    if (!playlistContainerRef.current) return;

    // `waveform-playlist` 초기화
    playlistRef.current = new WaveformPlaylist({
      container: playlistContainerRef.current,
      samplesPerPixel: 3000,
      waveHeight: 70,
      mono: true,
      state: "cursor",
      colors: {
        waveOutlineColor: "#E0EFF1",
        timeColor: "grey",
        fadeColor: "black",
      },
      controls: {
        show: true,
        width: 150,
      },
      zoomLevels: [500, 1000, 3000, 5000],
    });

    // 트랙 로드
    playlistRef.current
      .load([
        {
          src: "/examples/happyhappyhappysong.mp3",
          name: "Vocals",
          gain: 0.5,
        },
        {
          src: "/examples/happyhappyhappysong.mp3",
          name: "Drums",
          start: 8.5,
          fadeIn: { duration: 0.5 },
          fadeOut: { shape: "logarithmic", duration: 0.5 },
        },
      ])
      .then(() => {
        console.log("Tracks loaded!");
      });

    return () => {
      playlistRef.current?.clear();
    };
  }, []);

  const handlePlayPause = () => {
    if (playlistRef.current?.isPlaying()) {
      playlistRef.current.pause();
    } else {
      playlistRef.current.play();
    }
  };

  const handleStop = () => {
    playlistRef.current?.stop();
  };

  const handleForward = () => {
    const currentTime = playlistRef.current?.getCurrentTime() || 0;
    playlistRef.current?.setTime(currentTime + 10); // 10초 앞으로
  };

  const handleBackward = () => {
    const currentTime = playlistRef.current?.getCurrentTime() || 0;
    playlistRef.current?.setTime(Math.max(currentTime - 10, 0)); // 10초 뒤로
  };

  return (
    <section className="flex w-full flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-xl font-bold">Waveform Playlist</h2>
      <div ref={playlistContainerRef} className="mb-4 h-[300px] w-full" />
      <div className="flex space-x-4">
        <button
          onClick={handlePlayPause}
          className="text-white rounded bg-blue-500 px-4 py-2"
        >
          Play/Pause
        </button>
        <button
          onClick={handleStop}
          className="text-white rounded bg-red-500 px-4 py-2"
        >
          Stop
        </button>
        <button
          onClick={handleForward}
          className="text-white rounded bg-green-500 px-4 py-2"
        >
          Forward 10s
        </button>
        <button
          onClick={handleBackward}
          className="text-white rounded bg-yellow-500 px-4 py-2"
        >
          Backward 10s
        </button>
      </div>
    </section>
  );
};

export default RecordSectionTest;
