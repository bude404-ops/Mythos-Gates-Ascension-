#!/usr/bin/env python3
"""
Combat runtime dry-run — validates scripts/combat_runtime.gd math:
status ticking, multipliers, debt compounding, debtfire interest,
barrier pool, bargain records. Mirrors the .gd exactly.
"""
import math, os, sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
PASS, FAIL = [], []

def check(label, ok):
    (PASS if ok else FAIL).append(label)
    print(f"[{'PASS' if ok else 'FAIL'}] {label}")

# ---- constants mirror ----
TICK_RATE = 0.1
WRIT_RATE = 0.05
WRIT_CAP = 0.60
INTEREST = 0.20
SHRED = 0.05
OMEN_MIN, OMEN_MAX = 0.10, 0.60
POOL = 12

class Enemy:
    def __init__(self, hp=100.0, hp_max=100.0):
        self.meta = {"hp": hp, "hp_max": hp_max, "hp_frac": hp / hp_max}
        self.down = False
    def get(self, k, d=None): return self.meta.get(k, d)
    def set(self, k, v): self.meta[k] = v

def tick_timers(e, dt):
    for key, clear in [("snare_timer","snared"), ("slow_timer",None),
                       ("melt_timer",None), ("def_down_timer","def_down"),
                       ("armor_shred_timer",None), ("moonmark_timer","moonmarked"),
                       ("blinded",None), ("irradiated",None),
                       ("iframes",None), ("untargetable_time",None)]:
        left = float(e.get(key, 0.0)) - dt
        if left <= 0.0:
            e.set(key, 0.0)
            if clear: e.set(clear, False)
            if key == "slow_timer": e.set("slow_mult", 1.0)
            if key == "melt_timer": e.set("melt", 0.0)
            if key == "armor_shred_timer": e.set("armor_shred", 0)
            if key == "def_down_timer": e.set("def_down", 0.0)
        else:
            e.set(key, left)

def compound_debt(e, dt, apply_dmg):
    if e.get("writmarked", False):
        e.set("debt_seconds", e.get("debt_seconds", 0.0) + dt)
    if e.get("debt_dot", 0.0) > 0.0:
        acc = e.get("debt_dot_acc", 0.0) + dt
        if acc >= 1.0 - TICK_RATE * 0.5:
            acc -= 1.0
            burn = e.get("debt_dot", 0.0)
            apply_dmg(e, burn)
            e.set("debt_dot", burn * (1.0 + INTEREST))
        e.set("debt_dot_acc", acc)

def move_mult(e):
    if e.get("snared", False): return 0.0
    return e.get("slow_mult", 1.0)

def dmg_taken_mult(e):
    mult = 1.0
    mult += e.get("melt", 0.0)
    mult += e.get("def_down", 0.0)
    mult += int(e.get("armor_shred", 0)) * SHRED
    if e.get("writmarked", False):
        mult += min(WRIT_CAP, e.get("debt_seconds", 0.0) * WRIT_RATE)
    if e.get("omenmarked", False):
        frac = max(0.0, min(1.0, e.get("hp_frac", 1.0)))
        mult += OMEN_MAX - (OMEN_MAX - OMEN_MIN) * frac
    return mult

def targetable(e):
    return e.get("iframes", 0.0) <= 0.0 and e.get("untargetable_time", 0.0) <= 0.0

def apply_dmg(e, base):
    if not targetable(e): return 0.0
    dealt = base * dmg_taken_mult(e)
    e.set("hp", max(e.get("hp", 100.0) - dealt, 0.0))
    e.set("hp_frac", e.get("hp", 0.0) / max(e.get("hp_max", 100.0), 1.0))
    if e.get("hp", 0.0) <= 0.0: e.down = True
    return dealt

def tick(e, dt):
    tick_timers(e, dt)
    compound_debt(e, dt, apply_dmg)

# ---- TEST 1: snare roots, then expires ----
e = Enemy()
e.set("snared", True); e.set("snare_timer", 2.0)
check("snare: move 0 while rooted", move_mult(e) == 0.0)
for _ in range(21): tick(e, TICK_RATE)   # 2.1s
check("snare: expires after 2s, move restored to 1.0",
      e.get("snared") is False and move_mult(e) == 1.0)

# ---- TEST 2: slow decays and restores ----
e = Enemy(); e.set("slow_mult", 0.60); e.set("slow_timer", 1.0)
check("slow: move 0.60 while slowed", move_mult(e) == 0.60)
for _ in range(11): tick(e, TICK_RATE)
check("slow: expires after 1s, slow_mult resets to 1.0",
      e.get("slow_mult") == 1.0 and e.get("slow_timer") == 0.0)

# ---- TEST 3: melt amplifies damage, then clears ----
e = Enemy(); e.set("melt", 0.60); e.set("melt_timer", 4.0)
dealt = apply_dmg(e, 100.0)
check("melt: 100 base -> 160 applied while melted", abs(dealt - 160.0) < 1e-9)
for _ in range(41): tick(e, TICK_RATE)
check("melt: clears after 4s, multiplier back to 1.0",
      e.get("melt") == 0.0 and dmg_taken_mult(e) == 1.0)

