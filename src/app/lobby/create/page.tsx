"use client";
import React from "react";
import Description from "./_ components/Description";
import Genre from "./_ components/Genre";
import Play from "./_ components/Play";
import Role from "./_ components/Role";
import Schedule from "./_ components/Schedule";
import Title from "./_ components/Title";
import Type from "./_ components/Type";
import Video from "./_ components/Video";
import Script from "./_ components/Script";
import Header from "@/app/_components/Header";

export default function page() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-start">
      <div className="flex h-auto w-full items-start justify-start">
        <Header />
      </div>
      <div className="flex h-full w-full flex-row items-start justify-start">
        <div className="flex h-full w-1/3 flex-col items-start justify-start">
          <Title />
          <Play />
          <Schedule />
          <Role />
          <Type />
          <Genre />
        </div>
        <div className="flex h-full w-1/3 flex-col items-center justify-start">
          <div className="mb-10 flex h-auto w-full items-center justify-center">
            <Video />
          </div>
          <div className="flex h-auto w-full items-center justify-center">
            <Description />
          </div>
        </div>
        <div className="flex h-full w-1/3 items-start justify-end">
          <Script />
        </div>
      </div>
    </div>
  );
}
