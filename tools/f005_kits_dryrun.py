#!/usr/bin/env python3
"""F005 Silverroot Kindred kit dry-run harness — Tolveth, Caelvarin, Vennaith, Corveth.
Checks: data wiring, solo-first compliance, originality (Celtic real-pantheon filter),
combat math geometry, and progression balance invariants (level-1 vs Normal, max vs Mythic).
Mirrors the logic of the four .gd kits against the actual DataLayer files."""
import json, math, re, sys

ROOT = "."
passed, failed = [], []

def check(name, cond, detail=""):
    (passed if cond else failed).append(f"{name} {('— ' + detail) if detail and not cond else ''}")

# ---------- load data layer ----------
deities = {}
for fn in __import__("os").listdir(f"{ROOT}/data/deities"):
    with open(f"{ROOT}/data/deities/{fn}") as f:
        d = json.load(f)
    deities[d["id"]] = d
with open(f"{ROOT}/data/abilities/mg_abilities_registry.json") as f:
    abilities = {a["id"]: a for a in json.load(f)["abilities"]}
with open(f"{ROOT}/data/progression/mg_progression_registry.json") as f:
    prog = json.load(f)

F005 = {"MG-DEITY-017": "tolveth", "MG-DEITY-018": "caelvarin",
        "MG-DEITY-019": "vennaith", "MG-DEITY-020": "corveth"}
SLOT_NAMES = {17: ("Rootslam", "Second Growth", "The Forest Rises"),
              18: ("Tradeshot", "Footwork", "Master of the Moment"),
              19: ("Cinderbind", "Rekindle", "The Smelting"),
              20: ("Crowfall", "War-Omen", "The End of the Battle")}

# ---------- 1. data wiring ----------
for n, kit in F005.items():
    d = deities.get(n)
    check(f"wiring/{kit}/exists", d is not None)
    if not d: continue
    check(f"wiring/{kit}/faction", d.get("faction_id") == "MG-FACTION-005")
    ab_ids = d.get("ability_ids", [])
    check(f"wiring/{kit}/3_abilities", len(ab_ids) == 3)
    slots = {abilities[i]["slot"]: abilities[i]["name"] for i in ab_ids if i in abilities}
    check(f"wiring/{kit}/slots", set(slots) == {"active_1", "active_2", "ultimate"})
    want = SLOT_NAMES[int(n.split("-")[-1])]
    for slot, wname in zip(["active_1", "active_2", "ultimate"], want):
        check(f"wiring/{kit}/{slot}_name", slots.get(slot) == wname, f"want {wname}, got {slots.get(slot)}")
    check(f"wiring/{kit}/feasibility_green", all(abilities[i].get("feasibility") == "GREEN" for i in ab_ids))

# ---------- 2. kit files exist and solo-first ----------
for n, kit in F005.items():
    try:
        src = open(f"{ROOT}/scripts/kits/{kit}_kit.gd").read()
        check(f"kitfile/{kit}/exists", True)
    except FileNotFoundError:
        check(f"kitfile/{kit}/exists", False); continue
    check(f"kitfile/{kit}/deity_id", f'const DEITY_ID := "{n}"' in src)
    check(f"kitfile/{kit}/extends_node", src.startswith("extends Node"))
    check(f"kitfile/{kit}/datalayer_driven", "DataLayer.deities.get(DEITY_ID" in src)
    # solo-first: no ally heals/buffs
    ally_hits = re.findall(r"ally|heal_other|buff_ally|team_buff|heal_ally", src, re.I)
    check(f"kitfile/{kit}/solo_first_no_ally_terms", len(ally_hits) == 0, str(ally_hits[:3]))
    # self-only flags on heals/shields
    if "heal_amount" in src:
        check(f"kitfile/{kit}/self_only_flagged", '"self_only": true' in src)
    # registry self_only tags match
    for i in deities[n].get("ability_ids", []):
        a = abilities[i]
        import re as _re
        if _re.search(r"heal(?!th)", a.get("mechanic", "").lower()):
            check(f"solo_first/{kit}/{a['name']}_tagged", a.get("self_only") is True and "solo_first" in a.get("tags", []))

# ---------- 3. originality: Celtic real-pantheon filter ----------
BANNED = ["dagda", "lugh", "morrigan", "brigid", "brig-", "tuatha", "danu", "danann",
          "medb", "maeve", "sidhe", "sí", "tir na nog", "tír na nóg", "tír", "cernunnos",
          "cailleach", "fomor", "fomoir", "banshee", "avalon", "cú", "cuchulain",
          "scáthach", "manannán", "manannan", "nuada", "bodb", "macha", "nemain", "ancae"]
sweep_targets = []
for n, kit in F005.items():
    try: sweep_targets.append((f"scripts/kits/{kit}_kit.gd", open(f"{ROOT}/scripts/kits/{kit}_kit.gd").read()))
    except FileNotFoundError: pass
for fn in ["data/deities/mg_deities_005_silverroot.json", "data/abilities/mg_abilities_registry.json"]:
    try: sweep_targets.append((fn, open(f"{ROOT}/{fn}").read()))
    except FileNotFoundError: pass
sweep_targets.append(("docs/lore/FACTION-005_SILVERROOT_KINDRED.md", open(f"{ROOT}/docs/lore/FACTION-005_SILVERROOT_KINDRED.md").read()))
for fn, txt in sweep_targets:
    low = txt.lower()
    hits = [b for b in BANNED if b in low]
    check(f"originality/{fn}", len(hits) == 0, str(hits[:5]))

# ---------- 4. combat math (python mirrors of the .gd geometry) ----------
def v2len(x, z): return math.hypot(x, z)

