/* 
  Cosmic Helix Renderer README tests

  Runner compatibility:
  - Preferred: Jest or Vitest (global describe/test/expect)
  - Fallback: Node's built-in node:test with assert/strict
  No new dependencies are introduced.
*/

'use strict';

let fs, path, assert;
try {
  fs = require('fs');
  path = require('path');
  assert = require('assert/strict');
} catch (e) {
  // In rare ESM-only environments this file should be treated as CJS by the runner.
  throw e;
}

const hasFn = (name) => typeof global[name] === 'function';
const Runner = {
  describe: hasFn('describe') ? global.describe : require('node:test').describe,
  it: hasFn('it') ? global.it : (hasFn('test') ? global.test : require('node:test').it),
  beforeAll: hasFn('beforeAll') ? global.beforeAll : (hasFn('before') ? global.before : (fn) => fn()),
  afterAll: hasFn('afterAll') ? global.afterAll : (hasFn('after') ? global.after : (fn) => fn()),
};

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSection(text, title) {
  const headerRe = new RegExp('^##\\s+' + escapeRegExp(title) + '\\s*$', 'm');
  const m = text.match(headerRe);
  if (!m) return null;
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const next = rest.match(/^##\s+/m);
  const end = next ? start + next.index : text.length;
  return text.slice(start, end);
}

function findReadmeByHeading(heading) {
  const ignore = new Set([
    'node_modules','.git','dist','build','coverage','.next','.nuxt','.turbo','.cache','.pnpm','out'
  ]);
  const matches = [];

  function walk(dir, depth = 0) {

    if (depth > 12) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {

      if (ignore.has(e.name)) continue;
      const full = path.join(dir, e.name);

      if (e.isDirectory()) {

        walk(full, depth + 1);
      } else if (e.isFile()) {

        const lower = e.name.toLowerCase();
        const ext = path.extname(lower);
        const isMarkdown = ['.md', '.mdx', '.markdown', ''].includes(ext);
        if (isMarkdown && (lower.includes('readme') || lower.endsWith('.md') || lower.endsWith('.mdx') || lower.endsWith('.markdown'))) {

          try {

            const text = fs.readFileSync(full, 'utf8');

            if (text.includes(heading)) {

              matches.push({ file: full, text });

            }
          } catch {}
        }
      }

    }
  }

  walk(process.cwd());

  // Prefer a root README.md if present, otherwise shortest path
  const rootReadme = path.resolve('README.md').toLowerCase();
  matches.sort((a, b) => {

    const aRoot = path.resolve(a.file).toLowerCase() === rootReadme;

    const bRoot = path.resolve(b.file).toLowerCase() === rootReadme;

    if (aRoot && !bRoot) return -1;

    if (!aRoot && bRoot) return 1;

    return a.file.length - b.file.length;
  });
  return matches[0] || null;
}

const H1 = '# Cosmic Helix Renderer (Offline, ND-safe)';
const found = findReadmeByHeading(H1);
const readmePath = found ? found.file : null;
const text = found ? found.text : '';

Runner.describe('Cosmic Helix Renderer README', () => {
  Runner.it('locates the README and verifies the H1 heading is first', () => {
    assert.ok(readmePath, 'README containing the Cosmic Helix heading was not found in the repository.');
    const firstNonEmpty = text.split(/\r?\n/).map(l => l.trim()).find(l => l.length > 0);
    assert.equal(firstNonEmpty, H1, 'Expected H1 to be the first non-empty line.');
  });

  Runner.it('states offline-first usage with no tooling/bundlers/network calls required', () => {
    assert.match(text, /Open `index\.html` directly/i);
    assert.match(text, /no tooling, bundlers, or\s+network calls are required/i);
  });

  Runner.it('mentions a 1440x900 canvas size', () => {
    assert.match(text, /\b1440x900\b/);
  });

  Runner.it('lists core files in the Files section with code formatting ticks', () => {
    const section = getSection(text, 'Files');
    assert.ok(section, 'Files section missing.');
    assert.match(section, /`index\.html`/);
    assert.match(section, /`js\/helix-renderer\.mjs`/);
    assert.match(section, /`data\/palette\.json`/);
  });

  Runner.it('describes the four geometry layers', () => {
    assert.match(text, /Vesica field/i);
    assert.match(text, /Tree-of-Life scaffold/i);
    assert.match(text, /Fibonacci curve/i);
    assert.match(text, /double helix/i);
  });

  Runner.it('Usage section includes 1-3 steps, file:// mention, and fallback notice', () => {
    const section = getSection(text, 'Usage');
    assert.ok(section, 'Usage section missing.');
    assert.match(section, /^\s*1\./m);
    assert.match(section, /^\s*2\./m);
    assert.match(section, /^\s*3\./m);
    assert.match(section, /file:\/\//i);
    assert.match(section, /fallback/i);
  });

  Runner.it('Fly.io section provides exact commands and static server note', () => {
    const section = getSection(text, 'Preparing for Fly.io');
    assert.ok(section, 'Preparing for Fly.io section missing.');
    assert.match(section, /flyctl launch --no-deploy/);
    assert.match(section, /flyctl deploy --config fly\.toml/);
    assert.match(section, /static file server/i);
  });

  Runner.it('ND-safe Choices enumerate safety constraints, layer order, numerology, and inline notices', () => {
    const section = getSection(text, 'ND-safe Choices');
    assert.ok(section, 'ND-safe Choices section missing.');
    assert.match(section, /No animation, no autoplay, no flashing colors\./i);
    assert.match(section, /Vesica\s*->\s*Tree\s*->\s*Fibonacci\s*->\s*Helix/i);
    assert.match(section, /\b3,\s*7,\s*9,\s*11,\s*22,\s*33,\s*99,\s*144\b/);
    assert.match(section, /Inline notices explain fallbacks/i);
  });

  Runner.it('references Cathedral cosmology and layered (not flattened) geometry', () => {
    assert.match(text, /Cathedral cosmology/i);
    assert.match(text, /multi-layered rather than flattened/i);
  });
});