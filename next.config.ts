import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: ".env-fe" });

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  env: {
    NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY:
      process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY,
    NEXT_PUBLIC_KAKAO_CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    NEXT_PUBLIC_KAKAO_REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
};

export default nextConfig;
