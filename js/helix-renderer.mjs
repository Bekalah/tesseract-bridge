/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
    1) Vesica field
    2) Tree-of-Life scaffold
    3) Fibonacci curve
    4) Static double-helix lattice

  No animation, network calls, or external libraries.
  Geometry is parameterized by numerology constants passed via NUM.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Clear background with calm tone
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layers back to front for depth without motion
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// L1 — Vesica field: intersecting circle grid
function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const r = Math.min(w, h) / NUM.THREE; // base radius from numerology
  const step = r;
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// L2 — Tree-of-Life scaffold (10 nodes, 22 paths)
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const cx = w / 2;
  const xo = w / NUM.NINE;
  const ys = h / NUM.NINE;
  const nodes = [
    [cx, ys * 0.5],
    [cx + xo, ys * 1.5],
    [cx - xo, ys * 1.5],
    [cx - xo * 1.2, ys * 3],
    [cx + xo * 1.2, ys * 3],
    [cx, ys * 4.5],
    [cx - xo, ys * 6],
    [cx + xo, ys * 6],
    [cx, ys * 7.5],
    [cx, ys * 9],
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
  const r = NUM.SEVEN; // small node size
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// L3 — Fibonacci curve: static logarithmic spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE;
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.2;
  const cy = h * 0.8;
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

// L4 — Double-helix lattice: two phase-shifted sine curves
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amp = h / NUM.NINE; // gentle wave
  const segments = NUM.ONEFORTYFOUR; // resolution
  const step = w / segments;
  const phase = Math.PI; // second strand offset

  const strand = (offset, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = h / 2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  strand(0, colorA);
  strand(phase, colorB);

  // crossbars every 11th segment for stability
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = h / 2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2);
    const y2 = h / 2 + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
