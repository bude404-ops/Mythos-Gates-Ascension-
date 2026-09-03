# Mythos Gates: Ascension — Project Status
_Last updated: Sept 3, 2026 (BIGagent404)_

## Current Phase: ART (green-lit Sept 3; web export parked)

### Complete
- All 32 deity kits (F001-F008), DataLayer-driven, solo-first, uniform cast_slot dispatcher
- Combat runtime (status effects, debt economy, barrier pool) + combat loop + tap-to-move mobile UI
- Old-lore purge: Aten Ra assets deleted, faction-tinted avatars, 140 voice labels fixed, 20 F008 keys added
- F001 concept set v1/v2 + Khaveth v3 (new direction sample)

### Awaiting BudE404
- Khaveth v3 verdict → then restyle Djekhur/Shemris/Amekhet + delete old versions
- F002+ concepts each get a cultural design doc first

## Locked Rules
1. Concept art and 3D are INDEPENDENT pipelines — never mix.
2. Meshy.ai LOCKED without explicit go.
3. In-house 3D only (Blender + MiDaS/Open3D). No RunPod, no TRELLIS.
4. Reference art approval BEFORE any 3D submission.
5. One front-view image per deity; one consolidated done-report per task.
6. Push to GitHub main on every milestone.
7. Approved asset → delete all older versions.
8. Art Amendment 1: cultural realm gear, unique silhouettes, divine-seductive females, 30-ft scale cues.

## Ops
- Repo: bude404-ops/Mythos-Gates-Ascension- (branch main). Two writers push to main — always pull --rebase first.
- Engine: Godot 4.7.2 (godot-bin/, tools/godot-home/).
- Unity Cloud service keys (BudE404's Unity projects, not this game): validated Sept 3 2026. Basic auth works on services.api.unity.com; token endpoint POST /auth/v1/token-exchange?projectId=<UUID> (query param). Secrets live in encrypted store (UNITY_SECRET_KEY, UNITY_AUTHORIZATION_TOKEN) — never in repo. Blocked on Unity Project ID from cloud.unity.com.