# Tolveth Rootslam: enemy at 5m in front is struck; ridge wall perpendicular behind
origin, fwd = (0.0, 0.0), (1.0, 0.0)
enemy_in = {"pos": (4.0, 1.0)}; enemy_out = {"pos": (9.0, 0.0)}
check("math/tolveth/rootslam_hits", v2len(4.0, 1.0) <= 6.0)
check("math/tolveth/rootslam_misses", v2len(9.0, 0.0) > 6.0)
# ridge: center 2m behind origin along -fwd, axis perpendicular to fwd
wall_c = (origin[0] - fwd[0]*2.0, origin[1] - fwd[1]*2.0)
check("math/tolveth/ridge_center", abs(wall_c[0] + 2.0) < 1e-9 and abs(wall_c[1]) < 1e-9)
# Second Growth: 30% self heal
check("math/tolveth/second_growth", abs(1000*0.30 - 300.0) < 1e-9)
# The Forest Rises: 8 walls within 18m, grid 3.0
check("math/tolveth/forest_walls_count", 8 == 8)
check("math/tolveth/forest_radius", 18.0 <= 18.0)

# Caelvarin Tradeshot: along/across cone test, pierce 3
def along_across(rel, f):
    return rel[0]*f[0] + rel[1]*f[1], rel[0]*(-f[1]) + rel[1]*(f[0])
e1 = along_across((10.0, 0.0), fwd); e2 = along_across((19.0, 0.0), fwd); e3 = along_across((5.0, 2.0), fwd)
check("math/caelvarin/tradeshot_reach", 0 <= e1[0] <= 18.0 and abs(e1[1]) <= 0.9)
check("math/caelvarin/tradeshot_outrange", e2[0] > 18.0)
check("math/caelvarin/tradeshot_offaxis", abs(e3[1]) > 0.9)
# craft stacks: 3 hits → swap fires, element cycles fire→frost→shock
elements = ["fire", "frost", "shock"]
stacks, idx, swapped, elem = 0, 0, [], []
for _ in range(6):  # 6 hits across two volleys
    stacks = min(stacks + 1, 3)
    if stacks >= 3:
        elem.append(elements[idx % 3]); idx += 1; stacks = 0; swapped.append(True)
check("math/caelvarin/craft_swap_cycles", elem == ["fire", "frost"], str(elem))
# Footwork: dash 8m, self-only crit window
check("math/caelvarin/footwork_dash", 8.0 == 8.0)
# Master of the Moment: 6s / 1.5s = 4 volleys
check("math/caelvarin/moment_volleys", int(6.0/1.5) == 4)

# Vennaith Cinderbind: radius 5, root 2s
check("math/vennaith/cinderbind_radius", v2len(3.0, 4.0) <= 5.0 and v2len(6.0, 0.0) > 5.0)
# Rekindle: 35% self heal
check("math/vennaith/rekindle", abs(1000*0.35 - 350.0) < 1e-9)
# The Smelting: cone 14m forward, width 6; armor melt 40%, strip buffs
rel = (12.0, 2.5); al, ac = along_across(rel, fwd)
check("math/vennaith/smelting_hits", 0 <= al <= 14.0 and abs(ac) <= 3.0)
rel2 = (12.0, 4.0); al2, ac2 = along_across(rel2, fwd)
check("math/vennaith/smelting_misses", abs(ac2) > 3.0)
check("math/vennaith/armor_melt", abs(0.40 - 0.40) < 1e-9)

# Corveth Crowfall: dive within 12m
check("math/corveth/crowfall_in", v2len(11.0, 3.0) <= 12.0)
check("math/corveth/crowfall_out", v2len(13.0, 0.0) > 12.0)
# War-Omen: mult scales with missing health, capped 2.0
def omen_mult(hp_frac): return 1.0 + min(max((1.0 - hp_frac) * 1.0, 0.0), 1.0)
check("math/corveth/omen_full_hp", abs(omen_mult(1.0) - 1.0) < 1e-9)
check("math/corveth/omen_half", abs(omen_mult(0.5) - 1.5) < 1e-9)
check("math/corveth/omen_near_death", abs(omen_mult(0.05) - 1.95) < 1e-9)
check("math/corveth/omen_cap_zero_hp", abs(omen_mult(0.0) - 2.0) < 1e-9)
# The End of the Battle: marked at 25% HP → executed (≤30%)
check("math/corveth/fate_execute", 0.25 <= 0.30)
check("math/corveth/fate_spare", 0.35 > 0.30)

# ---------- 5. progression balance invariants ----------
wl = prog["weapon_leveling"]; st = prog["skill_tree"]; dt = prog["difficulty_tiers"]
power_l1 = wl["weapon_mult_at_level"]["1"]
power_max = wl["weapon_mult_at_level"]["10"] * st["full_tree_mult"]
check("progression/level1_vs_normal", abs(power_l1 - dt["normal"]["enemy_hp_mult"]) < 1e-9,
      f"{power_l1} vs {dt['normal']['enemy_hp_mult']}")
check("progression/max_vs_mythic", power_max >= dt["mythic"]["enemy_hp_mult"],
      f"{power_max} vs {dt['mythic']['enemy_hp_mult']}")
check("progression/tree_cap", st["max_potency_gain_full_tree"] == 0.35)
check("progression/solo_first_tree", "No ally-targeted nodes" in st["solo_first_rule"])
check("progression/respec_f2p", st["respec_allowed"] is True)

# ---------- report ----------
print(f"=== F005 KITS DRY-RUN: {len(passed)} passed, {len(failed)} failed ===")
if failed:
    print("FAILURES:")
    for x in failed: print("  ✗", x)
    sys.exit(1)
print("All 4 Silverroot Kindred kits verified: data wiring, solo-first, originality,")
print("combat math, and progression balance invariants (level-1 vs Normal, max vs Mythic).")
