# Cosmic Helix Renderer

Static HTML + Canvas scene layering four forms of sacred geometry. Works fully offline.

## Files
- `index.html` – entry point; open directly in a browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional color palette; missing file triggers fallback.
- `README_RENDERER.md` – this guide.

## Usage
1. Keep the three files together.
2. Double-click `index.html` (no server or network needed).
3. The 1440x900 canvas renders, in order:
   - Vesica circle field
   - Tree-of-Life nodes and paths
   - Fibonacci spiral polyline
   - Static double-helix lattice
4. If `palette.json` is absent, the header shows a notice and safe colors are used.

## Palette
`data/palette.json` format:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Remove or edit the file to test fallback colors.

## ND-safe choices
- No animation or flashing elements.
- Calm contrast and generous spacing for readability.
- Layer order preserves depth without 3D effects.
- Geometry counts use numerology constants `3, 7, 9, 11, 22, 33, 99, 144`.
