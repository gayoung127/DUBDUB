import React from "react";

interface ActionProps {
  onClick: () => void;
  buttonLabel: string;
}

const ActionButton = ({ onClick, buttonLabel }: ActionProps) => {
  return (
    <button
      onClick={onClick}
      className="h-[54px] w-[196px] rounded-[16px] border border-brand-200 px-[5px] py-[15px] text-center text-xl leading-[20px] text-brand-200 hover:border-0 hover:shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:shadow-brand-100"
    >
      {buttonLabel}
    </button>
  );
};

export default ActionButton;
