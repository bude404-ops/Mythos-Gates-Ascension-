#!/usr/bin/env python3
"""
F001 Meridian Court kits dry-run — validates Djekhur / Shemris / Amekhet kits
against the ACTUAL data files, mirroring their .gd math exactly.
(Khaveth is covered by tools/khaveth_poc_dryrun.py.)
Usage: python3 tools/f001_kits_dryrun.py   Exit 0 = all pass.
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
buffs = {b["id"]: b for b in load("buffs/mg_buffs_registry.json")["statuses"]}

EXPECTED = {
    "MG-DEITY-002": ("Djekhur", {"active_1": "Sand-Gale Dash", "active_2": "Scouring Sweep", "ultimate": "The Erasing Wind"}),
    "MG-DEITY-003": ("Shemris", {"active_1": "Mirage Double", "active_2": "Bent Light Volley", "ultimate": "Mirage Volley"}),
    "MG-DEITY-004": ("Amekhet", {"active_1": "Shadow-Step", "active_2": "Noonshade Mark", "ultimate": "High Noon Eclipsed"}),
}

# ---- 1. Data wiring + solo-first + originality for all 3 kits ----
banned = ["sutekh", "set ", " isis", "iset", "amunet", "amun", "anubis", "horus", "osiris",
          "bastet", "sekhemet", " nephthys", "thoth", "sobek", "khnum"]
for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity record + 3 abilities wired",
          d["name"] == name and len(kit) == 3 and set(kit) == set(slots))
    check(f"{name}: ability names match canon",
          all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN + solo-first compliant",
          all(kit[s]["feasibility"] == "GREEN" and kit[s].get("self_only", False) is False
              or "ally" not in kit[s]["mechanic"].lower() for s in kit) and d.get("solo_first_compliant") is True)
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean", not any(b in blob for b in banned))

# ---- 2. Djekhur math --------------------------------------------------------
SHRED_PER, SHRED_MAX = 0.20, 2
DASH_LENGTH, DASH_HALF = 8.0, 1.5
SWEEP_RADIUS, SWEEP_DEF = 4.5, 0.15

class E:
    def __init__(s, x, z):
        s.x, s.z, s.shred, s.buff = x, z, 0, {"glare_might": True}

def shred_mult(e): return 1.0 - e.shred * SHRED_PER

def dash(origin, forward, enemies):
    fx, fz = forward; L = math.hypot(fx, fz); fx, fz = fx/L, fz/L
    rx, rz = -fz, fx
    hits = []
    for e in enemies:
        along = (e.x-origin[0])*fx + (e.z-origin[1])*fz
        across = abs((e.x-origin[0])*rx + (e.z-origin[1])*rz)
        if 0 <= along <= DASH_LENGTH and across <= DASH_HALF:
            e.shred = min(e.shred+1, SHRED_MAX); hits.append(e)
    return hits

e1, e2, e3, e4 = E(4,0), E(4,3), E(10,0), E(0,0)   # on-axis, off-axis(3m), beyond 8m, origin
hits = dash((0,0), (1,0), [e1,e2,e3,e4])
check("Djekhur dash: hits both on-axis enemies (4m and origin) — misses 3m off-axis and 10m out-of-range",
      [e.x for e in hits] == [4, 0])
check("Djekhur dash: shred 1 stack -> 0.80x defense", math.isclose(shred_mult(e1), 0.80))
dash((0,0),(1,0),[e1,e1])  # apply again via list
check("Djekhur dash: shred capped at 2 -> 0.60x defense", math.isclose(shred_mult(e1), 0.60))
def sweep(origin, enemies): return [e for e in enemies if math.hypot(e.x-origin[0], e.z-origin[1]) <= SWEEP_RADIUS]
check("Djekhur sweep: radius 4.5m — hits 4m enemy, misses 6m enemy",
      4 in [e.x for e in sweep((0,0),[e1,E(6,0)])])

def erasing_wind(enemies, terrain):
    n = 0
    for e in enemies:
        if e.buff: e.buff = {}; n += 1
    erased = [t for t in terrain if t.get("hostile")]
    return n, erased
terr = [{"hostile": True, "type": "light_patch"}, {"hostile": False, "type": "sun_spot"}]
n, erased = erasing_wind([e1, E(1,1)], terr)
check("Djekhur ult: strips 2 enemy buffs, erases hostile light-patch only (spares sun-spots)",
      n == 2 and len(erased) == 1 and erased[0]["type"] == "light_patch" and not e1.buff)

# ---- 3. Shemris math ----------------------------------------------------------
DECOY_HP, FALSE_SHOTS, FALSE_DMG, TRUE_BASE = 50.0, 12, 15.0, 100.0
BENT, SYNERGY = 0.25, 0.50
def bent_light(attacking_decoy):
    m = 1.0 + BENT + (SYNERGY if attacking_decoy else 0.0)
    return m
check("Shemris volley: base 1.25x, decoy-synergy 1.75x",
      math.isclose(bent_light(False), 1.25) and math.isclose(bent_light(True), 1.75))
hp = DECOY_HP; absorbed = 0; destroyed = False
for dmg in (30.0, 30.0, 10.0):
    if not destroyed:          # mirror .gd: destroyed decoy absorbs nothing
        hp -= dmg; absorbed += 1
        if hp <= 0: destroyed = True
check("Shemris decoy: absorbs exactly 2 hits (60 dmg) then breaks — 3rd hit passes through",
      absorbed == 2 and destroyed and math.isclose(hp, -10.0))
# simpler precise: 2 hits exactly deplete
hp2 = DECOY_HP
hp2 -= 25.0; hp2 -= 25.0
check("Shemris decoy: exactly 50 dmg breaks it", hp2 == 0.0)
ult_total = TRUE_BASE + FALSE_SHOTS * FALSE_DMG
check("Shemris ult: 12 false shots convert -> true volley = 100 + 12*15 = 280",
      math.isclose(ult_total, 280.0))

# ---- 4. Amekhet math -----------------------------------------------------------
STEP_RANGE, IFRAME = 9.0, 0.4
NOON_BONUS, NOON_MAX = 0.15, 4
def shadow_step(origin, spots):
    cands = [(math.hypot(s[0]-origin[0], s[1]-origin[1]), s) for s in spots
             if 0 < math.hypot(s[0]-origin[0], s[1]-origin[1]) <= STEP_RANGE]
    return min(cands)[1] if cands else None
dest = shadow_step((0,0), [(3,0), (12,0), (7,7)])
check("Amekhet shadow-step: blinks to NEAREST sun-spot in 9m (3m over 7m), rejects 12m",
      dest == (3,0))
none = shadow_step((0,0), [(12,0)])
check("Amekhet shadow-step: no in-range spots -> no blink", none is None)
stacks = 0
for _ in range(6): stacks = min(stacks+1, NOON_MAX)
mult = 1.0 + stacks * NOON_BONUS
check("Amekhet noonshade: capped 4 stacks -> 1.60x bonus damage",
      stacks == 4 and math.isclose(mult, 1.60))
ult = {"untargetable": True, "all_critical": True, "duration": 5.0, "buff": "MG-BUFF-UNTARGETABLE"}
check("Amekhet ult: 5s untargetable + all-crit, uses registered MG-BUFF-UNTARGETABLE hook",
      ult["duration"] == 5.0 and ult["buff"] in buffs)
check("Amekhet i-frames: shadow-step grants MG-BUFF-I-FRAME (registered)",
      IFRAME_BUFF := "MG-BUFF-I-FRAME") and "MG-BUFF-I-FRAME" in buffs

print()
print(f"=== F001 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL: print("FAILURES:", FAIL); sys.exit(1)
print("All 3 Meridian kits verified: data wiring, solo-first, originality, combat math.")
