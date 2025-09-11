# Cosmic Helix Renderer

Static HTML+Canvas sketch encoding a layered cosmology. Works fully offline with no dependencies.

## Files
- `index.html` — entry point; open directly in a browser.
- `js/helix-renderer.mjs` — ES module drawing the four geometry layers.
- `data/palette.json` — optional color palette; modify for custom schemes.

## Usage
1. Clone or copy these files.
2. Double-click `index.html` (no server required).
3. The canvas renders:
   - Vesica circle grid
   - Tree-of-Life nodes and paths
   - Fibonacci spiral polyline
   - Static double-helix lattice

If `data/palette.json` is missing, a safe default palette is used and a notice appears in the header.

## ND-safe choices
- No motion or animation; reduces sensory load.
- Calm contrast palette defined in `palette.json`.
- Layers are drawn back-to-front for depth without 3D effects.

All code uses plain ES modules, UTF-8, ASCII quotes, and can be inspected or extended without tooling.
