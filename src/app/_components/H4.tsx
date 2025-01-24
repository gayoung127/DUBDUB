import React from "react";

const H4 = ({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) => {
  return (
    <h4 className={`text-base font-medium leading-none ${className}`}>
      {children}
    </h4>
  );
};

export default H4;
