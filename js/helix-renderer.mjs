/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine paths)

  No motion. No external dependencies. All geometry parameterized
  with numerology constants to maintain sacred proportions.
*/

export function renderHelix(ctx, cfg) {
  const { width, height, palette, NUM } = cfg;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[5], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawLattice(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

// Layer 1: Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE; // radius scaled by 3 for balance
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, colorNodes, colorLines, NUM) {
  const left = w / 2 - w / NUM.THREE;
  const right = w / 2 + w / NUM.THREE;
  const mid = w / 2;
  const top = h / NUM.ELEVEN;
  const gap = h / NUM.NINE;

  const nodes = [
    { x: mid, y: top },
    { x: left, y: top + gap },
    { x: right, y: top + gap },
    { x: left, y: top + gap * 2 },
    { x: right, y: top + gap * 2 },
    { x: mid, y: top + gap * 3 },
    { x: left, y: top + gap * 4 },
    { x: right, y: top + gap * 4 },
    { x: mid, y: top + gap * 5 },
    { x: mid, y: top + gap * 6 }
  ];

  const edges = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,5],[1,6],
    [2,4],[2,5],[2,7],
    [3,4],[3,6],[3,8],
    [4,5],[4,7],[4,8],
    [5,6],[5,7],[5,8],
    [6,8],[7,8],[8,9]
  ];

  // draw paths
  ctx.strokeStyle = colorLines;
  ctx.lineWidth = 1;
  edges.forEach(([a,b]) => {
    const p = nodes[a];
    const q = nodes[b];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  });

  // draw nodes
  ctx.fillStyle = colorNodes;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = Math.min(w, h) / NUM.NINETYNINE; // gentle scale
  const pts = [];
  for (let i = 0; i <= NUM.TWENTYTWO; i++) {
    const ang = i * Math.PI / NUM.ELEVEN;
    const radius = scale * Math.pow(phi, ang);
    const x = w / 2 + radius * Math.cos(ang);
    const y = h / 2 + radius * Math.sin(ang);
    pts.push({ x, y });
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
}

// Layer 4: static double-helix lattice
function drawLattice(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.ONEFORTYFOUR; // dense lattice
  const amp = h / NUM.NINE;
  ctx.lineWidth = 1;

  // first strand
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * w;
    const y = h / 2 + amp * Math.sin(t * NUM.TWENTYTWO);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // second strand (phase shifted by PI)
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * w;
    const y = h / 2 + amp * Math.sin(t * NUM.TWENTYTWO + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // lattice rungs every 1/11 across
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= NUM.ELEVEN; i++) {
    const t = i / NUM.ELEVEN;
    const x = t * w;
    const y1 = h / 2 + amp * Math.sin(t * NUM.TWENTYTWO);
    const y2 = h / 2 + amp * Math.sin(t * NUM.TWENTYTWO + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
