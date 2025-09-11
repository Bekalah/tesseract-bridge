/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves with rungs)

  No animation or external deps. Pure functions, offline use.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// 1) Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  const offset = r / NUM.THREE; // gentle overlap; ND-safe static
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - offset, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + offset, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// 2) Tree-of-Life scaffold
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [0.5, 0.05], // 0 Keter
    [0.75, 0.15], // 1 Chokmah
    [0.25, 0.15], // 2 Binah
    [0.75, 0.35], // 3 Chesed
    [0.25, 0.35], // 4 Gevurah
    [0.5, 0.45], // 5 Tiphareth
    [0.75, 0.65], // 6 Netzach
    [0.25, 0.65], // 7 Hod
    [0.5, 0.75], // 8 Yesod
    [0.5, 0.9]   // 9 Malkuth
  ].map(([x,y]) => [x * w, y * h]);

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[6,5],[7,5],[6,8],[7,8],[8,9],[5,8],
    [1,4],[2,3],[4,6],[3,7],[2,5],[1,5]
  ];

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.NINETYNINE; // small, readable
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 3) Fibonacci curve
function drawFibonacci(ctx, w, h, color, NUM) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) / NUM.SEVEN;
  const phi = (1 + Math.sqrt(5)) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= NUM.ONEFORTYFOUR; i++) {
    const theta = i / NUM.ONEFORTYFOUR * Math.PI * 4;
    const r = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

// 4) Double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amp = h / NUM.NINE;
  const freq = (Math.PI * 2) / (w / NUM.THIRTYTHREE);
  const mid = h / 2;
  ctx.lineWidth = 1;

  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = mid + amp * Math.sin(freq * x);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = mid + amp * Math.sin(freq * x + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  for (let x = 0; x <= w; x += w / NUM.NINETYNINE) {
    const y1 = mid + amp * Math.sin(freq * x);
    const y2 = mid + amp * Math.sin(freq * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
