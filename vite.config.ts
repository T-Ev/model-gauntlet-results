import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: https://t-ev.github.io/model-gauntlet-results/
export default defineConfig({
  plugins: [react()],
  base: "/model-gauntlet-results/",
});
