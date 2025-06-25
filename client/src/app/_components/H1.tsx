import React from "react";

const H1 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <h1 className={`text-[32px] font-extrabold leading-none ${className}`}>
      {children}
    </h1>
  );
};

export default H1;
