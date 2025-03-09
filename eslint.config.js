import config from "eslint-config-greenflash";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  { ignores: ["eslint.config.js"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          // Use the TypeScript configuration file
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          // Allow resolving node modules
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
];
