# Artwork Import Dropbox

Drop finished source artwork or model files here, then run:

```bash
npm run artwork:import
```

For Big Bot uploads, push files directly into this folder on `main`; GitHub will run the auto-import workflow and commit the moved asset plus refreshed reports.

File names must include a permanent asset ID such as `TITAN_001`, `BATTLEFIELD_001`, or `CHARACTER_001`.
Example: `TITAN_001__solara-sunforge__source-file.png`

Supported source extensions: `.glb`, `.gltf`, `.fbx`, `.obj`, `.blend`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.psd`, `.tga`.

The importer moves files into the correct `assets/.../source/<ASSET_ID>/v###/` folder and refreshes validation reports. Unknown IDs are rejected for review.
