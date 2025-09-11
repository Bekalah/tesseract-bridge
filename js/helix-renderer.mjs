/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sin waves)
*/

// Small pure helpers -----------------------------------------------
function circle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function line(ctx, ax, ay, bx, by, color) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.strokeStyle = color;
  ctx.stroke();
}

// Layer 1: Vesica field --------------------------------------------
function drawVesica(ctx, w, h, color, NUM) {
  const r = h / NUM.THREE; // size derived from numerology constant
  const cx = w / 2;
  const cy = h / 2;
  // two circles offset horizontally; no fill to keep background calm
  circle(ctx, cx - r / 2, cy, r, color);
  circle(ctx, cx + r / 2, cy, r, color);
}

// Layer 2: Tree-of-Life scaffold -----------------------------------
function drawTreeOfLife(ctx, w, h, nodeColor, pathColor, NUM) {
  // Basic normalized coordinates for 10 sephirot (source: simplified Etz Chaim)
  const nx = [0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.25, 0.75, 0.5, 0.5];
  const ny = [0.05, 0.18, 0.18, 0.36, 0.36, 0.5, 0.64, 0.64, 0.82, 0.95];
  const r = w / NUM.NINETYNINE; // small nodes, 1/99 of width
  // draw paths (22 canonical connections)
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[1,5],[2,5],[3,6],[4,7],[5,6],[5,7],
    [6,8],[7,8],[6,9],[7,9],[3,8],[4,8],[8,9],[0,5],[5,9],[0,9]
  ];
  ctx.lineWidth = 1;
  paths.forEach(p => {
    const [a,b] = p;
    line(ctx, nx[a]*w, ny[a]*h, nx[b]*w, ny[b]*h, pathColor);
  });
  // draw nodes
  ctx.lineWidth = 2;
  for (let i=0;i<nx.length;i++) {
    circle(ctx, nx[i]*w, ny[i]*h, r, nodeColor);
  }
}

// Layer 3: Fibonacci curve -----------------------------------------
function drawFibonacci(ctx, w, h, color, NUM) {
  // Log spiral using 33 segments for gentle curve
  const segments = NUM.THIRTYTHREE;
  const centerX = w * 0.7; // placed right for visual balance
  const centerY = h * 0.65;
  const a = 2; // base radius
  const b = 0.15; // growth rate
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * NUM.TWENTYTWO; // 22*pi radians total sweep
    const r = a * Math.exp(b * theta);
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.stroke();
}

// Layer 4: Double-helix lattice ------------------------------------
function drawHelixLattice(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.NINETYNINE; // lattice resolution
  const amplitude = h / NUM.NINE;
  ctx.lineWidth = 1;
  // two phase-shifted sine waves
  const ptsA = [];
  const ptsB = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const t = (i / steps) * NUM.THREE * Math.PI; // three full turns
    ptsA.push([x, h/2 + Math.sin(t) * amplitude]);
    ptsB.push([x, h/2 + Math.sin(t + Math.PI) * amplitude]);
  }
  // draw curves
  ctx.beginPath();
  ptsA.forEach((p,i) => { i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]); });
  ctx.strokeStyle = colorA;
  ctx.stroke();
  ctx.beginPath();
  ptsB.forEach((p,i) => { i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]); });
  ctx.strokeStyle = colorB;
  ctx.stroke();
  // lattice rungs
  for (let i = 0; i <= steps; i += NUM.SEVEN) { // every 7th point
    const a = ptsA[i];
    const b = ptsB[i];
    line(ctx, a[0], a[1], b[0], b[1], colorB);
  }
}

// Main orchestrator -------------------------------------------------
export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0,0,width,height);

  // Layer order chosen for visual hierarchy and ND safety
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}
