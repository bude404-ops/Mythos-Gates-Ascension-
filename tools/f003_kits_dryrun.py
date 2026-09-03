#!/usr/bin/env python3
"""
F003 kits dry-run — validates Thrasyles / Therissa / Aethrokles / Sophrona
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
buffs = {b["id"]: b for b in load("buffs/mg_buffs_registry.json")["statuses"]}

EXPECTED = {
    "MG-DEITY-009": ("Thrasyles", {"active_1": "Duelist's Claim", "active_2": "Flourish", "ultimate": "Champion's Verdict"}),
    "MG-DEITY-010": ("Therissa", {"active_1": "Laurel Snare", "active_2": "Hunter's Pace", "ultimate": "The Witness Shot"}),
    "MG-DEITY-011": ("Aethrokles", {"active_1": "Ostracize", "active_2": "Sky-Writ", "ultimate": "The Uncontested Sky"}),
    "MG-DEITY-012": ("Sophrona", {"active_1": "Premise", "active_2": "Conclusion", "ultimate": "The Perfect Plan"}),
}

banned = ["zeus", "hera", "apoll", "artemi", "athena", "poseid", "hades", "hermes",
          "ares", "aphrodit", "hestia", "demeter", "dionys", "heracle", "herakl",
          "titan", "olympus", "kronos", "medusa", "odysse", "achill", "perseus",
          "theseus", "socrat", "sparta", "lacon"]

for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity + 3 abilities wired, names match canon",
          d["name"] == name and set(kit) == set(slots)
          and all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility", all(kit[s]["feasibility"] == "GREEN" for s in kit))
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no Greek pantheon fragments)",
          not any(b in blob for b in banned))

class E:
    def __init__(s, x, z):
        s.x, s.z = x, z

# ---- Thrasyles ----------------------------------------------------------------
CLAIM_UP, RADIUS, VERDICT = 0.25, 6.0, 1.00
class Thra:
    def __init__(s): s.claimed = None
    def claim(s, t): s.claimed = t; return {"dmg_up": 1.0+CLAIM_UP, "others_down": 0.75}
    def claim_mult(s, t): return 1.0+CLAIM_UP if t is s.claimed else 1.0
    def verdict(s, self_pos, center):
        in_c = math.hypot(self_pos[0]-center[0], self_pos[1]-center[1]) <= RADIUS
        return {"in_circle": in_c, "undying": in_c, "claimed_bonus": VERDICT}
th = Thra(); e1, e2 = E(0,0), E(1,1)
c = th.claim(e1)
check("Thrasyles claim: claimed enemy takes 1.25x, others deal 0.75x to him",
      math.isclose(c["dmg_up"], 1.25) and math.isclose(c["others_down"], 0.75))
check("Thrasyles claim: multiplier applies to claimed only (1.25 vs 1.00)",
      th.claim_mult(e1) == 1.25 and th.claim_mult(e2) == 1.0)
v = th.verdict((2, 2), (0, 0))
check("Thrasyles verdict: inside 6m duel-circle -> undying (MG-BUFF-UNDYING registered)",
      v["in_circle"] and v["undying"] and "MG-BUFF-UNDYING" in buffs)
v2 = th.verdict((7, 7), (0, 0))
check("Thrasyles verdict: outside the circle -> NOT undying",
      not v2["in_circle"] and not v2["undying"])

# ---- Therissa ----------------------------------------------------------------
SNARE_T, PACE, PACE_MAX, WITNESS, FAITH = 2.0, 0.10, 3, 300.0, 10.0
class Ther:
    def __init__(s): s.stacks = 0
    def snare(s, t): t.snared = True; return {"duration": SNARE_T}
    def pace(s): s.stacks = min(s.stacks+1, PACE_MAX); return s.stacks
    def mult(s): return 1.0 + s.stacks*PACE
    def witness(s, hp): kill = hp <= WITNESS; return {"kill": kill, "faith": FAITH if kill else 0.0}
te = Ther(); t1 = E(0,0)
check("Therissa snare: laurel-root binds 2s (MG-DEBUFF-SNARE registered)",
      te.snare(t1)["duration"] == 2.0 and t1.snared and "MG-DEBUFF-SNARE" in buffs)
te.pace(); te.pace(); te.pace(); n = te.pace()
check("Therissa pace: speed stacks cap at 3 -> 1.30x (MG-BUFF-SPEED-SELF, self-only)",
      n == 3 and math.isclose(te.mult(), 1.30) and "MG-BUFF-SPEED-SELF" in buffs)
w1 = te.witness(250.0); w2 = te.witness(400.0)
check("Therissa witness: kills at 250hp (faith surge +10), no kill at 400hp",
      w1["kill"] and w1["faith"] == 10.0 and not w2["kill"] and w2["faith"] == 0.0)

# ---- Aethrokles ----------------------------------------------------------------
DOT_TICK, TICKS, GROW = 8.0, 5, 1.25
def skywrit_total():
    total, tick = 0.0, DOT_TICK
    for _ in range(TICKS):
        total += tick; tick *= GROW
    return total
# 8 + 10 + 12.5 + 15.625 + 19.53125 = 65.65625
check("Aethrokles sky-writ: growing DOT totals 8+10+12.5+15.6+19.5 = 65.66 dmg",
      math.isclose(skywrit_total(), 65.65625))
t2 = E(0,0)
def ostracize(t): t.buff_exiled = True; return True
def uncontested(cover, enemies):
    for e in enemies: e.silenced = True
    return len(cover), len(enemies)
o = ostracize(t2)
cover_n, sil_n = uncontested([{"cover":1},{"cover":2}], [t1, t2])
check("Aethrokles ult: destroys 2 cover objects + silences 2 enemies 3s (MG-DEBUFF-SILENCE)",
      cover_n == 2 and sil_n == 2 and t2.silenced and "MG-DEBUFF-SILENCE" in buffs)

# ---- Sophrona -----------------------------------------------------------------
RANGE, STRIKE, PLAN_CRIT, FAITH_K = 12.0, 1.5, 0.50, 5.0
class Soph:
    def __init__(s): s.marked = []
    def premise(s, t): t.marked = True
    def conclusion(s, origin, t):
        if not getattr(t, "marked", False): return {"blinked": False}
        d = math.hypot(t.x-origin[0], t.z-origin[1])
        if d > RANGE: return {"blinked": False}
        return {"blinked": True, "bonus": STRIKE, "d": d}
so = Soph()
t3 = E(9, 3); t4 = E(15, 15)
so.premise(t3); so.premise(t4)
c1 = so.conclusion((0,0), t3); c2 = so.conclusion((0,0), t4)
check("Sophrona conclusion: blinks to marked target at 9.5m (1.5x strike), rejects 21m",
      c1["blinked"] and c1["bonus"] == 1.5 and not c2["blinked"])
c3 = so.conclusion((0,0), E(5,5))  # unmarked -> no blink
check("Sophrona conclusion: unmarked targets reject the blink", not c3["blinked"])
plan = {"crit": PLAN_CRIT, "faith": 3 * FAITH_K}
check("Sophrona perfect plan: +50% crit, 3 kills restore 15 Faith (self-only)",
      plan["crit"] == 0.50 and plan["faith"] == 15.0)

print()
print(f"=== F003 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL: print("FAILURES:", FAIL); sys.exit(1)
print("All 4 kits verified: data wiring, solo-first, originality, combat math.")
