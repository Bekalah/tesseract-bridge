/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  No animation, ND-safe palette. All geometry uses numerology constants from NUM.
*/

export function renderHelix(ctx, opts = {}) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

function drawCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 1: Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE; // uses 3 for ratio
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  drawCircle(ctx, cx1, cy, r);
  drawCircle(ctx, cx2, cy, r);
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const top = h * 0.1;
  const bottom = h * 0.9;
  const left = w * 0.3;
  const right = w * 0.7;
  const center = w / 2;
  const stepY = (bottom - top) / (NUM.NINE + 1); // uses 9 for vertical rhythm
  const nodes = [
    { x: center, y: top },
    { x: left, y: top + stepY },
    { x: right, y: top + stepY },
    { x: left, y: top + stepY * 3 },
    { x: center, y: top + stepY * 3 },
    { x: right, y: top + stepY * 3 },
    { x: left, y: top + stepY * 5 },
    { x: right, y: top + stepY * 5 },
    { x: center, y: top + stepY * 6.5 },
    { x: center, y: bottom }
  ];
  const edges = [
    [0,1],[0,2],
    [1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,7],[5,7],
    [6,7],[6,8],[7,8],[8,9],
    [3,8],[5,8],[1,6],[2,7],[0,9],[2,3],[4,9]
  ]; // 22 paths as per NUM.TWENTYTWO

  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    const na = nodes[a];
    const nb = nodes[b];
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    ctx.stroke();
  });

  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, NUM.ELEVEN / 2, 0, Math.PI * 2); // node size tied to 11
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [0, 1];
  while (fib[fib.length - 1] < NUM.ONEFORTYFOUR) {
    fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  }
  const scale = Math.min(w, h) / (NUM.ONEFORTYFOUR * 1.5);
  const cx = w * 0.75;
  const cy = h * 0.6;
  let angle = 0;
  let x = cx;
  let y = cy;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 2; i < fib.length; i++) {
    const r = fib[i] * scale;
    angle += Math.PI / 2;
    x = cx + r * Math.cos(angle);
    y = cy + r * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const { NINETYNINE, THIRTYTHREE, ELEVEN, SEVEN } = NUM;
  const amplitude = h / SEVEN; // uses 7 for calm amplitude
  const offsetY = h / 2;
  const step = w / NINETYNINE; // 99 steps across
  const freq = (Math.PI * 2) / THIRTYTHREE; // 33 waves span
  const pathA = [];
  const pathB = [];
  for (let i = 0; i <= NINETYNINE; i++) {
    const x = i * step;
    pathA.push({ x, y: offsetY + amplitude * Math.sin(freq * i) });
    pathB.push({ x, y: offsetY + amplitude * Math.sin(freq * i + Math.PI) });
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  ctx.moveTo(pathA[0].x, pathA[0].y);
  for (let i = 1; i < pathA.length; i++) ctx.lineTo(pathA[i].x, pathA[i].y);
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  ctx.moveTo(pathB[0].x, pathB[0].y);
  for (let i = 1; i < pathB.length; i++) ctx.lineTo(pathB[i].x, pathB[i].y);
  ctx.stroke();

  ctx.strokeStyle = colorA;
  for (let i = 0; i <= NINETYNINE; i += ELEVEN) {
    const a = pathA[i];
    const b = pathB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}
