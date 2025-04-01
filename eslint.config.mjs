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
      // 放松React Hook缺失依赖规则
      // "react-hooks/exhaustive-deps": "warn",
      // 允许使用any类型
      "@typescript-eslint/no-explicit-any": "warn",
      // 放松未使用变量规则
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "varsIgnorePattern": "^_", 
        "argsIgnorePattern": "^_" 
      }]
    }
  }
];

export default eslintConfig;
