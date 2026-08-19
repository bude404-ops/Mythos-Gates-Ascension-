# Mythos Gates: Ascension — 3D Model Pipeline

## Overview
Converts approved 2D art assets to GLB 3D models using the TRELLIS.2 engine via Hugging Face Inference API.

## Prerequisites

1. **Hugging Face API Token**
   - Get one at: https://huggingface.co/settings/tokens
   - Needs "Read" access at minimum
   - Set as environment variable: `export HF_TOKEN="your_token"`

2. **Approved 2D Art**
   - Must be in `art/approved/` directory
   - PNG format
   - Named: `TG-TITAN-###_name.png`, `TG-CREATURE-###_name.png`, `TG-NPC-###_name.png`, `TG-MAP-###.png`

3. **Python Dependencies**
   ```bash
   pip install requests
   ```

## Usage

### Check token validity
```bash
python3 scripts/trellis_3d_pipeline.py --check
```

### Convert all deities (28)
```bash
python3 scripts/trellis_3d_pipeline.py --batch deities
```

### Convert all creatures (39)
```bash
python3 scripts/trellis_3d_pipeline.py --batch creatures
```

### Convert all NPCs (8)
```bash
python3 scripts/trellis_3d_pipeline.py --batch npcs
```

### Convert all maps (21)
```bash
python3 scripts/trellis_3d_pipeline.py --batch maps
```

### Convert everything (96 total)
```bash
python3 scripts/trellis_3d_pipeline.py --batch all
```

### Convert a single asset
```bash
python3 scripts/trellis_3d_pipeline.py --single TG-TITAN-001_aten-ra
```

### Check progress
```bash
python3 scripts/trellis_3d_pipeline.py --status
```

## Output
- GLB files are saved to `3D_Blueprints/` in the appropriate subdirectory
- Each model gets its own folder matching the 2D asset name
- Already-converted files are skipped on re-runs

## Free Tier Limitations
- Hugging Face free tier has limited GPU quota
- Script handles rate limiting (429) and model loading (503) automatically
- For bulk conversion, a paid HF tier is recommended
- The script processes one model at a time with 2-second delays

## Asset Inventory
| Batch | Count | Source Dir | Output Dir |
|-------|-------|------------|------------|
| Deities | 28 | art/approved/TG-TITAN-*.png | 3D_Blueprints/Characters/Deities/ |
| Creatures | 39 | art/approved/TG-CREATURE-*.png | 3D_Blueprints/Characters/Creatures/ |
| NPCs | 8 | art/approved/TG-NPC-*.png | 3D_Blueprints/Characters/NPCs/ |
| Maps | 21 | art/approved/TG-MAP-*.png | 3D_Blueprints/Battlefields/ |
| **Total** | **96** | | |
