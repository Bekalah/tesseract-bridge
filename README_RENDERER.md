# Cosmic Helix Renderer

This tiny offline module draws layered sacred geometry to an HTML5 canvas.
No build tools or network calls are required.

## Files
- `index.html` – entry page with a 1440x900 canvas
- `js/helix-renderer.mjs` – ES module with pure functions for each layer
- `data/palette.json` – optional palette override

## Use
1. Double-click `index.html` in any modern browser.
2. If `data/palette.json` is present, its colors are used.
   If missing, a safe fallback palette is applied and a notice appears.
3. The canvas renders four calm layers: vesica field, Tree-of-Life nodes and paths,
   Fibonacci curve, and a static double-helix lattice.

## Notes on ND safety
- No animation or motion is used.
- Colors are soft with high contrast against the dark background.
- Geometry parameters use numerology constants (3, 7, 9, 11, 22, 33, 99, 144).
- The renderer works entirely offline for a predictable experience.
