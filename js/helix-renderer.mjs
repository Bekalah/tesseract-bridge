/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted, no motion)
*/

// Small helpers
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

// Draw layer 1: Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const r = NUM.NINETYNINE;
  const step = NUM.ONEFORTYFOUR;
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      circle(ctx, x, y, r);
      ctx.stroke();
    }
  }
}

// Draw layer 2: Tree-of-Life (nodes + paths)
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const xc = w / 2;
  const xo = w / NUM.NINE; // horizontal offset
  const ys = h / NUM.NINE; // vertical step
  const nodes = [
    [xc, ys * 0.5],
    [xc + xo, ys * 1.5],
    [xc - xo, ys * 1.5],
    [xc - xo * 1.2, ys * 3],
    [xc + xo * 1.2, ys * 3],
    [xc, ys * 4.5],
    [xc - xo, ys * 6],
    [xc + xo, ys * 6],
    [xc, ys * 7.5],
    [xc, ys * 9],
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
    circle(ctx, x, y, NUM.SEVEN);
    ctx.fill();
  }
}

// Draw layer 3: Fibonacci polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w / NUM.THREE;
  const cy = h - h / NUM.THREE;
  let r = NUM.NINE;
  let ang = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  for (let i = 0; i < NUM.ELEVEN; i++) {
    ang += Math.PI / 2;
    r *= phi;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Draw layer 4: Double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segs = NUM.TWENTYTWO;
  const amp = h / NUM.NINE;
  const yMid = h / 2;
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const x = t * w;
    const yA = yMid + Math.sin(t * Math.PI * NUM.THREE) * amp;
    const yB = yMid + Math.sin(t * Math.PI * NUM.THREE + Math.PI) * amp;
    pointsA.push([x, yA]);
    pointsB.push([x, yB]);
  }
  ctx.lineWidth = 1.5;
  // helix A
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  pointsA.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  // helix B
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  pointsB.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  // lattice bars
  ctx.strokeStyle = colorA;
  for (let i = 0; i <= segs; i++) {
    const [x1,y1] = pointsA[i];
    const [x2,y2] = pointsB[i];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

// Exported orchestrator
export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  // Layer order: Vesica -> Tree -> Fibonacci -> Helix
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// ND-safe notes: all routines are static, parameterized, and free of time-based motion.
