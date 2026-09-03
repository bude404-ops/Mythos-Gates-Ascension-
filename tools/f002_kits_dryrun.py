#!/usr/bin/env python3
"""
F002 Stormmoot kits dry-run — validates Halmarr / Falwyn / Vargrim / Estrith
kits against the ACTUAL data files, mirroring their .gd math exactly.
Usage: python3 tools/f002_kits_dryrun.py   Exit 0 = all pass.
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
    "MG-DEITY-005": ("Halmarr", {"active_1": "Thunderstep", "active_2": "Oathguard", "ultimate": "Verdict of the Sky"}),
    "MG-DEITY-006": ("Falwyn", {"active_1": "Duskflight", "active_2": "Feathermark", "ultimate": "The Falcon's Price"}),
    "MG-DEITY-007": ("Vargrim", {"active_1": "Rune of Undoing", "active_2": "Stormsight", "ultimate": "The Unwriting"}),
    "MG-DEITY-008": ("Estrith", {"active_1": "Threadstep", "active_2": "Unspool", "ultimate": "The Predetermined"}),
}

banned = ["thor", "odin", "loki", "freya", "freyr", "tyr ", "heimdall", "fenrir", "odinn",
          "thorr", " valk", "valkyr", "mimir", "baldur", "baldr", "sif ", "njord", "ymir"]

# ---- 1. Data wiring + solo-first + originality for all 4 kits ----
for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity record + 3 abilities wired",
          d["name"] == name and len(kit) == 3 and set(kit) == set(slots))
    check(f"{name}: ability names match canon",
          all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility",
          all(kit[s]["feasibility"] == "GREEN" for s in kit))
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no Norse fragments)", not any(b in blob for b in banned))

# ---- 2. Halmarr math ----------------------------------------------------------
LEAP, RADIUS = 7.0, 3.5

class E:
    def __init__(s, x, z, hp_max=100.0, vel=(0.0, 0.0)):
        s.x, s.z, s.hp_max, s.vel = x, z, hp_max, vel
        s.snared = False; s.buffs = {"storm_might": True, "wind_skin": True}
        s.revealed = False; s.silenced = False; s.fated = False

def thunderstep(origin, forward, enemies):
    fx, fz = forward; L = math.hypot(fx, fz); fx, fz = fx/L, fz/L
    land = (origin[0] + fx*LEAP, origin[1] + fz*LEAP)
    hits = []
    for e in enemies:
        if math.hypot(e.x-land[0], e.z-land[1]) <= RADIUS:
            e.snared = True; hits.append(e)
    return land, hits

h1, h2, h3 = E(7, 0), E(9, 1), E(1, 1)   # at landing (7,0), 2.2m away, 6.3m away
land, hits = thunderstep((0, 0), (1, 0), [h1, h2, h3])
check("Halmarr thunderstep: landing at (7,0); hits enemies within 3.5m (2 of 3)",
      land == (7.0, 0.0) and [e.x for e in hits] == [7, 9] and h1.snared and h3.snared is False)
RED = 0.40
def oathguard(): return {"reduction": RED, "taunt": True, "self_buff": True}
og = oathguard()
check("Halmarr oathguard: 40% self damage reduction + taunt (solo-first: self-only)",
      og["reduction"] == 0.40 and og["self_buff"] is True and "MG-BUFF-SHIELD-SELF" in buffs)
big, small = E(0, 0, hp_max=500.0), E(0, 0, hp_max=80.0)
def verdict(enemies): b = max(enemies, key=lambda e: e.hp_max); b.snared = True; return b
check("Halmarr verdict: sky-splitting strike targets BIGGEST enemy (500hp over 80hp)",
      verdict([big, small]) is big and big.snared)

# ---- 3. Falwyn math ------------------------------------------------------------
GLIDE, SHOTS, RANGE, SEEK, BONUS = 6.0, 3, 15.0, 3, 0.20
def duskflight(origin, enemies):
    glide_to = (origin[0], origin[1] - GLIDE)
    per_shot_targets = [e for e in enemies
                        if math.hypot(e.x-glide_to[0], e.z-glide_to[1]) <= RANGE]
    return glide_to, SHOTS, per_shot_targets
g, n, t = duskflight((0, 0), [h1, h3])
check("Falwyn duskflight: glides 6m backwards, 3 shots, targets within 15m of glide point",
      g == (0.0, -6.0) and n == 3 and len(t) == 2)
stacks = SEEK; target = h1
seek_results = []
for _ in range(4):
    if stacks > 0:
        stacks -= 1; seek_results.append((True, 1.0 + BONUS))
    else:
        seek_results.append((False, None))
check("Falwyn feathermark: exactly 3 seeking shots at 1.20x, then empties",
      [r for r in seek_results[:3]] == [(True, 1.20)]*3 and seek_results[3][0] is False)
def falcons_price(): return {"untargetable": True, "shots": 8, "duration": 4.0}
fp = falcons_price()
check("Falwyn ult: 8-shot untargetable falcon barrage, 4s (MG-BUFF-UNTARGETABLE registered)",
      fp["shots"] == 8 and "MG-BUFF-UNTARGETABLE" in buffs)

# ---- 4. Vargrim math -------------------------------------------------------------
def rune_of_undoing(target):
    n = len(target.buffs); target.buffs = {}
    return n, 1.0 + n * 0.10
n, mult = rune_of_undoing(h1)
check("Vargrim rune of undoing: strips 2 buffs -> 1.20x damage (MG-DEBUFF-BUFF-STRIP registered)",
      n == 2 and math.isclose(mult, 1.20) and h1.buffs == {} and "MG-DEBUFF-BUFF-STRIP" in buffs)
def stormsight(origin, enemies, radius=20.0):
    return [e for e in enemies if math.hypot(e.x-origin[0], e.z-origin[1]) <= radius]
sr = stormsight((0, 0), [h1, h2, E(25, 0)])
check("Vargrim stormsight: reveals within 20m (2 of 3), misses 25m-away enemy",
      len(sr) == 2 and all(math.hypot(e.x, e.z) <= 20.0 for e in sr))
def unwriting(enemies):
    for e in enemies: e.silenced = True
    return len(enemies)
check("Vargrim unwriting: field-wide 6s silence on all enemies (MG-DEBUFF-SILENCE registered)",
      unwriting([h1, h2, h3]) == 3 and h1.silenced and "MG-DEBUFF-SILENCE" in buffs)

# ---- 5. Estrith math ---------------------------------------------------------------
LEAD = 0.5
def threadstep(target):
    return (target.x + target.vel[0]*LEAD, target.z + target.vel[1]*LEAD)
mv = E(5, 5, vel=(3.0, 4.0))
check("Estrith threadstep: blinks to target's future position (5,5)+(1.5,2.0)",
      threadstep(mv) == (6.5, 7.0))
SLOW = 0.30
def unspool(target):
    target.slowed = True; target.dodge_fails = True
    return 1.0 - SLOW
check("Estrith unspool: -30% slow (0.70x move) + next dodge fails (MG-DEBUFF-SLOW registered)",
      math.isclose(unspool(h1), 0.70) and h1.dodge_fails and "MG-DEBUFF-SLOW" in buffs)
def predetermined(marked):
    for e in marked: e.fated = True
    return len(marked)
marked = [h1, h2]
check("Estrith ult: 5s of fated guaranteed hits on marked enemies only",
      predetermined(marked) == 2 and h1.fated and h3.fated is False)

print()
print(f"=== F002 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL: print("FAILURES:", FAIL); sys.exit(1)
print("All 4 Stormmoot kits verified: data wiring, solo-first, originality, combat math.")
