# Cosmic Helix Renderer

Static HTML+Canvas experiment for layered sacred geometry. The renderer is
non-moving, ND-safe, and works entirely offline.

## Usage
1. Double-click `index.html` in a desktop file manager.
2. A 1440x900 canvas appears with four layers:
   - Vesica field
   - Tree-of-Life scaffold
   - Fibonacci curve
   - Static double-helix lattice

No network calls are made. If `data/palette.json` is missing the script falls
back to a built-in palette and notes the absence in the page header.

## Design Notes
- Calm contrast and soft colors for readability.
- Geometry and loop counts parameterized by numerology constants
  (3, 7, 9, 11, 22, 33, 99, 144).
- No animation or external dependencies to respect offline and sensory safety.
