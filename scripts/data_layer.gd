extends Node
## Mythos Gates: Ascension — Unified MG- Data Layer (autoload: DataLayer)
## Loads the JSON registry from res://data at startup. All game content is data-driven;
## no real-world mythology, solo-first enforced at the data level (self_only buffs never target allies).

var manifest: Dictionary = {}
var factions: Dictionary = {}      # MG-FACTION-001..008
var deities: Dictionary = {}       # MG-DEITY-001..032
var abilities: Dictionary = {}     # MG-ABILITY-0001..0096
var buffs: Dictionary = {}         # MG-BUFF-* / MG-DEBUFF-*
var chapters: Dictionary = {}      # MG-CHAPTER-XXX-XX
var gates: Dictionary = {}
var npcs: Dictionary = {}
var hollow: Dictionary = {}
var bosses: Dictionary = {}
var dungeons: Dictionary = {}

func _ready() -> void:
	_load_json("res://data/mg_manifest.json", func(d): manifest = d)
	_load_dir("res://data/factions", func(d): factions[d["id"]] = d)
	_load_dir("res://data/deities", func(d): deities[d["id"]] = d)
	var ab := _read("res://data/abilities/mg_abilities_registry.json")
	for a in ab.get("abilities", []):
		abilities[a["id"]] = a
	var bf := _read("res://data/buffs/mg_buffs_registry.json")
	for b in bf.get("statuses", []):
		buffs[b["id"]] = b
	var ch := _read("res://data/chapters/mg_chapters_registry.json")
	for c in ch.get("chapters", []):
		chapters[c["id"]] = c
	var bo := _read("res://data/bosses/mg_bosses_registry.json")
	for b in bo.get("bosses", []):
		bosses[b["id"]] = b
	var dg := _read("res://data/dungeons/mg_dungeons_registry.json")
	for d in dg.get("dungeons", []):
		dungeons[d["id"]] = d
	_load_dir("res://data/gates", func(d): gates[d["id"]] = d)
	_load_dir("res://data/npcs", func(d): npcs[d["id"]] = d)
	_load_dir("res://data/hollow", func(d): hollow[d["id"]] = d)
	print("[DataLayer] MG- registry loaded: %d factions, %d deities, %d abilities, %d chapters" %
		[factions.size(), deities.size(), abilities.size(), chapters.size()])

func _read(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		push_warning("[DataLayer] missing: " + path)
		return {}
	var f := FileAccess.open(path, FileAccess.READ)
	var parsed = JSON.parse_string(f.get_as_text())
	return parsed if parsed is Dictionary else {}

func _load_json(path: String, cb: Callable) -> void:
	var d := _read(path)
	if not d.is_empty(): cb.call(d)

func _load_dir(dir_path: String, cb: Callable) -> void:
	var dir := DirAccess.open(dir_path)
	if dir == null:
		push_warning("[DataLayer] missing dir: " + dir_path)
		return
	dir.list_dir_begin()
	var fn := dir.get_next()
	while fn != "":
		if fn.ends_with(".json"):
			var d := _read(dir_path + "/" + fn)
			if d.has("id"): cb.call(d)
		fn = dir.get_next()
	dir.list_dir_end()

# --- API ---
func get_faction(id: String) -> Dictionary: return factions.get(id, {})
func get_deity(id: String) -> Dictionary: return deities.get(id, {})
func get_ability(id: String) -> Dictionary: return abilities.get(id, {})
func get_buff(id: String) -> Dictionary: return buffs.get(id, {})
func get_chapter(id: String) -> Dictionary: return chapters.get(id, {})
func get_dungeon(id: String) -> Dictionary: return dungeons.get(id, {})
func get_faction_deities(faction_id: String) -> Array:
	return deities.values().filter(func(d): return d.get("faction_id") == faction_id)

## Solo-first enforcement: any buff with self_only=true may never be applied to an ally.
func can_apply_to_ally(buff_id: String) -> bool:
	var b := get_buff(buff_id)
	return not b.get("self_only", false)  # returns false for every self_only buff

## Sothiel's Refraction hook — mirrors an enemy's last-used ability from this registry.
func mirror_enemy_ability(enemy_ability_name: String) -> Dictionary:
	for a in abilities.values():
		if a.get("name", "").to_lower() == enemy_ability_name.to_lower():
			return a
	return {}
