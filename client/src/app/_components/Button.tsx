"use client";
import React from "react";

interface ButtonProps {
  outline?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  small?: boolean;
  large?: boolean;
  disabled?: boolean;
  // type?: "button" | "submit" | "reset";
}

const Button = ({
  outline,
  onClick,
  children,
  className,
  small,
  large,
  disabled,
  // type = "button",
}: ButtonProps) => {
  const sizeClass = small
    ? "text-sm px-3 py-2"
    : large
      ? "text-lg px-6 py-3"
      : "text-base px-4 py-2";

  return (
    <button
      className={`rounded-[8px] ${sizeClass} ${
        disabled
          ? "cursor-not-allowed bg-white-300 text-gray-100"
          : outline
            ? "bg-white shadow-md border border-brand-200 text-brand-200 hover:border hover:bg-brand-100"
            : "bg-brand-200 text-white-100 hover:bg-brand-300"
      } ${className}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
