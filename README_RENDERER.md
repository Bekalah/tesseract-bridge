# Cosmic Helix Renderer

Static, offline HTML+Canvas demo encoding layered sacred geometry.

## Files
- `index.html` – main entry; open directly in a browser.
- `js/helix-renderer.mjs` – small ES module with pure drawing routines.
- `data/palette.json` – optional color palette; removed or renamed for fallback.
- `README_RENDERER.md` – usage notes.

## Use (offline)
1. Download repo or copy files locally.
2. Double-click `index.html` – no server or network required.
3. If `data/palette.json` is missing, a calm default palette is used and noted onscreen.

## Layer order
1. Vesica field
2. Tree-of-Life nodes and paths
3. Fibonacci curve (log spiral polyline)
4. Static double-helix lattice

## ND-safe choices
- No motion or animation; everything renders once.
- Soft contrast and generous spacing for readability.
- Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 shape geometry.
- Offline-only; no external scripts or network requests.
