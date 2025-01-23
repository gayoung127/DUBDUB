import Header from "../_components/Header";
import StudioScript from "./_components/StudioScript";
import StudioSideTab from "./_components/StudioSideTab";
import TeamRole from "./_components/TeamRole";
import VideoPlayer from "./_components/VideoPlayer";

export default function StudioPage() {
  return (
    <div className="flex max-h-[540px] w-full flex-1 flex-row">
      <div className="flex flex-1 flex-col items-start justify-start">
        <Header />
        <div className="flex w-full flex-1 flex-row items-center justify-start">
          <StudioSideTab />
          <VideoPlayer />
        </div>
      </div>
      <div className="flex min-w-[440px] max-w-[440px] flex-col bg-gray-400">
        <TeamRole />
        <StudioScript />
      </div>
    </div>
  );
}
