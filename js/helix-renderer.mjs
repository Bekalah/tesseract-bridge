/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  All routines here avoid motion, external deps, and heavy computation.
  Geometry is parameterized by numerology constants passed in from index.html.
*/

// Draw a simple Vesica grid using a 3x3 array of intersecting circles.
function drawVesicaField(ctx, w, h, color, NUM) {
  const radius = Math.min(w, h) / NUM.THREE;
  const stepX = w / NUM.THREE;
  const stepY = h / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.25;
  for (let y = 0; y < NUM.THREE; y++) {
    for (let x = 0; x < NUM.THREE; x++) {
      const cx = stepX * (x + 0.5);
      const cy = stepY * (y + 0.5);
      ctx.beginPath();
      ctx.arc(cx - radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.arc(cx + radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// Draw Tree-of-Life nodes and paths; ND-safe soft lines and clear nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodes = [
    [0.5, 0.05],  // 0 Kether
    [0.75, 0.2],  // 1 Chokmah
    [0.25, 0.2],  // 2 Binah
    [0.75, 0.4],  // 3 Chesed
    [0.25, 0.4],  // 4 Geburah
    [0.5, 0.5],   // 5 Tiphereth
    [0.75, 0.7],  // 6 Netzach
    [0.25, 0.7],  // 7 Hod
    [0.5, 0.8],   // 8 Yesod
    [0.5, 0.95]   // 9 Malkuth
  ];
  const edges = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,4],
    [0,5],[1,5],[2,5],
    [3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [3,8],[4,8],[5,8],[6,8],[7,8],
    [8,9]
  ];
  ctx.lineWidth = 1;
  ctx.strokeStyle = pathColor;
  ctx.globalAlpha = 0.6;
  edges.forEach(([a,b]) => {
    const ax = nodes[a][0] * w;
    const ay = nodes[a][1] * h;
    const bx = nodes[b][0] * w;
    const by = nodes[b][1] * h;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.NINETYNINE * 3;
  nodes.forEach(([nx, ny]) => {
    ctx.beginPath();
    ctx.arc(nx * w, ny * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Static Fibonacci spiral approximated by polyline using first 9 numbers.
function drawFibonacci(ctx, w, h, color, NUM) {
  const fib = [1,1];
  for (let i = 2; i < NUM.NINE; i++) fib[i] = fib[i-1] + fib[i-2];
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.ELEVEN;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  fib.forEach((n, i) => {
    const angle = (i * Math.PI) / 2;
    const r = n * scale;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Double-helix lattice: two sine curves with vertical connectors.
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.NINETYNINE;
  const amp = h / NUM.SEVEN;
  const mid = h / 2;
  ctx.lineWidth = 1;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = mid + amp * Math.sin((i / steps) * NUM.THREE * 2 * Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = mid + amp * Math.sin((i / steps) * NUM.THREE * 2 * Math.PI + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Lattice connectors every 11th step
  const gap = Math.floor(steps / NUM.ELEVEN);
  for (let i = 0; i <= steps; i += gap) {
    const x = (w / steps) * i;
    const y1 = mid + amp * Math.sin((i / steps) * NUM.THREE * 2 * Math.PI);
    const y2 = mid + amp * Math.sin((i / steps) * NUM.THREE * 2 * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

// Main orchestrator: draws layers in sequence for depth preservation.
export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);   // L1
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM); // L2
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);     // L3
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM); // L4
}

export default { renderHelix };

