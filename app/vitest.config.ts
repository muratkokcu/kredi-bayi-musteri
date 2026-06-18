import path from "node:path";
import { defineConfig } from "vitest/config";

// Unit tests run in a plain Node environment (pure finance/format logic).
// Component/E2E tooling is set up later (roadmap 1.1).
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