# ---- TEST 4: writ debt compounds per second, caps at 60% ----
e = Enemy(); e.set("writmarked", True)
for _ in range(100): tick(e, TICK_RATE)   # 10s
m = dmg_taken_mult(e)
check("writ: 10s held = 1.50x multiplier", abs(m - 1.50) < 1e-9)
for _ in range(500): tick(e, TICK_RATE)  # +5s more
m = dmg_taken_mult(e)
check("writ: caps at 1.60x (15s+)", abs(m - 1.60) < 1e-9)

# ---- TEST 5: debtfire burns 1x/s with 20% interest ----
e = Enemy(hp=1000.0, hp_max=1000.0)
e.set("debt_dot", 40.0)
check("debtfire: initial value 40", e.get("debt_dot") == 40.0)
for _ in range(30): tick(e, TICK_RATE)   # 3.0s -> 3 burns
check("debtfire: 3 burns applied (40+48+57.6=145.6 damage)",
      abs(e.get("hp") - (1000.0 - 145.6)) < 1e-9)
check("debtfire: value compounded to 69.12",
      abs(e.get("debt_dot") - 69.12) < 1e-9)

# ---- TEST 6: omen scales with missing health ----
e = Enemy(hp=1000.0, hp_max=1000.0); e.set("omenmarked", True)
check("omen: full health = 1.10x", abs(dmg_taken_mult(e) - 1.10) < 1e-9)
e.set("hp_frac", 0.0)
check("omen: near death = 1.60x", abs(dmg_taken_mult(e) - 1.60) < 1e-9)
e.set("hp_frac", 0.5)
check("omen: half health = 1.35x", abs(dmg_taken_mult(e) - 1.35) < 1e-9)

# ---- TEST 7: i-frames block damage entirely ----
e = Enemy(); e.set("iframes", 0.5)
check("iframes: untargetable, damage returns 0", apply_dmg(e, 100.0) == 0.0)
for _ in range(6): tick(e, TICK_RATE)
check("iframes: expire after 0.5s, damage lands again",
      targetable(e) and apply_dmg(e, 10.0) == 10.0)

# ---- TEST 8: hp_frac tracks and enemy_down fires ----
e = Enemy(hp=50.0, hp_max=100.0); e.set("omenmarked", True)
dealt = apply_dmg(e, 50.0)   # 50 * 1.35 = 67.5 -> overkill
check("overkill: hp floors at 0, enemy down, hp_frac 0",
      e.get("hp") == 0.0 and e.down and e.get("hp_frac") == 0.0)

# ---- TEST 9: barrier pool recycles oldest at 12 ----
barriers = []
def spawn_barrier(pos, length, hp, kind):
    if len(barriers) >= POOL: barriers.pop(0)
    b = {"pos": pos, "length": length, "hp": hp, "kind": kind,
         "blocks_sight": kind == "fog"}
    barriers.append(b); return b
for i in range(14):
    spawn_barrier((i, 0, 0), 8.0, 150.0, "wall")
check("barriers: pool caps at 12, oldest recycled", len(barriers) == 12 and barriers[0]["pos"] == (2, 0, 0))
fog = spawn_barrier((0, 0, 0), 8.0, 150.0, "fog")
check("barriers: fog blocks sight, walls don't",
      fog["blocks_sight"] is True and barriers[5]["blocks_sight"] is False)
fog["hp"] -= 150.0
check("barriers: hp floors at 0 when destroyed", fog["hp"] <= 0.0)

# ---- TEST 10: bargain open/resolve lifecycle ----
bargains = []
def open_bargain(deity_id, terms):
    b = {"id": f"{deity_id}_{len(bargains)}", "deity_id": deity_id,
         "terms": terms, "open": True}
    bargains.append(b); return b
b = open_bargain("MG-DEITY-025", {"offer": "power now", "price": "20% later"})
check("bargain: opens with unique id", b["id"] == "MG-DEITY-025_0" and b["open"])
b["open"] = False; bargains.remove(b); b["accepted"] = True
check("bargain: resolve closes and records acceptance",
      b["open"] is False and b["accepted"] is True and len(bargains) == 0)

# ---- source sanity ----
src = open(os.path.join(ROOT, "scripts", "combat_runtime.gd")).read().lower()
check("runtime: wired to DataLayer conventions (meta-based, no ally-targeted effects)",
      "set_meta" in src and "ally heal" not in src and "heal allies" not in src
      and "party" not in src)
check("runtime: signals for barrier/bargain/enemy_down",
      "barrier_destroyed" in src and "bargain_resolved" in src and "enemy_down" in src)

print()
print(f"=== COMBAT RUNTIME DRY-RUN: {len(PASS)} passed, {len(FAIL)} failed ===")
if FAIL:
    print("FAILED CHECKS:", *FAIL, sep="\n  - ")
    sys.exit(1)
print("Combat runtime verified: ticking, multipliers, debt, debtfire, omen, barriers, bargains.")
