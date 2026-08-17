# Asset Import Standards — Mythos Gates: Ascension

These rules protect the asset pipeline before real AAA source assets begin landing.

## Permanent IDs

- Never rename an existing asset ID to match a file name.
- New assets require a reserved ID before source files are imported.
- Manifests and dependency graph must be regenerated after asset changes.

## Approved lanes

| Lane | Use |
| --- | --- |
| `assets/source/` | Original external or DCC source files. |
| `assets/previews/` | Lightweight preview renders and thumbnails. |
| `assets/game_ready/` | Engine-ready exports after validation. |

## Naming contract

Use lowercase kebab-case descriptors after the permanent ID:

```text
BATTLEFIELD_001_the-first-reopening-gate.glb
TG-TITAN-001_amun-atenra-source.blend
TG-TITAN-001_amun-atenra-preview.webp
```

## Scale and technical expectations

- Units: one engine unit equals one meter unless an engine-specific integration overrides it.
- Pivot: battlefields at world origin; characters at ground contact center.
- Forward axis and up axis must be documented in the manifest.
- Materials must use named, reusable slots.
- Textures must identify albedo/base color, normal, roughness, metallic, emissive, and opacity when used.
- LODs, collision, animation clips, and socket/attachment points must be explicit before game-ready approval.

## Validation before acceptance

- Asset registry validates.
- Manifest exists and references the correct permanent ID.
- Source file extension is allowed by policy.
- No source file overwrites another canonical asset.
- Canon/faction visual bible alignment is reviewed.
