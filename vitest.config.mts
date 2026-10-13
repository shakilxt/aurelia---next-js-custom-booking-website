import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
    // UTC+14: date code that accidentally uses local time shifts by a day here and fails.
    env: { TZ: "Pacific/Kiritimati" },
  },
});
