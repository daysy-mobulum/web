import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  server: {
    allowedHosts: ['localhost-vite.mobulum.xyz','daysy.mobulum.com', 'daysy-mobulum.github.io'],
  },
});
