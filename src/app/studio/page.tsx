import Header from "../_components/Header";
import StudioSideTab from "./_components/StudioSideTab";

export default function StudioPage() {
  return (
    <div className="flex max-h-[540px] w-full flex-1 flex-row">
      <div className="flex flex-1 flex-col items-start justify-start">
        <Header />
        <div className="flex flex-row">
          <StudioSideTab />
          <div>비디오 플레이어</div>
        </div>
      </div>
      <div className="flex min-w-[440px] max-w-[440px] flex-col">
        <div>더빙 역할</div>
        <div>대본</div>
      </div>
    </div>
  );
}
