"use client";
import React from "react";

interface ButtonProps {
  outline?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ outline, onClick, children }: ButtonProps) => {
  return (
    <button
      className={`rounded-[8px] px-4 py-2 ${outline ? `border-brand-200 text-brand-200 hover:border-brand-200 bg-white shadow-md hover:border` : `bg-brand-200 text-white-100 hover:bg-brand-300`}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
