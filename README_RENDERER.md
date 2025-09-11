# Cosmic Helix Renderer

Static offline renderer for layered sacred geometry. Designed for calm, ND-safe study environments.

## Files
- `index.html` – entry point; open directly.
- `js/helix-renderer.mjs` – drawing routines (ES module, no dependencies).
- `data/palette.json` – optional color palette. If removed, default colors are used.

## Layers
1. Vesica field (two intersecting circles)
2. Tree-of-Life scaffold (10 nodes, 22 paths)
3. Fibonacci curve (approximate log spiral)
4. Double-helix lattice (two phase-shifted sine waves)

All geometry is static: no animation, network, or interaction.

## Local use
1. Ensure all files stay in the same folder structure.
2. Double-click `index.html` or open it in any modern browser.
3. If `palette.json` is missing, a safe fallback palette is used and noted in the header.

## ND-safe choices
- Soft contrast palette, readable text.
- No flashing, motion, or autoplay.
- Comments in code explain each layer and parameter.
