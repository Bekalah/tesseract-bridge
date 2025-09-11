# Cosmic Helix Renderer

Static HTML+Canvas scene rendering layered geometry. Works offline—open `index.html` directly.

## Layers
1. **Vesica field** – grid of intersecting circles (3×7) as soft background.
2. **Tree-of-Life scaffold** – 10 nodes and 22 paths drawn with gentle lines.
3. **Fibonacci curve** – single logarithmic spiral scaled by 144°.
4. **Double-helix lattice** – two sine waves with 33 rungs, no motion.

## Usage
- Open `index.html` in any modern browser; no server or network required.
- Optional palette override: edit `data/palette.json`.
- If palette file is missing, renderer uses safe built‑in colors and shows a small notice.

## ND-Safe Notes
- No animation or external libraries.
- Soft contrast palette; layers drawn in calm order for readability.
- Geometry constants: 3, 7, 9, 11, 22, 33, 99, 144.
