# Cosmic Helix Renderer

Static HTML + Canvas scene layering Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a static double-helix lattice. Works fully offline with no dependencies.

## Files
- `index.html` – entry page; open directly in a modern browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional colors; missing file triggers a safe fallback notice.
- `README_RENDERER.md` – this guide.

## Usage
1. Keep the files together.
2. Double-click `index.html` (no server needed).
3. Canvas renders layers in order:
   - Vesica field
   - Tree-of-Life scaffold
   - Fibonacci curve
   - Static double-helix lattice
4. If `palette.json` is absent, the header shows a notice and default colors are used.

## Palette
`data/palette.json` structure:

```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

Edit or remove the file to test fallback behavior.

## ND-safe choices
- No animation or autoplay.
- Calm contrast and soft tones.
- Layer order preserves depth without flattening.
- Geometry counts use numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
