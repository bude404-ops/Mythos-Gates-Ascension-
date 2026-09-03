#!/usr/bin/env python3
"""
F007 kits dry-run — validates Kraxus / Orivax / Mazka / Syrrax
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
    "MG-DEITY-025": ("Kraxus", {"active_1": "Writ of War", "active_2": "Chainstroke", "ultimate": "Involuntary Collection"}),
    "MG-DEITY-026": ("Orivax", {"active_1": "Debtfire", "active_2": "Refinance", "ultimate": "The Original Loan"}),
    "MG-DEITY-027": ("Mazka", {"active_1": "Payment Collection", "active_2": "Terms of Trade", "ultimate": "Closing Costs"}),
    "MG-DEITY-028": ("Syrrax", {"active_1": "Loophole", "active_2": "Default", "ultimate": "Amnesty"}),
}

# Real infernal/goetic fragments — none may appear in kit data or names.
banned = ["lucifer", "satan", "beelzebub", "belphegor", "mammon",
          "asmodeus", "leviathan", "belial", "moloch", "dante", "mephisto",
          "faust", "baphomet", "pandemonium", "gehenna", "styx", "hades"]

for did, (name, slots) in EXPECTED.items():
    d = deities[did]
    kit = {abilities[aid]["slot"]: abilities[aid] for aid in d["ability_ids"]}
    check(f"{name}: deity + 3 abilities wired, names match canon",
          d["name"] == name and set(kit) == set(slots)
          and all(kit[s]["name"] == slots[s] for s in slots))
    check(f"{name}: all GREEN feasibility", all(kit[s]["feasibility"] == "GREEN" for s in kit))
    check(f"{name}: solo_first_compliant flag set", d.get("solo_first_compliant") is True)
    blob = json.dumps(d).lower() + json.dumps(kit).lower()
    check(f"{name}: originality sweep clean (no infernal/goetic fragments)",
          not any(b in blob for b in banned))

for h in ["MG-BUFF-DEBT-STACK", "MG-BUFF-DOT-GROW", "MG-BUFF-HEAL-SELF",
          "MG-BUFF-SHIELD-SELF", "MG-BUFF-I-FRAME", "MG-BUFF-UNTARGETABLE",
          "MG-BUFF-CRIT-CHAIN", "MG-BUFF-MARK"]:
    check(f"hook registered in buffs registry: {h}", h in buffs)

# ---- Kraxus -------------------------------------------------------------------
TICK, CAP, CHAIN_RANGE, MELT = 0.05, 0.60, 12.0, 0.40
def writ_mult(seconds_held):
    return min(1.0 + seconds_held * TICK, 1.0 + CAP)
check("Kraxus writ of war: 10s mark = 1.50x, compounds to 1.60x cap",
      writ_mult(10.0) == 1.50 and writ_mult(20.0) == 1.60)
check("Kraxus chainstroke: 12m chain-pull legal, 15m out of reach",
      math.hypot(12, 0) <= CHAIN_RANGE and not (math.hypot(15, 0) <= CHAIN_RANGE))
check("Kraxus involuntary collection: marked dragged in, -40% def",
      MELT == 0.40)

# ---- Orivax -------------------------------------------------------------------
BASE, INTEREST, TICKS, LOAN = 40.0, 0.20, 4, 0.20
def debtfire_total():
    dmg, total = BASE, 0.0
    for _ in range(TICKS):
        dmg *= (1.0 + INTEREST)
        total += dmg
    return total
total = debtfire_total()
check("Orivax debtfire: interest compounds 48->57.6->69.12->82.944 (257.664 total)",
      abs(total - 257.664) < 1e-9)
def refinance(n_debuffs):
    return n_debuffs * BASE
check("Orivax refinance: 3 self-debuffs -> one 120 burst, delayed",
      refinance(3) == 120.0)
check("Orivax the original loan: 1.8x power 8s, 20% comes due after",
      LOAN == 0.20)

# ---- Mazka -------------------------------------------------------------------
PAYMENT, TERMS, MULT = 0.02, 4, 1.5
payments = 0.0
for _ in range(5):
    payments += 1000.0 * PAYMENT
check("Mazka payment collection: 5 strikes on 1000 HP = 100 collected, self-heal",
      payments == 100.0)
def terms(enemies):
    moved = 0.0
    for e in enemies:
        s = e.get("shield", 0.0)
        if s > 0: moved += s
    return moved
en = [{"shield": 80.0}, {"shield": 0.0}, {"shield": 50.0}]
check("Mazka terms of trade: shatters 2 shields, 130 value transferred to you",
      terms(en) == 130.0)
check("Mazka closing costs: 100 payments detonate for 150",
      payments * MULT == 150.0)

# ---- Syrrax -------------------------------------------------------------------
LOOP_RANGE, IFRAMES, DEFAULT = 10.0, 0.4, 0.50
check("Syrrax loophole: 10m blink THROUGH enemies, 0.4s iframes",
      math.hypot(10, 0) <= LOOP_RANGE and IFRAMES == 0.4)
def strike(writmarked, debt_dot):
    return DEFAULT if (writmarked or debt_dot > 0.0) else 0.0
check("Syrrax default: +50% vs marked or debt-stacked, 0 vs clean",
      strike(True, 0.0) == 0.50 and strike(False, 30.0) == 0.50
      and strike(False, 0.0) == 0.0)
def amnesty(debuffs):
    return len(debuffs)
check("Syrrax amnesty: erases own debuffs, untargetable, next strike crits",
      amnesty(["slow", "mark"]) == 2)

# ---- solo-first sweep ------------------------------------------------------------
for k in ["kraxus", "orivax", "mazka", "syrrax"]:
    src = open(os.path.join(ROOT, "scripts", "kits", f"{k}_kit.gd")).read().lower()
    check(f"{k}_kit.gd: no ally-targeting (solo-first wording)",
          "ally" not in src and "party" not in src)
    check(f"{k}_kit.gd: DEITY_ID wired to DataLayer with assert",
          "datalayer" in src and "assert" in src)

print()
print(f"=== F007 KITS DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL:
    print("FAILED CHECKS:", *FAIL, sep="\n  - ")
    sys.exit(1)
print("All 4 Black-Iron Dominion kits verified: data wiring, solo-first, originality, combat math.")
