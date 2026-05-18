import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages base. Repo name: turnstile.
// In production builds, assets are served from /turnstile/.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/turnstile/" : "/",
  build: {
    target: "es2020",
    sourcemap: false
  },
  server: {
    host: true,
    port: 5173
  }
}));
