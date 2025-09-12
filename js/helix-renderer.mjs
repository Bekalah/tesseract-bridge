/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 nodes, 22 paths)
    3) Fibonacci curve (logarithmic spiral polyline)
    4) Double-helix lattice (two phase-shifted sine strands)

  No animation or network calls. Calm palette and fixed geometry
  promote sensory safety. All geometry sizes use numerology constants.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1 — Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  // gentle grid of overlapping circles; no motion
  const r = Math.min(w, h) / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = r; y < h; y += r) {
    for (let x = r; x < w; x += r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r / NUM.THREE, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2 — Tree-of-Life scaffold
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const ys = h / NUM.TWENTYTWO; // vertical spacing based on 22 paths
  const nodes = [
    [w / 2, ys * 1],
    [w * 0.65, ys * 3],
    [w * 0.35, ys * 3],
    [w * 0.35, ys * 6],
    [w * 0.65, ys * 6],
    [w / 2, ys * 8],
    [w * 0.35, ys * 12],
    [w * 0.65, ys * 12],
    [w / 2, ys * 16],
    [w / 2, ys * 20]
  ];
  const paths = [
    [0,1],[0,2],[0,5],
    [1,3],[1,5],[1,6],
    [2,4],[2,5],[2,7],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],[5,9],
    [6,7],[6,8],
    [7,8],
    [8,9]
  ]; // NUM.TWENTYTWO paths
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  const r = NUM.SEVEN; // small steady nodes
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3 — Fibonacci curve
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

// Layer 4 — Double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR; // 144 segments for smooth strands
  const amp = h / NUM.NINE; // gentle wave height
  const mid = h / 2;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * NUM.THREE;
    const x = (i / segments) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * NUM.THREE + Math.PI;
    const x = (i / segments) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // crossbars every eleventh segment for stability
  for (let j = 0; j <= segments; j += NUM.ELEVEN) {
    const t = (j / segments) * Math.PI * NUM.THREE;
    const x = (j / segments) * w;
    const y1 = mid + Math.sin(t) * amp;
    const y2 = mid + Math.sin(t + Math.PI) * amp;
    ctx.strokeStyle = colorA;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
