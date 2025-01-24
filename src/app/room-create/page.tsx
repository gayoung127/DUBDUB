"use client";
import React from "react";
import Header from "../_components/Header";
import Badge from "../_components/Badge";
import BreadCrumb from "../_components/Breadcrumb";
import Script from "./_ components/Script";
import Video from "./_ components/Video";
import Description from "./_ components/Description";
import Left from "./_ components/Left";

export default function page() {
  return (
    <div className="bg-white-100">
      <div>
        <Header />
      </div>
      <div>
        <Left />
      </div>
      <div>
        <Video />
        <Description />
      </div>
      <div>
        <Script />
      </div>
    </div>
  );
}
