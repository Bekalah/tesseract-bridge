/* 
  Test framework note:
  - These tests use Jest-style APIs: describe/it/expect. They also run fine on Vitest/Mocha with Chai (minor globals).
  - If your project uses a different runner, adapt imports/globals accordingly.
*/

/* Dynamic import helper to support both ESM and CJS environments in runners */
async function loadRenderer() {
  try {
    // Try ESM default path (module is .mjs in source)
    const mod = await import('../helix-renderer.mjs');
    return mod;
  } catch (e) {
    // Fallback to CJS require if transpiled/aliased
    // eslint-disable-next-line global-require, import/no-commonjs
    return require('../helix-renderer.mjs');
  }
}

/* Minimal CanvasRenderingContext2D stub to capture draw calls */
class CtxStub {
  constructor() {
    this.stack = [];
    this.calls = [];
    // Graphics state
    this.fillStyle = '#000';
    this.strokeStyle = '#000';
    this.lineWidth = 1;
    this.font = '10px sans-serif';
    this.textBaseline = 'alphabetic';
  }
  // Utility to record a call with snapshot of current state
  _log(method, args = {}) {
    this.calls.push({
      method,
      state: {
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
        font: this.font,
        textBaseline: this.textBaseline,
      },
      ...args,
    });
  }
  // State stack
  save() { this.stack.push({ 
    fillStyle: this.fillStyle,
    strokeStyle: this.strokeStyle,
    lineWidth: this.lineWidth,
    font: this.font,
    textBaseline: this.textBaseline,
  }); this._log('save'); }
  restore() { const s = this.stack.pop() || {}; Object.assign(this, s); this._log('restore'); }

  // Paths
  beginPath() { this._log('beginPath'); }
  arc(x, y, r, sa, ea) { this._log('arc', { x, y, r, sa, ea }); }
  moveTo(x, y) { this._log('moveTo', { x, y }); }
  lineTo(x, y) { this._log('lineTo', { x, y }); }
  stroke() { this._log('stroke'); }
  fill() { this._log('fill'); }
  strokeRect(x, y, w, h) { this._log('strokeRect', { x, y, w, h }); }
  fillRect(x, y, w, h) { this._log('fillRect', { x, y, w, h }); }
  fillText(text, x, y) { this._log('fillText', { text, x, y }); }

  // Text measure model: ~7 px per char, space included
  measureText(text) {
    const s = String(text);
    return { width: s.length * 7 };
  }
}

/* Shared numerology constants for tests */
const NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
  TWENTYTWO: 22,
};

