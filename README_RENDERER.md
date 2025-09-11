# Cosmic Helix Renderer

Static HTML + Canvas renderer for layered sacred geometry. Designed for offline use and ND-safe presentation.

## Files
- `index.html` – main entry; open directly in any modern browser.
- `js/helix-renderer.mjs` – ES module that draws the four layers.
- `data/palette.json` – optional color palette. Delete or edit to adjust colors.

## Layers
1. **Vesica field** – two intersecting circles creating the vesica piscis.
2. **Tree-of-Life** – ten nodes and twenty-two paths in a simplified grid.
3. **Fibonacci curve** – logarithmic spiral approximated by a polyline.
4. **Double-helix lattice** – twin sine strands with cross ties.

The order and calm palette avoid flicker and provide clear contrast. Nothing animates; all geometry is static.

## Usage
Double-click `index.html`. If `palette.json` is missing, the renderer falls back to safe defaults and reports this inline. No network or build step is required.
