/**
 * Note on framework: These tests are written for Jest with the jsdom environment,
 * which is the most common setup for browser-like unit tests in JS projects.
 * If your repo uses Vitest, replace jest.fn/resetAllMocks with vi.fn/vi.resetAllMocks,
 * and update imports accordingly. The test code otherwise remains compatible.
 */

const ORIGINAL_IMAGE = global.Image;
const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_LOCATION = global.location;

/**
 * Minimal Image mock that lets us:
 * - control src, complete, naturalWidth
 * - register load/error listeners
 * - trigger events programmatically
 */
class MockImage {
  constructor() {
    this._listeners = { load: [], error: [] };
    this.complete = false;
    this.naturalWidth = 0;
    this.loading = undefined;
    this.decoding = undefined;
    this.src = "";
    this.alt = "";
    this.style = {};
  }
  addEventListener(type, fn) {
    if (this._listeners[type]) {
      this._listeners[type].push(fn);
    }
  }
  removeEventListener(type, fn) {
    if (!this._listeners[type]) {
      return;
    }
    this._listeners[type] = this._listeners[type].filter((f) => f !== fn);
  }
  dispatch(type) {
    (this._listeners[type] || []).forEach((fn) => fn.call(this));
  }
  // Browser sets complete/naturalWidth once src assigned and resource resolves; tests set explicitly.
}

function mockFetchOk(jsonData) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(jsonData),
  });
}

function mockFetchNotOk() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: jest.fn().mockResolvedValue({}),
  });
}

function mockFetchReject(err = new Error("network")) {
  global.fetch = jest.fn().mockRejectedValue(err);
}

async function importModule(modulePathCandidates) {
  // Try candidates in order until one resolves. Helps when repo structure differs.
  for (const p of modulePathCandidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const mod = await import(p);
      return { mod, usedPath: p };
    } catch (e) {
      // continue
    }
  }
  throw new Error(`Failed to import art-loader module from candidates: ${modulePathCandidates.join(", ")}`);
}

