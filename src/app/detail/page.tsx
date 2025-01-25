import Header from "../_components/Header";
import DubbingInfo from "./_components/DubbingInfo";
import Role from "./_components/Role";
import ScriptSection from "./_components/ScriptSection";
import ScriptBox from "./_components/ScriptSection";
import UserActionButton from "./_components/UserActionButton";

export default function RoomDetailPage() {
  return (
    <div className="flex h-full w-full flex-col items-center bg-white-bg">
      <Header />
      <main className="p-6">
        <div className="flex w-full max-w-screen-xl flex-row justify-center gap-4 p-6">
          <div className="flex flex-col gap-2 p-1">
            <DubbingInfo />
            <Role />
          </div>
          <ScriptSection />
        </div>
        <UserActionButton />
      </main>
    </div>
  );
}
