/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)
  Notes: no motion, no network, light palette from data/palette.json.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], NUM);
  ctx.restore();
}

function drawVesicaField(ctx, w, h, color, NUM) {
  /* ND-safe: static vesica grid using three circles; gentle lines */
  const r = Math.min(w, h) / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    const cx = w / 2 + i * r / 2;
    ctx.beginPath();
    ctx.arc(cx, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTreeOfLife(ctx, w, h, color, NUM) {
  /* ND-safe: static Tree-of-Life scaffold; high-contrast nodes */
  const nodes = [
    { x: 0.5, y: 0.05 },
    { x: 0.25, y: 0.15 },
    { x: 0.75, y: 0.15 },
    { x: 0.25, y: 0.35 },
    { x: 0.75, y: 0.35 },
    { x: 0.5, y: 0.45 },
    { x: 0.25, y: 0.65 },
    { x: 0.75, y: 0.65 },
    { x: 0.5, y: 0.75 },
    { x: 0.5, y: 0.92 }
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],
    [5,6],[5,7],[6,8],[7,8],[8,9],
    [1,2],[3,4],[6,7],[1,6],[2,7],[3,8],[4,8],
    [1,5],[2,5],[3,9],[4,9]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (const [a,b] of paths.slice(0, NUM.TWENTYTWO)) {
    const p = nodes[a];
    const q = nodes[b];
    ctx.beginPath();
    ctx.moveTo(p.x*w, p.y*h);
    ctx.lineTo(q.x*w, q.y*h);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  const radius = Math.max(4, h / NUM.ONEFORTYFOUR * NUM.SEVEN);
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x*w, n.y*h, radius, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawFibonacciCurve(ctx, w, h, color, NUM) {
  /* ND-safe: static Fibonacci spiral; smooth polyline */
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = { x: w / 2, y: h / 2 };
  const a = Math.min(w, h) / NUM.ELEVEN;
  const steps = NUM.NINETYNINE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const angle = i / steps * NUM.NINE * Math.PI / 2;
    const r = a * Math.pow(phi, angle / (Math.PI / 2));
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelixLattice(ctx, w, h, color, NUM) {
  /* ND-safe: static double helix lattice; no animation */
  const segments = NUM.THIRTYTHREE;
  const amp = h / NUM.THREE;
  const mid = h / 2;
  const step = w / segments;
  const phase = Math.PI;
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const angle = i / segments * NUM.SEVEN * Math.PI * 2 / NUM.NINE;
    const yA = mid + amp * Math.sin(angle);
    const yB = mid + amp * Math.sin(angle + phase);
    pointsA.push({x, y:yA});
    pointsB.push({x, y:yB});
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  drawPolyline(ctx, pointsA);
  drawPolyline(ctx, pointsB);
  ctx.lineWidth = 1;
  for (let i = 0; i <= segments; i += NUM.SEVEN) {
    const p = pointsA[i];
    const q = pointsB[i];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
}

function drawPolyline(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
}
