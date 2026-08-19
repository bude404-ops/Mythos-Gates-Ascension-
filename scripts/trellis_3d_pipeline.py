#!/usr/bin/env python3
"""
Mythos Gates: Ascension — TRELLIS.2 3D Model Pipeline
Converts approved 2D art assets to GLB 3D models.

Requirements:
- Hugging Face API token (set as HF_TOKEN environment variable)
- Approved 2D source images in art/approved/

Usage:
  export HF_TOKEN="your_token_here"
  python3 scripts/trellis_3d_pipeline.py --batch deities      # Convert all 28 deities
  python3 scripts/trellis_3d_pipeline.py --batch creatures    # Convert all 39 creatures
  python3 scripts/trellis_3d_pipeline.py --batch npcs         # Convert all 8 NPCs
  python3 scripts/trellis_3d_pipeline.py --batch maps         # Convert all 21 maps
  python3 scripts/trellis_3d_pipeline.py --batch all          # Convert everything
  python3 scripts/trellis_3d_pipeline.py --single MG-DEITY-001_aten-ra  # Convert one asset
  python3 scripts/trellis_3d_pipeline.py --status             # Show conversion status
"""

import os
import sys
import json
import time
import glob
import argparse
import requests
from pathlib import Path

# Configuration
REPO_ROOT = Path(__file__).parent.parent
ART_DIR = REPO_ROOT / "art" / "approved"
OUTPUT_DIR = REPO_ROOT / "3D_Blueprints"
TRELLIS_API_URL = "https://api-inference.huggingface.co/models/jasperai/TRELLIS-2"

# Batch definitions
BATCHES = {
    "deities": {
        "glob": "MG-DEITY-*.png",
        "dir": "Characters/Deities",
        "total": 28,
    },
    "creatures": {
        "glob": "MG-CREATURE-*.png", 
        "dir": "Characters/Creatures",
        "total": 39,
    },
    "npcs": {
        "glob": "MG-NPC-*.png",
        "dir": "Characters/NPCs",
        "total": 8,
    },
    "maps": {
        "glob": "MG-MAP-*.png",
        "dir": "Battlefields",
        "total": 21,
    },
}

def get_hf_token():
    token = os.environ.get("HF_TOKEN")
    if not token:
        print("ERROR: HF_TOKEN environment variable not set.")
        print("Get a token from https://huggingface.co/settings/tokens")
        print("Set it with: export HF_TOKEN='your_token'")
        sys.exit(1)
    return token

def check_gpu_quota(token):
    """Check if we have GPU quota available"""
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(
            "https://huggingface.co/api/whoami-v2",
            headers=headers
        )
        if response.status_code == 200:
            print(f"✅ HF token valid — logged in as {response.json().get('name','unknown')}")
            return True
        else:
            print(f"❌ HF token invalid: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Token check failed: {e}")
        return False

def convert_image_to_3d(image_path, output_path, token):
    """
    Send a 2D image to TRELLIS.2 and receive a GLB 3D model.
    """
    headers = {"Authorization": f"Bearer {token}"}
    
    with open(image_path, "rb") as f:
        files = {"image": f}
        data = {"task": "image_to_3d", "format": "glb"}
        
        print(f"  Converting {Path(image_path).name} → GLB...")
        
        try:
            response = requests.post(
                TRELLIS_API_URL,
                headers=headers,
                files=files,
                data=data,
                timeout=300  # 5 min timeout per model
            )
            
            if response.status_code == 200:
                # Save GLB file
                with open(output_path, "wb") as f:
                    f.write(response.content)
                print(f"  ✅ Saved: {output_path}")
                return True
            elif response.status_code == 429:
                print(f"  ⏳ Rate limited — waiting 60s...")
                time.sleep(60)
                return False
            elif response.status_code == 503:
                print(f"  ⏳ Model loading — waiting 30s and retrying...")
                time.sleep(30)
                # Retry once
                with open(image_path, "rb") as f2:
                    files2 = {"image": f2}
                    response2 = requests.post(TRELLIS_API_URL, headers=headers, files=files2, data=data, timeout=300)
                    if response2.status_code == 200:
                        with open(output_path, "wb") as f3:
                            f3.write(response2.content)
                        print(f"  ✅ Saved on retry: {output_path}")
                        return True
                    print(f"  ❌ Retry failed: {response2.status_code}")
                    return False
            else:
                print(f"  ❌ Error {response.status_code}: {response.text[:200]}")
                return False
        except Exception as e:
            print(f"  ❌ Exception: {e}")
            return False

