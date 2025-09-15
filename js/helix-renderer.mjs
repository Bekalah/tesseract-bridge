/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
    1) Vesica field – intersecting circle grid
    2) Tree-of-Life scaffold – ten nodes, twenty-two paths
    3) Fibonacci curve – logarithmic spiral polyline
    4) Double-helix lattice – two phase-shifted strands with crossbars

  No animation, network calls, or external libraries.
  Numerology constants (3,7,9,11,22,33,99,144) guide proportions.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background with calm tone
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layers back-to-front for depth without motion
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1 — Vesica field: gentle grid of overlapping circles
function drawVesica(ctx, w, h, color, NUM) {
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
      circle(ctx, cx - r / 2, cy, r);
      ctx.stroke();
      circle(ctx, cx + r / 2, cy, r);
      ctx.stroke();
    }
  }
}

// Layer 2 — Tree-of-Life scaffold: ten nodes and twenty-two paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const cx = w / 2;
  const xo = w / NUM.NINE;
  const ys = h / NUM.NINE;
  const nodes = [
    { x: cx,       y: ys },
    { x: cx - xo,  y: ys * 2 },
    { x: cx + xo,  y: ys * 2 },
    { x: cx,       y: ys * 3 },
    { x: cx - xo,  y: ys * 4 },
    { x: cx + xo,  y: ys * 4 },
    { x: cx,       y: ys * 5 },
    { x: cx - xo,  y: ys * 6 },
    { x: cx + xo,  y: ys * 6 },
    { x: cx,       y: ys * 7 }
  ];

  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,3],
    [3,4],[3,5],[4,5],[4,6],[5,6],
    [6,7],[6,8],[7,8],[7,9],[8,9],
    [1,4],[2,5],[4,7],[5,8],[1,5],
    [2,4],[6,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  for (const [a, b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  }

  ctx.fillStyle = nodeColor;
  const r = h / NUM.THIRTYTHREE;
  for (const n of nodes) {
    circle(ctx, n.x, n.y, r);
    ctx.fill();
  }
}

// Layer 3 — Fibonacci curve: static logarithmic spiral polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE;      // three quarter-turns
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

  // Crossbars every 11th segment for stability
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

// helper: draw a circle
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
