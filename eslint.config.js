import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// Flat config (ESLint 9). Replaces the legacy .eslintrc.cjs.
export default [
  { ignores: ["dist", "dev-dist", "coverage", "landing", "**/*.config.js", "**/*.config.cjs", "**/*.config.ts"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...globals.browser, ...globals.jest },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // TypeScript handles undefined identifiers; the base rule false-positives on types/globals.
      "no-undef": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
