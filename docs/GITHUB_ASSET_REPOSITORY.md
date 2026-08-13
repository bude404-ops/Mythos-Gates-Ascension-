# Titan Gates: Ascension — GitHub Asset Repository

GitHub is the central source of truth for artwork and 3D asset files. Reaper is the development and management layer, not the required importer.

## Flow

External Art/3D Tool → GitHub → Asset Registry → Reaper/Development Tools → Game

Assets may come from Blender, AI art tools, AI 3D generators, human artists, other modeling software, GitHub uploads, GitHub Desktop, Git LFS, or future asset-management tools.

## Permanent IDs

Every asset uses a stable ID such as `TITAN_001`, `CHARACTER_001`, `CREATURE_001`, `BATTLEFIELD_001`, `GATE_001`, `WEAPON_001`, or `PROP_001`.

Never reuse an asset ID. The ID survives filename changes, folder moves, redesigns, model replacements, and new versions.

## Source vs runtime

- `source/` preserves the original uploaded file.
- `game_ready/` holds optimized runtime outputs.
- `preview/` and `assets/previews/` hold small previews.

Do not overwrite the source file to optimize it.

## Adding an asset from any tool

1. Choose the canon asset ID from `asset_registry/github-asset-registry.json`.
2. Add the source file under the matching folder, ideally with the ID in the path or filename.
   - Example: `assets/3d/titans/source/TITAN_001/v001/model.glb`
3. Optionally add or update a manifest under `manifests/assets/` using `ASSET_MANIFEST_TEMPLATE.json`.
4. Run detection and validation:
   - `npm run assets:detect`
   - `npm run assets:validate`
5. Commit the asset, registry update, and validation report.

If the asset cannot be matched to canon, it is reported as `NEEDS_CANON_REVIEW`. Do not invent lore to force a match.

## Large files

Large models, Blender files, high-resolution art, large textures, and animation sources are tracked through Git LFS policy in `.gitattributes`. JSON, manifests, blueprints, configuration, and small previews stay in normal Git.

The registry can later point to external object storage using `storage.external_uri` without changing the permanent asset ID.

## Validation states

Validation reports one of:

- `VALID`
- `WARNING`
- `ERROR`
- `NEEDS_REVIEW`

Validation never rewrites source assets.

## Current visual direction

Titan Gates uses 3D characters, 3D Titans, 3D creatures, 3D battlefields, 3D gates, 3D props, materials, animations, VFX, and lighting. Old 2D battlefield sprite systems are deprecated for active character/enemy gameplay.