describe("art-loader mountArt", () => {
  let mountEl;
  let statusEl;
  let onFallbackSpy;
  let usedPath;
  let mountArt;

  beforeAll(async () => {
    // Ensure a stable location for URL resolution logic inside the module
    // JSDOM usually provides http://localhost/, keep that default.
    delete global.location;
    global.location = new URL("http://localhost/");

    // Prepare Image mock globally
    global.Image = MockImage;

    // Attempt to import the module from common locations
    const { mod, usedPath: pathUsed } = await importModule([
      "./src/art-loader.js",
      "./lib/art-loader.js",
      "./art-loader.js",
      "./assets/js/art-loader.js",
      "./client/art-loader.js"
    ]);
    usedPath = pathUsed;
    mountArt = mod.mountArt;
    if (typeof mountArt !== "function") {
      throw new Error(`mountArt not found in ${usedPath}`);
    }
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="hero-art"></div>
      <div id="status"></div>
    `;
    mountEl = document.getElementById("hero-art");
    statusEl = document.getElementById("status");
    onFallbackSpy = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    // reset fetch
    if (ORIGINAL_FETCH) {
      global.fetch = ORIGINAL_FETCH;
    } else {
      delete global.fetch;
    }
  });

  afterAll(() => {
    // Restore globals
    global.Image = ORIGINAL_IMAGE;
    if (ORIGINAL_LOCATION) {
      global.location = ORIGINAL_LOCATION;
    }
  });

  test("returns null and triggers fallback when mount point is missing", async () => {
    document.getElementById("hero-art").remove(); // remove mount
    mockFetchOk({ hero: { src: "hero.webp", alt: "alt" } });

    let fallbackMsg;
    const result = await mountArt({
      targetId: "hero-art",
      statusElement: statusEl,
      onFallback: (msg) => { fallbackMsg = msg; onFallbackSpy(msg); }
    });

    expect(result).toBeNull();
    expect(onFallbackSpy).toHaveBeenCalledTimes(1);
    expect(fallbackMsg).toBe("Hero art mount missing; octagram fallback only.");
    // Status is also updated with same message via triggerFallback->updateStatus
    expect(statusEl.textContent).toBe("Hero art mount missing; octagram fallback only.");
  });

  test("manifest fetch not ok -> mounts message and triggers fallback", async () => {
    mockFetchNotOk();

    const result = await mountArt({
      statusElement: statusEl,
      onFallback: onFallbackSpy
    });

    expect(result).toBeNull();
    expect(mountEl.textContent).toBe("Manifest fetch failed; octagram fallback ready.");
    expect(onFallbackSpy).toHaveBeenCalledWith("Manifest fetch failed; octagram fallback ready.");
    expect(statusEl.textContent).toBe("Manifest fetch failed; octagram fallback ready.");
  });

  test("manifest fetch rejects -> mounts offline message and triggers fallback", async () => {
    mockFetchReject();

    const result = await mountArt({
      statusElement: statusEl,
      onFallback: onFallbackSpy
    });

    expect(result).toBeNull();
    expect(mountEl.textContent).toBe("Manifest unavailable; relying on fallback art.");
    expect(onFallbackSpy).toHaveBeenCalledWith("Manifest unavailable; relying on fallback art.");
    expect(statusEl.textContent).toBe("Manifest unavailable; relying on fallback art.");
  });

  test("manifest ok but hero missing -> mounts message and triggers fallback", async () => {
    mockFetchOk({}); // no hero

    const result = await mountArt({
      statusElement: statusEl,
      onFallback: onFallbackSpy
    });

    expect(result).toBeNull();
    expect(mountEl.textContent).toBe("Manifest missing hero art; octagram fallback active.");
    expect(onFallbackSpy).toHaveBeenCalledWith("Manifest missing hero art; octagram fallback active.");
    expect(statusEl.textContent).toBe("Manifest missing hero art; octagram fallback active.");
  });

  test("hero present, image load via event -> status updates and hero returned with resolved URL", async () => {
    mockFetchOk({ hero: { src: "hero.webp", alt: "A Hero" } });

    // Prepare that Image won't be complete yet; we'll simulate async load event.
    const imgInstances = [];
    const ImageSpy = jest.fn(() => {
      const img = new MockImage();
      imgInstances.push(img);
      return img;
    });
    global.Image = ImageSpy;

    const hero = await mountArt({
      statusElement: statusEl
    });

    expect(hero).toEqual({
      src: "http://localhost/assets/art/hero.webp", // resolved relative to manifest path "./assets/art/manifest.json"
      alt: "A Hero"
    });

    // Verify the "loading" status is set once the img is appended
    expect(statusEl.textContent).toBe("Loading hero art (WEBP)...");

    // Now simulate successful load
    const img = imgInstances[0];
    img.complete = false; // not relevant for event path
    img.naturalWidth = 100;
    img.dispatch("load");

    expect(statusEl.textContent).toBe("Hero art mounted (WEBP).");
    expect(mountEl.querySelector("img")).toBeTruthy();
    const appended = mountEl.querySelector("img");
    expect(appended.src).toBe(hero.src);
    expect(appended.alt).toBe("A Hero");
    expect(appended.style.display).toBe("block");
  });

  test("image already complete with naturalWidth>0 -> onLoad runs synchronously", async () => {
    mockFetchOk({ hero: { src: "hero.webp", alt: "" } });

    // Create an Image that is already loaded
    global.Image = class extends MockImage {
      constructor() {
        super();
        this.complete = true;
        this.naturalWidth = 640;
      }
    };

    const hero = await mountArt({
      statusElement: statusEl
    });

    // Loading status set before synchronous resolution
    expect(statusEl.textContent).toBe("Hero art mounted (WEBP).");
    expect(hero.src).toBe("http://localhost/assets/art/hero.webp");
  });

  test("image already complete with naturalWidth===0 -> onError runs synchronously and triggers fallback", async () => {
    mockFetchOk({ hero: { src: "hero.webp", alt: "" } });

    const onFallback = jest.fn();

    global.Image = class extends MockImage {
      constructor() {
        super();
        this.complete = true;
        this.naturalWidth = 0;
      }
    };

    const hero = await mountArt({
      statusElement: statusEl,
      onFallback
    });
    expect(hero).toBeNull();
    expect(mountEl.textContent).toBe("Hero art resource missing; octagram fallback active.");
    expect(onFallback).toHaveBeenCalledWith("Hero art resource missing; octagram fallback active.");
  });

  test("data URL is passed through unchanged", async () => {
    const DATA = "data:image/webp;base64,AAA=";
    mockFetchOk({ hero: { src: DATA, alt: "inline" } });

    const { src, alt } = await mountArt({ statusElement: statusEl });
    expect(src).toBe(DATA);
    expect(alt).toBe("inline");
  });

  test("whitespace src is treated as missing hero -> fallback", async () => {
    mockFetchOk({ hero: { src: "   ", alt: "ignored" } });

    const onFallback = jest.fn();
    const res = await mountArt({ statusElement: statusEl, onFallback });
    expect(res).toBeNull();
    expect(mountEl.textContent).toBe("Manifest missing hero art; octagram fallback active.");
    expect(onFallback).toHaveBeenCalledWith("Manifest missing hero art; octagram fallback active.");
  });

  test("custom targetId and statusElement are used", async () => {
    document.body.innerHTML = `
      <div id="custom-art"></div>
      <div id="custom-status"></div>
    `;
    const target = document.getElementById("custom-art");
    const status = document.getElementById("custom-status");
    mockFetchOk({ hero: { src: "hero.webp", alt: "" } });

    global.Image = class extends MockImage {
      constructor() {
        super();
        this.complete = true;
        this.naturalWidth = 200;
      }
    };

    const hero = await mountArt({
      targetId: "custom-art",
      statusElement: status
    });

    expect(hero.src).toBe("http://localhost/assets/art/hero.webp");
    expect(target.querySelector("img")).toBeTruthy();
    expect(status.textContent).toBe("Hero art mounted (WEBP).");
  });

  test("onFallback is optional and not called when not provided", async () => {
    mockFetchNotOk();
    const res = await mountArt({ statusElement: statusEl });
    expect(res).toBeNull();
    // Ensure we didn't accidentally throw
    expect(statusEl.textContent).toBe("Manifest fetch failed; octagram fallback ready.");
  });

  test("invalid manifestPath falls back to window.location for base URL", async () => {
    mockFetchOk({ hero: { src: "relative.webp", alt: "" } });

    global.Image = class extends MockImage {
      constructor() {
        super();
        this.complete = true;
        this.naturalWidth = 100;
      }
    };

    const hero = await mountArt({
      manifestPath: "::::invalid-url::::", // causes resolveBaseUrl to use window.location.href
      statusElement: statusEl
    });

    expect(hero.src).toBe("http://localhost/relative.webp");
  });
});