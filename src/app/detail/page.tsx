import Header from "../_components/Header";
import DubbingInfo from "./_components/DubbingInfo";
import Role from "./_components/Role";
import Script from "./Script";

export default function RoomDetailPage() {
  return (
    <div className="flex h-full w-full flex-col items-center bg-white-bg">
      <Header />
      <div className="flex w-full max-w-screen-lg flex-row space-x-6 p-6">
        <div className="flex flex-col p-1">
          <DubbingInfo />
          <Role />
        </div>
        <Script />
      </div>
      <div>
        <button>신청하기</button>
      </div>
    </div>
  );
}
