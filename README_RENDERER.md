# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
- `index.html` - entry document that instantiates the 1440x900 canvas and loads the helix renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override; missing file triggers a safe fallback notice.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A 1440x900 canvas renders, in order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `data/palette.json` is absent, the header reports the fallback and a calm on-canvas notice is drawn while defaults are used.

When launched via `file://`, browsers often block local fetches. To respect the "no network" covenant, the loader skips fetches
in that context and renders with the defaults plus the on-canvas notice. To preview custom palettes, either adjust the defaults
inside `index.html` or launch a local server temporarily and open the same files there.

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

## ND-safe choices
- No animation or autoplay; only a single static canvas render.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
