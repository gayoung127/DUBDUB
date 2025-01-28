import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/jsx-key": "warn", // 경고로 변경
      "@next/next/no-img-element": "off", // <img> 태그 사용 허용
      "@typescript-eslint/no-explicit-any": "off", // any 타입 허용
      "react-hooks/exhaustive-deps": "warn", // React Hook 의존성 경고로 변경
      "jsx-a11y/alt-text": "warn", // alt 속성 누락 경고로 변경
    },
  },
];

export default eslintConfig;
