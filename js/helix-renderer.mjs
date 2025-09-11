/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sinusoids)

  All geometry is parameterized; no animation, no external deps.
*/

// Main entry point. Context and options are passed in so the code stays pure.
export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawDoubleHelix(ctx, width, height, palette.layers[3], NUM);
}

// L1: Vesica field — intersecting circles, calm and centered
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.NINE; // radius guided by 9
  const step = r; // grid step maintains vesica overlaps
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    // horizontal set
    ctx.beginPath();
    ctx.arc(cx + i * step, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    // vertical set
    ctx.beginPath();
    ctx.arc(cx, cy + i * step, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// L2: Tree-of-Life — 10 nodes, 22 paths, simplified coordinates
function drawTreeOfLife(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THIRTYTHREE; // node radius
  const nodes = [
    [0.5, 0.08],
    [0.35, 0.2], [0.65, 0.2],
    [0.35, 0.35], [0.65, 0.35],
    [0.5, 0.48],
    [0.35, 0.63], [0.65, 0.63],
    [0.5, 0.76],
    [0.5, 0.9]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[1,5],[2,4],[2,5],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[5,8],[0,5]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax * w, ay * h);
    ctx.lineTo(bx * w, by * h);
    ctx.stroke();
  });
  ctx.fillStyle = color;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * w, y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// L3: Fibonacci curve — static polyline, no motion
function drawFibonacci(ctx, w, h, color, NUM) {
  const fib = [1,1,2,3,5,8,13,21,34,55,89,144];
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR; // 144 is max radius
  const cx = w * 0.75; // placed to the right of Tree-of-Life
  const cy = h * 0.5;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let theta = 0;
  fib.forEach((n, i) => {
    const r = n * scale;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    theta += Math.PI / 2; // quarter turn per segment
  });
  ctx.stroke();
}

// L4: Double-helix lattice — two sinusoids, phase-shifted
function drawDoubleHelix(ctx, w, h, color, NUM) {
  const turns = NUM.THREE; // three full twists across the width
  const points = NUM.NINETYNINE; // smoothness of curves
  const amp = h / NUM.SEVEN / 2; // amplitude guided by 7
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  // first helix
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2 * turns;
    const x = (i / points) * w;
    const y = h / 2 + amp * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // second helix (phase-shifted)
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2 * turns + Math.PI;
    const x = (i / points) * w;
    const y = h / 2 + amp * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // lattice cross-links at regular intervals (static)
  const step = Math.floor(points / NUM.ELEVEN);
  for (let i = 0; i <= points; i += step) {
    const t = (i / points) * Math.PI * 2 * turns;
    const x = (i / points) * w;
    const y1 = h / 2 + amp * Math.sin(t);
    const y2 = h / 2 + amp * Math.sin(t + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
