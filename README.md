# exp_webgpu_global_illumination

**▶ Live demos: https://astaroverov.github.io/exp_webgpu_global_illumination/**
_(needs a WebGPU browser — Chrome/Edge desktop)_

A from-scratch **WebGPU renderer with real-time voxel global illumination**, plus
a small ECS engine that drives it with 3D physics. A personal hobby experiment —
no Three.js, no game frameworks, hand-written WGSL end to end.

## What's inside

- **`packages/renderer`** — an SDF renderer built for **top-down camera games**: the
  scene is authored in 2D-ish layers but the shapes are true 3D SDFs, raymarched
  into a G-buffer under a tilted orthographic top-down camera (reverse-Z) and lit
  by **voxel cone tracing GI**: scene voxelization → radiance pyramid
  (+ anisotropic mips against light leaks) → screen-space probes with temporal
  accumulation → cone resolve → composite. Emissive shapes are real light
  sources; the sun casts soft distance-field shadows with physically growing
  penumbra.
- **`packages/engine`** — ECS (`bitecs`) + **Rapier 3D physics running in a Web
  Worker over SharedArrayBuffer**, driving the renderer's transforms. Z-up world,
  fixed-step worker sim, lock-free SAB channels for ops/poses/hits.
- **`packages/demo`** — the unified demo page deployed to GitHub Pages: every
  renderer scene + the physics scene behind one GUI switcher (`?scene=` is
  linkable).
- **`packages/common`** — shared SAB utilities. **`packages/game`** — WIP game
  prototype scenes on top of the engine.

## The demos

| Scene | What it shows |
| --- | --- |
| `showcase` | one of every SDF shape kind + several emitters |
| `emitter` | a movable/resizable light emitter vs a box occluder |
| `final` | the animated "final" scene |
| `swarm` | many small lights (round-robin subsampling + clustered light culling) |
| `perf` / `perf2` | GPU-cost harnesses with per-pass toggles and timestamp timings |
| `physics` | Rapier 3D gravity sandbox — spawn boxes/spheres (optionally emissive) onto a plane |

Controls: drag to orbit, wheel to zoom, WASD/arrows to pan. The GUI exposes the
full GI configuration (voxel size, cone/probe budgets, temporal hysteresis, sun,
exposure…) with live per-pass GPU timings.

## Running locally

```bash
npm install
npm run dev --workspace=demo      # unified demo page (all scenes)
```

Deployment note: the physics scene needs `SharedArrayBuffer`, i.e. a
cross-origin-isolated page. The dev/preview servers send real COOP/COEP headers;
on GitHub Pages (which can't) `coi-serviceworker` emulates them client-side.
Deploys run from `.github/workflows/deploy.yml` on pushes to `main`.

## Status

Active personal experiment — APIs, package names, and the scenes change freely
as I explore. Shared as a record of what I'm tinkering with, not as a product.
