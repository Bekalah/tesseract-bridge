/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves with 33 rungs)

  All geometry is parameterized by numerology constants to keep the scene
  symbolic yet calm. No animation or flashing elements.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1 — Vesica grid: calm intersecting circles forming a field
function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.3; // ND-safe subtlety
  const r = Math.min(w, h) / NUM.THREE;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(w / 2 + i * r, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let j = -1; j <= 1; j++) {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + j * r, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Layer 2 — Tree of Life: 10 nodes + 22 paths
function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  ctx.save();
  const nodes = [
    { x: 0.5, y: 0.05 }, // Keter
    { x: 0.25, y: 0.2 }, // Binah
    { x: 0.75, y: 0.2 }, // Chokmah
    { x: 0.25, y: 0.4 }, // Chesed
    { x: 0.75, y: 0.4 }, // Gevurah
    { x: 0.5, y: 0.5 }, // Tiferet
    { x: 0.25, y: 0.7 }, // Netzach
    { x: 0.75, y: 0.7 }, // Hod
    { x: 0.5, y: 0.8 }, // Yesod
    { x: 0.5, y: 0.95 } // Malkuth
  ];

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,3],[2,4],[3,5],[4,5],[3,6],
    [4,7],[5,6],[5,7],[6,8],[7,8],[8,9],[2,5],[1,5],[3,7],[4,6],
    [0,5],[5,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    const A = nodes[a];
    const B = nodes[b];
    ctx.beginPath();
    ctx.moveTo(A.x * w, A.y * h);
    ctx.lineTo(B.x * w, B.y * h);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = NUM.NINE / 2; // small node size
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3 — Fibonacci spiral: static golden spiral polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE;
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.2;
  const cy = h * 0.8;
  ctx.beginPath();
  for (let i = 0; i <= steps * turns; i++) {
    const theta = (i / steps) * turns * (Math.PI / 2);
    const r = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4 — Double helix lattice: two sine curves + 33 rungs
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  ctx.save();
  const points = NUM.ONEFORTYFOUR; // smoothness
  const amp = h / 4;
  const mid = h / 2;

  // first strand
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * NUM.THREE;
    const x = (i / points) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // second strand phase-shifted by π
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * NUM.THREE + Math.PI;
    const x = (i / points) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // lattice rungs
  ctx.strokeStyle = colorA;
  for (let j = 0; j <= NUM.THIRTYTHREE; j++) {
    const t = (j / NUM.THIRTYTHREE) * Math.PI * NUM.THREE;
    const x = (j / NUM.THIRTYTHREE) * w;
    const y1 = mid + Math.sin(t) * amp;
    const y2 = mid + Math.sin(t + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  ctx.restore();
}
