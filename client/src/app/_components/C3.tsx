import React from "react";

const C3 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <span className={`text-[10px] font-normal leading-none ${className}`}>
      {children}
    </span>
  );
};

export default C3;
