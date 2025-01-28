import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
};

export default nextConfig;
