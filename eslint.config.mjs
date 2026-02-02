import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Perbaikan: Gunakan __filename

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // This tells ESLint to stop looking in parent folders
    root: true,
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Pengaturan untuk resolusi impor TypeScript
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // Selalu coba resolusi tipe TypeScript
          project: "./tsconfig.json", // Referensi ke tsconfig.json untuk alias
        },
      },
    },
    // Aturan untuk impor
    rules: {
      "import/no-unresolved": "error", // Pastikan semua impor valid
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
