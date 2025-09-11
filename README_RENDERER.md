# Cosmic Helix Renderer

Static HTML+Canvas renderer for layered sacred geometry. ND-safe, offline, no dependencies.

## Files
- `index.html` — entry point; open directly in a browser.
- `js/helix-renderer.mjs` — ES module implementing the four geometry layers.
- `data/palette.json` — optional palette override; delete or edit to change colors.

## Usage
1. Ensure all files remain in the same directory structure.
2. Double-click `index.html` in any modern browser.
3. If `data/palette.json` is missing, a calm default palette is used and a note shows.

## Geometry Layers
1. **Vesica field** — two circles with a septenary grid.
2. **Tree of Life** — ten sephirot, twenty-two connecting paths.
3. **Fibonacci curve** — static spiral using sequence up to 144.
4. **Double-helix lattice** — two phase-shifted sinusoids with 33 rungs.

## ND-Safe Considerations
- No animation, strobe, or autoplay elements.
- Soft contrast palette avoids glare while keeping text legible.
- Canvas size fixed at 1440×900 to avoid unexpected scaling.

## Editing
All geometry parameters reference numerology constants (3,7,9,11,22,33,99,144).
Adjust them in `index.html` if different proportions are needed.
