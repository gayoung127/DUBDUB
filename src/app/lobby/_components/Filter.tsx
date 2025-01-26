"use client";
import { useState } from "react";
import FilteredArea from "@/app/lobby/_components/FilteredArea";
import H3 from "@/app/_components/H3";
import H4 from "@/app/_components/H4";

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
    <div className="shadow-dub flex h-fit w-[300px] flex-col gap-4 rounded-[4px] bg-white-100 p-3">
      <FilteredArea />

      <div className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <input
            type="text"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="검색어를 입력하세요"
          />
        </div>
      </div>
      <div className="mb-4">
        <H3 className="mb-2 font-semibold">참여 시간</H3>
        <div className="grid grid-cols-2">
          {times.map((time) => (
            <label key={time} className="flex items-center gap-3">
              <input
                className="h-5 w-5 accent-brand-300"
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
        <H3 className="mb-2 py-1 font-semibold">영상 유형</H3>
        <div className="grid grid-cols-2 gap-4">
          {types.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                className="h-5 w-5 accent-brand-300"
                type="checkbox"
                name="time"
                value={type}
                checked={typeFilter.includes(type)}
                onChange={() => {
                  handleTypeChange(type);
                }}
              />
              <H4 className="py-1">{type}</H4>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <H3 className="mb-2 py-1 font-semibold">영상 장르</H3>
        <div className="grid grid-cols-2 gap-4">
          {genres.map((genre) => (
            <label key={genre} className="flex items-center gap-2">
              <input
                className="h-5 w-5 accent-brand-300"
                type="checkbox"
                name="time"
                value={genre}
                checked={genreFilter.includes(genre)}
                onChange={() => {
                  handleGenreChange(genre);
                }}
              />
              <H4 className="py-1">{genre}</H4>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
