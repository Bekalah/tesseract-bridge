/**
 * Unit tests for first-paint-octagram.js
 *
 * Focus: paintOctagram(id = "opus", width = 1200, height = 675)
 * - Returns false when canvas element is missing
 * - Returns false when 2D context is unavailable
 * - On success, sets canvas dimensions, paints gradient background,
 *   and draws 8 radial lines with expected drawing parameters.
 *
 * Testing framework: This file uses Jest-style APIs (describe/it/expect, jest.fn()).
 * If the repository uses another runner with compatible globals (e.g., Vitest),
 * the tests should still work. Otherwise, adjust imports accordingly.
 */

let paintOctagram;
let sourceModule;

/**
 * Helper: build a fully mocked 2D context with spies for APIs used by paintOctagram.
 */
function createMock2DContext() {
  const gradientStops = [];
  const gradient = {
    addColorStop: jest.fn((offset, color) => {
      gradientStops.push({ offset, color });
    }),
    _stops: gradientStops
  };

  return {
    // Properties that will be set by the implementation
    fillStyle: null,
    globalAlpha: null,
    lineWidth: null,
    strokeStyle: null,

    // Methods used by the implementation
    createRadialGradient: jest.fn(() => gradient),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),

    // Expose gradient for inspection
    _gradient: gradient
  };
}

/**
 * Resolve module path for import in ESM/CommonJS projects.
 * We try common locations; fallback to default ESM import attempt.
 */
async function importSourceModule() {
  // Try a few common paths where the file may live.
  const candidates = [
    // Canonical names
    "./first-paint-octagram.js",
    "first-paint-octagram.js",
    "src/first-paint-octagram.js",
    "src/lib/first-paint-octagram.js",
    "lib/first-paint-octagram.js",
    "assets/js/first-paint-octagram.js",
  ];

  // Try dynamic import for ESM; fall back to require if available.
  for (const p of candidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const m = await import(p);
      if (m && typeof m.paintOctagram === "function") {
        return m;
      }
    } catch (e) {
      // try next candidate
    }
  }

  // Last attempt: try requiring if test runner supports CJS require resolution.
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const m = require("../first-paint-octagram.js");
    if (m && typeof m.paintOctagram === "function") {
      return m;
    }
  } catch (e) {
    // ignore
  }

  throw new Error("Unable to locate and import first-paint-octagram.js with a paintOctagram export.");
}

beforeAll(async () => {
  // Ensure DOM globals exist (JSDOM in Jest usually provides these)
  if (typeof document === "undefined") {
    // Minimal DOM shim if needed
    global.document = {
      _nodes: {},
      getElementById(id) {
        return this._nodes[id] || null;
      },
      createElement(tag) {
        return { tagName: tag.toUpperCase() };
      },
      body: {
        appendChild() {}
      }
    };
  }

  sourceModule = await importSourceModule();
  paintOctagram = sourceModule.paintOctagram;
});

afterEach(() => {
  // Clean up any canvases we added
  if (document && document._nodes) {
    document._nodes = {};
  }

  // Restore any mocked getContext
  if (
    typeof HTMLCanvasElement !== "undefined" &&
    HTMLCanvasElement.prototype &&
    HTMLCanvasElement.prototype.getContext &&
    typeof HTMLCanvasElement.prototype.getContext.mockRestore === "function"
  ) {
    HTMLCanvasElement.prototype.getContext.mockRestore();
  }
});

