import React from "react";

const C2 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <span className={`text-[12px] font-normal leading-none ${className}`}>
      {children}
    </span>
  );
};

export default C2;
