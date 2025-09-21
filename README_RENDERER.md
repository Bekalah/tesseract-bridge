# Cosmic Helix Renderer & Integration Hub

Static, offline HTML + Canvas composition layering four sacred geometry systems and an accompanying integration hub fed by the bridge manifest. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – main document with integration hub layout, manifest-driven repo cards, and the helix renderer canvas.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each sacred geometry layer.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice.
Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
=
StaticStatic, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
>>>>>>>+main/codex/orga
ex.html` – entry document that sets up the helix renderer and handles palette fallbacks.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `data/palette.json` – optional palette override; missing file triggers a safe fallback notice.
Static, offline HTML + Canvas composition that layers the vesica field, Tree-of-Life scaffold, Fibonacci sweep, and a static double-helix lattice. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvas, loads the palette, and calls the renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer plus fallback notice rendering.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice and defaults.
- `README_RENDERER.md` – this usage guide.
Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
- `index.html` - entry document that instantiates the 1440x900 canvas and loads the helix renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override; missing file triggers a safe fallback notice.
- `index.html` - entry document that sets up the canvas and palette loader, then calls the helix renderer.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override; missing file triggers an inline fallback notice.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
<<<<<<< main
3. The 3. The Integration Hub section reads `registry/notes/bridge_manifest.json` via JSON modules and renders one card per repo. Missing data produces a gentle inline notice and keeps the layout calm.
4. A 1440x900 canvas renders, in order:
>>>>>>>+main
/codex/organize-project-directory-structure
3. A 1440x900 canvas renders, in order:
   - Vesica field
3. A 1440x900 canvas renders, in order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
<<<<<<< main
4. If `4. If `data/palette.json` is absent, the header reports the fallback and a calm on-canvas notice is drawn while defaults are used.
4. If `data/palette.json` is absent or blocked, the header reports the fallback and a calm on-canvas notice is drawn while defaults are used.

When launched via `file://`, browsers often block local fetches. To respect the "no network" covenant, the loader skips fetches
in that context and renders with the defaults plus the on-canvas notice. To preview custom palettes, either adjust the defaults
inside `index.html` or launch a local server temporarily and open the same files there.
4. If `data/palette.json` is absent, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults
are used.
4. The header reports palette status. When the palette file is missing or blocked (common when opened via `file://`), a muted inline notice is drawn on the canvas while defaults are used.
>>>>>>>+main
palette.4. If `data/palette.json` is absent, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults
are used.
>>>>>>>+main/codex/orga
lette.json` structure:

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
<<<<<<< main
- No an- No animation or autoplay; only local JSON module reads.
## ND-safe choices
- No animation or autoplay; only a single static canvas render.
Edit the file to customize colors, or delete it to exercise the fallback notice. The renderer only fetches the palette when not running under `file://`; otherwise it applies the defaults immediately for offline safety.

## ND-safe choices
- No animation or autoplay; the canvas paints once on load.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
>>>>>>>+main
/codex/organize-project-directory-structure
- No animation or autoplay; static layering only.
- Calm contrast, layered order, and generous spacing for readability.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
# Cosmic Helix Renderer & Integration Hub

<<<<<<<+main
Static, offline HTML + Canvas composition layering four sacred geometry systems and an accompanying integration hub fed by the bridge manifest. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – main document with integration hub layout, manifest-driven repo cards, and the helix renderer canvas.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each sacred geometry layer.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice.
Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
=
StaticStatic, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
>>>>>>>+main/codex/orga
ex.html` – entry document that sets up the helix renderer and handles palette fallbacks.
ry document that sets up the canvas and invokes the helix renderer.
>>>>>>> main/codex/add-error-handling-for-sendmessage-method
- `index.html` – entry document that sets up the canvases, loads the renderer module, paints the octagram fallback, and mounts optional hero art.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `assets/js/first-paint-octagram.js` – chapel-safe first paint to ensure a calm field if hero art is offline.
- `assets/js/art-loader.js` – manifest-driven WEBP loader with ND-safe fallbacks.
- `assets/art/manifest.json` – declares the live WEBP hero asset (relative paths keep it offline-friendly).
- `data/palette.json` – optional palette override; missing file triggers a safe fallback notice.
Static, offline HTML + Canvas composition that layers the vesica field, Tree-of-Life scaffold, Fibonacci sweep, and a static double-helix lattice. The scene avoids motion and harsh contrast for ND safety and runs by simply opening `index.html`.

## Files
- `index.html` – entry document that sets up the canvas, loads the palette, and calls the renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer plus fallback notice rendering.
- `data/palette.json` – optional palette override; missing file triggers a calm fallback notice and defaults.
- `index.html` – entry document that sets up the canvas and palette fallback before invoking the helix renderer.
- `js/helix-renderer.mjs` – ES module with pure drawing routines for each layer.
- `data/palette.json` – optional palette override; missing file triggers a calm inline notice while defaults are used.
- `scripts/verify-absent.mjs` – guard executed before builds to ensure forbidden PNG masters stay absent.
- `README_RENDERER.md` – this usage guide.
Static, offline HTML + Canvas composition layering four sacred geometry systems. The scene avoids motion and harsh contrast for
ND safety and runs by simply opening `index.html`.

## Files
- `index.html` - entry document that instantiates the 1440x900 canvas and loads the helix renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override; missing file triggers a safe fallback notice.
- `index.html` - entry document that mounts the 1440x900 canvas and calls the renderer module.
- `js/helix-renderer.mjs` - ES module with pure drawing routines for each layer.
- `data/palette.json` - optional palette override consumed via JSON modules; missing files trigger a calm fallback.
- `README_RENDERER.md` - this usage guide.

## Usage
1. Keep all files in the same directory structure.
2. Double-click `index.html` (no server or network required).
<<<<<<< main
3. The 3. The Integration Hub section reads `registry/notes/bridge_manifest.json` via JSON modules and renders one card per repo. Missing data produces a gentle inline notice and keeps the layout calm.
4. A 1440x900 canvas renders, in order:
>>>>>>>+main
/codex/organize-project-directory-structure
3. A 1440x900 canvas renders, in order:
   - Vesica field
3. A 1440x900 canvas renders, in order:
   - Vesica field (interlocking circles)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
<<<<<<< main
4. If `4. If `data/palette.json` is absent, the header reports the fallback and a calm on-canvas notice is drawn while defaults are used.
4. If `data/palette.json` is absent or malformed, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults are used.
3. A single canvas renders, in order:
   - Vesica field (intersecting grid)
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
<<<<<<< main
4. The header reports whether the optional palette loaded. Missing or unsupported JSON modules fall back to defaults, and the canvas prints a small notice box for clarity.
4. If `data/palette.json` is absent, the header reports the fallback and a muted on-canvas notice appears while defaults remain active.
4. The octagram canvas (`#opus`) paints immediately, so visitors perceive the chapel geometry even if hero art or network requests stall.
5. If `assets/art/black-madonna-altar-1600.webp` is present, the manifest loader displays it; otherwise `#hero-art` shows a calm fallback note while the octagram remains visible.
6. The header status line reports palette or hero-art fallbacks as they happen, and `renderHelix` writes the same notes onto the geometry canvas.

