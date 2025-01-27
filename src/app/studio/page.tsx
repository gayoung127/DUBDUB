"use client";

import Header from "../_components/Header";
import { socket } from "../_utils/socketClient";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import RecordSectionTest from "./_components/RecordSectionTest";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import TeamRole from "./_components/TeamRole";
import VideoPlayer from "./_components/VideoPlayer";

export default function StudioPage() {
  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const name = "아무개";

    socket.emit("cursorMove", { x, y, name });
  };

  return (
    <>
      <div
        onPointerMove={handlePointerMove}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div className="relative flex h-full min-h-screen w-full flex-col items-start justify-start">
          <div className="flex h-full w-full flex-row">
            <div className="flex h-full w-full flex-1 flex-col items-start justify-start">
              <Header />
              <div className="flex h-full w-full flex-1 flex-row items-center justify-start">
                <StudioSideTab />
                <VideoPlayer />
              </div>
            </div>
            <div className="flex h-full w-[440px] flex-shrink-0 flex-col bg-gray-400">
              <TeamRole />
              <StudioScript />
            </div>
          </div>
          <RecordSectionTest />
        </div>
        <CursorPresence />
      </div>
    </>
  );
}
