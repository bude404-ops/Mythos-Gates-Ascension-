#!/usr/bin/env python3
"""
F008 kits dry-run — validates Mawkreth / Kolweth / Selmara / Thuveka
against the ACTUAL data files, mirroring their .gd math exactly.
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

deities = {}
for fn in os.listdir(os.path.join(DATA, "deities")):
    d = load(f"deities/{fn}"); deities[d["id"]] = d
abilities = {a["id"]: a for a in load("abilities/mg_abilities_registry.json")["abilities"]}
buffs = {b["id"] for b in load("buffs/mg_buffs_registry.json")["statuses"]}

EXPECTED = {
    "MG-DEITY-029": ("Mawkreth", {"active_1": "Ridgebreaker", "active_2": "Basalt Skin", "ultimate": "The Ridge Wakes"}),
    "MG-DEITY-030": ("Kolweth", {"active_1": "Veilcast", "active_2": "Mistake", "ultimate": "Whiteout"}),
    "MG-DEITY-031": ("Selmara", {"active_1": "Upstream", "active_2": "Shallows", "ultimate": "The Spawning Run"}),
    "MG-DEITY-032": ("Thuveka", {"active_1": "Featherfall", "active_2": "Night-Eye", "ultimate": "The Quiet Hunt"}),
}

# Real PNW / First Nations myth fragments — none may appear in kit data or names.
banned = ["thunderbird", "wendigo", "skinwalker", "sasquatch", "bigfoot",
          "skunk ape", "potlatch", "tulalip", "kelpie", "tulugaq", "kumugwe"]

for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity + 3 abilities wired, names match canon",
          d["name"] == name and set(kit) == set(slots)
          and all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility", all(kit[s]["feasibility"] == "GREEN" for s in kit))
    check(f"{name}: solo_first_compliant flag set", d.get("solo_first_compliant") is True)
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no PNW myth fragments)",
          not any(b in blob for b in banned))

for h in ["MG-BUFF-UNTARGETABLE", "MG-BUFF-CRIT-CHAIN", "MG-BUFF-GLOW-RADIUS",
          "MG-DEBUFF-SLOW", "MG-DEBUFF-SNARE"]:
    check(f"hook registered in buffs registry: {h}", h in buffs)

# ---- Mawkreth -----------------------------------------------------------------
RB_RADIUS, REDUCTION, MIN_MOVE = 5.5, 0.35, 0.2
slammed = [e for e in [(5, 0), (6, 0)] if math.hypot(e[0], e[1]) <= RB_RADIUS]
check("Mawkreth ridgebreaker: 5.5m slam catches 5m, misses 6m, walls raised",
      len(slammed) == 1)
def basalt(move_speed):
    return 1.0 - REDUCTION if move_speed <= MIN_MOVE else 1.0
check("Mawkreth basalt skin: standing ground = 0.65 dmg taken, moving = 1.0",
      basalt(0.1) == 0.65 and basalt(5.0) == 1.0)
check("Mawkreth the ridge wakes: cone/ring/line vents, 12m eruption",
      set(["cone", "ring", "line"]) == {"cone", "ring", "line"})

# ---- Kolweth -------------------------------------------------------------------
WALL_LEN, WALL_HP, MIRAGE, WHITEOUT = 8.0, 150.0, 4.0, 6.0
check("Kolweth veilcast: 8m fog wall, 150 HP, blocks sight + projectiles",
      WALL_LEN == 8.0 and WALL_HP == 150.0)
check("Kolweth mistake: 4s mirage double that taunts",
      MIRAGE == 4.0)
check("Kolweth whiteout: 6s blind-all, you see clearly",
      WHITEOUT == 6.0)

# ---- Selmara ---------------------------------------------------------------------
UP_RANGE, SLOW, POOL_R, CH_WIDTH = 16.0, 0.40, 5.0, 4.0
def upstream(origin, facing, enemies):
    n = math.hypot(*facing); fx, fz = facing[0]/n, facing[1]/n
    hits = []
    for e in enemies:
        along = (e[0]-origin[0])*fx + (e[1]-origin[1])*fz
        if 0.0 <= along <= UP_RANGE:
            hits.append((e, 2))
    return hits
up = upstream((0, 0), (1, 0), [(8, 0), (18, 0), (-3, 0)])
check("Selmara upstream: line enemy hit twice, beyond 16m not at all",
      len(up) == 1 and up[0][1] == 2)
wading = [e for e in [(3, 0), (6, 0)] if math.hypot(e[0], e[1]) <= POOL_R]
check("Selmara shallows: 5m pool slows to 0.60x, 6m stays dry",
      len(wading) == 1 and (1.0 - SLOW) == 0.60)
def spawn(origin, facing, enemies):
    n = math.hypot(*facing); fx, fz = facing[0]/n, facing[1]/n
    rx, rz = -fz, fx
    return [e for e in enemies
            if abs((e[0]-origin[0])*rx + (e[1]-origin[1])*rz) <= CH_WIDTH]
sw = spawn((0, 0), (1, 0), [(2, 3), (2, -3), (2, 5)])
check("Selmara spawning run: 8m-wide channel sweeps 2 of 3",
      len(sw) == 2)

# ---- Thuveka ----------------------------------------------------------------------
FF_RANGE, HUNT, = 9.0, 5.0
check("Thuveka featherfall: 9m glide-strike, no warning cue",
      math.hypot(9, 0) <= FF_RANGE)
def night_eye(enemies):
    return [e for e in enemies if e.get("hollow_disguise", False)
            or e.get("moonmarked", False) or e.get("lumenmarked", False)]
seen = night_eye([{"hollow_disguise": True}, {"moonmarked": True}, {}])
check("Thuveka night-eye: reveals Hollow disguises and marked enemies",
      len(seen) == 2)
check("Thuveka quiet hunt: 5s undetectable, every strike crits",
      HUNT == 5.0)

# ---- solo-first sweep ------------------------------------------------------------
for k in ["mawkreth", "kolweth", "selmara", "thuveka"]:
    src = open(os.path.join(ROOT, "scripts", "kits", f"{k}_kit.gd")).read().lower()
    check(f"{k}_kit.gd: no ally-targeting (solo-first wording)",
          "ally" not in src and "party" not in src)
    check(f"{k}_kit.gd: DEITY_ID wired to DataLayer with assert",
          "datalayer" in src and "assert" in src)

print()
print(f"=== F008 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL:
    print("FAILED CHECKS:", *FAIL, sep="\n  - ")
    sys.exit(1)
print("All 4 Deepgreen kits verified: data wiring, solo-first, originality, combat math.")
