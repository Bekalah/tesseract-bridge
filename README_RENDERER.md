# Cosmic Helix Renderer (Offline, ND-safe)

Static HTML + Canvas scene that layers the Cathedral cosmology without motion.
Open `index.html` directly in any modern browser to view the composition offline.
The renderer remains ND-safe: calm contrast, no flashing, and all geometry remains
layered rather than flattened.

## Files
- `index.html` – entry document that loads the palette, reports status, and
  invokes the renderer against a 1440x900 canvas.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for the Vesica
  field, Tree-of-Life scaffold, Fibonacci curve, and static double helix.
- `data/palette.json` – optional palette override. Missing files trigger a muted
  notice while ND-safe defaults render the layers.
- `README_RENDERER.md` – this usage guide.

## Usage
1. Keep the directory structure exactly as-is.
2. Double-click `index.html`. No build step or server is required.
3. The canvas paints the four layers in this order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `data/palette.json` is absent or blocked (common under `file://` security),
   the header explains the fallback and the canvas shows a calm inline notice
   while defaults are applied.

### Palette format
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the palette file to customize colors, or delete it to exercise the fallback
notice. The renderer only reads local JSON; there are no remote requests or
external dependencies.

## ND-safe choices
- No animation or autoplay; the canvas paints once on load.
- Calm contrast, layered order, and generous spacing for readability.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144`
  to honor the cosmology brief.
