import React from "react";

const C1 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <span className={`text-[14px] font-normal leading-none ${className}`}>
      {children}
    </span>
  );
};

export default C1;
