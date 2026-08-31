import {
  defineConfig,
} from "vitest/config";

import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/")) {
            return "react";
          }

          if (
            id.includes("node_modules/react-dom/")
            || id.includes("node_modules/react-router-dom/")
          ) {
            return "react";
          }

          if (id.includes("node_modules/@tanstack/react-query/")) {
            return "query";
          }

          if (id.includes("node_modules/axios/")) {
            return "axios";
          }

          if (id.includes("node_modules/lucide-react/")) {
            return "icons";
          }

          return undefined;
        },
      },
    },
  },

  test: {
    environment: "jsdom",

    globals: true,

    setupFiles: [
      "./src/test/setup.ts",
    ],

    css: true,

    clearMocks: true,

    restoreMocks: true,
  },
});