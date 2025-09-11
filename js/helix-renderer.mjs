/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  All geometry uses numerology constants supplied via NUM.
  The export is a pure function: renderHelix(ctx, opts).
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], NUM);

  ctx.restore();
}

// Layer 1: Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  // ND-safe: thin strokes; repeated pattern gives depth without motion
  const r = Math.min(w, h) / NUM.TWENTYTWO; // radius tied to 22
  const step = r * NUM.THREE;               // grid spacing uses 3
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = r; y < h; y += step) {
    for (let x = r; x < w; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.arc(x + r, y, r, 0, Math.PI * 2); // offset for vesica overlap
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold
function drawTreeOfLife(ctx, w, h, nodeColor, pathColor, NUM) {
  const nodes = [];
  const cols = [w / 2, w / 2 - w / NUM.NINE, w / 2 + w / NUM.NINE]; // 3 columns
  const rows = NUM.SEVEN;                                          // 7 vertical levels
  const vStep = h / (rows + 1);
  for (let i = 0; i < rows; i++) {
    const y = vStep * (i + 1);
    if (i === 0 || i === rows - 1) {
      nodes.push({ x: cols[0], y });
    } else if (i === 3) { // central triad
      nodes.push({ x: cols[0], y });
      nodes.push({ x: cols[1], y });
      nodes.push({ x: cols[2], y });
    } else {
      nodes.push({ x: cols[1], y });
      nodes.push({ x: cols[2], y });
    }
  }

  // draw simplified 22 paths by sampling combinations
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  let drawn = 0;
  for (let i = 0; i < nodes.length && drawn < NUM.TWENTYTWO; i++) {
    for (let j = i + 1; j < nodes.length && drawn < NUM.TWENTYTWO; j++) {
      ctx.beginPath();
      ctx.moveTo(nodes[i].x, nodes[i].y);
      ctx.lineTo(nodes[j].x, nodes[j].y);
      ctx.stroke();
      drawn++;
    }
  }

  // draw nodes
  ctx.fillStyle = nodeColor;
  const radius = w / NUM.ONEFORTYFOUR; // small, anchored to 144
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
function drawFibonacci(ctx, w, h, color, NUM) {
  // ND-safe: static polyline approximating a log spiral
  const cx = w / 2;
  const cy = h / 2;
  const turns = NUM.THREE;              // three outward turns
  const steps = NUM.THIRTYTHREE;        // resolution uses 33 segments
  const maxTheta = turns * Math.PI * 2;
  const a = Math.min(w, h) / NUM.NINETYNINE; // initial radius tied to 99

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = (maxTheta / steps) * i;
    const r = a * Math.exp(theta / (Math.PI * 2)); // simple growth
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelixLattice(ctx, w, h, color1, color2, NUM) {
  // ND-safe: two static sine waves, phase-shifted; vertical links form lattice
  const steps = NUM.NINETYNINE;               // horizontal sample count
  const amp = h / NUM.NINE;                   // amplitude uses 9
  const waveLen = w / NUM.ELEVEN;             // wavelength uses 11
  const midY = h / 2;

  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const t = (2 * Math.PI * x) / waveLen;
    pointsA.push({ x, y: midY + Math.sin(t) * amp });
    pointsB.push({ x, y: midY + Math.sin(t + Math.PI) * amp });
  }

  ctx.strokeStyle = color1;
  ctx.lineWidth = 1;
  ctx.beginPath();
  pointsA.forEach((p, idx) => idx ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  ctx.stroke();

  ctx.strokeStyle = color2;
  ctx.beginPath();
  pointsB.forEach((p, idx) => idx ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  ctx.stroke();

  // lattice links every third point
  ctx.strokeStyle = color1;
  for (let i = 0; i <= steps; i += NUM.THREE) {
    ctx.beginPath();
    ctx.moveTo(pointsA[i].x, pointsA[i].y);
    ctx.lineTo(pointsB[i].x, pointsB[i].y);
    ctx.stroke();
  }
}
