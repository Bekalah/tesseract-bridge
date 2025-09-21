# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for ND safety and renders by simply opening `index.html`.

## Files
- `index.html` - entry document that mounts the 1440x900 canvas, loads the palette, and calls the renderer.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer plus the default palette export.
- `data/palette.json` - optional palette override; missing files trigger a calm inline notice while defaults are used.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. The 1440x900 canvas renders, in order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `data/palette.json` is absent or blocked (common under `file://` security), the header reports the fallback and a muted inline notice appears on the canvas while ND-safe defaults are applied.

`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the palette file to customize colors, or delete it to exercise the fallback notice. The renderer only reads local JSON; there are no remote requests or external dependencies.

## ND-safe choices
- No animation or autoplay; the canvas paints once on load.
- Calm contrast, layered order, and generous spacing for readability.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
# Cosmic Helix Renderer (Offline, ND-safe)

A lightweight HTML + Canvas scene that layers four pieces of sacred geometry with
calm, ND-safe colors. Open `index.html` directly; no tooling, bundlers, or
network calls are required. The renderer breathes in four tiers that echo the
Cathedral cosmology and keeps geometry multi-layered rather than flattened.

## Files
- `index.html` - entry document that loads the palette, reports status, and
  invokes the renderer against a 1440x900 canvas.
- `js/helix-renderer.mjs` - ES module with pure drawing functions for the
  Vesica field, Tree-of-Life scaffold, Fibonacci curve, and static double helix.
- `data/palette.json` - optional palette override; missing files trigger an
  inline notice and calm defaults.

## Usage
1. Keep the directory structure exactly as-is.
2. Double-click `index.html`. Browsers opened via `file://` simply use the
   default palette and annotate the canvas with the fallback notice.
3. Update `data/palette.json` to experiment with colors. Remove it to verify the
   fallback renders.

## Preparing for Fly.io
- Manual deploys only. From a local terminal run:
  - `flyctl launch --no-deploy` (once) to create the app configuration.
  - `flyctl deploy --config fly.toml` when you are ready to publish.
- Keep assets static. Fly will serve the same `index.html`, module, and data
  files without build tooling.
- The included `fly.toml` uses a minimal static file server so the offline-first
  experience matches local double-click previews.

## ND-safe Choices
- No animation, no autoplay, no flashing colors.
- Calm contrast and layered geometry order (Vesica -> Tree -> Fibonacci -> Helix).
- Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide layout spacing.
- Inline notices explain fallbacks instead of raising alerts or blocking.
