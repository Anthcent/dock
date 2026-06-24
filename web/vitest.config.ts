import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["dist/**", "vite.config.ts", "vitest.config.ts", "src/main.tsx", "src/types.ts", "src/data/**"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
