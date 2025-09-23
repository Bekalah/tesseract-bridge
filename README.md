# tesseract-bridge
Central connector for the Cathedral of Circuits. It now runs as a pure JSON API so other repos can stay synchronized without a front-end.

## Service overview
- `server.mjs` provides an Express application that exposes offline registry data at `/registry/*`.
- `/registry` returns a directory listing, while `/registry/:path` streams JSON, CSV (converted to JSON), and NDJSON files directly from `./registry`.
- `/sync` aggregates `registry/ids.json`, `registry/notes/bridge_manifest.json`, and the event queue for quick status polls.
- Every response is JSON; there is no SPA or rendered HTML served by the process.

## Local usage
1. Install dependencies: `npm install`.
2. Start the API: `npm start` (defaults to port 3000).
3. Example checks:
   - `curl http://localhost:3000/registry` → list registry folders/files.
   - `curl http://localhost:3000/registry/ids.json` → parsed registry IDs.
   - `curl http://localhost:3000/sync` → combined manifest + queue snapshot.

## Registry maintenance
- Update `registry/ids.json` before introducing new IDs in downstream repos to keep `core/check_ids.py` happy.
- `registry/notes/bridge_manifest.json` records status for liber-arcanae, liber-arcanae-game, circuitum99, cosmogenesis-learning-engine, and stone-cathedral.
- Run `python3 core/check_ids.py --bridge .` to verify IDs remain consistent.

## Offline geometry renderer
`index.html` and the related assets remain for offline study of the layered geometry (Vesica grid, Tree-of-Life nodes, Fibonacci curve, static helix). Open the file directly; it is not served by the API.

## Fly.io notes
- Deploy manually with `flyctl deploy --config fly.toml` when ready.
- `fly.toml` builds the Docker image defined in `Dockerfile` and keeps autosuspend enabled (`auto_stop_machines = true`, `min_machines_running = 0`).
- Update the Fly app name locally; never commit secrets or automation workflows.

Keep all updates offline-first, trauma-informed, and layered—never flatten the Cathedral geometry.
