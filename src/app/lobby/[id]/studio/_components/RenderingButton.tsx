import React, { useEffect, useState } from "react";
import Button from "@/app/_components/Button";
import StopBrandButton from "@/public/images/icons/icon-stop-brand.svg";

import { useRendering } from "@/app/_hooks/useRendering";

const RenderingButton = () => {
  const [isRendering, setIsRendering] = useState(false);
  const { mergeVideoAudio, isProcessing, outputUrl } = useRendering();

  // 렌더링
  async function handleStartRendering() {
    setIsRendering(true);

    // 오디오 파일
    const audio = await fetch("/examples/dummy-audio.mp3");
    const blob = await audio.blob();
    const audioFile = new File([blob], "sampleAudio.mp3", {
      type: "audio/mp3",
    });

    // 비디오 파일
    const video = await fetch("/examples/zzangu.mp4");
    const blob2 = await video.blob();
    const videoFile = new File([blob2], "sampleVideo.mp4", {
      type: "video/mp4",
    });
    mergeVideoAudio(videoFile, audioFile);
  }

  function handleFinishRendering() {
    setIsRendering(false);
  }

  useEffect(() => {
    if (!isProcessing && outputUrl) {
      setIsRendering(false);
      const link = document.createElement("a");
      link.href = outputUrl;
      link.download = "output.webm";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [isProcessing, outputUrl]);

  return (
    <>
      {!isRendering ? (
        <Button
          className="flex items-center justify-center px-2 py-1.5"
          onClick={handleStartRendering}
        >
          동영상 추출하기
        </Button>
      ) : (
        <Button
          outline
          onClick={handleFinishRendering}
          className="flex items-center justify-center gap-2 px-2 py-1.5"
        >
          <div className="flex items-center">
            <StopBrandButton />
          </div>
          추출 중 ...
        </Button>
      )}
    </>
  );
};

export default RenderingButton;
