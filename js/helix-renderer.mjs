/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  All routines avoid motion/flash. Colors and ordering favor clarity for neurodivergent
  audiences. Geometry uses numerology constants (3,7,9,11,22,33,99,144).
*/

export function renderHelix(ctx, opts) {
  const { width: w, height: h, palette, NUM } = opts;

  // Fill background for safety against transparent canvases
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  drawVesica(ctx, w, h, palette.layers[0], NUM);
  drawTreeOfLife(ctx, w, h, palette.layers[1], NUM);
  drawFibonacci(ctx, w, h, palette.layers[2], NUM);
  drawHelixLattice(ctx, w, h, palette.layers[3], NUM);
}

// --- Layer 1: Vesica grid ---
function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Radius derived from 9 and 3 to honor triadic structure
  const r = Math.min(w, h) / NUM.NINE * NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  const offsets = [-1, 0, 1]; // three-by-three grid

  offsets.forEach(ix => {
    offsets.forEach(iy => {
      ctx.beginPath();
      ctx.arc(cx + ix * r, cy + iy * r, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
  ctx.restore();
}

// --- Layer 2: Tree-of-Life scaffold ---
function drawTreeOfLife(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  const nodes = [
    { x: 0.5,  y: 1 / NUM.SEVEN },
    { x: 0.75, y: 2 / NUM.SEVEN },
    { x: 0.25, y: 2 / NUM.SEVEN },
    { x: 0.75, y: 3 / NUM.SEVEN },
    { x: 0.25, y: 3 / NUM.SEVEN },
    { x: 0.5,  y: 4 / NUM.SEVEN },
    { x: 0.75, y: 5 / NUM.SEVEN },
    { x: 0.25, y: 5 / NUM.SEVEN },
    { x: 0.5,  y: 6 / NUM.SEVEN },
    { x: 0.5,  y: 7 / NUM.SEVEN }
  ];

  const paths = [
    [1, 2], [1, 3], [1, 6],
    [2, 3], [2, 4], [2, 6], [2, 7],
    [3, 5], [3, 6], [3, 8],
    [4, 5], [4, 6], [4, 7],
    [5, 6], [5, 9],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 10],
    [8, 10],
    [9, 10]
  ];
  // Ensure we honor the 22 Major Arcana connections
  if (paths.length !== NUM.TWENTYTWO) {
    console.warn("Tree-of-Life paths expected:", NUM.TWENTYTWO);
  }

  paths.forEach(([a, b]) => {
    const pa = nodes[a - 1];
    const pb = nodes[b - 1];
    ctx.beginPath();
    ctx.moveTo(pa.x * w, pa.y * h);
    ctx.lineTo(pb.x * w, pb.y * h);
    ctx.stroke();
  });

  const r = Math.min(w, h) / NUM.THIRTYTHREE;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// --- Layer 3: Fibonacci curve ---
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  const fib = [1, 1];
  while (fib[fib.length - 1] < NUM.ONEFORTYFOUR) {
    const next = fib[fib.length - 1] + fib[fib.length - 2];
    fib.push(next);
  }
  // There should be 11 segments from 1 to 144
  if (fib.length - 1 !== NUM.ELEVEN) {
    console.warn("Fibonacci segment count expected:", NUM.ELEVEN);
  }

  const scale = Math.min(w, h) / (fib[fib.length - 1] * 1.5);
  let angle = 0;
  let x = w / 2;
  let y = h / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 2; i < fib.length; i++) {
    angle += Math.PI / 2; // quarter turns
    const r = fib[i] * scale;
    x = w / 2 + r * Math.cos(angle);
    y = h / 2 + r * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// --- Layer 4: Double-helix lattice ---
function drawHelixLattice(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  const segments = NUM.THIRTYTHREE; // ladder rungs
  const amp = h / NUM.NINE; // gentle amplitude
  const cycles = NUM.NINETYNINE / NUM.THIRTYTHREE; // three full turns across width
  const phase = Math.PI * NUM.TWENTYTWO / NUM.TWENTYTWO; // pi, uses 22

  const left = [];
  const right = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * w;
    const angle = t * cycles * Math.PI * 2;
    const y1 = h / 2 + amp * Math.sin(angle);
    const y2 = h / 2 + amp * Math.sin(angle + phase);
    left.push({ x, y: y1 });
    right.push({ x, y: y2 });
  }

  ctx.beginPath();
  left.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  ctx.beginPath();
  right.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // lattice rungs
  for (let i = 0; i <= segments; i++) {
    const a = left[i];
    const b = right[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}
