"use client";
import React from "react";

interface ButtonProps {
  outline?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}

const Button = ({ outline, onClick, children, className }: ButtonProps) => {
  return (
    <button
      className={`rounded-[8px] px-4 py-2 ${outline ? `bg-white border-brand-200 text-brand-200 shadow-md hover:border hover:border-brand-200` : `bg-brand-200 text-white-100 hover:bg-brand-300`} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
