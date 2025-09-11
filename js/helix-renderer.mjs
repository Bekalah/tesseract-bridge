/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles + grid)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves with rungs)

  All geometry is parameterized by numerology constants passed from index.html.
  No motion, no external dependencies, and soft contrast for ND-safe viewing.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers.slice(3), NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // 3x3 grid using constant THREE
  const stepX = w / NUM.THREE;
  const stepY = h / NUM.THREE;
  ctx.beginPath();
  for (let i = 1; i < NUM.THREE; i++) {
    ctx.moveTo(stepX * i, 0);
    ctx.lineTo(stepX * i, h);
    ctx.moveTo(0, stepY * i);
    ctx.lineTo(w, stepY * i);
  }
  ctx.stroke();
  // Vesica circles using radius height/3
  const r = h / NUM.THREE;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, w, h, color, NUM) {
  const colL = w / NUM.THREE;
  const colC = w / 2;
  const colR = w - colL;
  const row = (n) => h * (n / NUM.NINETYNINE);
  const nodes = [
    { x: colC, y: row(7) },
    { x: colL, y: row(18) },
    { x: colR, y: row(18) },
    { x: colL, y: row(33) },
    { x: colR, y: row(33) },
    { x: colC, y: row(50) },
    { x: colL, y: row(66) },
    { x: colR, y: row(66) },
    { x: colC, y: row(78) },
    { x: colC, y: row(90) }
  ];
  const edges = [
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,3],[2,4],
    [3,4],[3,5],[4,5],[3,6],[4,7],[6,7],
    [5,6],[5,7],[6,8],[7,8],[6,9],[7,9],
    [8,9],[2,5],[1,5]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  const nodeR = w / NUM.NINETYNINE;
  ctx.fillStyle = color;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [1, 1];
  for (let i = 2; i < NUM.NINE; i++) fib[i] = fib[i - 1] + fib[i - 2];
  const step = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  ctx.beginPath();
  for (let i = 0; i < fib.length; i++) {
    const angle = (Math.PI / 2) * i;
    const r = fib[i] * step;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelixLattice(ctx, w, h, colors, NUM) {
  const steps = NUM.THIRTYTHREE;
  const amp = h / NUM.NINE;
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * NUM.TWENTYTWO * Math.PI;
    const x = t * w;
    const yA = h / 2 + amp * Math.sin(angle);
    const yB = h / 2 + amp * Math.sin(angle + Math.PI);
    pointsA.push({ x, y: yA });
    pointsB.push({ x, y: yB });
  }
  ctx.strokeStyle = colors[0];
  ctx.beginPath();
  pointsA.forEach((p, i) => { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
  ctx.stroke();

  ctx.strokeStyle = colors[1];
  ctx.beginPath();
  pointsB.forEach((p, i) => { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); });
  ctx.stroke();

  const rungCount = NUM.ELEVEN;
  const step = Math.floor(steps / rungCount);
  ctx.strokeStyle = colors[2];
  for (let i = 0; i <= rungCount; i++) {
    const idx = i * step;
    const a = pointsA[idx];
    const b = pointsB[idx];
    if (a && b) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

export default { renderHelix };
