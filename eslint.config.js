import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node, // ✅ use node globals instead of browser
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
  "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    },
  },
]);
