// Standalone entry for the engine package's dev page (index.html). The demo itself lives in
// runDemo.ts (shared with the unified `demo` package, which adds a scene switcher on top).

import { runEngineDemo } from "./runDemo.ts";

runEngineDemo().catch((err) => {
  document.body.innerHTML = `<pre style="color:#f88;padding:20px">${(err as Error)?.stack ?? err}</pre>`;
  console.error(err);
});
