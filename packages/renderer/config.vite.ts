import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  // Deploy-time subpath (e.g. /<repo>/renderer/ on GitHub Pages); "/" for local dev.
  base: process.env.BASE_PATH ?? "/",
  plugins: [wasm(), topLevelAwait()],
  optimizeDeps: {
    include: ["lodash/fp"],
    exclude: ["@dimforge/rapier2d-simd"],
  },
});
