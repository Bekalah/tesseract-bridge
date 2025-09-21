# Cosmic Helix Renderer & Integration Hub

Static, offline HTML + Canvas composition layering four sacred geometry systems and an accompanying integration hub fed by the bridge manifest. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – main document with integration hub layout, manifest-driven repo cards, and the helix renderer canvas.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each sacred geometry layer.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice.
- `README_RENDERER.md` – this usage guide.
Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
- `index.html` - entry document that instantiates the 1440x900 canvas and loads the helix renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override; missing file triggers a safe fallback notice.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
3. The Integration Hub section reads `registry/notes/bridge_manifest.json` via JSON modules and renders one card per repo. Missing data produces a gentle inline notice and keeps the layout calm.
4. A 1440x900 canvas renders, in order:
   - Vesica field
3. A 1440x900 canvas renders, in order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
4. If `data/palette.json` is absent, the header reports the fallback and a calm on-canvas notice is drawn while defaults are used.

When launched via `file://`, browsers often block local fetches. To respect the "no network" covenant, the loader skips fetches
in that context and renders with the defaults plus the on-canvas notice. To preview custom palettes, either adjust the defaults
inside `index.html` or launch a local server temporarily and open the same files there.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit the file to customize colors, or delete it to exercise the fallback notice. The module import gracefully fails when the file is missing and records the fallback inside the canvas notices.

## Manifest-driven cards
- Repo cards derive from `registry/notes/bridge_manifest.json`. Update that manifest to change roles, status indicators, bridge focus, or notes.
- Card titles use slug-friendly capitalization with optional overrides defined in `index.html`. Extend the override map if a repo needs a specific display name.
- Link buttons use slug-based Netlify and GitHub URLs; adjust them in the script if a realm uses a different endpoint.

## ND-safe choices
- No animation or autoplay; only local JSON module reads.
## ND-safe choices
- No animation or autoplay; only a single static canvas render.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
