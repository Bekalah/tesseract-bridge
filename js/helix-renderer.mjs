/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Double-helix lattice

  No animation or network calls. Geometry uses numerology constants
  provided via NUM.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background with calm tone
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layers back to front for depth without motion
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
// Intersecting circle grid; gentle spacing, no more than 63 circles
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
      circle(ctx, x - r / 2, y, r);
      ctx.stroke();
      circle(ctx, x + r / 2, y, r);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ---
// Ten sephirot with twenty-two connecting paths; simplified layout
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const cx = w / 2;
  const xo = w / NUM.NINE;
  const ys = h / NUM.NINE;
  const nodes = [
    { x: cx, y: ys },
    { x: cx - xo, y: ys * 2 },
    { x: cx + xo, y: ys * 2 },
    { x: cx, y: ys * 3 },
    { x: cx - xo, y: ys * 4 },
    { x: cx + xo, y: ys * 4 },
    { x: cx, y: ys * 5 },
    { x: cx - xo, y: ys * 6 },
    { x: cx + xo, y: ys * 6 },
    { x: cx, y: ys * 7 }
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,3],
    [3,4],[3,5],[4,5],[4,6],[5,6],
    [6,7],[6,8],[7,8],[7,9],[8,9],
    [1,4],[2,5],[4,7],[5,8],[1,5],
    [2,4],[6,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.THIRTYTHREE;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Layer 3: Fibonacci curve ---
// Logarithmic spiral drawn as polyline; static
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
// Two sine strands with crossbars; static, no motion
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR; // smooth strands
  const amp = h / NUM.NINE; // gentle amplitude
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

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

