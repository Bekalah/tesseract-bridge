/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sinusoids with rungs)

  Design notes:
    - No animation or user motion; renders once on load.
    - Soft palette and generous spacing support ND-safe viewing.
    - Geometry scales with numerology constants for easy tuning.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
  ctx.restore();
}

// ----- Layer 1: Vesica field -------------------------------------------------
function drawVesica(ctx, w, h, color, NUM) {
  /* Vesica: two circles intersecting; 7-line grid references septenary harmony. */
  const r = Math.min(w, h) / NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // Circles
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // Grid lines (7 verticals)
  const step = (r * 2) / NUM.SEVEN;
  for (let i = 1; i < NUM.SEVEN; i++) {
    const x = cx - r + step * i;
    ctx.beginPath();
    ctx.moveTo(x, cy - r);
    ctx.lineTo(x, cy + r);
    ctx.stroke();
  }
}

// ----- Layer 2: Tree of Life -------------------------------------------------
function drawTreeOfLife(ctx, w, h, nodeColor, pathColor, NUM) {
  /* Ten nodes and twenty-two paths; simplified proportions for clarity. */
  const nodes = [
    { x: 0.5, y: 0.06 }, // 1 Keter
    { x: 0.75, y: 0.18 }, // 2 Chokmah
    { x: 0.25, y: 0.18 }, // 3 Binah
    { x: 0.82, y: 0.38 }, // 4 Chesed
    { x: 0.18, y: 0.38 }, // 5 Geburah
    { x: 0.5,  y: 0.52 }, // 6 Tiphareth
    { x: 0.82, y: 0.68 }, // 7 Netzach
    { x: 0.18, y: 0.68 }, // 8 Hod
    { x: 0.5,  y: 0.80 }, // 9 Yesod
    { x: 0.5,  y: 0.92 }  // 10 Malkuth
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,8],[7,8],
    [8,9],[1,2],[3,4],[6,7],[1,6],[1,5],
    [2,5],[2,7],[3,9],[4,9]
  ];
  // Validate count against NUM.TWENTYTWO (keeps lore coherent)
  if (paths.length !== NUM.TWENTYTWO) {
    // Silent fail; structure integrity matters more than drawing
    return;
  }
  const nodeRadius = Math.min(w, h) / NUM.THIRTYTHREE;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = pathColor;
  for (const [a, b] of paths) {
    const n1 = nodes[a];
    const n2 = nodes[b];
    ctx.beginPath();
    ctx.moveTo(n1.x * w, n1.y * h);
    ctx.lineTo(n2.x * w, n2.y * h);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ----- Layer 3: Fibonacci curve ---------------------------------------------
function drawFibonacci(ctx, w, h, color, NUM) {
  /* Static polyline approximation of a Fibonacci spiral up to 144. */
  const fib = [1,1];
  while (fib[fib.length - 1] < NUM.ONEFORTYFOUR) {
    const len = fib.length;
    fib.push(fib[len - 1] + fib[len - 2]);
  }
  const scale = Math.min(w, h) / (2 * fib[fib.length - 1]);
  const cx = w / 2;
  const cy = h / 2;
  const step = Math.PI / NUM.ELEVEN; // subtle turn
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < fib.length; i++) {
    const angle = step * i;
    const radius = fib[i] * scale;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// ----- Layer 4: Double helix lattice ----------------------------------------
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  /* Two sinusoids phase-shifted by π; 33 rungs weave the ladder. */
  const amp = h / NUM.NINE;
  const cycles = NUM.THREE; // triple wave across width
  const steps = NUM.NINETYNINE; // smoothness
  const cx = (t) => w * t;
  const y1 = (t) => h / 2 + amp * Math.sin(t * Math.PI * cycles);
  const y2 = (t) => h / 2 + amp * Math.sin(t * Math.PI * cycles + Math.PI);

  // first helix
  ctx.strokeStyle = colorA;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = cx(t);
    const y = y1(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // second helix
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = cx(t);
    const y = y2(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // rungs (33)
  ctx.lineWidth = 1;
  for (let j = 0; j <= NUM.THIRTYTHREE; j++) {
    const t = j / NUM.THIRTYTHREE;
    const x = cx(t);
    ctx.beginPath();
    ctx.moveTo(x, y1(t));
    ctx.lineTo(x, y2(t));
    ctx.stroke();
  }
}
