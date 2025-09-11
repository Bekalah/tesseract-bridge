/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  // Two calm circles intersecting; triadic radius keeps 3:7 harmony
  const r = Math.min(w, h) / NUM.THREE;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx1, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx2, cy, r, 0, Math.PI * 2); ctx.stroke();
}

function drawTree(ctx, w, h, colorPath, colorNode, NUM) {
  // Simplified Tree-of-Life; static grid, no animation
  const xs = [w / 4, w / 2, (w * 3) / 4];
  const ys = [];
  for (let i = 0; i < 8; i++) ys.push((h * (i + 1)) / NUM.ELEVEN);
  const nodes = [
    [1, 0], [2, 1], [0, 1], [2, 2], [0, 2],
    [1, 3], [2, 4], [0, 4], [1, 5], [1, 6]
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[3,6],[4,7],[6,5],[7,5],[6,8],[7,8],[8,9],
    [1,2],[1,4],[2,3],[3,7],[4,6],[1,5],[2,5],[6,9],[7,9]
  ];
  ctx.strokeStyle = colorPath;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    const ax = xs[nodes[a][0]], ay = ys[nodes[a][1]];
    const bx = xs[nodes[b][0]], by = ys[nodes[b][1]];
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  ctx.fillStyle = colorNode;
  for (const [xi, yi] of nodes) {
    const x = xs[xi], y = ys[yi];
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
  }
}

function drawFibonacci(ctx, w, h, color, NUM) {
  // Log spiral approximated by polyline; static for ND safety
  const center = { x: w / 2, y: h / 2 };
  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = Math.min(w, h) / NUM.THREE;
  const pts = [];
  for (let t = 0; t <= NUM.THREE * Math.PI; t += Math.PI / NUM.TWENTYTWO) {
    const r = scale * Math.pow(phi, t / (Math.PI / 2));
    const x = center.x + r * Math.cos(t);
    const y = center.y + r * Math.sin(t);
    pts.push([x, y]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  // Twin sine curves with lattice connectors; static, no flicker
  const amp = h / NUM.NINE;
  const step = w / NUM.THIRTYTHREE;
  const mid = h / 2;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = mid + amp * Math.sin((2 * Math.PI * x) / w * NUM.SEVEN);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = mid + amp * Math.sin((2 * Math.PI * x) / w * NUM.SEVEN + Math.PI);
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = colorB;
  for (let x = 0; x <= w; x += step) {
    const y1 = mid + amp * Math.sin((2 * Math.PI * x) / w * NUM.SEVEN);
    const y2 = mid + amp * Math.sin((2 * Math.PI * x) / w * NUM.SEVEN + Math.PI);
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
  }
}
