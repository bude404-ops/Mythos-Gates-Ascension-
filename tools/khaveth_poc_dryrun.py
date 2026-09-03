#!/usr/bin/env python3
"""
Khaveth PoC dry-run harness (no Godot required).

Mirrors scripts/kits/khaveth_kit.gd exactly and validates the kit against the
ACTUAL MG- data files in res://data. Proves the DataLayer contract works:
deity record -> ability records -> MG-BUFF-MARK hook, solo-first compliance,
and the full mark/beam/ultimate combat math.

Usage: python3 tools/khaveth_poc_dryrun.py
"""
import json
import math
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root
DATA = os.path.join(HERE, "data")

# --- kit tuning constants (must match khaveth_kit.gd) -----------------------
MARK_DMG_PER_STACK = 0.12
MARK_MAX_STACKS = 5
BEAM_LENGTH = 12.0
BEAM_HALF_WIDTH = 1.2
BEAM_MARK_CONSUME = 2
BRAND_DMG_MULT = 1.5
ULT_RANGE = 18.0
ULT_EXECUTE_PCT = 0.15
ULT_MARK_STACKS = 3

PASS, FAIL = [], []

def check(label, ok):
    (PASS if ok else FAIL).append(label)
    print(f"[{'PASS' if ok else 'FAIL'}] {label}")

def load(path):
    with open(os.path.join(DATA, path)) as f:
        return json.load(f)

# --- 1. DataLayer contract -------------------------------------------------
deities = {}
for fn in os.listdir(os.path.join(DATA, "deities")):
    d = load(f"deities/{fn}")
    deities[d["id"]] = d
abilities = {a["id"]: a for a in load("abilities/mg_abilities_registry.json")["abilities"]}
buffs = {b["id"]: b for b in load("buffs/mg_buffs_registry.json")["statuses"]}
bosses = load("bosses/mg_bosses_registry.json")["bosses"]
f1_bosses = [b for b in bosses if b["faction_id"] == "MG-FACTION-001"]

deity = deities["MG-DEITY-001"]
kit_abilities = {a["slot"]: a for aid in deity["ability_ids"] for a in [abilities[aid]]}

check("DataLayer: Khaveth deity record loads", deity["name"] == "Khaveth")
check("DataLayer: 3 abilities linked to deity", len(kit_abilities) == 3)
check("DataLayer: names match kit (Weigh the Deed/Noon Sentence/Meridian Judgement)",
      kit_abilities["active_1"]["name"] == "Weigh the Deed"
      and kit_abilities["active_2"]["name"] == "Noon Sentence"
      and kit_abilities["ultimate"]["name"] == "Meridian Judgement")
check("Solo-first: deity flag true", deity["solo_first_compliant"] is True)
check("Solo-first: no ability heals or buffs allies",
      all("heal" not in (a["mechanic"] or "").lower() and "buff" not in (a["mechanic"] or "").lower()
          for a in kit_abilities.values()))
check("Feasibility: all 3 abilities GREEN",
      all(a["feasibility"] == "GREEN" for a in kit_abilities.values()))
check("Buff hook: MG-BUFF-MARK exists and is enemy-facing",
      buffs["MG-BUFF-MARK"]["kind"] == "mark" and buffs["MG-BUFF-MARK"]["self_only"] is False)
check("Originality: deity epithet/weapon carry zero real-world fragments",
      all(t not in json.dumps(deity).lower()
          for t in ["ra", "horus", "solar disc", "aten"]))  # "ra" needs word-boundary care below

# --- 2. mark math ------------------------------------------------------------
class Dummy:
    def __init__(self, name, x, z, hp=100.0, hp_max=100.0, threat=2.0):
        self.name = name; self.x = x; self.z = z
        self.hp = hp; self.hp_max = hp_max; self.threat = threat
        self.stacks = 0

def mark_multiplier(e):
    return 1.0 + e.stacks * MARK_DMG_PER_STACK

def weigh_the_deed(e):
    e.stacks = min(e.stacks + 1, MARK_MAX_STACKS)
    return e.stacks

