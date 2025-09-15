/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
  Layers back-to-front:
    1) Vesica field – intersecting circles
    2) Tree-of-Life scaffold – ten nodes, twenty-two paths
    3) Fibonacci curve – logarithmic spiral polyline
    4) Double-helix lattice – two phase-shifted strands with crossbars

  Numerology constants (3,7,9,11,22,33,99,144) guide proportions.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background with calm tone
>>>>>>>+codex/create-3d
>>>>>>> main/codex/integrate-open-source-tools-for-art-education-7wgvp5
  No animation, network calls, or external dependencies.
  Colors and geometry use numerology constants (3,7,9,11,22,33,99,144).
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Calm background; ND-safe: no flashing
    1) Vesica field (circle grid)
    2) Tree-of-Life scaffold (nodes and paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two sine strands)

  All routines are pure and draw on the provided 2D context.
  No animation, network calls, or dependencies.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Calm background for sensory safety
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layers back to front to preserve depth without motion
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
// Calm grid of intersecting circles; cols*rows = 63 < 144 for ND safety
// Intersecting circle grid; gentle symmetry, no more than 63 circles
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const stepX = w / cols;
  const stepY = h / rows;
  const r = Math.min(stepX, stepY) / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
<<<<<<< 
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
>>>>>>>+codex/create-3d
>>>>>>> main/codex/integrate-open-source-tools-for-art-education-7wgvp5
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let c = 0; c < cols; c++) {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const x = (c + 0.5) * stepX;
      const y = (rIdx + 0.5) * stepY;
      circle(ctx, x - r / 2, y, r);
      ctx.stroke();
      circle(ctx, x + r / 2, y, r);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ---
// Ten sephirot nodes and twenty-two connective paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
<<<<<<< codex/create-3d-rosslyn-cathedral-scene-yrb02k
  const cx = w / 2;
  const stepX = w / NUM.NINE;
  const stepY = h / NUM.NINE;
  const nodes = [
    { x: cx, y: stepY },
    { x: cx - stepX, y: stepY * 2 },
    { x: cx + stepX, y: stepY * 2 },
    { x: cx, y: stepY * 3 },
    { x: cx - stepX, y: stepY * 4 },
    { x: cx + stepX, y: stepY * 4 },
    { x: cx, y: stepY * 5 },
    { x: cx - stepX, y: stepY * 6 },
    { x: cx + stepX, y: stepY * 6 },
    { x: cx, y: stepY * 7 }
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,3],[1,4],[2,5],[3,4],[3,5],
    [4,5],[4,6],[5,6],[4,7],[5,8],[6,7],[6,8],[7,8],[7,9],[8,9],[1,5],[2,4],[6,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  for (const [a, b] of paths) {
// Ten sephirot nodes with twenty-two connecting paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodesNorm = [
    [0.5, 0.05], [0.35, 0.2], [0.65, 0.2],
    [0.5, 0.35], [0.25, 0.5], [0.5, 0.5], [0.75, 0.5],
    [0.35, 0.65], [0.65, 0.65], [0.5, 0.8]
  ];
  const nodes = nodesNorm.map(([nx, ny]) => [nx * w, ny * h]);
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,3],[1,4],[1,5],[2,5],[2,6],
    [3,4],[3,5],[3,6],[4,5],[5,6],[4,7],[5,7],[5,8],[6,8],
    [7,8],[7,9],[8,9],[5,9]
  ];
  ctx.strokeStyle = pathColor;
  paths.forEach(([a,b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  ctx.fillStyle = nodeColor;
  const r = h / NUM.THIRTYTHREE;
  for (const n of nodes) {
    circle(ctx, n.x, n.y, r);
  const nodesNorm = [
    [0.5, 0.05],
    [0.3, 0.2], [0.7, 0.2],
    [0.3, 0.4], [0.7, 0.4],
    [0.5, 0.5],
    [0.3, 0.7], [0.7, 0.7],
    [0.5, 0.8],
    [0.5, 0.95]
  ];

  const edges = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,5],
    [2,4],[2,5],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],
    [7,8],[7,9],
    [8,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  const nodesNorm = [
    [0.5, 0.05],
    [0.3, 0.2], [0.7, 0.2],
    [0.3, 0.4], [0.7, 0.4],
    [0.5, 0.5],
    [0.3, 0.7], [0.7, 0.7],
    [0.5, 0.8],
    [0.5, 0.95]
  ];

  const edges = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,5],
    [2,4],[2,5],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],
    [7,8],[7,9],
    [8,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  edges.forEach(([a, b]) => {
    const ax = nodesNorm[a][0] * w;
    const ay = nodesNorm[a][1] * h;
    const bx = nodesNorm[b][0] * w;
    const by = nodesNorm[b][1] * h;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = 6; // node radius
  nodesNorm.forEach(([nx, ny]) => {
    circle(ctx, nx * w, ny * h, r);
  });
  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.ONEFORTYFOUR;
  nodes.forEach(([x, y]) => {
    circle(ctx, x, y, r);
    ctx.fill();
  });
}

// --- Layer 3: Fibonacci curve ---
// Static logarithmic spiral approximated with a polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE;        // three quarter-turns
  const steps = NUM.NINETYNINE;   // smoothness
// Static logarithmic spiral approximated with a polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE;
  const turns = NUM.THREE;       // three quarter turns
  const steps = NUM.NINETYNINE;  // smoothness
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

// --- Layer 4: Double-helix lattice ---
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amp = h / NUM.NINE;
// Two sine strands with crossbars; entirely static for ND safety
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR; // smooth strands
  const amp = h / NUM.NINE; // gentle amplitude
  const mid = h / 2;
  const step = w / segments;

// Two sine strands with periodic crossbars; entirely static
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amp = h / NUM.NINE;
  const mid = h / 2;
  const step = w / segments;
  const strand = (phase, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * NUM.THREE + phase;
      const x = i * step;
      const y = mid + Math.sin(t) * amp;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  strand(0, colorA);
  strand(Math.PI, colorB);

  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const t = (i / segments) * Math.PI * NUM.THREE;
    const x = i * step;
    const y1 = mid + Math.sin(t) * amp;
    const y2 = mid + Math.sin(t + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

// helper: begin a circle path
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
