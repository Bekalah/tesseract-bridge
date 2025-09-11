# Cosmic Helix Renderer

Static, offline HTML + Canvas component that renders layered sacred geometry.

## Features
- **Vesica field:** three intersecting circles.
- **Tree-of-Life:** ten sephirot and twenty-two paths.
- **Fibonacci curve:** static logarithmic spiral.
- **Double-helix lattice:** two sine curves with crossbars.
- ND-safe palette with no motion or network requests.

## Usage
1. Keep `index.html`, `js/helix-renderer.mjs`, `data/palette.json` together.
2. Double-click `index.html` in any modern browser.
3. If `palette.json` is missing, a fallback palette is used and a notice appears.

## Palette
Customize colors by editing `data/palette.json`:
```json
{
  "bg": "#0b0b12",
  "ink": "#e8e8f0",
  "layers": ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
}
```

## ND-safe Rationale
- No animation or flashing elements.
- Calm contrast and soft tones.
- Layer order mirrors body (Vesica), mind (Tree), soul (Fibonacci), spirit (Helix).
- Geometry constants include 3, 7, 9, 11, 22, 33, 99, and 144.
