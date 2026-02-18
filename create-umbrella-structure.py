"""
Create 5-Domain Umbrella Structure
Organizes apps by category into umbrella domains
"""

import os
import shutil
from pathlib import Path

# Define the 5 umbrella domains and their apps
UMBRELLA_STRUCTURE = {
    "calculator-tools": {
        "domain": "calculatortools.com",
        "description": "Free Online Calculators",
        "apps": [
            "bmi-calculator",
            "loan-calculator",
            "tip-calculator",
            "age-calculator",
            "date-difference-calculator",
            "addsubtract-days-calculator",
            "work-hours-calculator",
        ]
    },
    "text-tools": {
        "domain": "texttools.online",
        "description": "Free Text Processing Tools",
        "apps": [
            "word-counter",
            "case-converter",
            "markdown-preview",
        ]
    },
    "quick-tools": {
        "domain": "quicktools.pro",
        "description": "Quick & Easy Online Tools",
        "apps": [
            "password-generator",
            "qr-code-generator",
            "color-picker",
            "dice-roller",
            "random-name-generator",
            "pomodoro-timer",
        ]
    },
    "converter-tools": {
        "domain": "convertertools.com",
        "description": "Free Unit Converters",
        "apps": [
            "unit-converter--length",
            "unit-converter--temperature",
        ]
    }
}

def create_umbrella_directories():
    """Create umbrella domain directories"""
    script_dir = Path(__file__).parent
    umbrella_dir = script_dir.parent / "umbrella-domains"
    
    print("=" * 70)
    print("Creating 5-Domain Umbrella Structure")
    print("=" * 70)
    print()
    
    # Create umbrella-domains directory
    umbrella_dir.mkdir(exist_ok=True)
    
    for umbrella_name, config in UMBRELLA_STRUCTURE.items():
        domain_dir = umbrella_dir / umbrella_name
        domain_dir.mkdir(exist_ok=True)
        
        print(f"[DOMAIN] {umbrella_name} ({config['domain']})")
        print(f"   {config['description']}")
        print(f"   Apps: {len(config['apps'])}")
        print()
        
        # Copy apps to umbrella domain
        for app_name in config['apps']:
            src_app = script_dir / app_name
            dest_app = domain_dir / app_name
            
            if src_app.exists():
                # Copy if doesn't exist
                if not dest_app.exists():
                    shutil.copytree(src_app, dest_app)
                    print(f"   [OK] Copied: {app_name}")
                else:
                    print(f"   [SKIP] Exists: {app_name}")
            else:
                print(f"   [ERROR] Missing: {app_name}")
        
        print()
    
    print("=" * 70)
    print("Umbrella structure created!")
    print(f"Location: {umbrella_dir}")
    print("=" * 70)
    print()
    print("Next steps:")
    print("1. Review the structure in: umbrella-domains/")
    print("2. Purchase 4 domains ($48/year total)")
    print("3. Deploy each umbrella as a Vercel project")
    print("4. Configure custom domains in Vercel")
    print()

def generate_domain_plan():
    """Generate domain purchase and setup plan"""
    print("=" * 70)
    print("5-Domain Umbrella Strategy")
    print("=" * 70)
    print()
    
    total_cost = 0
    
    for umbrella_name, config in UMBRELLA_STRUCTURE.items():
        cost = 12  # Average domain cost
        total_cost += cost
        
        print(f"[DOMAIN] {config['domain']} (${cost}/year)")
        print(f"   Category: {config['description']}")
        print(f"   Apps: {len(config['apps'])}")
        print(f"   URLs: /{', /'.join(config['apps'][:3])}{'...' if len(config['apps']) > 3 else ''}")
        print()
    
    print(f"[COST] Total: ${total_cost}/year")
    print()
    print("Benefits:")
    print("[+] Domain authority compounds (better SEO)")
    print("[+] Professional branding")
    print("[+] Easy to promote (one domain per niche)")
    print("[+] Internal linking power")
    print("[+] 4 projects vs 18 projects to manage")
    print()

if __name__ == "__main__":
    generate_domain_plan()
    create_umbrella_directories()
