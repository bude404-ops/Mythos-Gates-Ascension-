#!/usr/bin/env python3
"""Generate lightweight blockout placement data from Deity Gates tactical blueprint JSON.

Outputs engine-neutral placement rows that can be imported by Unity, Godot, Unreal,
Blender, or a custom grid runtime. No engine dependency required.
"""
from __future__ import annotations

import argparse
import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


@dataclass(frozen=True)
class Placement:
    asset: str
    x: float
    y: float
    z: float
    rot_y: float
    sx: float
    sy: float
    sz: float
    tile_x: int
    tile_y: int
    tile_z: int
    layer: str
    tags: str


def load_blueprint(path: Path, blueprint_id: str | None = None) -> dict[str, Any]:
    payload = json.loads(path.read_text())
    layouts = payload if isinstance(payload, list) else [payload]
    if blueprint_id:
        for layout in layouts:
            if layout.get("id") == blueprint_id:
                return layout
        raise SystemExit(f"Blueprint id not found: {blueprint_id}")
    return layouts[0]


def world_pos(tile: dict[str, Any], tile_size: float, level_height: float) -> tuple[float, float, float]:
    """Return engine-neutral tile-center position: X east, Y up, Z south."""
    return ((tile["x"] + 0.5) * tile_size, tile.get("z", 0) * level_height, (tile["y"] + 0.5) * tile_size)


def asset_scale(asset_lookup: dict[str, dict[str, Any]], name: str) -> tuple[float, float, float]:
    dims = asset_lookup.get(name, {}).get("dimensionsTiles", [1, 1, 1])
    return (float(dims[0]), float(dims[2] if len(dims) > 2 else 1), float(dims[1]))


def validate_layout(layout: dict[str, Any]) -> None:
    dims = layout.get("dimensions", {})
    matrix = layout.get("symbolMatrix", [])
    elevations = layout.get("elevationMatrix", [])
    if len(matrix) != dims.get("height") or any(len(row) != dims.get("width") for row in matrix):
        raise ValueError("symbolMatrix does not match dimensions")
    if len(elevations) != dims.get("height") or any(len(row) != dims.get("width") for row in elevations):
        raise ValueError("elevationMatrix does not match dimensions")
    if not layout.get("modularAssets"):
        raise ValueError("modularAssets list is required")


def placements(layout: dict[str, Any]) -> Iterable[Placement]:
    validate_layout(layout)
    coords = layout.get("coordinateSystem", {})
    tile_size = float(coords.get("tileSizeMeters", 2.0))
    level_height = float(coords.get("levelHeightMeters", 1.0))
    asset_lookup = {a["name"]: a for a in layout.get("modularAssets", [])}

    for row in layout["tiles"]:
        for tile in row:
            wx, wy, wz = world_pos(tile, tile_size, level_height)
            tags = ",".join(tile.get("tags", []))
            base_asset = {
                "stone_floor": "bp_tile_stone_floor_2x2",
                "portal_dais": "bp_tile_portal_dais_2x2_z4",
                "structural_wall": "bp_wall_block_2x2x1",
                "stairs": "bp_stair_segment_2x2_rise1",
                "obelisk_cover": "bp_tile_stone_floor_2x2",
                "water_channel": "bp_water_channel_2x2",
                "void_crack": "bp_tile_stone_floor_2x2",
            }.get(tile.get("tile"), "bp_tile_stone_floor_2x2")
            sx, sy, sz = asset_scale(asset_lookup, base_asset)
            yield Placement(base_asset, wx, wy, wz, 0.0, sx, sy, sz, tile["x"], tile["y"], tile.get("z", 0), "base", tags)

            emitted = {base_asset}
            for component in tile.get("components", []):
                name = {
                    "wall_block": "bp_wall_block_2x2x1",
                    "stair_segment": "bp_stair_segment_2x2_rise1",
                    "obelisk_pillar": "bp_obelisk_pillar_1x1x2",
                    "water_channel_straight": "bp_water_channel_2x2",
                    "void_crack_vfx": "bp_void_crack_vfx_2x2",
                    "spawn_marker": "bp_spawn_marker_player" if tile.get("spawn") == "player" else "bp_spawn_marker_enemy",
                    "portal_arch": "bp_portal_arch_2x1x4",
                    "void_rift": "bp_void_crack_vfx_2x2",
                    "upper_dais": "bp_tile_portal_dais_2x2_z4",
                }.get(component)
                if not name or name in emitted:
                    continue
                emitted.add(name)
                sx, sy, sz = asset_scale(asset_lookup, name)
                offset_y = 0.08 if "marker" in name or "vfx" in name else 0.0
                rot_y = 45.0 if "stair" in name else 0.0
                yield Placement(name, wx, wy + offset_y, wz, rot_y, sx, sy, sz, tile["x"], tile["y"], tile.get("z", 0), "component", tags)


def write_json(out: Path, rows: list[Placement]) -> None:
    out.write_text(json.dumps([p.__dict__ for p in rows], indent=2) + "\n")


def write_csv(out: Path, rows: list[Placement]) -> None:
    with out.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(Placement.__dataclass_fields__.keys()))
        writer.writeheader()
        writer.writerows(p.__dict__ for p in rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate scene blockout placements from a Deity Gates blueprint.")
    parser.add_argument("--input", default="data/tactical-blueprint-layouts.json", help="Blueprint JSON path")
    parser.add_argument("--id", default=None, help="Specific blueprint id")
    parser.add_argument("--out", default="dist/blueprint-scene-placements.json", help="Output file")
    parser.add_argument("--format", choices=["json", "csv"], default="json")
    args = parser.parse_args()

    layout = load_blueprint(Path(args.input), args.id)
    rows = list(placements(layout))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if args.format == "csv":
        write_csv(out, rows)
    else:
        write_json(out, rows)
    print(json.dumps({"ok": True, "blueprint": layout["id"], "placements": len(rows), "out": str(out)}, indent=2))


if __name__ == "__main__":
    main()
