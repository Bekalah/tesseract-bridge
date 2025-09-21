# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` - entry document that mounts the 1440x900 canvas and calls the renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override consumed via JSON modules; missing files trigger a calm fallback.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A single canvas renders, in order:
   - Vesica field (intersecting grid)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. The header reports whether the optional palette loaded. Missing or unsupported JSON modules fall back to defaults, and the canvas prints a small notice box for clarity.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to customize colors. Browsers that support JSON modules (modern Chromium, Firefox, and Safari) will load the palette even when opened via `file://`. Older browsers fall back gracefully while drawing the notice overlay.

## ND-safe choices
- No animation or autoplay; only a single render pass.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
- Notices appear inside muted panels to communicate fallbacks without flashing or startling color shifts.
