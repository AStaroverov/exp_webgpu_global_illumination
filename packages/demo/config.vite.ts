import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// The engine (physics scene) requires SharedArrayBuffer → the page must be cross-origin
// isolated. Dev/preview servers send real COOP/COEP headers; on GitHub Pages (which can't
// send headers) public/coi-serviceworker.min.js emulates them client-side.
const crossOriginIsolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

export default defineConfig({
  // Deploy-time subpath (e.g. /<repo>/ on GitHub Pages); "/" for local dev.
  base: process.env.BASE_PATH ?? "/",
  plugins: [wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ["@dimforge/rapier3d-simd"],
  },
  server: {
    headers: crossOriginIsolationHeaders,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
  },
  // The physics worker bundle must be ES so vite-plugin-wasm + top-level-await apply inside
  // it (Rapier WASM is imported in the worker). Classic workers can't TLA.
  worker: {
    format: "es",
    plugins: () => [wasm(), topLevelAwait()],
  },
});