def process_batch(batch_name, token):
    batch = BATCHES[batch_name]
    art_files = sorted(ART_DIR.glob(batch["glob"]))
    
    if not art_files:
        print(f"No art files found for batch '{batch_name}' ({batch['glob']})")
        return
    
    print(f"\n{'='*60}")
    print(f"Batch: {batch_name.upper()} — {len(art_files)} files to convert")
    print(f"Output: {OUTPUT_DIR}/{batch['dir']}/")
    print(f"{'='*60}\n")
    
    output_base = OUTPUT_DIR / batch["dir"]
    output_base.mkdir(parents=True, exist_ok=True)
    
    success = 0
    failed = 0
    
    for i, art_file in enumerate(art_files, 1):
        name = art_file.stem  # e.g. MG-DEITY-001_aten-ra
        output_dir = output_base / name
        output_dir.mkdir(parents=True, exist_ok=True)
        output_glb = output_dir / f"{name}.glb"
        
        # Skip if already converted
        if output_glb.exists():
            print(f"[{i}/{len(art_files)}] ⏭️  Already exists: {name}")
            success += 1
            continue
        
        print(f"[{i}/{len(art_files)}] Processing: {name}")
        
        if convert_image_to_3d(art_file, output_glb, token):
            success += 1
        else:
            failed += 1
        
        # Small delay between requests
        time.sleep(2)
    
    print(f"\n--- Batch {batch_name} Complete ---")
    print(f"Success: {success}/{len(art_files)}")
    print(f"Failed: {failed}/{len(art_files)}")
    
    return success, failed

def process_single(asset_name, token):
    """Convert a single asset by name"""
    art_file = ART_DIR / f"{asset_name}.png"
    
    if not art_file.exists():
        print(f"Art file not found: {art_file}")
        return False
    
    # Determine output dir
    if "DEITY" in asset_name:
        out_dir = OUTPUT_DIR / "Characters/Deities" / asset_name
    elif "CREATURE" in asset_name:
        out_dir = OUTPUT_DIR / "Characters/Creatures" / asset_name
    elif "NPC" in asset_name:
        out_dir = OUTPUT_DIR / "Characters/NPCs" / asset_name
    elif "MAP" in asset_name:
        out_dir = OUTPUT_DIR / "Battlefields" / asset_name
    else:
        out_dir = OUTPUT_DIR / "Characters" / asset_name
    
    out_dir.mkdir(parents=True, exist_ok=True)
    output_glb = out_dir / f"{asset_name}.glb"
    
    if output_glb.exists():
        print(f"Already exists: {output_glb}")
        return True
    
    print(f"Converting: {asset_name}")
    return convert_image_to_3d(art_file, output_glb, token)

def show_status():
    """Show 3D conversion status"""
    print("\n" + "="*60)
    print("3D CONVERSION STATUS")
    print("="*60)
    
    for batch_name, batch in BATCHES.items():
        art_files = sorted(ART_DIR.glob(batch["glob"]))
        total = len(art_files)
        
        converted = 0
        for art_file in art_files:
            name = art_file.stem
            output_dir = OUTPUT_DIR / batch["dir"] / name
            glb_file = output_dir / f"{name}.glb"
            if glb_file.exists():
                converted += 1
        
        remaining = total - converted
        pct = (converted / total * 100) if total > 0 else 0
        
        status = "✅" if converted == total else ("🔄" if converted > 0 else "⏳")
        print(f"\n{status} {batch_name.upper()}: {converted}/{total} ({pct:.0f}%)")
        if remaining > 0:
            print(f"   Remaining: {remaining}")
    
    # Total
total_art = sum(len(list(ART_DIR.glob(b["glob"]))) for b in BATCHES.values())
    total_glb = 0
    for batch_name, batch in BATCHES.items():
        for art_file in ART_DIR.glob(batch["glob"]):
            name = art_file.stem
            glb = OUTPUT_DIR / batch["dir"] / name / f"{name}.glb"
            if glb.exists():
                total_glb += 1
    
    print(f"\n{'='*60}")
    print(f"TOTAL: {total_glb}/{total_art} models converted")
    print(f"{'='*60}\n")

def main():
    parser = argparse.ArgumentParser(description="Mythos Gates 3D Pipeline — TRELLIS.2")
    parser.add_argument("--batch", choices=list(BATCHES.keys()) + ["all"], help="Batch to convert")
    parser.add_argument("--single", help="Convert a single asset by name")
    parser.add_argument("--status", action="store_true", help="Show conversion status")
    parser.add_argument("--check", action="store_true", help="Check HF token validity")
    
    args = parser.parse_args()
    
    if args.status:
        show_status()
        return
    
    token = get_hf_token()
    
    if args.check:
        check_gpu_quota(token)
        return
    
    if not check_gpu_quota(token):
        print("Cannot proceed without valid HF token.")
        sys.exit(1)
    
    if args.single:
        process_single(args.single, token)
    elif args.batch:
        if args.batch == "all":
            for b in BATCHES:
                process_batch(b, token)
        else:
            process_batch(args.batch, token)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
