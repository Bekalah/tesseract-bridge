/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layers (back to front):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice

  No animation, network access, or external dependencies.
  Colors and spacing are calm to reduce sensory load.

  Layers (back to front):
    1) Vesica field (intersecting circle grid)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted sine strands with crossbars)

  No animation, network calls, or external libraries.
  Geometry uses numerology constants passed via NUM.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background with calming tone
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layers back-to-front to preserve depth without motion
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1 — Vesica field: gentle grid of overlapping circles
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.NINE;        // 9 columns
  const rows = NUM.SEVEN;       // 7 rows
  const stepX = w / cols;
  const stepY = h / rows;
  const r = Math.min(stepX, stepY) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let rIdx = 0; rIdx < rows; rIdx++) {
    for (let c = 0; c < cols; c++) {
// --- Layer 1: Vesica field ---
function drawVesica(ctx, w, h, color, NUM) {
  // grid of overlapping circles; calm symmetry, no motion
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const stepX = w / cols;
  const stepY = h / rows;
  const r = Math.min(stepX, stepY) / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (let c = 0; c < cols; c++) {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const cx = c * stepX + stepX / 2;
      const cy = rIdx * stepY + stepY / 2;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      circle(ctx, cx + r / 2, cy, r);
      ctx.beginPath();
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2 — Tree-of-Life scaffold: ten nodes and twenty-two paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodesNorm = [
    [0.5, 0.1], [0.35, 0.2], [0.65, 0.2],
    [0.35, 0.4], [0.65, 0.4], [0.5, 0.5],
    [0.35, 0.7], [0.65, 0.7], [0.5, 0.8],
    [0.5, 0.9]
  ];
  const nodes = nodesNorm.map(([nx, ny]) => ({ x: nx * w, y: ny * h }));
  const r = h / NUM.THIRTYTHREE;

// --- Layer 2: Tree-of-Life scaffold ---
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const cx = w / 2;
  const stepX = w / NUM.NINE;
  const stepY = h / NUM.NINE;

  // node positions derived from traditional layout
  const nodes = [
    [cx, stepY * 0.5],
    [cx + stepX, stepY * 1.5],
    [cx - stepX, stepY * 1.5],
    [cx - stepX * 1.2, stepY * 3],
    [cx + stepX * 1.2, stepY * 3],
    [cx, stepY * 4.5],
    [cx - stepX, stepY * 6],
    [cx + stepX, stepY * 6],
    [cx, stepY * 7.5],
    [cx, stepY * 9]
  ];

  // 22 connecting paths
  const paths = [
    [0,1],[0,2],
    [1,2],[1,3],[1,5],[1,4],
    [2,4],[2,5],[2,3],
    [3,4],[3,5],[3,6],[3,8],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],
    [7,8],
    [8,9]
  ]; // 22 total

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(([a, b]) => {
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(n => {
  }

  ctx.fillStyle = nodeColor;
  const r = NUM.SEVEN; // small steady nodes
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3 — Fibonacci curve: static log spiral polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE;           // three quarter-turns
  const steps = NUM.NINETYNINE;      // resolution
// --- Layer 3: Fibonacci curve ---
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE; // smoothness
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.2;
  const cy = h * 0.8;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps * turns; i++) {
    const theta = (i / steps) * turns * (Math.PI / 2);
    const r = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4 — Double-helix lattice: two phase-shifted sine strands
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amp = h / NUM.NINE;
  const mid = h / 2;
  const step = w / segments;
// --- Layer 4: Double-helix lattice ---
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR; // smooth strands
  const amp = h / NUM.NINE; // gentle wave
  const mid = h / 2;

  const strand = (phase, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = mid + Math.sin((i / segments) * Math.PI * NUM.THREE + phase) * amp;
      const t = (i / segments) * Math.PI * NUM.THREE + phase;
      const x = (i / segments) * w;
      const y = mid + Math.sin(t) * amp;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  strand(0, colorA);
  strand(Math.PI, colorB);

  // Crossbars every 11th segment for stability
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = mid + Math.sin((i / segments) * Math.PI * NUM.THREE) * amp;
    const y2 = mid + Math.sin((i / segments) * Math.PI * NUM.THREE + Math.PI) * amp;
    const t = (i / segments) * Math.PI * NUM.THREE;
    const x = (i / segments) * w;
    const y1 = mid + Math.sin(t) * amp;
    const y2 = mid + Math.sin(t + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

// helper: draw a circle without closing the path
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
