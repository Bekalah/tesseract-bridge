# Cosmic Helix Renderer

Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvases, loads the renderer module, paints the octagram fallback, and mounts optional hero art.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `assets/js/first-paint-octagram.js` – chapel-safe first paint to ensure a calm field if hero art is offline.
- `assets/js/art-loader.js` – manifest-driven WEBP loader with ND-safe fallbacks.
- `assets/art/manifest.json` – declares the live WEBP hero asset (relative paths keep it offline-friendly).
- `data/palette.json` – optional palette override; missing file triggers a safe fallback notice.
- `scripts/verify-absent.mjs` – guard executed before builds to ensure forbidden PNG masters stay absent.
- `README_RENDERER.md` – this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. A 1440x900 canvas renders, in order:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. The octagram canvas (`#opus`) paints immediately, so visitors perceive the chapel geometry even if hero art or network requests stall.
5. If `assets/art/black-madonna-altar-1600.webp` is present, the manifest loader displays it; otherwise `#hero-art` shows a calm fallback note while the octagram remains visible.
6. The header status line reports palette or hero-art fallbacks as they happen, and `renderHelix` writes the same notes onto the geometry canvas.

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

When launched via `file://`, browsers often block local fetches; the renderer therefore skips the palette request and displays the inline notice while using the defaults. To preview custom palettes, either adjust the defaults inside `index.html` or launch a temporary local server.

## Guards and health checks
- `.gitattributes` disables LFS filters for PNG to prevent accidental smudging.
- `.gitignore` blocks `assets/art/black-madonna-altar-1600.png` from returning.
- `scripts/verify-absent.mjs` exits non-zero if the forbidden PNG reappears. It runs via the `prebuild` npm script and can be invoked manually with `node scripts/verify-absent.mjs`.
- `core/health-check.html` offers an offline diagnostics page to confirm build timestamp and whether Netlify gating is active.

## ND-safe choices
- No animation, autoplay, or network dependencies beyond optional manifest fetches (which gracefully fail when offline).
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica → Tree → Fibonacci → Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
- Octagram fallback and WEBP-only manifest prevent PNG resurrection while keeping the public shell beautiful.
