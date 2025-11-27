import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import pluginNext from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
// import pluginImport from "eslint-plugin-import";
import pluginA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
// import unusedImports from 'eslint-plugin-unused-imports';
import globals from "globals";
import tseslint from "typescript-eslint";

// ---------------------------------------------------
// BASE EXPORT
// ---------------------------------------------------

export default defineConfig([
  // ---------------------------------------------------
  // Base JS / TS Rules
  // ---------------------------------------------------
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      // Basic code quality rules
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      // 'no-duplicate-imports': 'error',
      // 'no-var': 'error',
      // 'prefer-const': 'error',
      // 'prefer-arrow-callback': 'error',
      // 'object-shorthand': 'error',
    },
  },

  // ---------------------------------------------------
  // TypeScript
  // ---------------------------------------------------
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylistic,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // '@typescript-eslint/no-unused-vars': [
      //   'error',
      //   {
      //     argsIgnorePattern: '^_',
      //     varsIgnorePattern: '^_',
      //     caughtErrorsIgnorePattern: '^_',
      //   },
      // ],
      "@typescript-eslint/no-useless-catch": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      // "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      // "@typescript-eslint/prefer-optional-chain": "error",
      // "@typescript-eslint/no-non-null-assertion": "warn",
      // "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      // "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      // "@typescript-eslint/prefer-nullish-coalescing": "error",
      // "@typescript-eslint/prefer-as-const": "error",
      // "@typescript-eslint/no-unnecessary-condition": "error",
      // "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },

  // ---------------------------------------------------
  // React
  // ---------------------------------------------------
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: pluginReact },
    extends: [pluginReact.configs.flat.recommended],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // 'react/prop-types': 'off', // TypeScript handles this
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-pascal-case": "error",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-children-prop": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      // 'react/hook-use-state': 'error',
      "react/jsx-no-leaked-render": "error",
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // ---------------------------------------------------
  // Next.js
  // ---------------------------------------------------
  {
    ...pluginNext.configs.recommended,
    rules: {
      ...pluginNext.configs.recommended.rules,
      // '@next/next/no-html-link-for-pages': 'error',
      // '@next/next/no-img-element': 'warn',
      // '@next/next/no-sync-scripts': 'error',
      // '@next/next/no-unwanted-polyfillio': 'error',
    },
  },

  // ---------------------------------------------------
  // Accessibility
  // ---------------------------------------------------
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { "jsx-a11y": pluginA11y },
    rules: {
      ...pluginA11y.configs.recommended.rules,
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/anchor-has-content": "off",
    },
  },

  // ---------------------------------------------------
  // IMPORT ORDER + AUTO FIX
  // ---------------------------------------------------
  // {
  //   plugins: { import: pluginImport },
  //   rules: {
  //     "import/order": [
  //       "error",
  //       {
  //         groups: [
  //           "builtin",
  //           "external",
  //           "internal",
  //           ["parent", "sibling", "index"],
  //           "object",
  //           "type",
  //         ],
  //         pathGroups: [
  //           {
  //             pattern: "react",
  //             group: "external",
  //             position: "before",
  //           },
  //           {
  //             pattern: "next/**",
  //             group: "external",
  //             position: "before",
  //           },
  //           {
  //             pattern: "@/**",
  //             group: "internal",
  //           },
  //         ],
  //         pathGroupsExcludedImportTypes: ["react"],
  //         "newlines-between": "always",
  //         alphabetize: {
  //           order: "asc",
  //           caseInsensitive: true,
  //           orderImportKind: "asc",
  //         },
  //         warnOnUnassignedImports: true,
  //       },
  //     ],
  //     "import/no-unresolved": "error",
  //     "import/no-duplicates": "error",
  //     "import/no-cycle": "error",
  //     "import/no-self-import": "error",
  //     "import/no-useless-path-segments": "error",
  //     "import/first": "error",
  //     "import/newline-after-import": "error",
  //   },
  //   settings: {
  //     "import/resolver": {
  //       typescript: {
  //         alwaysTryTypes: true,
  //         project: "./tsconfig.json",
  //       },
  //     },
  //   },
  // },

  // ---------------------------------------------------
  // AUTO REMOVE UNUSED IMPORTS & VARS
  // ---------------------------------------------------
  // {
  //   plugins: { 'unused-imports': unusedImports },
  //   rules: {
  //     'unused-imports/no-unused-imports': 'error',
  //     'unused-imports/no-unused-vars': [
  //       'error', // Changed from warn to error for stricter enforcement
  //       {
  //         vars: 'all',
  //         varsIgnorePattern: '^_',
  //         args: 'after-used',
  //         argsIgnorePattern: '^_',
  //         caughtErrors: 'all',
  //         caughtErrorsIgnorePattern: '^_',
  //       },
  //     ],
  //   },
  // },

  // ---------------------------------------------------
  // SECURITY & BEST PRACTICES
  // ---------------------------------------------------
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // 'no-eval': 'error',
      // 'no-implied-eval': 'error',
      // 'no-new-func': 'error',
      // 'no-script-url': 'error',
    },
  },

  // ---------------------------------------------------
  // JSON
  // ---------------------------------------------------
  {
    files: ["**/*.json"],
    plugins: { json },
    extends: ["json/recommended"],
    language: "json/json",
  },

  // ---------------------------------------------------
  // Markdown
  // ---------------------------------------------------
  {
    files: ["**/*.md"],
    plugins: { markdown },
    extends: ["markdown/recommended"],
    language: "markdown/gfm",
  },

  // ---------------------------------------------------
  // CSS
  // ---------------------------------------------------
  {
    files: ["**/*.css"],
    plugins: { css },
    extends: ["css/recommended"],
    language: "css/css",
  },

  // ---------------------------------------------------
  // QUOTES & FORMATTING (Align with Prettier)
  // ---------------------------------------------------
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      quotes: ["error", "double", { avoidEscape: true }],
      "jsx-quotes": ["error", "prefer-double"],

      // Other formatting rules that align with Prettier
      semi: ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
    },
  },

  // ---------------------------------------------------
  // PRETTIER (must be last)
  // ---------------------------------------------------
  {
    files: ["**/*.{js,jsx,ts,tsx,json,css,md}"],
    plugins: {
      prettier: eslintPluginPrettier, // Add this import
    },
    extends: [prettier],
    rules: {
      "prettier/prettier": "error",
    },
  },

  // ---------------------------------------------------
  // IGNORES
  // ---------------------------------------------------
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".next/**",
      "coverage/**",
      "*.min.js",
      "*.d.ts",
    ],
  },
]);
