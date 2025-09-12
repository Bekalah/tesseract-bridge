# Cosmic Helix Renderer

Static offline HTML+Canvas sketch encoding a layered cosmology. ND-safe: no motion, no network, soft contrast.

## Layers
1. **Vesica field** – intersecting circles grid.
2. **Tree-of-Life** – ten sephirot with twenty-two paths.
3. **Fibonacci curve** – static logarithmic spiral.
4. **Double-helix lattice** – two sine strands with crossbars.

## Usage
1. Keep `index.html`, `js/helix-renderer.mjs`, and `data/palette.json` together.
2. Double-click `index.html` in any modern browser.
3. If `palette.json` is missing, a calm fallback palette is used and a note appears in the header.

## Palette
```
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```
Edit `data/palette.json` to customize colors or remove it to test the fallback.

## ND-safe Choices
- No animation or flashing elements.
- Calm contrast and generous spacing for readability.
- Geometry counts use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
- Layer order preserves depth without flattening.
