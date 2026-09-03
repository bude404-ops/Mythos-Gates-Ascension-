#!/usr/bin/env python3
"""
One-shot patcher: adds a uniform `cast_slot(slot, ctx)` override to every kit,
routing ctx fields to each kit's own typed functions. Idempotent: kits that
already have cast_slot are skipped. Matcher priority: exact name first, then
prefix matches (longest), the_-stripped variants, substring last. Functions
taking a `delta` arg are helpers and never selected.
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
DATA = os.path.join(ROOT, "data")

# Manual function overrides where a slot maps to a non-derivable function.
MANUAL_FN = {
    ("MG-DEITY-024", "active_1"): "place_node",   # Threshold Glow (place; swap is separate)
    ("MG-DEITY-028", "active_2"): "strike",         # Default
}

def normalize(name: str) -> str:
    s = name.lower().replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return re.sub(r"_+", "_", s).strip("_")

def load(p):
    with open(os.path.join(DATA, p)) as f: return json.load(f)

deities = {}
for fn in sorted(os.listdir(os.path.join(DATA, "deities"))):
    d = load(f"deities/{fn}"); deities[d["id"]] = d
abilities = {a["id"]: a for a in load("abilities/mg_abilities_registry.json")["abilities"]}

def arg_expr(a: str) -> str:
    a = a.strip()
    m = {
        "origin": 'ctx["player_pos"]', "self_pos": 'ctx["player_pos"]',
        "from_pos": 'ctx["player_pos"]', "center": 'ctx["player_pos"]',
        "storm_origin": 'ctx["player_pos"]', "away_from": 'ctx["player_pos"]',
        "circle_center": 'ctx["target_pos"]', "target_pos": 'ctx["target_pos"]',
        "to_pos": 'ctx["target_pos"]', "pos": 'ctx["target_pos"]',
        "enemies": 'ctx["enemies"]', "marked_enemies": 'ctx["enemies"]',
        "max_hp": 'ctx["max_hp"]', "target": 'ctx["target"]',
        "facing": 'ctx["facing"]', "forward": 'ctx["facing"]', "march_dir": 'ctx["facing"]',
        "current_hp": '(ctx["target"].get_meta("hp", 100.0) if ctx["target"] else 100.0)',
    }
    if a in m: return m[a]
    if a == "cover_objects": return 'ctx.get("cover_objects", [])'
    if a == "terrain_effects": return 'ctx.get("terrain_effects", [])'
    if a in ("active_debuffs", "active_self_debuffs"): return 'ctx.get("self_debuffs", [])'
    if a == "kills": return 'ctx.get("kills", 0)'
    if a == "sun_spots": return 'ctx.get("sun_spots", [])'
    if a == "target_attacking_decoy": return 'ctx.get("target_attacking_decoy", false)'.replace("false", "false")
    return None

patched, skipped = [], []
for did, d in deities.items():
    kit_name = d["name"].lower() + "_kit"
    path = os.path.join(ROOT, "scripts", "kits", f"{kit_name}.gd")
    if not os.path.exists(path):
        print(f"WARN: no kit file for {did} ({kit_name})"); continue
    src = open(path).read()
    if "func cast_slot" in src:
        skipped.append(kit_name); continue

    funcs = dict(re.findall(r"^func ([a-z_0-9]+)\(([^)]*)\)", src, re.M))
    # helpers with a delta arg are tickers, never cast entries
    helpers = {f for f, sig in funcs.items() if "delta" in sig}
    lines = ["", "# ------------------------------------------------ uniform dispatch",
             "## Uniform dispatch for the combat loop. ctx keys:",
             "##   player_pos, target_pos, facing, enemies, target, max_hp",
             'const SLOT_FN := {']
    for slot in ["active_1", "active_2", "ultimate"]:
        i = ["active_1", "active_2", "ultimate"].index(slot)
        ab = abilities[d["ability_ids"][i]]
        tok = normalize(ab["name"])
        fn = MANUAL_FN.get((did, slot))
        if fn is None:
            cands = [f for f in funcs if f not in helpers and f != "_ready"]
            toks = [tok] + ([tok[4:]] if tok.startswith("the_") else [])
            exact = [f for f in cands if f in toks]
            pre = sorted([f for f in cands
                          if any(f.startswith(t) or t.startswith(f) for t in toks)],
                         key=len, reverse=True)
            sub = sorted([f for f in cands
                          if any(f in t for t in toks) and f not in pre],
                         key=len, reverse=True)
            pick = (exact or pre or sub or [None])[0]
            fn = pick
        if fn is None or fn not in funcs:
            print(f"ERROR: {kit_name}: no function matches {slot} '{ab['name']}' (tok={tok})")
            sys.exit(1)
        lines.append(f'\t"{slot}": "{fn}",')
    lines.append("}")
    lines.append("")
    lines.append("func cast_slot(slot: String, ctx: Dictionary) -> Dictionary:")
    lines.append('\tvar fn: String = SLOT_FN.get(slot, "")')
    lines.append('\tif fn.is_empty(): return {"cast": false, "why": "unknown slot"}')
    sig = re.findall(r"^func %s\(([^)]*)\)" % fn, src, re.M)
    args = [a.strip().split(":")[0] for a in sig[0].split(",") if a.strip()] if sig else []
    call_args, bad = [], []
    for a in args:
        e = arg_expr(a)
        if e is None: bad.append(a)
        else: call_args.append(e)
    if bad:
        print(f"ERROR: {kit_name}.{fn}: unmapped args {bad}")
        sys.exit(1)
    lines.append('\treturn {"cast": true, "slot": slot, "result": self.callv(fn, [%s])}'
                 % ", ".join(call_args))
    src = src.rstrip() + "\n" + "\n".join(lines) + "\n"
    open(path, "w").write(src)
    patched.append(kit_name)

print(f"Patched {len(patched)} kits; skipped {len(skipped)} (already had cast_slot)")
