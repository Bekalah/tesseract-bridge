/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine strands)

  No animation, no external dependencies. Small pure functions only.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers.slice(3), NUM);
}

// --- Layer 1: Vesica field -------------------------------------------------
// ND-safe choice: gentle grid, no motion, subtle stroke.
function drawVesicaField(ctx, w, h, color, NUM) {
  const cols = NUM.THREE; // 3x3 grid
  const rows = NUM.THREE;
  const radius = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) * (w / cols);
      const cy = (r + 0.5) * (h / rows);
      ctx.beginPath();
      ctx.arc(cx - radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.arc(cx + radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ---------------------------------------
// ND-safe: static nodes, readable contrast.
function drawTreeOfLife(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const nodes = [
    { x: 0.5, y: 0.05 },
    { x: 0.25, y: 0.2 },
    { x: 0.75, y: 0.2 },
    { x: 0.25, y: 0.4 },
    { x: 0.75, y: 0.4 },
    { x: 0.5, y: 0.5 },
    { x: 0.25, y: 0.7 },
    { x: 0.75, y: 0.7 },
    { x: 0.5, y: 0.8 },
    { x: 0.5, y: 0.95 }
  ];
  const edges = [
    [0,1],[0,2],[0,5],
    [1,2],[1,5],[1,3],
    [2,4],[2,5],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],
    [7,8],[7,9],
    [8,9]
  ];
  ctx.lineWidth = 2;
  for (const [a,b] of edges) {
    const na = nodes[a];
    const nb = nodes[b];
    ctx.beginPath();
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();
  }
  const r = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.SEVEN;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Layer 3: Fibonacci curve ---------------------------------------------
// ND-safe: fixed polyline, no animation.
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.TWENTYTWO;
  const center = { x: w / 2, y: h / 2 };
  const scale = Math.min(w, h) / NUM.NINETYNINE;
  const pts = [];
  let theta = 0;
  for (let i = 0; i < steps; i++) {
    const r = scale * Math.pow(phi, theta / (Math.PI / NUM.NINE));
    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    pts.push({ x, y });
    theta += Math.PI / NUM.ELEVEN;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ----------------------------------------
// ND-safe: static sine strands with cross-links, soft tones.
function drawHelixLattice(ctx, w, h, colors, NUM) {
  const mid = h / 2;
  const amp = h / NUM.THREE;
  const freq = (2 * Math.PI / w) * NUM.NINE; // nine waves
  ctx.lineWidth = 1.5;
  const strands = [0, Math.PI];
  strands.forEach((phase, i) => {
    ctx.strokeStyle = colors[i];
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = mid + amp * Math.sin(freq * x + phase);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = colors[2] || colors[0];
  const rungs = NUM.THIRTYTHREE;
  for (let i = 0; i <= rungs; i++) {
    const x = (w / rungs) * i;
    const y1 = mid + amp * Math.sin(freq * x);
    const y2 = mid + amp * Math.sin(freq * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
