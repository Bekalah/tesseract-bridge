# Cosmic Helix Renderer

Static HTML+Canvas viewer for layered sacred geometry. Works offline and respects ND-safe principles:

- **No motion:** all layers render once on load.
- **Readable contrast:** calm palette from `data/palette.json`.
- **Layered order:** Vesica field → Tree-of-Life → Fibonacci curve → double-helix lattice.

## Usage

1. Double-click `index.html` in any modern browser.
2. If `data/palette.json` is missing, a safe fallback palette is used and a note appears.
3. No network requests or dependencies.

## Files

- `index.html` – entry point and status note.
- `js/helix-renderer.mjs` – small pure functions that draw each layer.
- `data/palette.json` – optional color palette (UTF-8, no comments).

## Numerology Constants

Geometry routines reference familiar numbers: 3, 7, 9, 11, 22, 33, 99, 144. These guide circle counts, spiral steps, and lattice bars.

## Why ND-safe?

The renderer avoids flashing, animation, and color extremes to reduce sensory load. Layers are drawn sequentially so geometry remains legible.
