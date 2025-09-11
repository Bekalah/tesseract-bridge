# Cosmic Helix Renderer

Static offline HTML+Canvas renderer for layered sacred geometry used in Cathedral of Circuits.

## Use
- Open `index.html` directly in a browser (no server).
- Canvas (1440x900) draws four layers:
  1. Vesica grid
  2. Tree-of-Life nodes and paths
  3. Fibonacci curve
  4. Static double-helix lattice
- Colors come from `data/palette.json`. If the file is missing, a fallback palette loads and a small notice appears in the header.

## ND-safe choices
- No motion, no autoplay, and gentle contrast tones.
- Geometry scales by numerology constants (3, 7, 9, 11, 22, 33, 99, 144) to honor project structure.
- Works completely offline and issues no external network requests.
