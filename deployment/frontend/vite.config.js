import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Module bundler: Vite. Dev server di port 5173, proxy /api ke backend Express.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
