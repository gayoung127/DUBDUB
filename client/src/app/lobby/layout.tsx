"use client";

const LobbyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full grow flex-col overflow-hidden">{children}</div>
  );
};

export default LobbyLayout;
