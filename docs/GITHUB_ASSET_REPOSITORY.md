# Mythos Gates: Ascension — GitHub Asset Repository

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


## Easiest import path

Use this path when building toward the finished product. No one needs to hand-edit registry JSON.

```bash
npm run artwork:queue
```

That creates/refreshes:

- `artwork_import/ARTWORK_BUILD_QUEUE.md` — human-readable next assets to build.
- `artwork_import/ARTWORK_BUILD_QUEUE.json` — machine-readable queue.
- `artwork_import/dropbox/` — safe drop zone for finished source art/models.

Then build/export the asset from Blender, an AI art tool, an AI 3D tool, or a human artist package. Name the file with the permanent ID:

```text
TITAN_001__solara-sunforge__source-file.png
BATTLEFIELD_001__first-reopening-gate__source-file.glb
CHARACTER_001__mesha-gate-scribe__source-file.webp
```

Drop it into `artwork_import/dropbox/`, then run:

```bash
npm run artwork:import
```

The importer will:

1. Read the permanent ID from the file/folder name.
2. Move the source file into the correct canonical folder under `assets/.../source/<ASSET_ID>/v###/`.
3. Preserve the original source file; it never overwrites an existing source.
4. Run detection and validation.
5. Regenerate manifests and creator handoff packets.
6. Refresh the artwork build queue so the next missing assets rise to the top.
7. Write `validation/reports/artwork-import-report.json`.

For a full finished-product asset pass after files are in the dropbox:

```bash
npm run artwork:finish
```

If a file has no permanent ID, or the ID is not reserved, it is skipped for canon review. Do not invent lore or rename assets to force a match.

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

Mythos Gates uses 3D characters, 3D Titans, 3D creatures, 3D battlefields, 3D gates, 3D props, materials, animations, VFX, and lighting. Old 2D battlefield sprite systems are deprecated for active character/enemy gameplay.

## Big Bot auto-import

Big Bot can upload finished artwork or model exports directly into the GitHub dropbox and let the repository import them automatically.

### Upload target

Use the repository dropbox folder:

```text
artwork_import/dropbox/
```

### Required filename rule

Every uploaded file must include the permanent asset ID in the filename or folder path.

Good examples:

```text
TITAN_001__aten-ra-solar-law-monolith__source-file.png
CHARACTER_001__mesha-gate-scribe__source-file.webp
BATTLEFIELD_001__the-first-reopening-gate__source-file.glb
```

Supported source extensions: `.glb`, `.gltf`, `.fbx`, `.obj`, `.blend`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.psd`, `.tga`.

### What happens after upload

When Big Bot pushes to `main` under `artwork_import/dropbox/`, GitHub runs the artwork auto-import workflow. The workflow:

1. Runs `npm run artwork:auto-import`.
2. Moves valid source files into the correct permanent `assets/.../source/<ASSET_ID>/v###/` folder.
3. Refreshes the GitHub asset registry, manifests, handoff packets, import report, build output, and index freshness checks.
4. Commits the imported artwork and generated registry updates back to `main`.

The importer never overwrites an existing source version and never invents canon. Files with unknown IDs or unsupported extensions fail the workflow for review.

### Big Bot minimum payload

Big Bot only needs three things:

- The finished file bytes.
- A reserved Mythos Gates asset ID from `artwork_import/ARTWORK_BUILD_QUEUE.json`.
- A filename containing that ID.

No manual registry editing is required.

