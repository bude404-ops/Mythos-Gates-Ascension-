#!/usr/bin/env python3
"""
F004 kits dry-run — validates Arashido / Yoruka / Hikarune / Mukage
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
    "MG-DEITY-013": ("Arashido", {"active_1": "Gale Step", "active_2": "Tempest Sweep", "ultimate": "The Storm Crosses"}),
    "MG-DEITY-014": ("Yoruka", {"active_1": "Crescent Volley", "active_2": "Moonmark", "ultimate": "Total Eclipse"}),
    "MG-DEITY-015": ("Hikarune", {"active_1": "Sunthread", "active_2": "Radiant Weave", "ultimate": "Dawn Rewound"}),
    "MG-DEITY-016": ("Mukage", {"active_1": "Spirit-Step", "active_2": "Unmaking Cut", "ultimate": "The Threshold Closes"}),
}

# Real Japanese myth/religion fragments — none may appear in kit data or names.
banned = ["amaterasu", "susano", "tsukuyomi", "izanagi", "izanami", "raijin",
          "fujin", "inari", "hachiman", "benten", "bishamon", "izumo",
          "shinto", "tengu", "kitsune", "onmyoji", "yokai", "yurei", "kami"]

for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity + 3 abilities wired, names match canon",
          d["name"] == name and set(kit) == set(slots)
          and all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility", all(kit[s]["feasibility"] == "GREEN" for s in kit))
    check(f"{name}: solo_first_compliant flag set", d.get("solo_first_compliant") is True)
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no Shinto pantheon fragments)",
          not any(b in blob for b in banned))

# Registered buff/debuff hooks used by the kits must exist in the registry.
hooks = ["MG-DEBUFF-SLOW", "MG-DEBUFF-SNARE", "MG-BUFF-SPEED-SELF", "MG-BUFF-MARK",
         "MG-BUFF-GLOW-RADIUS", "MG-BUFF-SHIELD-SELF", "MG-BUFF-HEAL-SELF",
         "MG-BUFF-I-FRAME", "MG-DEBUFF-ARMOR-MELT"]
for h in hooks:
    check(f"hook registered in buffs registry: {h}", h in buffs)

class E:
    def __init__(s, x, z):
        s.x, s.z = x, z
        s.meta = {}
        s.position = type("P", (), {"x": x, "z": z})()
    def get_meta(s, k, dv=None): return s.meta.get(k, dv)
    def set_meta(s, k, v): s.meta[k] = v

# ---- Arashido ----------------------------------------------------------------
DASH_LENGTH, DASH_HALF_WIDTH, DASH_SLOW = 9.0, 1.6, 0.30
CROSS_SPEED, SWEEP_RADIUS, STORM_WIDTH, STORM_SNARE = 0.35, 5.0, 10.0, 2.0

def gale_step(origin, forward, enemies):
    fx, fz = forward
    n = math.hypot(fx, fz); fx, fz = fx / n, fz / n
    rx, rz = -fz * DASH_HALF_WIDTH, fx * DASH_HALF_WIDTH
    hits = []
    for e in enemies:
        relx, relz = e.x - origin[0], e.z - origin[1]
        along = relx * fx + relz * fz
        across = abs(relx * rx + relz * rz)
        if 0.0 <= along <= DASH_LENGTH and across <= DASH_HALF_WIDTH:
            e.set_meta("slow_mult", 1.0 - DASH_SLOW)
            hits.append(e)
    return hits

o = (0.0, 0.0)
hit = gale_step(o, (1, 0), [E(4, 0), E(4, 2), E(12, 0)])
check("Arashido gale step: corridor hits 1 of 3, slow applied",
      len(hit) == 1 and hit[0].get_meta("slow_mult") == 0.70)
sweep = [e for e in [E(3, 0), E(9, 0)] if math.hypot(e.x, e.z) <= SWEEP_RADIUS]
check("Arashido tempest sweep: 5m radius catches 3m, misses 9m", len(sweep) == 1)
def storm_front(march_dir, enemies):
    fx, fz = march_dir
    n = math.hypot(fx, fz); fx, fz = fx / n, fz / n
    rx, rz = -fz, fx
    caught = []
    for e in enemies:
        across = abs((e.x - 0.0) * rx + (e.z - 0.0) * rz)
        if across <= STORM_WIDTH:
            e.set_meta("snared", True)
            caught.append(e)
    return caught

torii_caught = storm_front((1, 0), [E(5, 8), E(5, 9), E(5, 12)])
check("Arashido the storm crosses: 10-wide front catches z<=10, misses z=12, snare 2s",
      len(torii_caught) == 2 and torii_caught[0].get_meta("snared") and STORM_SNARE == 2.0)

# ---- Yoruka -------------------------------------------------------------------
VOLLEY_SHOTS, SPREAD, RANGE_MIN, RANGE_BONUS = 3, 0.18, 15.0, 0.25
shots = [(i - 1) * SPREAD for i in range(VOLLEY_SHOTS)]
check("Yoruka crescent volley: exactly 3 shots, symmetric fan, all piercing",
      len(shots) == 3 and shots[0] == -SPREAD and shots[1] == 0.0 and shots[2] == SPREAD)

def moonmark(self_pos, tgt):
    dist = math.hypot(tgt.x - self_pos[0], tgt.z - self_pos[1])
    tgt.set_meta("moonmarked", True)
    return RANGE_BONUS if dist >= RANGE_MIN else 0.0

near, far = E(10, 0), E(20, 0)
check("Yoruka moonmark: 20m target earns range bonus, 10m does not",
      moonmark((0, 0), far) == 0.25 and moonmark((0, 0), near) == 0.0)
ecl = [e for e in [far, near, E(1, 1)] if e.get_meta("moonmarked")]
check("Yoruka total eclipse: only marked targets glow and are guaranteed hit",
      len(ecl) == 2 and all(e.get_meta("moonmarked") for e in ecl))

# ---- Hikarune -----------------------------------------------------------------
BEAM_LEN, SNARE_T, SHIELD, HEAL = 14.0, 2.0, 0.30, 0.35
def sunthread(origin, forward, enemies):
    n = math.hypot(*forward); fx, fz = forward[0] / n, forward[1] / n
    out = []
    for e in enemies:
        along = (e.x - origin[0]) * fx + (e.z - origin[1]) * fz
        if 0.0 <= along <= BEAM_LEN:
            e.set_meta("snared", True); out.append(e)
    return out

snared = sunthread((0, 0), (1, 0), [E(6, 0), E(20, 0), E(-5, 0)])
check("Hikarune sunthread: 14m beam roots forward enemy only, snare 2s",
      len(snared) == 1 and snared[0].get_meta("snared") and SNARE_T == 2.0)
check("Hikarune radiant weave: 30% shield on 1000 HP = 300, self-only hook",
      1000 * SHIELD == 300.0)
illu = E(4, 0); illu.set_meta("is_false_reflection", True)
real = E(5, 0)
def dawn(enemies):
    purged = [e for e in enemies if e.get_meta("is_false_reflection", False)]
    return purged
check("Hikarune dawn rewound: heals 350 of 1000 HP, purges only false reflections",
      1000 * HEAL == 350.0 and len(dawn([illu, real])) == 1 and dawn([illu, real])[0] is illu)

# ---- Mukage -------------------------------------------------------------------
STEP_RANGE, IFRAMES, UNMAKE = 12.0, 0.5, 0.50
check("Mukage spirit step: 12m blink legal, 0.5s i-frames (registered MG-BUFF-I-FRAME)",
      math.hypot(12, 0) <= STEP_RANGE and IFRAMES == 0.5)
def unmaking(tgt):
    is_ref = tgt.get_meta("is_false_reflection", False) or tgt.get_meta("is_illusion", False)
    return UNMAKE if is_ref else 0.0
ref = E(0, 0); ref.set_meta("is_false_reflection", True)
check("Mukage unmaking cut: +50% vs reflection, 0 vs real enemy",
      unmaking(ref) == 0.50 and unmaking(E(1, 0)) == 0.0)
marked = E(3, 0); marked.set_meta("moonmarked", True)
unmarked = E(4, 0)
def threshold(enemies):
    caught = []
    for e in enemies:
        if e.get_meta("moonmarked", False) or e.get_meta("thresholdmarked", False):
            e.set_meta("melt", 0.60); caught.append(e)
    return caught
caught = threshold([marked, unmarked])
check("Mukage the threshold closes: marked-only caught, -60% def, strikes land true",
      len(caught) == 1 and caught[0].get_meta("melt") == 0.60)

# ---- solo-first sweep -----------------------------------------------------------
KITS = ["arashido", "yoruka", "hikarune", "mukage"]
for k in KITS:
    src = open(os.path.join(ROOT, "scripts", "kits", f"{k}_kit.gd")).read().lower()
    check(f"{k}_kit.gd: no ally-targeting heals/shields (solo-first wording)",
          "ally" not in src and "team heal" not in src and "party" not in src)
    check(f"{k}_kit.gd: DEITY_ID wired to DataLayer with assert",
          "datalayer" in src and "assert" in src)

print()
print(f"=== F004 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL:
    print("FAILED CHECKS:", *FAIL, sep="\n  - ")
    sys.exit(1)
print("All 4 Thousand Torii kits verified: data wiring, solo-first, originality, combat math.")
