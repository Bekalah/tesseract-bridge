# Cosmic Helix Renderer

Static, offline HTML + Canvas composition that layers the vesica field, Tree-of-Life scaffold, Fibonacci sweep, and a static double-helix lattice. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvas, loads the palette, and calls the renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer plus fallback notice rendering.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice and defaults.
- `README_RENDERER.md` – this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A 1440x900 canvas renders, in order:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. The header reports palette status. When the palette file is missing or blocked (common when opened via `file://`), a muted inline notice is drawn on the canvas while defaults are used.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to customize colors, or delete it to exercise the fallback notice. The renderer only fetches the palette when not running under `file://`; otherwise it applies the defaults immediately for offline safety.

## ND-safe choices
- No animation or autoplay; the canvas paints once on load.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica → Tree → Fibonacci → Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
