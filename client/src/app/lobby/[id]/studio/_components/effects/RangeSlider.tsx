import React, { useState } from "react";
import C3 from "@/app/_components/C3";

interface RangeSliderProps {
  title: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

function RangeSlider({
  title,
  unit,
  min,
  max,
  step = 1,
  value,
  onChange,
}: RangeSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full justify-between text-white-100">
        <C3>{title}</C3>
        <C3>
          {sliderValue} {unit}
        </C3>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        className="h-2 w-full appearance-none rounded-lg bg-gray-300 accent-brand-200 focus:outline-none"
        style={{
          background: `linear-gradient(to right, #EB9D83 ${((sliderValue - min) / (max - min)) * 100}%, gray  ${((sliderValue - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}

export default RangeSlider;
