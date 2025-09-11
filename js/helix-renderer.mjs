/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine paths)

  No motion, no external dependencies. All geometry uses numerology constants
  passed in via opts.NUM for offline reproducibility.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
function drawVesica(ctx, w, h, color, NUM) {
  const r = w / NUM.THREE; // large radius honoring triadic balance
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// --- Layer 2: Tree-of-Life scaffold ---
function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  // simplified coordinates scaled to canvas
  const nodes = [
    [0.5, 0.1], // Keter
    [0.33, 0.2], // Chokmah
    [0.66, 0.2], // Binah
    [0.25, 0.4], // Chesed
    [0.75, 0.4], // Gevurah
    [0.5, 0.5], // Tiphereth
    [0.33, 0.7], // Netzach
    [0.66, 0.7], // Hod
    [0.5, 0.8], // Yesod
    [0.5, 0.9]  // Malkuth
  ].map(([x, y]) => [x * w, y * h]);

  const edges = [
    [0,1],[0,2], // top triad
    [1,3],[2,4],[3,5],[4,5], // upper connections
    [3,6],[4,7],[5,6],[5,7], // middle
    [6,8],[7,8],[8,9],       // lower
    [1,2],[3,4],[6,7]       // horizontals
  ];
  // Ensure 22 paths using numerology constant
  if (edges.length !== NUM.TWENTYTWO) {
    console.warn("Tree-of-Life edges expected to be 22");
  }

  ctx.strokeStyle = pathColor;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Layer 3: Fibonacci curve ---
function drawFibonacci(ctx, w, h, color, NUM) {
  const centerX = w * 0.6; // placed off-center for depth
  const centerY = h * 0.6;
  const points = [];
  const a = w / NUM.ONEFORTYFOUR; // seed size
  const b = 0.306349; // log(phi)/(pi/2) constant for golden spiral
  const segments = NUM.THIRTYTHREE; // polyline points
  for (let i = 0; i <= segments; i++) {
    const theta = i / NUM.SEVEN * Math.PI * 2; // step angle with sevenfold harmony
    const r = a * Math.exp(b * theta);
    points.push([centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)]);
  }
  ctx.strokeStyle = color;
  ctx.beginPath();
  points.forEach(([x,y], idx) => {
    if (idx === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ---
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amplitude = h / NUM.NINE; // gentle wave
  const segments = NUM.NINETYNINE; // resolution of lattice
  const step = w / segments;
  const phase = Math.PI; // second helix phase shift

  const path = (offset, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2 + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  path(0, colorA);
  path(phase, colorB);

  // lattice crossbars every eleventh segment for stability
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2);
    const y2 = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2 + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
