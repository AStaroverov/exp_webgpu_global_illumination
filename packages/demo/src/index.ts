// Unified demo page — every renderer scene + the engine physics scene behind one GUI
// switcher. Selection comes from the ?scene= URL param (linkable) or localStorage;
// switching rewrites the param and reloads. The demo bodies are dynamic imports so the
// renderer scenes don't pay for the Rapier WASM bundle.

import type GUI from "lil-gui";
import { SCENE_OPTIONS } from "../../renderer/src/demo/scenes/index.ts";

const DEMO_OPTIONS = [...SCENE_OPTIONS, "physics"] as const;
type DemoName = (typeof DEMO_OPTIONS)[number];

function isDemoName(v: string | null): v is DemoName {
  return (DEMO_OPTIONS as readonly string[]).includes(v ?? "");
}

const fromUrl = new URL(location.href).searchParams.get("scene");
const saved = localStorage.getItem("demo.scene");
const scene: DemoName = isDemoName(fromUrl) ? fromUrl : isDemoName(saved) ? saved : "showcase";

function setupDemoGUI(gui: GUI): void {
  gui
    .add({ scene }, "scene", DEMO_OPTIONS as unknown as string[])
    .name("scene")
    .onChange((v: string) => {
      localStorage.setItem("demo.scene", v);
      const url = new URL(location.href);
      url.searchParams.set("scene", v);
      location.href = url.toString();
    });
}

async function main(): Promise<void> {
  localStorage.setItem("demo.scene", scene);
  const hud = document.getElementById("hud")!;
  if (scene === "physics") {
    hud.innerHTML = "engine — Rapier 3D physics driving the renderer (2.5D SDF) · voxel-GI sun";
    const { runEngineDemo } = await import("../../engine/src/runDemo.ts");
    await runEngineDemo({ setupDemoGUI });
  } else {
    hud.innerHTML =
      "renderer3d — 2.5D true-3D-SDF · orthographic tilted top-down · raymarched, " +
      "real-depth sorted (reverse-Z) · voxel-GI lighting · drag to orbit, wheel to zoom, WASD to pan";
    const { runRendererDemo } = await import("../../renderer/src/demo/run.ts");
    await runRendererDemo({ scene, setupDemoGUI });
  }
}

main().catch((err) => {
  document.body.innerHTML = `<pre style="color:#f88;padding:20px">${(err as Error)?.stack ?? err}</pre>`;
  console.error(err);
});
