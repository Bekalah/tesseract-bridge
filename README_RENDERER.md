# Cosmic Helix Renderer

Offline canvas prototype for layered sacred geometry. Open `index.html` directly; no build step or network needed.

## Files
- `index.html` – sets up a 1440×900 canvas and loads palette + renderer.
- `js/helix-renderer.mjs` – pure ES module drawing Vesica, Tree-of-Life, Fibonacci spiral, and a static double-helix lattice.
- `data/palette.json` – optional color overrides; delete to use built-in safe defaults.

## Design notes
- ND-safe: calm contrast, no motion, readable fonts.
- Layer order: Vesica → Tree → Fibonacci → Helix to preserve depth.
- Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) parameterize spacing and counts.

## Local use
1. Ensure the three files above reside in the same directory structure.
2. Double-click `index.html` in any modern browser.
3. If `data/palette.json` is absent, the renderer falls back to a baked-in palette and shows a notice.
