import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

const eslintConfig = defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/*",
    ".next/*",
    "public/*",
    "commitlint.config.js",
    "commitlint.config.ts",
    "eslint.config.mjs",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "tsconfig.*.json",
    "babel.config.js",
    ".eslintrc.js",
    ".eslintignore",
    ".prettierrc.js",
    ".stylelintrc.js",
  ]),
  {
    files: ["**/*.{ts,tsx,jsx,js}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unknown-property": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "error",
      "react/no-unescaped-entities": "off",
      "no-console": "warn",
      "no-useless-escape": "off",
      "react/no-unescaped-entities": "off",
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);

export default eslintConfig;
