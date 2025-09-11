# Cosmic Helix Renderer

Offline, ND-safe HTML canvas visualizer for layered sacred geometry. Double-click `index.html` in any browser to view.

## Layers
1. **Vesica field** – 3x3 circle grid for intersecting fields.
2. **Tree-of-Life** – 10 sephirot and 22 paths, simplified layout.
3. **Fibonacci curve** – static spiral polyline reaching 144 units.
4. **Double-helix lattice** – two phase-shifted sine strands with 33 rungs.

## Palette
Colors are loaded from `data/palette.json`. If missing, a safe fallback palette is used and a status note is shown.

## ND-safe Choices
- No animation or flashing.
- Soft contrast with readable ink on dark field.
- Pure ES modules, no dependencies, works fully offline.
- Geometry uses numerology constants (3,7,9,11,22,33,99,144).

## Local Use
1. Ensure this repository is on disk (no build step).
2. Double-click `index.html` or open it via `file:///` in a browser.
3. Optionally edit `data/palette.json` to customize colors.
