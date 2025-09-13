# Cosmic Helix Renderer

Static HTML + Canvas scene layering sacred geometry. Works offline and avoids motion for ND safety.

## Files
- `index.html` – entry page; open directly in a modern browser.
- `js/helix-renderer.mjs` – ES module with pure drawing routines.
- `data/palette.json` – optional colors; missing file triggers a calm fallback.
- `README_RENDERER.md` – this guide.

## Usage
1. Keep the files together.
2. Double-click `index.html` (no server or network needed).
3. Canvas renders:
   - Vesica field
   - Tree-of-Life scaffold
   - Fibonacci curve
   - Static double-helix lattice
4. If `palette.json` is absent, a notice appears and safe default colors are used.

## Palette
`data/palette.json` structure:
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```
Edit the file to customize colors or remove it to test the fallback.

## ND-safe choices
- No animation or flashing elements.
- Calm contrast and soft tones.
- Geometry counts use numerology constants `3, 7, 9, 11, 22, 33, 99, 144`.
- Layer order (Vesica → Tree → Fibonacci → Helix) preserves depth without flattening.
