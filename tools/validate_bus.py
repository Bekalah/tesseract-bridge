#!/usr/bin/env python3
"""
validate_bus.py - minimal validator for build/bus.json.
Ensures the bus file exists and is valid JSON.
Future schema checks can extend this script.
"""
import json
import pathlib
import sys

BUS_PATH = pathlib.Path("build/bus.json")

def main():
    if not BUS_PATH.exists():
        print("build/bus.json not found")
        return 1
    try:
        json.loads(BUS_PATH.read_text(encoding="utf-8"))
    except Exception as err:
        print(f"invalid JSON: {err}")
        return 1
    print("bus.json ok")
    return 0

if __name__ == "__main__":
    sys.exit(main())
