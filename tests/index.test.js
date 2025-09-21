/* Test framework detected via package.json: Unknown.
This suite focuses on the PR diff's module script behaviors in index.html:
- Offline-first loader (loadPalette): file:// short-circuit, fetch success, HTTP error, JSON parse failure
- Status text updates
- renderHelix invocation with width/height, NUM constants, and palette selection
- Ensures fetch is called with cache: 'no-store'
No new dependencies are introduced; Node's vm is used to execute the inline module script with a mocked DOM. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const INDEX_HTML = path.join(process.cwd(), "index.html");

const RUNNER_NAME = globalThis.jest ? "Jest" : (globalThis.vi ? "Vitest" : "Unknown (Jest-like expected)");
/* eslint-disable no-undef */

function readModuleScript(htmlText) {
  const m = htmlText.match(/<script\s+type=["']module["']>([\s\S]*?)<\/script>/i);
  if (!m) {
    throw new Error("Module <script type=\"module\"> not found in " + INDEX_HTML);
  }
  return m[1];
}

function instrument(scriptBody) {
  // Replace ESM import with a spy-compatible local function capturing calls
  const replaced = scriptBody.replace(
    /import\s+\{\s*renderHelix\s*\}\s+from\s+["'][^"']+["'];?/,
    'globalThis.__calls__ = []; function renderHelix(ctx, opts){ globalThis.__calls__.push({ ctx, opts }); }'
  );
  // At the end, expose key internals for assertions
  const captureTail = `
;globalThis.__capture__ = {
  statusText: document.getElementById("status").textContent,
  notices,
  NUM,
  calls: globalThis.__calls__ || []
};`;
  return `globalThis.__done__ = (async () => { ${replaced}\n${captureTail}\n})();`;
}

function makeDocumentStub() {
  const statusEl = { textContent: 'Loading palette...' };
  const canvasEl = { width: 1440, height: 900, getContext: () => ({}) };
  return {
    getElementById: (id) => {
      if (id === 'status') return statusEl;
      if (id === 'stage') return canvasEl;
      return null;
    }
  };
}

function createFetchMock(responder) {
  const mock = (...args) => {
    mock.calls.push(args);
    return responder(...args);
  };
  mock.calls = [];
  return mock;
}

async function runScenario({ protocol, fetchImpl }) {
  if (!fs.existsSync(INDEX_HTML)) {
    throw new Error(`Expected to find index.html at ${INDEX_HTML}. Please ensure the PR includes the HTML file.`);
  }
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const moduleScript = readModuleScript(html);
  const code = instrument(moduleScript);

  const warns = [];
  const context = {
    window: { location: { protocol } },
    document: makeDocumentStub(),
    fetch: fetchImpl,
    console: { ...console, warn: (...args) => { warns.push(args); } },
    URL,
    setTimeout
  };

  vm.runInNewContext(code, context, { timeout: 2000 });
  // Wait for top-level async to finish
  await context.__done__;
  return { ...context.__capture__, warns, fetchCalls: fetchImpl && fetchImpl.calls ? fetchImpl.calls : [] };
}

describe(`index.html module script (${RUNNER_NAME})`, () => {
  const fallbackPalette = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#b1c7ff","#89f7fe","#a0ffa1","#ffd27f","#f5a3ff","#d0d0e6"]
  };

  test("offline: file:// protocol bypasses fetch and uses calm fallback palette", async () => {
    const fetchMock = createFetchMock(() => { throw new Error("fetch should not be called for file://"); });
    const cap = await runScenario({ protocol: "file:", fetchImpl: fetchMock });

    expect(fetchMock.calls.length).toBe(0);
    expect(cap.statusText).toBe("Palette missing; using calm fallback.");
    expect(cap.notices).toContain("Palette file offline - defaults applied for ND-safe contrast.");

    expect(cap.calls.length).toBe(1);
    const { ctx, opts } = cap.calls[0];
    expect(typeof ctx).toBe("object");
    expect(opts.width).toBe(1440);
    expect(opts.height).toBe(900);
    expect(opts.palette).toEqual(fallbackPalette);

    // Validate numerology constants passed into renderer
    expect(cap.NUM).toEqual({
      THREE:3, SEVEN:7, NINE:9, ELEVEN:11, TWENTYTWO:22, THIRTYTHREE:33, NINETYNINE:99, ONEFORTYFOUR:144
    });
  });

  test("online: successful fetch loads palette, updates status, and passes it to renderHelix", async () => {
    const customPalette = { bg:"#11111a", ink:"#ffffff", layers:["#123","#456"] };
    const fetchMock = createFetchMock(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(customPalette)
    }));

    const cap = await runScenario({ protocol: "https:", fetchImpl: fetchMock });

    expect(fetchMock.calls.length).toBe(1);
    const [pathArg, optionsArg] = fetchMock.calls[0];
    expect(pathArg).toBe("./data/palette.json");
    expect(optionsArg && optionsArg.cache).toBe("no-store");

    expect(cap.statusText).toBe("Palette loaded.");
    expect(cap.notices).toEqual([]);

    expect(cap.calls.length).toBe(1);
    expect(cap.calls[0].opts.palette).toEqual(customPalette);
  });

  test("online: HTTP error (e.g., 404) falls back gracefully and warns", async () => {
    const fetchMock = createFetchMock(() => Promise.resolve({
      ok: false,
      status: 404,
      json: async () => ({})
    }));

    const cap = await runScenario({ protocol: "https:", fetchImpl: fetchMock });

    expect(fetchMock.calls.length).toBe(1);
    expect(cap.statusText).toBe("Palette missing; using calm fallback.");
    expect(cap.notices).toContain("Palette file offline - defaults applied for ND-safe contrast.");

    // Console warning surfaced with status code
    const joinedWarns = cap.warns.map(args => args.join(" "));
    expect(joinedWarns.some(w => /Palette load failed:\s*404/.test(w))).toBe(true);

    // Renderer still invoked with fallback
    expect(cap.calls.length).toBe(1);
    expect(cap.calls[0].opts.palette).toEqual(fallbackPalette);
  });

  test("online: JSON parse failure is caught, warns, and falls back", async () => {
    const fetchMock = createFetchMock(() => Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON"))
    }));

    const cap = await runScenario({ protocol: "https:", fetchImpl: fetchMock });

    expect(cap.statusText).toBe("Palette missing; using calm fallback.");
    const joinedWarns = cap.warns.map(args => args.join(" "));
    expect(joinedWarns.some(w => /Palette load failed:\s*Invalid JSON/.test(w))).toBe(true);

    expect(cap.calls.length).toBe(1);
    expect(cap.calls[0].opts.palette).toEqual(fallbackPalette);
  });
});