import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          900: "#000000",
          400: "#1d1d1d",
          300: "#303030",
          200: "#414141",
          100: "#6d6d6d",
        },
        white: {
          900: "#ffffff",
          300: "#efefef",
          200: "#f6f6f6",
          100: "#fefefe",
          bg: "#f8f8f8",
        },
        brand: {
          300: "#cc7052",
          200: "#ff8c66",
          100: "#ffeee8",
        },
      },
      keyframes: {
        flowText: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        flowText: "flowText 5s linear infinite",
      },
    },
    boxShadow: {
      dub: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
    },
  },
  plugins: [],
} satisfies Config;
