#!/usr/bin/env python3
"""Quick health check: verify that IDs mentioned in project files exist in registry."""
import os
import sys
import json
import argparse
import glob
import re

ID_PATTERNS = {
  # Each pattern reflects a numbered naming scheme in the bridge lore.
  "nodes": re.compile(r"C144N-\d{3}"),
  "rooms": re.compile(r"\bR\d{3}\b"),
  "chapels": re.compile(r"\bC33-\d{2}\b"),
  "arcana": re.compile(r"\bLA-\d{2}-[A-Z-]+\b"),
  "shem": re.compile(r"\bSHEM-\d{2}\b"),
}

# Search JSON and Markdown files for ID references.
SEARCH_GLOBS = ["**/*.json", "**/*.md"]

def load_ids(bridge_root):
  """Load known IDs from the bridge registry."""
  path = os.path.join(bridge_root, "registry", "ids.json")
  return json.load(open(path, "r", encoding="utf-8"))

def files(globs):
  """Expand glob patterns into a flat list of files."""
  out = []
  for g in globs:
    out.extend(glob.glob(g, recursive=True))
  return [f for f in out if os.path.isfile(f)]

def main():
  """Entry point: scan files and report unknown IDs."""
  ap = argparse.ArgumentParser()
  ap.add_argument(
    "--bridge",
    default=os.environ.get("BRIDGE", "../tesseract-bridge"),
    help="Path to bridge registry root",
  )
  args = ap.parse_args()
  ids = load_ids(args.bridge)
  universe = {k: set(ids.get(k, [])) for k in ID_PATTERNS}
  unknown = []
  for path in files(SEARCH_GLOBS):
    try:
      txt = open(path, "r", encoding="utf-8", errors="ignore").read()
      for kind, pat in ID_PATTERNS.items():
        for match in pat.findall(txt):
          if match not in universe[kind]:
            unknown.append((path, kind, match))
    except Exception:
      # Silently ignore unreadable files; this script is advisory only.
      pass
  if unknown:
    print("✗ unknown IDs:")
    for path, kind, value in unknown:
      print(f" - {path}: {kind} -> {value}")
    sys.exit(1)
  print("✓ IDs consistent with Bridge")

if __name__ == "__main__":
  main()
