/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Rationale:
  - No animation or motion, to respect ND-safe calm viewing.
  - Soft palette and strict layer order maintain visual clarity.
  - Geometry routines are parameterised with numerology constants.

  Usage:
    import { renderHelix } from "./js/helix-renderer.mjs";
    renderHelix(ctx, { width, height, palette, NUM });
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  // clear background first
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFib(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}

// ---- helpers ----

// small pure helper for circle stroke
function strokeCircle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

// Layer 1: Vesica field (two intersecting circles)
function drawVesica(ctx, w, h, color, NUM) {
  // radius uses constant THREE; offset uses SEVEN to avoid dead center
  const r = Math.min(w, h) / NUM.THREE;
  const offset = r / NUM.SEVEN;
  const cx1 = w / 2 - offset;
  const cx2 = w / 2 + offset;
  const cy = h / 2;
  strokeCircle(ctx, cx1, cy, r, color);
  strokeCircle(ctx, cx2, cy, r, color);
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, color, NUM) {
  // grid spacing with ELEVEN vertical divisions and NINE horizontal
  const vGap = h / NUM.ELEVEN;
  const hGap = w / NUM.NINE;

  const nodes = [
    [w/2, vGap], // 1 Kether
    [w/2 - hGap, vGap*2], [w/2 + hGap, vGap*2], // 2-3 Chokmah, Binah
    [w/2 - hGap, vGap*4], [w/2 + hGap, vGap*4], // 4-5 Chesed, Geburah
    [w/2, vGap*5], // 6 Tiphareth
    [w/2 - hGap, vGap*7], [w/2 + hGap, vGap*7], // 7-8 Netzach, Hod
    [w/2, vGap*8], // 9 Yesod
    [w/2, vGap*10] // 10 Malkuth
  ];

  // 22 traditional paths (simplified connections)
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],
    [3,6],[4,7],[6,7],[5,8],[6,8],[7,8],[8,9],
    [1,5],[2,5],[3,1],[4,2],[6,4],[7,3],[6,9],[7,9]
  ];

  if (paths.length !== NUM.TWENTYTWO) {
    console.warn("Tree paths expected TWENTYTWO entries");
  }

  ctx.strokeStyle = color;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  // node circles sized with NINETYNINE to stay subtle
  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x, y]) => {
    strokeCircle(ctx, x, y, r, color);
  });
}

// Layer 3: Fibonacci spiral (static polyline)
function drawFib(ctx, w, h, color, NUM) {
  const fib = [1,1,2,3,5,8,13,21,34];
  const base = Math.min(w, h) / NUM.ONEFORTYFOUR; // base scale uses 144
  const scale = base * NUM.THIRTYTHREE; // amplified by 33
  const cx = w * 0.8;
  const cy = h * 0.6;
  let angle = 0;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(cx, cy);
  fib.forEach(n => {
    const r = n * scale;
    angle += Math.PI / 2; // quarter-turn
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// Layer 4: Double-helix lattice (two static sine waves)
function drawHelix(ctx, w, h, color, NUM) {
  const amplitude = h / NUM.NINE;
  const freq = NUM.SEVEN; // number of waves across
  const steps = NUM.ONEFORTYFOUR; // lattice resolved in 144 steps
  ctx.strokeStyle = color;
  for (let phase = 0; phase < 2; phase++) {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = (w / steps) * i;
      const y = h / 2 + amplitude * Math.sin((i / steps) * Math.PI * 2 * freq + phase * Math.PI);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
