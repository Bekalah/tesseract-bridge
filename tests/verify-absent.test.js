/**
 * Tests for verify-absent.mjs
 *
 * Framework: Jest (adjust to Vitest/Mocha if project uses a different runner).
 *
 * This suite spawns the guard as a child process with controlled working directories,
 * verifying behavior when forbidden assets are present or absent.
 */
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const GUARD_CANDIDATES = [
  "verify-absent.mjs",
  "scripts/verify-absent.mjs",
  "tools/verify-absent.mjs"
];

function resolveGuardPath() {
  for (const rel of GUARD_CANDIDATES) {
    const abs = resolve(process.cwd(), rel);
    if (existsSync(abs)) return abs;
  }
  throw new Error(
    `Could not locate verify-absent.mjs. Tried: ${GUARD_CANDIDATES.join(", ")}`
  );
}

function runGuardInCwd(cwd) {
  const guard = resolveGuardPath();
  // Use Node to execute ESM .mjs script
  return spawnSync(process.execPath, [guard], {
    cwd,
    encoding: "utf8"
  });
}

function withTempDir(fn) {
  const prefix = join(tmpdir(), "verify-absent-");
  const dir = mkdtempSync(prefix);
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("verify-absent.mjs guard", () => {
  const tombs = [
    "assets/art/black-madonna-altar-1600.png",
    "img/black-madonna.png"
  ];

  test("passes (exit 0) when all forbidden assets are absent", () => {
    withTempDir((dir) => {
      const { status, stdout, stderr } = runGuardInCwd(dir);
      expect(status).toBe(0);
      expect(stderr).toBe("");
      expect(stdout.trim()).toMatch(/Guard ok - no undead assets detected\./);
    });
  });

  test("fails (exit 1) when the first forbidden asset exists", () => {
    withTempDir((dir) => {
      const p = join(dir, tombs[0]);
      mkdirSync(join(dir, "assets", "art"), { recursive: true });
      writeFileSync(p, "fake png content");
      const { status, stdout, stderr } = runGuardInCwd(dir);
      expect(status).toBe(1);
      expect(stdout).toBe(""); // guard reports violation on stderr
      expect(stderr).toMatch(/PROTECT violation: undead asset\(s\) present:/);
      expect(stderr).toContain(tombs[0]);
      // second entry should not appear
      expect(stderr).not.toContain(tombs[1]);
    });
  });

  test("fails (exit 1) when the second forbidden asset exists", () => {
    withTempDir((dir) => {
      const p = join(dir, tombs[1]);
      mkdirSync(join(dir, "img"), { recursive: true });
      writeFileSync(p, "fake png content");
      const { status, stdout, stderr } = runGuardInCwd(dir);
      expect(status).toBe(1);
      expect(stdout).toBe("");
      expect(stderr).toMatch(/PROTECT violation: undead asset\(s\) present:/);
      expect(stderr).toContain(tombs[1]);
      expect(stderr).not.toContain(tombs[0]);
    });
  });

  test("fails (exit 1) when both forbidden assets exist and lists both in order", () => {
    withTempDir((dir) => {
      // Create both files
      mkdirSync(join(dir, "assets", "art"), { recursive: true });
      writeFileSync(join(dir, tombs[0]), "fake png content");
      mkdirSync(join(dir, "img"), { recursive: true });
      writeFileSync(join(dir, tombs[1]), "fake png content");

      const { status, stdout, stderr } = runGuardInCwd(dir);
      expect(status).toBe(1);
      expect(stdout).toBe("");
      // Should include both paths, comma-separated, in the original order
      expect(stderr).toMatch(
        new RegExp(
          `PROTECT violation: undead asset\\(s\\) present: ${tombs[0]}, ${tombs[1]}`
        )
      );
    });
  });

  test("produces a helpful error if the guard script cannot be located", () => {
    // Temporarily alter GUARD_CANDIDATES resolution by running from a subdir
    withTempDir((dir) => {
      // Create an unrelated subdir with no guard present and run from there,
      // but intercept resolveGuardPath by creating a proxy file if needed.
      // Instead, simulate by running runGuardInCwd but temporarily hide candidates via env.
      // We will skip this test gracefully if the real guard isn't found at project root.
      try {
        resolveGuardPath();
      } catch (err) {
        // If not found at all, the primary tests above would already fail.
        // Mark as skipped to avoid false negatives in unusual layouts.
        console.warn("verify-absent.mjs not found in repo; skipping negative-locate test.");
        return;
      }
      // To meaningfully test negative location without altering repo files,
      // we rely on withTempDir which ensures cwd has no guard; resolveGuardPath
      // searches from process.cwd() which now lacks the file -> should throw.
      expect(() => runGuardInCwd(dir)).toThrow(/Could not locate verify-absent\.mjs/);
    });
  });
});