When launched via `file://`, browsers often block local fetches. To respect the "no network" covenant, the loader skips fetches
in that context and renders with the defaults plus the on-canvas notice. To preview custom palettes, either adjust the defaults
inside `index.html` or launch a local server temporarily and open the same files there.
4. If `data/palette.json` is absent, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults
are used.
4. The header reports palette status. When the palette file is missing or blocked (common when opened via `file://`), a muted inline notice is drawn on the canvas while defaults are used.
>>>>>>>+main
palette.4. If `data/palette.json` is absent, the header reports the fallback and a calm inline notice is drawn on-canvas while defaults
are used.
>>>>>>>+main/codex/orga
lette.json` structure:

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
<<<<<<< main
- No an- No animation or autoplay; only local JSON module reads.
## ND-safe choices
- No animation or autoplay; only a single static canvas render.
Edit the file to customize colors, or delete it to exercise the fallback notice. The renderer only fetches the palette when not running under `file://`; otherwise it applies the defaults immediately for offline safety.

## ND-safe choices
- No animation or autoplay; the canvas paints once on load.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
>>>>>>>+main
/codex/organize-project-directory-structure
- No animation or autoplay; static layering only.
When launched via `file://`, browsers often block local fetches; the renderer therefore skips the request and displays the inline notice while using the defaults. To preview custom palettes, either adjust the defaults inside `index.html` or launch a temporary local server and open the same files there.

## ND-safe choices
- No animation or autoplay; only a single draw pass.
When launched via `file://`, browsers often block local fetches; the renderer therefore skips the palette request and displays the inline notice while using the defaults. To preview custom palettes, either adjust the defaults inside `index.html` or launch a temporary local server.

## Guards and health checks
- `.gitattributes` disables LFS filters for PNG to prevent accidental smudging.
- `.gitignore` blocks `assets/art/black-madonna-altar-1600.png` from returning.
- `scripts/verify-absent.mjs` exits non-zero if the forbidden PNG reappears. It runs via the `prebuild` npm script and can be invoked manually with `node scripts/verify-absent.mjs`.
- `core/health-check.html` offers an offline diagnostics page to confirm build timestamp and whether Netlify gating is active.

## ND-safe choices
- No animation, autoplay, or network dependencies beyond optional manifest fetches (which gracefully fail when offline).
- Calm contrast, layered order, and generous spacing for readability.
Edit the file to customize colors. Browsers that support JSON modules (modern Chromium, Firefox, and Safari) will load the palette even when opened via `file://`. Older browsers fall back gracefully while drawing the notice overlay.

## ND-safe choices
- No animation or autoplay; only a single render pass.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
When launched via `file://`, browsers often block local fetches; the renderer therefore skips the palette request and uses the defaults automatically. To preview custom palettes without a server, tweak the defaults in `index.html` and re-open the file.

## ND-safe choices
- No animation or autoplay; the canvas paints once with layered geometry.
- Calm contrast, layered order, and generous spacing preserve readability.
- Layer hierarchy (Vesica → Tree → Fibonacci → Helix) keeps geometry multi-layered rather than flattened.
Edit the file to customize colors. When launched via `file://`, browsers often block local fetches; the renderer therefore skips the request and displays the inline notice while using the defaults. To preview custom palettes, either adjust the defaults inside `index.html` or launch a temporary local server and open the same files there.

## ND-safe choices
- No animation or autoplay; only a single canvas render pass.
- Calm contrast, layered order, and generous spacing for readability.
- Layer hierarchy (Vesica -> Tree -> Fibonacci -> Helix) keeps geometry multi-layered rather than flattened.
- Geometry counts align with numerology constants `3, 7, 9, 11, 22, 33, 99, 144` to honor the cosmology brief.
- Notices appear inside muted panels to communicate fallbacks without flashing or startling color shifts.
- Octagram fallback and WEBP-only manifest prevent PNG resurrection while keeping the public shell beautiful.
