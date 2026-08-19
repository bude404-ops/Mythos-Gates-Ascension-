# Artwork Import Dropbox

Drop finished source artwork or model files here, then run:

```bash
npm run artwork:import
```

File names must include a permanent asset ID such as `DEITY_001`, `BATTLEFIELD_001`, or `CHARACTER_001`.
Example: `DEITY_001__solara-sunforge__source-file.png`

The importer moves files into the correct `assets/.../source/<ASSET_ID>/v###/` folder and refreshes validation reports.
