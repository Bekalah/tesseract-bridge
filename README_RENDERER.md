# Cosmic Helix Renderer

Static HTML+Canvas experiment for layered sacred geometry. The renderer is
non-moving, ND-safe, and works entirely offline.

## Usage
1. Double-click `index.html` in a desktop file manager.
2. A 1440x900 canvas appears with four layers:


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


Static HTML+Canvas sketch encoding a layered cosmology. Works fully offline with no dependencies.

## Files
- `index.html` — entry point; open directly in a browser.
- `js/helix-renderer.mjs` — ES module drawing the four geometry layers.
- `data/palette.json` — optional color palette; modify for custom schemes.

## Usage
1. Clone or copy these files.
2. Double-click `index.html` (no server required).
3. The canvas renders:
   - Vesica circle grid
   - Tree-of-Life nodes and paths
   - Fibonacci spiral polyline
   - Static double-helix lattice

If `data/palette.json` is missing, a safe default palette is used and a notice appears in the header.

## ND-safe choices
- No motion or animation; reduces sensory load.
- Calm contrast palette defined in `palette.json`.
- Layers are drawn back-to-front for depth without 3D effects.

All code uses plain ES modules, UTF-8, ASCII quotes, and can be inspected or extended without tooling.


Static, offline HTML+Canvas demo encoding layered sacred geometry.

## Files
- `index.html` – main entry; open directly in a browser.
- `js/helix-renderer.mjs` – small ES module with pure drawing routines.
- `data/palette.json` – optional color palette; removed or renamed for fallback.
- `README_RENDERER.md` – usage notes.

## Use (offline)
1. Download repo or copy files locally.
2. Double-click `index.html` – no server or network required.
3. If `data/palette.json` is missing, a calm default palette is used and noted onscreen.

## Layer order
1. Vesica field
2. Tree-of-Life nodes and paths
3. Fibonacci curve (log spiral polyline)
4. Static double-helix lattice

## ND-safe choices
- No motion or animation; everything renders once.
- Soft contrast and generous spacing for readability.
- Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 shape geometry.
- Offline-only; no external scripts or network requests.
=======
r for layered sacred geometry. Designed for offline use and ND safety.

## Use
- Double-click `index.html` in any modern browser.
- A 1440x900 canvas renders four layers:
  1. Vesica field
  2. Tree-of-Life nodes and paths
  3. Fibonacci curve
  4. Static double-helix lattice
- No motion, autoplay, or network requests.

## Palette
`data/palette.json` supplies colors. If missing, a calm fallback palette is used and a notice is shown inline.

## Rationale
Comments in `js/helix-renderer.mjs` explain layer order and ND-safe choices (soft contrast, static rendering).

## Customizing
Adjust numerology constants or palette values to explore different geometries. Keep functions pure and static for accessibility.


Static, offline-first Canvas renderer for layered sacred geometry.

## Usage
1. Open `index.html` directly in a modern browser.
2. A 1440x900 canvas will display:


   - Vesica field
   - Tree-of-Life scaffold
   - Fibonacci curve
   - Static double-helix lattice


No network calls are made. If `data/palette.json` is missing the script falls
back to a built-in palette and notes the absence in the page header.

## Design Notes
- Calm contrast and soft colors for readability.
- Geometry and loop counts parameterized by numerology constants
  (3, 7, 9, 11, 22, 33, 99, 144).
- No animation or external dependencies to respect offline and sensory safety.

3. No network requests or external libraries are used.

## Palette
Colors are stored in `data/palette.json`. If the file is missing, safe defaults are used.

## ND-Safe Choices
- No motion or autoplay
- Calm contrast with high readability
- Layer order mirrors symbolic depth


Static HTML + Canvas renderer for layered sacred geometry. ND-safe and offline.

## Layers
1. **Vesica field** – intersecting circles in a gentle grid.
2. **Tree-of-Life scaffold** – 10 nodes, 22 paths.
3. **Fibonacci curve** – logarithmic spiral polyline.
4. **Double-helix lattice** – two sine strands with cross-links.

## Usage
- Requires no build step or network.
- Open `index.html` directly in any modern browser.
- If `data/palette.json` is missing, a calm fallback palette is used.

## ND-safe Notes
- No motion, autoplay, or flashing.
- Soft contrast palette and generous spacing.
- Layer order preserves depth without flattening geometry.
 =======
Offline HTML + Canvas demo that layers sacred geometry. ND-safe: no motion, calm palette, high readability. Double-click `index.html` to view.

## Layers
1. **Vesica field** – two intersecting circles framing the space.
2. **Tree-of-Life scaffold** – ten nodes and twenty-two paths in the classic layout.
3. **Fibonacci curve** – static golden spiral polyline, no animation.
4. **Double-helix lattice** – two sine waves with crossbars, phase-shifted but still.

Numerology constants (3,7,9,11,22,33,99,144) parameterize sizes and counts for reproducible proportion.

## Palette
Colors are in `data/palette.json`. Delete or edit to customize. Missing files trigger a safe fallback message and default hues.

## Local Use
- Requires only a modern browser.
- Open `index.html` directly; no server or network.
- If geometry ever feels overwhelming, simply close the tab (Safe Stop).

## Why No Animation?
Motion can be overstimulating. This renderer prefers stillness so attention can rest gently on layered depth.






