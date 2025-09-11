/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3]);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  /* ND-safe: static vesica grid using gentle color */
  ctx.strokeStyle = color;
  const r = Math.min(w, h) / NUM.NINETYNINE; // 99: subtle radius
  const step = r * NUM.TWENTYTWO; // 22: spacing
  for (let y = r; y < h; y += step) {
    for (let x = r; x < w; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.arc(x + step / 2, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  /* ND-safe: simplified Tree-of-Life scaffold */
  const col = [w / 2 - w / 6, w / 2, w / 2 + w / 6];
  const rowStep = h / (NUM.SEVEN + 1); // 7 rows base
  const rows = Array.from({ length: NUM.SEVEN + 1 }, (_, i) => rowStep * (i + 1));
  const nodes = [
    [col[1], rows[0]],
    [col[0], rows[1]], [col[2], rows[1]],
    [col[0], rows[2]], [col[1], rows[2]], [col[2], rows[2]],
    [col[0], rows[3]], [col[2], rows[3]],
    [col[1], rows[4]],
    [col[1], rows[5]]
  ];
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  const paths = [
    [0, 1], [0, 2],
    [1, 3], [1, 4], [2, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 7], [5, 7],
    [6, 8], [7, 8], [8, 9]
  ];
  for (const [a, b] of paths) {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  const radius = w / NUM.ONEFORTYFOUR; // 144: small node circles
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFibonacci(ctx, w, h, color) {
  /* ND-safe: Fibonacci spiral using quarter-circle arcs */
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
  let x = w / 2;
  let y = h / 2;
  let dir = 0;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 2; i < fib.length; i++) {
    const r = fib[i] * 2; // scale factor
    switch (dir % 4) {
      case 0:
        x += r;
        ctx.arc(x - r, y, r, 0, Math.PI / 2);
        break;
      case 1:
        y += r;
        ctx.arc(x, y - r, r, Math.PI / 2, Math.PI);
        break;
      case 2:
        x -= r;
        ctx.arc(x + r, y, r, Math.PI, 3 * Math.PI / 2);
        break;
      case 3:
        y -= r;
        ctx.arc(x, y + r, r, 3 * Math.PI / 2, Math.PI * 2);
        break;
    }
    dir++;
  }
  ctx.stroke();
}

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  /* ND-safe: static double-helix using two sine curves */
  const steps = NUM.ONEFORTYFOUR; // 144 points for smoothness
  const amp = w / NUM.ELEVEN; // amplitude tuned by 11
  ctx.lineWidth = 1;
  for (let phase = 0; phase < 2; phase++) {
    ctx.beginPath();
    ctx.strokeStyle = phase === 0 ? colorA : colorB;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + Math.sin((t + phase / 2) * Math.PI * 2) * amp;
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = colorB;
  const rungStep = NUM.THIRTYTHREE; // horizontal lattice every 33px
  for (let y = 0; y <= h; y += rungStep) {
    const x1 = w / 2 + Math.sin((y / h) * Math.PI * 2) * amp;
    const x2 = w / 2 + Math.sin((y / h + 0.5) * Math.PI * 2) * amp;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}
