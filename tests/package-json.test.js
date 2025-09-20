/**
 * Test framework: Node.js built-in test runner (node:test)
 * Scope: Validate package.json fields and scripts introduced/modified in the diff.
 * Focus: "scripts.prebuild" and "scripts.build" plus core metadata.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

test('package.json — has expected package name', () => {
  assert.equal(pkg.name, 'tesseract-bridge');
});

test('package.json — declares a valid semver version', () => {
  const semverRe = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;
  assert.equal(typeof pkg.version, 'string');
  assert.match(pkg.version, semverRe);
});

test('package.json — is private and uses ESM', () => {
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
});

test('package.json — defines a scripts object', () => {
  assert.ok(pkg.scripts && typeof pkg.scripts === 'object');
});

test('package.json — prebuild runs verify-absent via node (diff focus)', () => {
  assert.equal(pkg.scripts?.prebuild, 'node scripts/verify-absent.mjs');
});

test('package.json — prebuild target file exists', () => {
  const target = path.resolve(process.cwd(), 'scripts/verify-absent.mjs');
  assert.equal(fs.existsSync(target), true);
});

test('package.json — build uses vite build', () => {
  assert.equal(pkg.scripts?.build, 'vite build');
});

test('package.json — declares vite when using vite in build script', () => {
  const usesVite = typeof pkg.scripts?.build === 'string' && pkg.scripts.build.includes('vite');
  const hasViteDep = Boolean(pkg.devDependencies?.vite || pkg.dependencies?.vite);
  if (usesVite) {
    assert.equal(hasViteDep, true);
  }
});

test('package.json — npm name rules', () => {
  const npmNameRe = /^[a-z0-9~][a-z0-9-._~]*$/;
  assert.match(pkg.name, npmNameRe);
});