describe("paintOctagram", () => {
  it("returns false when the canvas element is not found", () => {
    // No element registered under default id "opus"
    expect(paintOctagram()).toBe(false);
  });

  it("returns false when getContext('2d') returns null/undefined", () => {
    // Register a canvas element with the expected id
    const canvas = {
      id: "opus",
      width: 0,
      height: 0,
      getContext: jest.fn(() => null)
    };
    if (!document || !document._nodes) {
      document._nodes = {};
    }
    document._nodes.opus = canvas;

    expect(paintOctagram()).toBe(false);
    expect(canvas.getContext).toHaveBeenCalledWith("2d");
  });

  it("paints gradient background and draws 8 static rays on success (default size)", () => {
    // Arrange a real-ish canvas object with a mocked 2D context
    const mockCtx = createMock2DContext();
    const canvas = {
      id: "opus",
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockCtx)
    };
    if (!document || !document._nodes) {
      document._nodes = {};
    }
    document._nodes.opus = canvas;

    // Act
    const result = paintOctagram(); // defaults: id='opus', w=1200, h=675

    // Assert: return value
    expect(result).toBe(true);

    // Canvas dimension updates
    expect(canvas.width).toBe(1200);
    expect(canvas.height).toBe(675);

    // Gradient creation parameters
    const expectedCx = 1200 / 2;
    const expectedCy = 675 / 2;
    const expectedR0 = 40;
    const expectedR1 = Math.hypot(1200, 675) / 2;

    expect(mockCtx.createRadialGradient).toHaveBeenCalledTimes(1);
    expect(mockCtx.createRadialGradient).toHaveBeenCalledWith(
      expectedCx, expectedCy, expectedR0,
      expectedCx, expectedCy, expectedR1
    );

    // Palette color stops (5 stops from 0 to 1 at 0.25 increments)
    // Expected colors from implementation:
    const expectedPalette = ["#0F0B1E", "#1d1d20", "#3b2e5a", "#bfa66b", "#dfe8ff"];
    const addStop = mockCtx._gradient.addColorStop;
    expect(addStop).toHaveBeenCalledTimes(expectedPalette.length);
    expectedPalette.forEach((color, idx) => {
      const expectedOffset = idx / (expectedPalette.length - 1);
      expect(addStop).toHaveBeenNthCalledWith(idx + 1, expectedOffset, color);
    });

    // Fill with gradient
    expect(mockCtx.fillStyle).toBe(mockCtx._gradient);
    expect(mockCtx.fillRect).toHaveBeenCalledWith(0, 0, 1200, 675);

    // Static line style
    expect(mockCtx.globalAlpha).toBe(0.25);
    expect(mockCtx.lineWidth).toBe(2);
    expect(mockCtx.strokeStyle).toBe("#dfe8ff");

    // 8 radial lines: each line calls beginPath, moveTo, lineTo, stroke once
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(8);
    expect(mockCtx.moveTo).toHaveBeenCalledTimes(8);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(8);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(8);

    // Validate that moveTo is always at center
    for (let i = 1; i <= 8; i += 1) {
      expect(mockCtx.moveTo).toHaveBeenNthCalledWith(i, expectedCx, expectedCy);
    }

    // Validate endpoints lie on circle with radius = min(w,h)*0.32
    const radius = Math.min(1200, 675) * 0.32;
    for (let k = 0; k < 8; k += 1) {
      const angle = (Math.PI / 4) * k;
      const ex = expectedCx + radius * Math.cos(angle);
      const ey = expectedCy + radius * Math.sin(angle);
      expect(mockCtx.lineTo).toHaveBeenNthCalledWith(k + 1, ex, ey);
    }
  });

  it("supports custom id and canvas size", () => {
    const mockCtx = createMock2DContext();
    const canvas = {
      id: "alt",
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockCtx)
    };
    if (!document || !document._nodes) {
      document._nodes = {};
    }
    document._nodes.alt = canvas;

    const w = 800;
    const h = 800;
    const ok = paintOctagram("alt", w, h);
    expect(ok).toBe(true);

    expect(canvas.width).toBe(w);
    expect(canvas.height).toBe(h);

    const expectedCx = w / 2;
    const expectedCy = h / 2;
    const expectedR0 = 40;
    const expectedR1 = Math.hypot(w, h) / 2;

    expect(mockCtx.createRadialGradient).toHaveBeenCalledWith(
      expectedCx, expectedCy, expectedR0,
      expectedCx, expectedCy, expectedR1
    );

    // Validate 8 lines endpoints on radius = min(w,h)*0.32
    const radius = Math.min(w, h) * 0.32;
    for (let k = 0; k < 8; k += 1) {
      const angle = (Math.PI / 4) * k;
      const ex = expectedCx + radius * Math.cos(angle);
      const ey = expectedCy + radius * Math.sin(angle);
      expect(mockCtx.lineTo).toHaveBeenNthCalledWith(k + 1, ex, ey);
    }
  });

  it("gracefully handles getContext throwing by returning false", () => {
    const canvas = {
      id: "opus",
      width: 0,
      height: 0,
      getContext: jest.fn(() => { throw new Error("boom"); })
    };
    if (!document || !document._nodes) {
      document._nodes = {};
    }
    document._nodes.opus = canvas;

    // Catch thrown error within test but assert function returns false

    let returned;
    try {
      returned = paintOctagram();
    } catch (e) {
      // If implementation does not catch, still assert type; but prefer no throw.
    }
    // If it threw, returned would be undefined; in that case, explicitly fail with better message.
    if (returned === undefined) {
      // Prefer explicit signal in tests
      expect(() => paintOctagram()).not.toThrow();
    } else {
      expect(returned).toBe(false);
    }
  });
});