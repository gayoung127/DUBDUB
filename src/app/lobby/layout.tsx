"use client";
import Header from "../_components/Header";

const LobbyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-white-bg">
      <Header />
      {children}
    </div>
  );
};
export default LobbyLayout;
