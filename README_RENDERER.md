# Cosmic Helix Renderer

Static HTML + Canvas renderer for layered sacred geometry. Designed for offline use and ND safety.

## Use
- Double-click `index.html` in any modern browser.
- A 1440x900 canvas renders four layers:
  1. Vesica field
  2. Tree-of-Life nodes and paths
  3. Fibonacci curve
  4. Static double-helix lattice
- No motion, autoplay, or network requests.

## Palette
`data/palette.json` supplies colors. If missing, a calm fallback palette is used and a notice is shown inline.

## Rationale
Comments in `js/helix-renderer.mjs` explain layer order and ND-safe choices (soft contrast, static rendering).

## Customizing
Adjust numerology constants or palette values to explore different geometries. Keep functions pure and static for accessibility.
