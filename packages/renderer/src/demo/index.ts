// Standalone entry for the renderer package's dev page (index.html): scene selection is
// persisted in localStorage and switched via a GUI dropdown + reload. The harness itself
// lives in run.ts (shared with the unified `demo` package, which adds the engine demo too).

import { runRendererDemo } from "./run.ts";
import { SCENE_OPTIONS, type SceneName } from "./scenes/index.ts";

const savedScene = localStorage.getItem("demo.scene");
const scene: SceneName = (SCENE_OPTIONS as readonly string[]).includes(savedScene ?? "")
  ? (savedScene as SceneName)
  : "showcase";

runRendererDemo({
  scene,
  setupDemoGUI: (gui) => {
    gui
      .add({ scene }, "scene", SCENE_OPTIONS as unknown as string[])
      .name("scene")
      .onChange((v: string) => {
        localStorage.setItem("demo.scene", v);
        location.reload();
      });
  },
}).catch((err) => {
  document.body.innerHTML = `<pre style="color:#f88;padding:20px">${(err as Error)?.stack ?? err}</pre>`;
  console.error(err);
});
