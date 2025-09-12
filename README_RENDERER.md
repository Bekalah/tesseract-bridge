# Cosmic Helix Renderer

Static HTML + Canvas scene layering sacred geometry. Works offline and avoids motion for ND safety.

## Files
- `index.html` – entry point; open directly in a browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional colors; missing file triggers a calm fallback.

## Usage
1. Keep the three files together.
2. Double-click `index.html` (no server or network needed).
3. Canvas renders:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `palette.json` is absent, a notice appears and safe default colors are used.

## ND-safe choices
- No animation or autoplay.
- Calm contrast and soft tones.
- Layer order preserves depth without flattening.
- Geometry uses numerology constants `3, 7, 9, 11, 22, 33, 99, 144` for proportions.

