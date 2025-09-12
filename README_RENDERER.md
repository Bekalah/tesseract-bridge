# Cosmic Helix Renderer

Static, offline Canvas scene with layered sacred geometry. No motion, no dependencies.

## Files
- `index.html` — entry page; open directly.
- `js/helix-renderer.mjs` — ES module with drawing routines.
- `data/palette.json` — optional palette; missing file triggers fallback.
- `README_RENDERER.md` — this guide.

## Usage
1. Keep the three files in one folder.
2. Double-click `index.html` in a modern browser.
3. A 1440x900 canvas draws:
   - Vesica circle field
   - Tree-of-Life nodes and paths
   - Fibonacci spiral polyline
   - Static double-helix lattice

If `data/palette.json` is absent, a notice appears and a safe palette is used.

## Palette
`palette.json` structure:
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

## ND-safe choices
- No animation or flashing elements.
- Calm contrast and soft tones.
- Layer order (Vesica -> Tree -> Fibonacci -> Helix) preserves depth without 3D.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 for proportion.
