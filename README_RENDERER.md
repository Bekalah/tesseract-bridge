# Cosmic Helix Renderer

Static, offline canvas renderer that expresses layered cosmology:

1. **Vesica field**
2. **Tree-of-Life scaffold**
3. **Fibonacci curve**
4. **Double-helix lattice**

## Usage

1. Ensure `index.html`, `js/helix-renderer.mjs`, and `data/palette.json` are kept together.
2. Double-click `index.html` in any modern browser.
3. If `palette.json` is missing, the page renders with a built-in ND-safe fallback.

## Palette

`data/palette.json` lets you tweak colors without touching code. All hues are calm and high-contrast. No external requests are made.

## ND-Safe Choices

- No motion or animation; every layer is static.
- Soft contrasts and layered order to avoid visual overload.
- Works entirely offline; no network or build step required.

## Geometry Notes

The renderer parameterizes proportions with numerology constants: 3, 7, 9, 11, 22, 33, 99, and 144. See code comments for rationale.

