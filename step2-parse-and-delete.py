import subprocess
import os
import time

print("=" * 60)
print("  STEP 2: PARSE AND DELETE ALL PROJECTS")
print("=" * 60)
print()

# Read the projects list file
if not os.path.exists('projects-page1.txt'):
    print("ERROR: projects-page1.txt not found!")
    print("Please run step1-list-projects.bat first")
    exit()

with open('projects-page1.txt', 'r', encoding='utf-8') as f:
    content = f.read()

print("Parsing projects list...")
print()

# Extract project names
projects = []
lines = content.split('\n')

for line in lines:
    line = line.strip()
    # Look for lines with vercel.app URLs
    if 'vercel.app' in line and 'https://' in line:
        parts = line.split()
        if parts:
            project_name = parts[0]
            if '-' in project_name and project_name not in projects:
                projects.append(project_name)

print("=" * 60)
print(f"  FOUND {len(projects)} PROJECTS")
print("=" * 60)
print()

if len(projects) == 0:
    print("No projects found. Check projects-page1.txt file.")
    exit()

# Show all projects
print("Projects to be deleted:")
print("-" * 60)
for i, project in enumerate(projects, 1):
    print(f"  {i}. {project}")
print()

# Check for pagination
if '--next' in content:
    print("⚠️  WARNING: There are MORE projects (pagination detected)")
    print("   This script will only delete projects shown above.")
    print("   You may need to run this multiple times.")
    print()

# Confirm
print("=" * 60)
print("  READY TO DELETE")
print("=" * 60)
response = input("\nType 'DELETE' to confirm deletion: ")

if response != 'DELETE':
    print("\nDeletion cancelled.")
    exit()

print("\nDeleting projects...")
print("=" * 60)

# Delete each project
deleted = 0
errors = 0

for i, project in enumerate(projects, 1):
    print(f"\n[{i}/{len(projects)}] Deleting: {project}")
    try:
        # Use os.system instead of subprocess for better Windows compatibility
        result = os.system(f'vercel remove {project} --yes')
        
        if result == 0:
            print(f"    ✓ Deleted successfully")
            deleted += 1
        else:
            print(f"    ✗ Error (exit code {result})")
            errors += 1
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
            
    except Exception as e:
        print(f"    ✗ Error: {e}")
        errors += 1

# Summary
print()
print("=" * 60)
print("  DELETION COMPLETE")
print("=" * 60)
print(f"  Total projects: {len(projects)}")
print(f"  Deleted: {deleted}")
print(f"  Errors: {errors}")
print("=" * 60)
print()

if '--next' in content:
    print("⚠️  There may be more projects!")
    print("   Run step1-list-projects.bat again to check")
else:
    print("✓ All projects deleted!")
