# tesseract-bridge
Central connector for the Cathedral of Circuits. It tracks IDs, manifests, and cross-repo rituals so Tarot, rooms, and toggles stay aligned.

## Liber Arcanae Merge Readiness
- See `docs/liber_arcanae_merge_prep.md` for the current preparation checklist covering geometry slots, numerology counts, and ND-safe notes.
- `registry/notes/bridge_manifest.json` records status for liber-arcanae, liber-arcanae-game, circuitum99, cosmogenesis-learning-engine, and stone-cathedral.
- Update `registry/ids.json` before introducing new IDs in downstream repos to keep `core/check_ids.py` happy.

## Quick Verification
1. Run `python3 core/check_ids.py --bridge .` to confirm IDs resolve inside the bridge registry.
2. Review `docs/curation_checklist.md` prior to shipping any Tarot rooms or cards.
3. Open `index.html` directly to confirm the ND-safe renderer still layers Vesica, Tree-of-Life, Fibonacci, and helix without network calls.

Keep all updates offline-first, trauma-informed, and layered—never flatten the Cathedral geometry.
