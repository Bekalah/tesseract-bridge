# Liber Arcanae ↔ Liber Arcanae Game Merge Prep
This guide inventories bridge data so the Tarot codex can merge smoothly with the study game. It respects Cathedral numerology and ND-safe pacing.

## Active Bridge Files
- `registry/ids.json` — canonical IDs for nodes, rooms, arcana, chapels, and shem anchors referenced during merge.
- `registry/maps/arcana_to_paths.csv` — Tarot ↔ Qabalah path alignments (Fool currently mapped; expand as cards enter).
- `registry/maps/node_to_room.csv` — Codex node ↔ labyrinth room crosswalk.
- `registry/maps/node_to_chapel.csv` — Node ↔ chapel ladder bindings for Antahkarana bridges.
- `registry/notes/bridge_manifest.json` — cross-repo readiness matrix added in this update.
- `docs/curation_checklist.md` — numerology and ND-safe geometry checklist used before any Tarot room ships.

Keep these files in sync whenever liber-arcanae data is mirrored into other repos.

## Preparation Steps
1. **Confirm Canon IDs** — add every new Liber Arcanae card ID to `registry/ids.json` before referencing it elsewhere. Maintain numerology counts: 144 nodes, 33 chapels, 99 gates.
2. **Mirror Geometry Slots** — use the curation checklist to ensure each card’s geometry slot is open in `stone-cathedral` (`R001` currently reserved for the deck room).
3. **Align Antahkarana Bridges** — Fool (`LA-00-FOOL`) and Hierophant (`LA-05-HIEROPHANT`) must point to chapel `C33-01`. Update `node_to_chapel.csv` as more bridge cards arrive.
4. **Sync Game Manifests** — when merging into `liber-arcanae-game`, replicate deck-state metadata (arcana title, resonance cues) and confirm Tree-of-Life paths remain layered, not flattened.
5. **Citations & Safety** — log CSL citations in `registry/notes/bibliography.json` as lore is imported from `circuitum99`. Highlight trauma-informed notes alongside each card.

## Cross-Repo Touchpoints
- **liber-arcanae** → **liber-arcanae-game**: card metadata, Antahkarana ladder counts, palette parity with `index.html` renderer.
- **liber-arcanae-game** → **cosmogenesis-learning-engine**: chapel toggle bindings and resonance states.
- **liber-arcanae-game** → **stone-cathedral**: room provenance and exit signage for Tarot study chambers.
- **circuitum99** → **liber-arcanae-game**: lineage citations and ND-safe ritual warnings.

Consult `registry/notes/bridge_manifest.json` for detailed next actions per repo.

## Verification Checklist
- Run `python3 core/check_ids.py --bridge .` to confirm referenced IDs exist before syncing changes.
- Review `docs/curation_checklist.md` to ensure numerology layers (3, 7, 9, 11, 22, 33, 99, 144) remain intact.
- Spot-check the renderer (`index.html`) offline to guarantee palettes and notices still honor ND-safe constraints.

## Next Data Additions
- Expand `arcana_to_paths.csv` with remaining 20 Major Arcana once their IDs are registered.
- Register additional rooms and chapels as new Tarot study spaces manifest.
- Append bibliography anchors once citations are drawn from `circuitum99` or external CSL libraries.
