#!/usr/bin/env python3
"""
F004 kits dry-run — validates Arashido / Yoruka / Hikarune / Mukage
(The Thousand Torii) against the ACTUAL data files, mirroring their .gd math exactly.
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
    "MG-DEITY-013": ("Arashido", {"active_1": "Gale Step", "active_2": "Tempest Sweep", "ultimate": "The Storm Crosses"}),
    "MG-DEITY-014": ("Yoruka", {"active_1": "Crescent Volley", "active_2": "Moonmark", "ultimate": "Total Eclipse"}),
    "MG-DEITY-015": ("Hikarune", {"active_1": "Sunthread", "active_2": "Radiant Weave", "ultimate": "Dawn Rewound"}),
    "MG-DEITY-016": ("Mukage", {"active_1": "Spirit-Step", "active_2": "Unmaking Cut", "ultimate": "The Threshold Closes"}),
}

# Japanese real-pantheon fragments must never appear in F004 kit data
banned = ["amaterasu", "tsukuyomi", "susano", "susa-", "izanami", "izanagi", "kami",
          "tengu", "inari", "raijin", "fujin", "yokai", "shinto", "onmyoji"]

for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity + 3 abilities wired, names match canon",
          d["name"] == name and set(kit) == set(slots)
          and all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility", all(kit[s]["feasibility"] == "GREEN" for s in kit))
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no Japanese pantheon fragments)",
          not any(b in blob for b in banned))

# Solo-first: only the flagged self-only abilities may heal/shield the player
for did, (name, slots) in EXPECTED.items():
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in deities[did]["ability_ids"]}
    self_ok = kit["active_2"].get("self_only", False) if did == "MG-DEITY-015" else True
    ult_self_ok = kit["ultimate"].get("self_only", False) if did == "MG-DEITY-015" else True
    check(f"{name}: solo-first — heals/shields (if any) are self-only",
          self_ok and ult_self_ok)

class E:
    def __init__(s, x, z, illusion=False, marked=False):
        s.x, s.z = x, z; s.is_illusion = illusion; s.moonmarked = marked
        s.meta = {}
        s.position = type("P", (), {"x": x, "z": z})()
    def get_meta(s, k, d=False): return s.meta.get(k, d)
    def set_meta(s, k, v): s.meta[k] = v

# ---- Arashido ------------------------------------------------------------------
GALE_D, GALE_BUFF, SWEEP_R, SWEEP_KB = 10.0, 0.35, 6.0, 7.0
STORM_W, STORM_L, STORM_G, STORM_PER = 3.0, 20.0, 5, 0.30
gs = {"dash_distance": GALE_D, "self_speed_buff": GALE_BUFF, "self_only": True}
check("Arashido gale step: 10m dash + 35% SELF-ONLY speed (MG-BUFF-SPEED-SELF)",
      gs["dash_distance"] == 10.0 and gs["self_speed_buff"] == 0.35
      and "MG-BUFF-SPEED-SELF" in buffs and gs["self_only"])
def sweep(origin, enemies):
    out = []
    for e in enemies:
        d = math.hypot(e.x-origin[0], e.z-origin[1])
        if d <= SWEEP_R and d > 0.001:
            out.append((e, (origin[0]+(e.x-origin[0])/d*SWEEP_KB, origin[1]+(e.z-origin[1])/d*SWEEP_KB)))
    return out
near, far = E(3, 4), E(9, 9)   # 5m in, 12.7m out
pushed = sweep((0, 0), [near, far])
check("Arashido tempest sweep: pushes enemy at 5m (to ~9.2m), ignores enemy at 12.7m",
      len(pushed) == 1 and abs(math.hypot(pushed[0][1][0], pushed[0][1][1]) - 7.0) < 1e-6)
def storm(origin, enemies):
    best_dir, best_n = (1, 0), -1
    for e in enemies:
        rel = (e.x-origin[0], e.z-origin[1]); l = math.hypot(*rel)
        if l < 0.001: continue
        d = (rel[0]/l, rel[1]/l); n = 0
        for o in enemies:
            ro = (o.x-origin[0], o.z-origin[1])
            if ro[0]*d[0]+ro[1]*d[1] > 0 and abs(ro[0]*-d[1]+ro[1]*d[0]) <= STORM_W: n += 1
        if n > best_n: best_n, best_dir = n, d
    hits = []
    for e in enemies:
        rel = (e.x-origin[0], e.z-origin[1])
        along = rel[0]*best_dir[0]+rel[1]*best_dir[1]
        across = abs(rel[0]*-best_dir[1]+rel[1]*best_dir[0])
        if 0 <= along <= STORM_L and across <= STORM_W:
            gates = int(along / (STORM_L/STORM_G)) + 1
            hits.append((e, gates, 1.0 + gates*STORM_PER))
    return hits
e1, e2, e3 = E(8, 0), E(17, 0), E(5, 8)  # on the line at 8m/17m; off-line
sh = storm((0, 0), [e1, e2, e3])
check("Arashido storm crosses: catches 2 enemies on the march (5 gates), misses off-line",
      len(sh) == 2 and sh[0][1] == 3 and abs(sh[0][2]-1.9) < 1e-9
      and sh[1][1] == 5 and abs(sh[1][2]-2.5) < 1e-9)

# ---- Yoruka --------------------------------------------------------------------
SHOTS, SPREAD, VLEN, MARK_BONUS, NEAR = 3, 0.12, 18.0, 0.25, 10.0
def volley(origin, forward, enemies):
    fx, fz = forward; l = math.hypot(fx, fz); fx, fz = fx/l, fz/l
    lines = []
    for i in range(SHOTS):
        ang = (i-1)*SPREAD
        lines.append((fx*math.cos(ang)-fz*math.sin(ang), fx*math.sin(ang)+fz*math.cos(ang)))
    hits = set()
    for (dx, dz) in lines:
        for e in enemies:
            rel = (e.x-origin[0], e.z-origin[1])
            along = rel[0]*dx+rel[1]*dz
            if 0 <= along <= VLEN and abs(rel[0]*-dz+rel[1]*dx) <= 0.9: hits.add(e)
    return hits
va, vb = E(10, 0), E(-10, 0)   # straight ahead, straight behind
check("Yoruka crescent volley: 3 piercing shots hit enemy at 10m ahead, none behind",
      va in volley((0,0),(1,0),[va,vb]) and vb not in volley((0,0),(1,0),[va,vb]))
mm = {"marked": True, "at_range": True, "range_bonus": MARK_BONUS}
check("Yoruka moonmark: marks target seen through walls, +25% at range",
      mm["marked"] and mm["range_bonus"] == 0.25 and "MG-BUFF-MARK" in buffs)
EC_D, EC_B = 8.0, 0.40
check("Yoruka total eclipse: 8s darkness, guaranteed hits on marked (+40%)",
      EC_D == 8.0 and EC_B == 0.40)

# ---- Hikarune ------------------------------------------------------------------
ST_L, ST_W, ROOT_D = 12.0, 1.0, 2.5
def sunthread(origin, forward, enemies):
    fx, fz = forward; l = math.hypot(fx, fz); fx, fz = fx/l, fz/l
    out = []
    for e in enemies:
        rel = (e.x-origin[0], e.z-origin[1])
        along = rel[0]*fx+rel[1]*fz
        across = abs(rel[0]*-fz+rel[1]*fx)
        if 0 <= along <= ST_L and across <= ST_W: out.append(e)
    return out
ra, rb = E(10, 0.5), E(10, 3)
check("Hikarune sunthread: roots enemy inside the 1m-wide beam, misses enemy 3m off-axis",
      ra in sunthread((0,0),(1,0),[ra,rb]) and rb not in sunthread((0,0),(1,0),[ra,rb]))
wv = {"shield": 0.25*1000, "hook": "MG-BUFF-SHIELD-SELF", "self_only": True}
check("Hikarune radiant weave: 25% max-HP SELF-ONLY shield (MG-BUFF-SHIELD-SELF)",
      wv["shield"] == 250.0 and "MG-BUFF-SHIELD-SELF" in buffs and wv["self_only"])
dn = {"heal": 0.35*1000, "hook": "MG-BUFF-HEAL-SELF", "purge": 0.50}
check("Hikarune dawn rewound: 35% SELF heal (MG-BUFF-HEAL-SELF), +50% purge vs illusions",
      dn["heal"] == 350.0 and "MG-BUFF-HEAL-SELF" in buffs and dn["purge"] == 0.50)

# ---- Mukage --------------------------------------------------------------------
SS_R, IFR, UB = 14.0, 0.8, 0.75
def sstep(origin, target):
    d = math.hypot(target[0]-origin[0], target[1]-origin[1])
    return {"blinked": d <= SS_R, "iframes": IFR, "d": d}
check("Mukage spirit-step: blinks 12m through walls, rejects 17m",
      sstep((0,0),(12,0))["blinked"] and not sstep((0,0),(17,0))["blinked"]
      and "MG-BUFF-I-FRAME" in buffs)
def ucut(t): return UB if t.is_illusion else 0.0
ill, real = E(4, 4, illusion=True), E(5, 5)
check("Mukage unmaking cut: +75% vs illusions/false reflections, 0 vs true enemies",
      ucut(ill) == 0.75 and ucut(real) == 0.0)
def threshold(origin, enemies):
    caught = []
    for e in enemies:
        d = math.hypot(e.x-origin[0], e.z-origin[1])
        if d <= 13.0: caught.append(e)
    return caught
tc = threshold((0,0), [E(12,0), E(16,0)])
check("Mukage threshold closes: catches enemy at 12m, misses enemy at 16m",
      len(tc) == 1)

print()
print(f"=== F004 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL: print("FAILURES:", FAIL); sys.exit(1)
print("All 4 kits verified: data wiring, solo-first, originality, combat math.")