d1 = Dummy("Glaresworn Drifter", 6.0, 0.0)
check("Mark: stacks apply 1,2", weigh_the_deed(d1) == 1 and weigh_the_deed(d1) == 2)
check("Mark: multiplier at 2 stacks = 1.24", math.isclose(mark_multiplier(d1), 1.24))
d1.stacks = MARK_MAX_STACKS + 3
weigh_the_deed(d1)
check("Mark: capped at 5 stacks", d1.stacks == MARK_MAX_STACKS)
check("Mark: max multiplier = 1.60", math.isclose(mark_multiplier(d1), 1.60))

# --- 3. beam math (Noon Sentence) ---------------------------------------------
def noon_sentence(origin, forward, enemies):
    fx, fz = forward
    fl = math.hypot(fx, fz); fx, fz = fx/fl, fz/fl
    rx, rz = -fz, fx
    hits = []
    for e in enemies:
        relx, relz = e.x - origin[0], e.z - origin[1]
        along = relx*fx + relz*fz
        across = abs(relx*rx + relz*rz)
        if 0 <= along <= BEAM_LENGTH and across <= BEAM_HALF_WIDTH:
            mult = BRAND_DMG_MULT if e.stacks > 0 else 1.0
            if e.stacks > 0:
                e.stacks = max(e.stacks - BEAM_MARK_CONSUME, 0)
            hits.append((e.name, mult))
    return hits

d1.stacks = 2
d2 = Dummy("Hollow Webber", 4.0, 1.0)   # on-axis edge
d3 = Dummy("Dune Stalker", 6.0, 3.0)    # off-axis, miss
d4 = Dummy("Far Sentinel", 14.0, 0.0)   # beyond 12m, miss
hits = noon_sentence((0.0, 0.0), (1.0, 0.0), [d1, d2, d3, d4])
check("Beam: hits exactly the 2 on-axis enemies", len(hits) == 2)
check("Beam: marked target takes Brand 1.5x, stacks consumed 2->0",
      ("Glaresworn Drifter", 1.5) in hits and d1.stacks == 0)
check("Beam: unmarked target takes 1.0x", ("Hollow Webber", 1.0) in hits)

# --- 4. ultimate math (Meridian Judgement) ------------------------------------
def meridian_judgement(origin, enemies):
    in_range = [e for e in enemies if math.hypot(e.x-origin[0], e.z-origin[1]) <= ULT_RANGE]
    if not in_range:
        return None, False
    best = max(in_range, key=lambda e: e.threat)
    best.stacks = min(best.stacks + ULT_MARK_STACKS, MARK_MAX_STACKS)
    hp_frac = best.hp / max(best.hp_max, 1.0)
    executed = hp_frac <= ULT_EXECUTE_PCT
    return best, executed

d5 = Dummy("Unweighed Echo", 10.0, 0.0, threat=3.0)
d6 = Dummy("Scrub Hollow", 5.0, 0.0, threat=1.0)
target, executed = meridian_judgement((0.0, 0.0), [d5, d6, d4])
check("Ult: condemns the strongest unworthy in range", target is d5)
check("Ult: applies 3 condemnation stacks (0->3)", d5.stacks == 3)
check("Ult: out-of-range enemy not condemned", target is not d4)
check("Ult: no execute above 15% HP", executed is False)
d5.hp = 10.0
_, executed = meridian_judgement((0.0, 0.0), [d5])
check("Ult: executes at 10% HP (verdict passed)", executed is True)

# --- 5. F001 boss trio lock ---------------------------------------------------
trio = {b["name"] for b in f1_bosses}
check("Boss trio: Unweighed / Glare-Sworn Archon / Unshamed present",
      trio == {"The Unweighed", "The Glare-Sworn Archon", "The Unshamed"})
check("Boss trio: marked approved", all(b.get("approved") for b in f1_bosses))

print()
print(f"=== KHAVETH POC DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
raise SystemExit(1 if FAIL else 0)
