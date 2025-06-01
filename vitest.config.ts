import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      provider: "v8",
      exclude: ["**/demos/**", "**/dist/**", "**/*.config.ts"],
    },
  },
});
