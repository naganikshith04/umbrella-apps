"""
Fix vercel.json files in all apps
Remove deprecated 'builds' and 'name' properties
"""

import os
import json
from pathlib import Path

def fix_vercel_json(app_path):
    """Fix vercel.json in an app directory"""
    vercel_json_path = app_path / "vercel.json"
    
    if not vercel_json_path.exists():
        print(f"  [SKIP] No vercel.json in {app_path.name}")
        return False
    
    # Read current config
    with open(vercel_json_path, 'r') as f:
        config = json.load(f)
    
    # Create minimal config (Vercel auto-detects static sites)
    new_config = {
        "version": 2
    }
    
    # Write back
    with open(vercel_json_path, 'w') as f:
        json.dump(new_config, f, indent=2)
    
    print(f"  [FIXED] {app_path.name}/vercel.json")
    return True

def main():
    """Fix all vercel.json files"""
    script_dir = Path(__file__).parent
    
    print("=" * 60)
    print("Fixing vercel.json files...")
    print("=" * 60)
    print()
    
    fixed = 0
    
    # Process all app directories
    for app_dir in sorted(script_dir.iterdir()):
        if app_dir.is_dir() and not app_dir.name.startswith('.'):
            if fix_vercel_json(app_dir):
                fixed += 1
    
    print()
    print("=" * 60)
    print(f"Fixed {fixed} vercel.json files")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Commit and push changes: git add . && git commit -m 'Fix vercel configs' && git push")
    print("2. Vercel will auto-redeploy")
    print("3. Or run deploy-all-apps.bat again")
    print()

if __name__ == "__main__":
    main()
