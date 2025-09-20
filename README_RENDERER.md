# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvases, altar loader, and helix renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `assets/js/first-paint-octagram.js` – draws the octagram first paint while altar art resolves.
- `assets/js/art-loader.js` – fetches the WEBP manifest and mounts the hero art when available.
- `assets/art/manifest.json` – declares the hero WEBP and policy guardrails.
- `data/palette.json` – optional palette override; missing file triggers a safe fallback notice.
- `README_RENDERER.md` – this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A WEBP altar attempts to load above the helix canvas. When offline or blocked, the octagram first paint remains active with a calm notice.
4. A 1440x900 canvas renders, in order:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
5. If `data/palette.json` is absent, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults are used.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to customize colors, or delete it to exercise the fallback notice.

When launched via `file://`, browsers often block local fetches; the renderer therefore skips the request and displays the inline
notice while using the defaults. To preview custom palettes, either adjust the defaults inside `index.html` or launch a local
server temporarily and open the same files there.

## ND-safe choices
- No animation or autoplay; only optional local manifest fetches.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica → Tree → Fibonacci → Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
