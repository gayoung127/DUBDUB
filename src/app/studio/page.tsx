import Header from "../_components/Header";
import CursorPresence from "./_components/CursorPresence";
import RecordSection from "./_components/RecordSection";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import TeamRole from "./_components/TeamRole";
import VideoPlayer from "./_components/VideoPlayer";

export default function StudioPage() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-start justify-start">
      <CursorPresence />
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
      <RecordSection />
    </div>
  );
}
