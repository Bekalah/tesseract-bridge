# Cosmic Helix Renderer

Static, ND-safe HTML+Canvas scene layering four forms of sacred geometry. Works fully offline.

## Layers
1. **Vesica field** – intersecting circles forming a calm grid.
2. **Tree-of-Life scaffold** – ten nodes and twenty-two paths.
3. **Fibonacci curve** – logarithmic spiral polyline.
4. **Double-helix lattice** – two sine strands with crossbars.

## Usage
1. Keep `index.html`, `js/helix-renderer.mjs`, and `data/palette.json` together.
2. Double-click `index.html` in any modern browser (no server or network).
3. If `palette.json` is missing, a fallback palette is used and noted inline.

## Palette
`data/palette.json` contains colors:
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```
Edit values to customize hues.

## ND-safe choices
- No motion or autoplay; scene renders once.
- Soft contrast with readable tones.
- Geometry counts and proportions use numerology constants `3,7,9,11,22,33,99,144`.
- Layer order preserves depth without flattening geometry.
