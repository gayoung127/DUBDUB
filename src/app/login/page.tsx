"use client";

import React from "react";
import Header from "../_components/Header";
import Login from "./_components/Login";
import DynamicBackground from "./_components/DynamicBackground";
import SignUp from "./_components/SignUp";

export default function page() {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-white-bg">
      <Header />
      <main className="flex w-full flex-row gap-4">
        <Login />
        <DynamicBackground />
      </main>
    </div>
  );
}