describe('helix-renderer.mjs renderHelix', () => {
  let mod;
  beforeAll(async () => {
    mod = await loadRenderer();
    expect(typeof mod.renderHelix).toBe('function');
  });

  it('renders ND-safe background with fallback palette when palette is missing', () => {
    const ctx = new CtxStub();
    mod.renderHelix(ctx, { width: 300, height: 200, palette: undefined, NUM, notices: [] });
    // First fillRect should use default bg color "#0b0b12"
    const firstFillRect = ctx.calls.find(c => c.method === 'fillRect');
    expect(firstFillRect).toBeDefined();
    expect(firstFillRect.state.fillStyle).toBe('#0b0b12');
    expect(firstFillRect).toMatchObject({ x: 0, y: 0, w: 300, h: 200 });
    // Single save/restore balance at top-level
    const saveCount = ctx.calls.filter(c => c.method === 'save').length;
    const restoreCount = ctx.calls.filter(c => c.method === 'restore').length;
    expect(saveCount).toBeGreaterThanOrEqual(1);
    expect(restoreCount).toBeGreaterThanOrEqual(1);
    expect(Math.abs(saveCount - restoreCount)).toBeLessThanOrEqual(1);
  });

  it('draws expected number of strokes/beginPaths for all layers with default NUM', () => {
    const ctx = new CtxStub();
    mod.renderHelix(ctx, { width: 360, height: 240, palette: {}, NUM, notices: [] });

    const strokeCount = ctx.calls.filter(c => c.method === 'stroke').length;
    const beginPathCount = ctx.calls.filter(c => c.method === 'beginPath').length;
    const fillCount = ctx.calls.filter(c => c.method === 'fill').length;

    // Expected counts:
    // Vesica: 9*7*2 = 126 strokes and 126 beginPaths (circles)
    // Tree paths: 22 strokes and 22 beginPaths (lines)
    // Tree nodes: 10 fills and 10 beginPaths (circles)
    // Fibonacci: 1 stroke and 1 beginPath (polyline)
    // Helix strands: 2 strokes and 2 beginPaths
    // Helix rungs: 23 strokes and 23 beginPaths (0..22 inclusive)
    const expectedStrokes = 126 + 22 + 1 + 2 + 23; // 174
    const expectedBeginPaths = 126 + 22 + 10 + 1 + 2 + 23; // 184
    const expectedFills = 10; // tree nodes
    expect(strokeCount).toBe(expectedStrokes);
    expect(beginPathCount).toBe(expectedBeginPaths);
    expect(fillCount).toBe(expectedFills);
  });

  it('respects layer ordering by checking early vesica strokeStyle and later helix styles', () => {
    const customPalette = {
      bg: '#111111',
      ink: '#eeeeee',
      layers: ['#L0', '#L1', '#L2', '#L3', '#L4', '#L5'],
    };
    const ctx = new CtxStub();
    mod.renderHelix(ctx, { width: 400, height: 300, palette: customPalette, NUM, notices: [] });

    // First two strokes after the background should belong to Vesica circles, using layer[0]
    const strokes = ctx.calls.filter(c => c.method === 'stroke');
    expect(strokes.length).toBeGreaterThan(0);
    // Find first stroke and check strokeStyle snapshot is layers[0]
    const firstStrokeStyle = strokes[0].state.strokeStyle;
    expect(firstStrokeStyle).toBe('#L0');

    // The two strand strokes from helix should reflect layers[4] and layers[5]
    // Find last two 'strand' strokes by looking for strokes preceded by a beginPath with many lineTo's is complex,
    // so we assert that somewhere near the end two distinct strokeStyle values exist (#L4 and #L5).
    const endStrokeStyles = strokes.slice(-10).map(s => s.state.strokeStyle);
    expect(endStrokeStyles).toEqual(expect.arrayContaining(['#L4', '#L5']));
  });

  it('draws notice panels only when notices are provided and uses ink color for text', () => {
    const ctx = new CtxStub();
    const notices = [
      'Data file missing: colors.json. Falling back to defaults.',
      'Geometry config unavailable; using built-in numerology constants.',
    ];
    mod.renderHelix(ctx, { width: 480, height: 320, palette: { ink: '#abcd00' }, NUM, notices });

    const fillRects = ctx.calls.filter(c => c.method === 'fillRect'); // includes background + panels
    const strokeRects = ctx.calls.filter(c => c.method === 'strokeRect');
    const fillTexts = ctx.calls.filter(c => c.method === 'fillText');

    // 1 background + 2 notice panels
    expect(fillRects.length).toBeGreaterThanOrEqual(3);
    // One stroked outline per notice
    expect(strokeRects.length).toBe(2);
    // At least one line of text per notice
    expect(fillTexts.length).toBeGreaterThanOrEqual(2);
    // Text color should be ink at time of fillText calls
    const textColors = fillTexts.map(t => t.state.fillStyle);
    expect(textColors.every(c => c === '#abcd00')).toBe(true);
  });

  it('handles empty/invalid notices gracefully (no notice panels drawn)', () => {
    const ctx1 = new CtxStub();
    mod.renderHelix(ctx1, { width: 320, height: 200, palette: {}, NUM, notices: [] });
    const strokeRects1 = ctx1.calls.filter(c => c.method === 'strokeRect');
    expect(strokeRects1.length).toBe(0);

    const ctx2 = new CtxStub();
    mod.renderHelix(ctx2, { width: 320, height: 200, palette: {}, NUM, notices: null });
    const strokeRects2 = ctx2.calls.filter(c => c.method === 'strokeRect');
    expect(strokeRects2.length).toBe(0);
  });

  it('does not throw for tiny canvases and clamps geometry safely', () => {
    const ctx = new CtxStub();
    expect(() => mod.renderHelix(ctx, { width: 1, height: 1, palette: {}, NUM, notices: [] })).not.toThrow();
    // Still paints background
    const bg = ctx.calls.find(c => c.method === 'fillRect');
    expect(bg).toBeDefined();
  });
});