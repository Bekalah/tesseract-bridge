# Cosmic Helix Renderer

This small offline renderer draws a four-layered cosmology on a single 1440×900 canvas. It uses no libraries and is designed for ND-safe calm viewing.

## Layers
1. **Vesica field** – two intersecting circles.
2. **Tree-of-Life scaffold** – ten sephirot and twenty-two connecting paths.
3. **Fibonacci curve** – static logarithmic spiral polyline.
4. **Double-helix lattice** – two phase-shifted sine waves.

## Usage
1. Ensure all files remain in their relative folders:
   - `index.html`
   - `js/helix-renderer.mjs`
   - `data/palette.json`
2. Double-click `index.html` in any modern browser.
3. If `data/palette.json` is missing, a safe fallback palette is used and a note appears.

## ND-safe notes
- No animation, timers, or network requests.
- Calm palette with clear contrast.
- Geometry functions are parameterised with numerology constants 3,7,9,11,22,33,99,144.
