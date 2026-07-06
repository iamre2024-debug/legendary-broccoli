import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/legendary-broccoli/",
  plugins: [react()],
  build: {
    outDir: "dist"
  }
});
