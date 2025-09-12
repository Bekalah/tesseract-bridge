/*
  helix-renderer.mjs
  Static, ND-safe drawing routines for layered sacred geometry.
  Layers (back to front):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice
  Pure functions, no animation, offline-only.
*/

// Entry point: orchestrates all layers
export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
// Gentle circle grid; no overlaps beyond 144 iterations
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.NINE; // 9 columns
  const rows = NUM.SEVEN; // 7 rows
  const r = Math.min(w / cols, h / rows) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let c = 0; c < cols; c++) {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const x = (c + 0.5) * (w / cols);
      const y = (rIdx + 0.5) * (h / rows);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ---
// 10 nodes (sephirot) and 22 connecting paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const cx = w / 2;
  const stepX = w / NUM.NINE;
  const stepY = h / NUM.NINE;
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
  const paths = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,5],[1,6],
    [2,4],[2,5],[2,7],
    [3,4],[3,5],
    [4,5],[4,6],
    [5,6],[5,7],[5,8],[5,9],
    [6,7],[6,8],
    [7,8],
    [8,9]
  ];
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, NUM.SEVEN, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Layer 3: Fibonacci curve ---
// Log spiral approximation using polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE; // resolution
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
// Two sine strands with 33 crossbars
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amp = h / NUM.NINE;
  const segments = NUM.NINETYNINE;
  const step = w / segments;
  const phase = Math.PI;
  const strand = (offset, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = h/2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  strand(0, colorA);
  strand(phase, colorB);
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = h/2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2);
    const y2 = h/2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

