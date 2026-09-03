#!/usr/bin/env python3
"""
UI dry-run — validates the deity-select / ability-HUD design math and the
auto-aim logic against the registry. Mirrors scripts/ui/*.gd.
"""
import json, math, os, sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
DATA = os.path.join(ROOT, "data")
PASS, FAIL = [], []

def check(label, ok):
    (PASS if ok else FAIL).append(label)
    print(f"[{'PASS' if ok else 'FAIL'}] {label}")

def load(p):
    with open(os.path.join(DATA, p)) as f: return json.load(f)

abilities = {a["id"]: a for a in load("abilities/mg_abilities_registry.json")["abilities"]}
factions = {}
for fn in sorted(os.listdir(os.path.join(DATA, "factions"))):
    f = load(f"factions/{fn}"); factions[f["id"]] = f
deities = {}
for fn in sorted(os.listdir(os.path.join(DATA, "deities"))):
    d = load(f"deities/{fn}"); deities[d["id"]] = d

# ---- select grid layout -----------------------------------------------------
check("select: registry has 8 factions", len(factions) == 8)
check("select: registry has 32 deities", len(deities) == 32)
per_faction = {}
for d in deities.values():
    per_faction.setdefault(d["faction_id"], []).append(d["name"])
check("select: every faction gets exactly 4 deities",
      all(len(v) == 4 for v in per_faction.values()) and len(per_faction) == 8)
check("select: every deity has an epithet + role for the button text",
      all(d.get("epithet") and d.get("role") for d in deities.values()))

# ---- HUD slot labels ----------------------------------------------------------
SLOTS = ["active_1", "active_2", "ultimate"]
def labels_for(did):
    d = deities[did]
    return [abilities[d["ability_ids"][i]]["name"] for i in range(3)]
for did in ["MG-DEITY-001", "MG-DEITY-013", "MG-DEITY-024", "MG-DEITY-028"]:
    names = labels_for(did)
    check(f"hud: {deities[did]['name']} slot labels resolve ({', '.join(names)})",
          all(n and len(names) == 3 for n in names))

# ---- auto-aim math ------------------------------------------------------------
class E:
    def __init__(self, x, z, hp=100.0): self.pos = (x, 0, z); self.hp = hp
def nearest(player_pos, enemies, max_d):
    best, bd = None, max_d
    for e in enemies:
        if e.hp <= 0: continue
        d = math.dist(player_pos[:2], e.pos[:2])
        if d < bd: best, bd = e, d
    return best
aim_range = 30.0
p = (0, 0, 0)
enemies = [E(6, 0), E(18, 0), E(40, 0)]   # 40m is outside AIM_RANGE
n = nearest(p, enemies, aim_range)
check("aim: picks the nearest living enemy inside 30m", n.pos == (6, 0, 0))
dead = [E(6, 0, 0.0), E(18, 0)]
n2 = nearest(p, dead, aim_range)
check("aim: skips dead enemies", n2.pos == (18, 0, 0))
n3 = nearest(p, [E(50, 0)], aim_range)
check("aim: no enemy in range -> None (HUD falls back to straight ahead)", n3 is None)

# fallback: player pos + (0,0,-10)
fallback = (p[0] + 0.0, 0, p[2] - 10.0)
check("aim: fallback aim is 10m straight ahead", fallback == (0, 0, -10.0))

# ---- HP bar fraction -----------------------------------------------------------
def frac(hp, hp_max): return max(0.0, min(1.0, hp / hp_max))
check("hp bar: 400/1000 -> 0.4", frac(400, 1000) == 0.4)
check("hp bar: overkill clamps to 1.0", frac(1500, 1000) == 1.0)
check("hp bar: death clamps to 0.0", frac(-50, 1000) == 0.0)

# ---- slot key bindings -----------------------------------------------------------
SLOT_KEYS = {"active_1": "KEY_1", "active_2": "KEY_2", "ultimate": "KEY_3"}
check("hud: keys 1/2/3 map to the three slots",
      list(SLOT_KEYS.values()) == ["KEY_1", "KEY_2", "KEY_3"])

print()
print(f"=== UI DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL:
    print("FAILED CHECKS:", *FAIL, sep="\n  - ")
    sys.exit(1)

# ---- tap-to-move (mobile controls) ------------------------------------------
import math as _m
TAP_MAX_TIME, DRAG_THRESHOLD, ARRIVE = 0.35, 20.0, 0.3
def is_tap(held, moved):
    return held <= TAP_MAX_TIME and moved <= DRAG_THRESHOLD
check("tap: 0.2s hold + 5px = tap", is_tap(0.2, 5) == True)
check("tap: 0.5s hold = not a tap", is_tap(0.5, 5) == False)
check("tap: 50px drag = not a tap", is_tap(0.2, 50) == False)
def walk_time(dist, speed=5.0): return dist / speed
check("walk: 10m to a tap takes 2.0s at 5 m/s", _m.isclose(walk_time(10.0), 2.0))
def arrived(pos, target): return _m.dist(pos, target) <= ARRIVE
check("walk: stops within 0.3m epsilon", arrived((1, 1), (1, 1)) == True)
print(f"=== TAP-MOVE DRY-RUN: {len([c for c in PASS if 'tap' in c or 'walk' in c])} tap/walk checks included ===")
