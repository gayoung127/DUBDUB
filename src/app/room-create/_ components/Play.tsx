"use client";
import React from "react";
import { useState } from "react";

const Play = () => {
  const [selected, setSelected] = useState<"alone" | "withOthers" | null>(null);

  const handleClick = (value: "alone" | "withOthers") => {
    setSelected((prev) => (prev === value ? null : value));
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <h2 className="mb-2 text-xl font-bold">PLAY</h2>
      <div className="flex w-full flex-row gap-4">
        <button
          onClick={() => handleClick("alone")}
          className={`flex-1 rounded-full px-2 py-3 text-lg font-medium ${
            selected === "alone"
              ? "bg-brand-200 text-white-100"
              : "border-2 border-brand-200 bg-white-100 text-brand-200"
          }`}
        >
          혼자서 할래요
        </button>
        <button
          onClick={() => handleClick("withOthers")}
          className={`flex-1 rounded-full px-2 py-3 text-lg font-medium ${
            selected === "withOthers"
              ? "bg-brand-200 text-white-100"
              : "border-2 border-brand-200 bg-white-100 text-brand-200"
          }`}
        >
          다른 사람이랑 할래요
        </button>
      </div>
    </div>
  );
};

export default Play;
