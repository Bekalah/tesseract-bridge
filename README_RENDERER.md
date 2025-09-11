# Cosmic Helix Renderer

Static, offline HTML+Canvas renderer for layered sacred geometry. Designed per ND-safe guidelines: calm contrast, no motion, and clear ordering of layers.

## Files
- `index.html` – entry point; open directly in any modern browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional color palette override.

## Usage
1. Double-click `index.html`.
2. If `data/palette.json` exists, its colors are used. Missing files fall back to safe defaults and a notice appears.
3. A 1440×900 canvas renders four layers:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice

No network requests, no animation, no build step.

