# Geometry Manifest — Node 072

This manifest records the static layer recipe for the Node 072 renderer. Each layer keeps depth intact and references numerology constants.

1. **Layer 1: Vesica Field**
   - Grid: 9 columns × 7 rows (63 nodes, doubled vesica intersections under 144).
   - Radius ratio: 0.48 relative to cell size to prevent overcrowding.
   - Palette: `layers[0]` from `data/palette.json` or fallback.
2. **Layer 2: Tree of Life Scaffold**
   - Ten sephirot, radius = min(width, height) / 33.
   - Twenty-two connective paths in calm 2px strokes.
   - Palette: `layers[1]` (paths) and `layers[2]` (nodes).
3. **Layer 3: Fibonacci Curve**
   - Three quarter turns using 99 segments for stable curvature.
   - Origin offset: (0.18W, 0.82H) to weave between helix strands.
   - Palette: `layers[3]`.
4. **Layer 4: Double Helix Lattice**
   - 144 segments per strand, amplitude = height × 0.11.
   - Crossbars every 11 steps (~13 rungs) to echo 33 spine motif.
   - Palette: `layers[4]` and `layers[5]`.

All layers are rendered with pure drawing functions; no animation, motion blur, or external dependencies.
