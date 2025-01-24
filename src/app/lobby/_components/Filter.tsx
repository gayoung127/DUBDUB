"use client";
import { useState } from "react";
import FilteredArea from "@/app/lobby/_components/FilteredArea";

const Filter = () => {
  const times = ["ON AIR", "대기 중"];
  const types = [
    "영화",
    "애니메이션",
    "드라마",
    "다큐멘터리",
    "광고/CF",
    "기타",
  ];
  const genres = [
    "액션",
    "스릴러",
    "공포",
    "일상",
    "코믹",
    "로맨스",
    "SF",
    "판타지",
    "기타",
  ];

  const [timeFilter, setTimeFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);

  function handleTimeChange(newTime: string) {
    setTimeFilter(newTime);
  }

  function handleTypeChange(newValue: string) {
    if (typeFilter.includes(newValue)) {
      setTypeFilter((prev) => prev.filter((item) => item != newValue));
    } else {
      setTypeFilter((prev) => [...prev, newValue]);
    }
  }

  function handleGenreChange(newValue: string) {
    if (genreFilter.includes(newValue)) {
      setGenreFilter((prev) => prev.filter((item) => item != newValue));
    } else {
      setGenreFilter((prev) => [...prev, newValue]);
    }
  }

  return (
    <div className="flex h-fit w-[300px] flex-col gap-4 rounded-[4px] border bg-white-100 p-4">
      <FilteredArea />
      <div className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="text"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="검색어를 입력하세요"
          />
        </div>

        <h3 className="mb-2 font-semibold">참여 시간</h3>
        <div className="grid grid-cols-2">
          {times.map((time) => (
            <label key={time} className="flex items-center gap-2">
              <input
                type="radio"
                name="time"
                value={time}
                checked={time === timeFilter}
                onChange={() => {
                  handleTimeChange(time);
                }}
              />
              {time}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-semibold">영상 유형</h3>
        <div className="grid grid-cols-2 gap-2">
          {types.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="time"
                value={type}
                checked={typeFilter.includes(type)}
                onChange={() => {
                  handleTypeChange(type);
                }}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-semibold">영상 장르</h3>
        <div className="grid grid-cols-2 gap-2">
          {genres.map((genre) => (
            <label key={genre} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="time"
                value={genre}
                checked={genreFilter.includes(genre)}
                onChange={() => {
                  handleGenreChange(genre);
                }}
              />
              {genre}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
