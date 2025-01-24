import React from "react";

const H2 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <h2 className={`text-[24px] font-bold leading-none ${className}`}>
      {children}
    </h2>
  );
};

export default H2;
