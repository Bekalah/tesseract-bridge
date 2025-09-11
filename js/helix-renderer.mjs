/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  renderVesica(ctx, width, height, palette.layers[0], NUM);
  renderTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  renderFibonacci(ctx, width, height, palette.layers[3], NUM);
  renderLattice(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field
function renderVesica(ctx, width, height, color, NUM) {
  const radius = Math.min(width, height) / NUM.THREE;
  const gap = (radius * NUM.THREE) / NUM.ELEVEN; // uses 3 and 11
  const cx = width / 2;
  const cy = height / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - gap, cy, radius, 0, Math.PI * 2);
  ctx.arc(cx + gap, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold
function renderTree(ctx, width, height, nodeColor, pathColor, NUM) {
  const cols = [width / NUM.THREE, width / 2, (width * 2) / NUM.THREE];
  const rowStep = height / (NUM.SEVEN + 1); // seven levels + margins
  const nodes = [
    [cols[1], rowStep],
    [cols[2], rowStep * 2],
    [cols[0], rowStep * 2],
    [cols[2], rowStep * 3],
    [cols[0], rowStep * 3],
    [cols[1], rowStep * 4],
    [cols[2], rowStep * 5],
    [cols[0], rowStep * 5],
    [cols[1], rowStep * 6],
    [cols[1], rowStep * 7]
  ];

  const edges = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],
    [3,6],[4,7],[6,5],[7,5],[6,8],[7,8],
    [5,8],[8,9],[1,2],[1,4],[2,3],[3,7],
    [4,6],[1,5],[2,5],[6,7] // 22 paths
  ];

  ctx.strokeStyle = pathColor;
  edges.forEach(pair => {
    const [a, b] = pair;
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], rowStep / NUM.ELEVEN, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
function renderFibonacci(ctx, width, height, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) / NUM.THREE / phi;
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i < NUM.ONEFORTYFOUR; i++) { // 144 points
    const t = (i / NUM.ONEFORTYFOUR) * NUM.NINE; // nine half-turns
    const r = Math.pow(phi, t / Math.PI);
    const x = centerX + Math.cos(t) * r * scale;
    const y = centerY + Math.sin(t) * r * scale;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function renderLattice(ctx, width, height, colorA, colorB, NUM) {
  const centerX = width / 2;
  const amp = width / NUM.NINE;
  const freq = NUM.NINE; // nine twists
  const stepY = height / NUM.THIRTYTHREE; // 33 rungs
  ctx.lineWidth = 1;

  // sample curves with 99 points for smoothness
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= NUM.NINETYNINE; i++) {
    const y = (i / NUM.NINETYNINE) * height;
    const x = centerX + Math.sin((y / height) * freq * Math.PI * 2) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= NUM.NINETYNINE; i++) {
    const y = (i / NUM.NINETYNINE) * height;
    const x = centerX + Math.sin((y / height) * freq * Math.PI * 2 + Math.PI) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // rungs
  ctx.strokeStyle = colorB;
  for (let y = 0; y <= height; y += stepY) {
    const x1 = centerX + Math.sin((y / height) * freq * Math.PI * 2) * amp;
    const x2 = centerX + Math.sin((y / height) * freq * Math.PI * 2 + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}
