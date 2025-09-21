# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvas and palette fallback before invoking the helix renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `data/palette.json` – optional palette override; missing file triggers a calm inline notice while defaults are used.
- `README_RENDERER.md` – this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A 1440x900 canvas renders, in order:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `data/palette.json` is absent, the header reports the fallback and a muted on-canvas notice appears while defaults remain active.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to customize colors, or delete it to exercise the fallback notice.

When launched via `file://`, browsers often block local fetches; the renderer therefore skips the palette request and uses the defaults automatically. To preview custom palettes without a server, tweak the defaults in `index.html` and re-open the file.

## ND-safe choices
- No animation or autoplay; the canvas paints once with layered geometry.
- Calm contrast, layered order, and generous spacing preserve readability.
- Layer hierarchy (Vesica → Tree → Fibonacci → Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
