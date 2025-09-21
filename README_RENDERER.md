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
