"use client";

import { useEffect, useRef } from "react";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        audioContextRef.current = new AudioContext();
        const audioContext = audioContextRef.current;
        const source = audioContext.createMediaStreamSource(stream);

        analyserRef.current = audioContext.createAnalyser();
        const analyser = analyserRef.current;
        analyser.fftSize = 512;

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        source.connect(analyser);

        const particles = Array.from({ length: 120 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 2,
          dx: (Math.random() - 0.5) * 1.5,
          dy: (Math.random() - 0.5) * 1.5,
          color: `hsl(16, 100%, ${50 + Math.random() * 20}%)`,
        }));

        const drawParticles = () => {
          if (!canvas || !ctx || !analyser || !dataArrayRef.current) return;
          analyser.getByteFrequencyData(dataArrayRef.current);
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          particles.forEach((p, i) => {
            const v = dataArrayRef.current
              ? dataArrayRef.current[i % dataArrayRef.current.length] / 255
              : 0;

            p.y += p.dy * (5 + v * 20);
            if (p.y <= 0 || p.y >= canvas.height) p.dy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * (1 + v * 2), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          animationFrameRef.current = requestAnimationFrame(drawParticles);
        };

        drawParticles();
      });

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export default HeroSection;
