"use client";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full grow flex-col overflow-hidden bg-white-bg">
      {children}
    </div>
  );
};

export default MyPageLayout;
