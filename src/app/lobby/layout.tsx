"use client";
import Header from "../_components/Header";
import Filter from "@/app/lobby/_components/Filter";
import TabMenu from "@/app/lobby/_components/TabMenu";
import Button from "@/app/_components/Button";

const LobbyLayout = ({ children }: { children: React.ReactNode }) => {
  function handleCreateRoom() {
    alert("방 생성 이동");
  }

  return (
    <>
      <section className="flex min-h-screen flex-col items-center overflow-hidden">
        <Header />
        <div className="flex min-h-screen w-full bg-white-bg">
          <div className="justify-centerpl-3 flex flex-[2] items-center">
            <Filter />
          </div>
          <div className="w-full flex-[8]">
            <div className="p-5">
              <div className="flex w-full justify-between border-b border-gray-500 px-5 pb-3">
                <TabMenu />
                <Button onClick={handleCreateRoom}>+ 더빙룸 생성하기</Button>
              </div>
            </div>
          </div>
          {children}
        </div>
      </section>
    </>
  );
};
export default LobbyLayout;
