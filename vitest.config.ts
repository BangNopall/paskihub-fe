import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Minimal node environment since we test schemas
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
