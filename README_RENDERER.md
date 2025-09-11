# Cosmic Helix Renderer

Static HTML+Canvas renderer for layered sacred geometry (offline, ND-safe).

## Files
- `index.html` — entry point; open directly.
- `js/helix-renderer.mjs` — geometry routines; no dependencies.
- `data/palette.json` — optional palette; renderer falls back if missing.

## Usage
Double-click `index.html` in any modern browser. A 1440×900 canvas renders four layers:
1. Vesica field
2. Tree-of-Life nodes and paths
3. Fibonacci curve
4. Static double-helix lattice

No network requests, motion, or flashing. Colors are calm and readable. If the palette file is absent, a safe inline palette is used and a notice appears.

## ND-safe Notes
- All geometry is static; no animation loops.
- High contrast yet soft tones for readability without glare.
- Layer order and numerology constants (3,7,9,11,22,33,99,144) are commented in the code for research tracing.

Works offline; no build step or server required.
