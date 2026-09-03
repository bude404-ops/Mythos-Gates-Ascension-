# Mythos Gates: Ascension — Project Status
_Last updated: Sept 3, 2026 (BIGagent404)_

## Current Phase: ART (green-lit by BudE404 Sept 3; web export parked)

### Complete
- **All 32 deity kits** (F001–F008) — DataLayer-driven, solo-first, uniform `cast_slot` dispatcher (SLOT_FN verified 32/32)
- **Combat runtime** — status effects, debt economy, barrier pool, bargain records (commit e5092b57)
- **Combat loop + UI** — deity select (8×4 data-driven), ability HUD, tap-to-move mobile controls, keys 1/2/3+Q (commits 91c31058, 3719bbd3)
- **Old-lore purge** (fda205f4) — Aten Ra model + weapon pipeline deleted, faction-tinted placeholder avatars, visible enemies + death cleanup, 140 stale god-name voice labels fixed, 20 F008 Deepgreen voice keys
- **F001 Meridian Court concept set** (ffccb67c, 95d55876) — Khaveth v2 (restyle pass), Djekhur, Shemris, Amekhet

### Awaiting BudE404
- Khaveth v2 verdict (v1 to be deleted everywhere on approval, per locked-version rule)
- Green light to roll F002 Stormmoot concepts (Halmarr, Falwyn, Vargrim, Estrith)

### Known Regressions (deferred — art phase takes priority)
- test_f002: direct `.velocity` assignment on bare Node3D stub → convert to metas
- test_f003: kit reads missing `crit_window` key on Dictionary → guard with `get("crit_window", ...)`
- Fix pattern is established: enemies/stubs are Node3D + metas; kits read via `get_meta()`; tests set via `set_meta()`

## Locked Rules (enforced)
1. Concept art and 3D assets are two INDEPENDENT pipelines — concept art NEVER feeds 3D generators.
2. Meshy.ai is LOCKED. No API calls without BudE404's explicit go. Keys stay stored but unused.
3. All 3D in-house (Blender + MiDaS/Open3D); NO RunPod, NO TRELLIS.
4. Show BudE404 reference art BEFORE any 3D submission.
5. One front-view image per deity per update; one consolidated done-report per task.
6. Always push to GitHub (commit + push to main) on every completed milestone.
7. On approval/lock of any asset, delete ALL older versions locally and on GitHub.

## Ops Notes
- Repo: `bude404-ops/Mythos-Gates-Ascension-` (default branch `main`). Two writers push to main (this repo + workspace auto-commit mirror) — always `git pull --rebase` before pushing.
- Engine: Godot 4.7.2 (binary at `godot-bin/`, persistent home at `tools/godot-home/`).
- Unity Cloud service keys (for BudE404's Unity projects, not this Godot game): validated Sept 3 2026 via Basic auth against `services.api.unity.com`. Token exchange endpoint: `POST https://services.api.unity.com/auth/v1/token-exchange?projectId=<UUID>` (projectId as QUERY param). Secret values live in the encrypted secrets store (`UNITY_SECRET_KEY`, `UNITY_AUTHORIZATION_TOKEN`) — never in this repo. Blocked on BudE404's Unity Project ID (cloud.unity.com → project Settings).
