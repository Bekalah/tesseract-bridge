# Cosmic Helix Renderer

Static, offline HTML+Canvas scene layering four forms of sacred geometry. Works without network or dependencies and avoids motion for ND safety.
Static HTML + Canvas scene layering four forms of sacred geometry. Works fully offline.

## Files
- `index.html` – entry page; open directly in a modern browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional color palette; missing file triggers safe fallback.
- `data/palette.json` – optional colors; missing file triggers a calm fallback.
- `README_RENDERER.md` – this guide.

## Usage
1. Keep the files together.
2. Double-click `index.html` (no server or network needed).
3. The 1440x900 canvas renders, in order:
   - Vesica field
   - Vesica circle field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `palette.json` is absent, the header shows a notice and default colors are used.
   - Vesica circle field
   - Tree-of-Life nodes and paths
   - Fibonacci spiral polyline
   - Static double-helix lattice
4. If `palette.json` is absent, the header shows a notice and safe colors are used.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to adjust colors or remove it to test the fallback.

## ND-safe choices
- No animation or autoplay.
- Calm contrast and generous spacing for readability.
- Layer order preserves depth without flattening.
- Geometry counts use numerology constants `3, 7, 9, 11, 22, 33, 99, 144`.
Edit `data/palette.json` to customize colors or remove it to test the fallback.

## ND-safe choices
- No animation or autoplay.
- Calm contrast and soft tones for readability.
- Geometry counts use numerology constants `3, 7, 9, 11, 22, 33, 99, 144` for proportions.
- Layer order preserves depth without flattening.

