import React from "react";

const H3 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <h3 className={`text-[18px] font-bold leading-none ${className}`}>
      {children}
    </h3>
  );
};

export default H3;
