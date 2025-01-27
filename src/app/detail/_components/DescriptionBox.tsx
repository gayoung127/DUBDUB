import React from "react";
interface DescriptionProps {
  description: string;
}

const DescriptionBox = ({ description }: DescriptionProps) => {
  return (
    <div className="white-scrollbar max-h-[168px] min-h-[70px] w-[304px] flex-grow overflow-y-auto overflow-x-hidden break-words rounded-lg border-2 border-zinc-300 bg-white-300 p-2">
      <p className="text-sm tracking-wider">{description}</p>
    </div>
  );
};

export default DescriptionBox;
