import type { NextConfig } from "next";
import dotenv from "dotenv";

dotenv.config({ path: ".env-fe" });

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/, // 폰트 파일 처리
        type: "asset/resource", // Webpack 5의 기본 방식으로 처리
        generator: {
          filename: "static/fonts/[name][ext]", // 빌드 시 폰트 파일 위치 지정
        },
      },
    );

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bucket-dubdub.s3.ap-northeast-2.amazonaws.com",
      },
    ],
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
